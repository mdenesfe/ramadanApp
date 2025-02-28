import { formatDate, dateFromTimeStr, formatRemainingTime, getCurrentDateStr, getCurrentTimeStr, getHijriDate } from './dateTime.js';
import { CacheManager } from './cacheManager.js';

export class PrayerTimesManager {
  constructor() {
    this.API_KEY = '54Z1MHbdkvpG76ybOKTMqQ:2W6xxusezdVoNJjZG6bpQi';
    this.API_URL = 'https://api.collectapi.com/pray/all';
    this.cityData = {};
    this.elements = null;
    this.cacheManager = new CacheManager();
    this.updateInterval = null;
    this.lastUpdateTime = null;
    this.currentCity = null;
    this.isLoading = false;
    this.requestQueue = new Set();
    this.init();
  }

  async init() {
    this.elements = this.setupElements();
    await this.setupCitySelect();
    this.setupEventListeners();
  }

  setupElements() {
    const elements = {
      citySelect: document.getElementById('citySelect'),
      imsakTime: document.getElementById('imsakTime'),
      iftarTime: document.getElementById('iftarTime'),
      currentDate: document.getElementById('currentDateWithoutYear'),
      currentTime: document.getElementById('currentTime'),
      hijriDate: document.getElementById('hijriDate'),
      imsakContainer: document.getElementById('remainingToImsakContainer'),
      iftarContainer: document.getElementById('remainingToIftarContainer'),
      remainingToImsak: document.getElementById('remainingToImsak'),
      remainingToIftar: document.getElementById('remainingToIftar')
    };

    // Validate all elements exist
    Object.entries(elements).forEach(([key, element]) => {
      if (!element) {
        console.error(`Element not found: ${key}`);
      }
    });

    return elements;
  }

  setupEventListeners() {
    // Sayfa görünürlüğü değiştiğinde güncelleme
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkAndUpdateData();
      }
    });

    // Çevrimiçi/çevrimdışı durumu değiştiğinde güncelleme
    window.addEventListener('online', () => this.checkAndUpdateData());
  }

  async setupCitySelect() {
    try {
      const savedCity = localStorage.getItem('selectedCity') || 'istanbul';
      this.currentCity = savedCity;

      if (this.elements.citySelect) {
        this.elements.citySelect.value = savedCity;
        
        this.elements.citySelect.addEventListener('change', async (e) => {
          const selectedCity = e.target.value.toLowerCase();
          this.currentCity = selectedCity;
          localStorage.setItem('selectedCity', selectedCity);
          await this.loadPrayerTimes(selectedCity, true); // force update
        });

        await this.loadPrayerTimes(savedCity);
      }
    } catch (error) {
      console.error('Error in setupCitySelect:', error);
    }
  }

  async checkAndUpdateData() {
    if (!this.lastUpdateTime || !this.currentCity) return;

    const now = new Date();
    const timeSinceLastUpdate = now - this.lastUpdateTime;
    const hoursSinceLastUpdate = timeSinceLastUpdate / (1000 * 60 * 60);

    // 12 saatten fazla geçtiyse veya gece yarısından sonraysa güncelle
    if (hoursSinceLastUpdate >= 12 || now.getHours() === 0) {
      await this.loadPrayerTimes(this.currentCity, true);
    }
  }

  async loadPrayerTimes(city, forceUpdate = false) {
    // Eğer zaten yükleme yapılıyorsa ve zorla güncelleme istenmiyorsa, kuyruğa ekle
    if (this.isLoading && !forceUpdate) {
      this.requestQueue.add(city);
      return;
    }

    try {
      this.isLoading = true;
      const cacheKey = `prayer-times-${city}-${formatDate(new Date())}`;
      
      // Önbellekten veri al (force update değilse)
      let prayerData = !forceUpdate ? await this.cacheManager.getCachedData(cacheKey) : null;

      if (!prayerData) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 saniye timeout

        try {
          const response = await fetch(`${this.API_URL}?data.city=${city}`, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              'authorization': `apikey ${this.API_KEY}`
            },
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error('API request failed');
          }

          const data = await response.json();
          
          if (!data.success) {
            throw new Error('API response indicates failure');
          }

          prayerData = this.extractPrayerTimes(data.result);
          await this.cacheManager.cacheData(cacheKey, prayerData, 12);
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      }

      this.cityData = {
        [formatDate(new Date())]: prayerData
      };
      
      this.lastUpdateTime = new Date();
      this.updateDisplays();
    } catch (error) {
      console.error('Error loading prayer times:', error);
      this.showErrorMessage();
      
      // Hata durumunda önbellekten veri yüklemeyi dene
      const cachedData = await this.cacheManager.getCachedData(`prayer-times-${city}-${formatDate(new Date())}`);
      if (cachedData) {
        this.cityData = {
          [formatDate(new Date())]: cachedData
        };
        this.updateDisplays();
      }
    } finally {
      this.isLoading = false;
      
      // Kuyrukta bekleyen istekleri işle
      if (this.requestQueue.size > 0) {
        const nextCity = Array.from(this.requestQueue)[0];
        this.requestQueue.clear();
        await this.loadPrayerTimes(nextCity);
      }
    }
  }

  extractPrayerTimes(prayerTimes) {
    const imsak = prayerTimes.find(time => time.vakit === 'İmsak')?.saat;
    const iftar = prayerTimes.find(time => time.vakit === 'Akşam')?.saat;

    if (!imsak || !iftar) {
      throw new Error('Required prayer times not found in API response');
    }

    return { imsak, iftar };
  }

  showErrorMessage() {
    const { imsakTime, iftarTime } = this.elements;
    if (imsakTime) imsakTime.textContent = 'Yüklenemedi';
    if (iftarTime) iftarTime.textContent = 'Yüklenemedi';
  }

  updateDisplays() {
    if (!this.elements || Object.keys(this.cityData).length === 0) return;

    try {
      const now = new Date();
      const todayFormatted = formatDate(now);
      const todayTimes = this.cityData[todayFormatted];

      if (!todayTimes) return;

      const { imsak, iftar } = todayTimes;
      const imsakDate = dateFromTimeStr(now, imsak);
      const iftarDate = dateFromTimeStr(now, iftar);

      this.updateTimeDisplays(imsak, iftar);
      this.updateRemainingTimeDisplay(now, imsakDate, iftarDate);
    } catch (error) {
      console.error('Error in updateDisplays:', error);
    }
  }

  updateTimeDisplays(imsak, iftar) {
    try {
      const { imsakTime, iftarTime, currentDate, currentTime, hijriDate } = this.elements;
      
      if (imsakTime) imsakTime.textContent = imsak;
      if (iftarTime) iftarTime.textContent = iftar;
      if (currentDate) currentDate.textContent = getCurrentDateStr();
      if (currentTime) currentTime.textContent = getCurrentTimeStr();
      if (hijriDate) hijriDate.textContent = getHijriDate();
    } catch (error) {
      console.error('Error in updateTimeDisplays:', error);
    }
  }

  updateRemainingTimeDisplay(now, imsakDate, iftarDate) {
    try {
      let remainingToImsak = imsakDate - now;
      let remainingToIftar = iftarDate - now;
      
      // If current time is past iftar, calculate for next day's imsak
      if (now >= iftarDate) {
        // Add 24 hours to get next day's imsak time
        const nextImsakDate = new Date(imsakDate.getTime() + 24 * 60 * 60 * 1000);
        remainingToImsak = nextImsakDate - now;
        remainingToIftar = 0; // Reset iftar countdown
      }

      // If current time is past imsak but before iftar
      const isIftarTime = now >= imsakDate && now < iftarDate;
      // If current time is past iftar
      const isPastIftar = now >= iftarDate;

      const { imsakContainer, iftarContainer, remainingToImsak: remainingToImsakEl, remainingToIftar: remainingToIftarEl } = this.elements;

      // Show imsak container if it's past iftar or before imsak
      if (imsakContainer) imsakContainer.classList.toggle('hidden', isIftarTime);
      if (iftarContainer) iftarContainer.classList.toggle('hidden', !isIftarTime);

      // Update the countdown displays
      if (remainingToImsakEl && !isIftarTime) {
        remainingToImsakEl.textContent = formatRemainingTime(remainingToImsak);
      }
      if (remainingToIftarEl && isIftarTime) {
        remainingToIftarEl.textContent = formatRemainingTime(remainingToIftar);
      }
    } catch (error) {
      console.error('Error in updateRemainingTimeDisplay:', error);
    }
  }

  startUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // İlk güncellemeyi yap
    this.updateDisplays();

    // Performans için requestAnimationFrame kullan
    const update = () => {
      this.updateDisplays();
      this.updateInterval = requestAnimationFrame(update);
    };

    this.updateInterval = requestAnimationFrame(update);

    // Temizleme işlemleri
    window.addEventListener('unload', () => {
      if (this.updateInterval) {
        cancelAnimationFrame(this.updateInterval);
      }
    });

    // Sayfa görünür değilken güncellemeyi durdur
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.updateInterval) {
        cancelAnimationFrame(this.updateInterval);
      } else if (!document.hidden && !this.updateInterval) {
        this.updateInterval = requestAnimationFrame(update);
      }
    });
  }
} 