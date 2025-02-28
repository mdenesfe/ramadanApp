import { formatDate } from './dateTime.js';
import { CacheManager } from './cacheManager.js';

export class VerseManager {
  constructor() {
    this.cacheManager = new CacheManager();
    this.elements = this.setupElements();
    this.loadDailyVerse();
  }

  setupElements() {
    const elements = {
      verse: document.getElementById('gununAyeti'),
      surah: document.getElementById('gununAyetiSure')
    };

    // Validate elements
    Object.entries(elements).forEach(([key, element]) => {
      if (!element) {
        console.error(`Element not found: ${key}`);
      }
    });

    return elements;
  }

  formatDateForVerse(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async loadDailyVerse() {
    try {
      const todayFormatted = this.formatDateForVerse(new Date());
      console.log('Looking for verse for date:', todayFormatted);
      const cacheKey = `verse-${todayFormatted}`;
      
      let data = await this.cacheManager.getCachedData(cacheKey);
      console.log('Cache data:', data);
      
      if (!data) {
        try {
          console.log('Cache miss, fetching from network...');
          const response = await fetch('/ayet/ayet.json', {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
          
          if (!response.ok) {
            console.error('HTTP Error Response:', {
              status: response.status,
              statusText: response.statusText,
              url: response.url
            });
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const text = await response.text();
          console.log('Raw JSON text:', text.substring(0, 100) + '...'); // İlk 100 karakteri göster
          
          try {
            data = JSON.parse(text);
            console.log('Successfully parsed JSON data');
            console.log('Data structure:', {
              type: typeof data,
              isNull: data === null,
              isObject: typeof data === 'object',
              hasProperties: data ? Object.keys(data).length : 0,
              firstKey: data ? Object.keys(data)[0] : 'no keys'
            });
            
            if (data && typeof data === 'object') {
              const dates = Object.keys(data);
              console.log('Found dates in JSON:', dates);
              console.log('Does JSON include today?', dates.includes(todayFormatted));
              
              await this.cacheManager.cacheData(cacheKey, data, 24);
              console.log('Data cached successfully');
            } else {
              throw new Error('Invalid data format received');
            }
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            throw parseError;
          }
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
          throw fetchError;
        }
      } else {
        console.log('Using cached data');
      }

      if (data && data[todayFormatted]) {
        console.log('Found verse for today:', data[todayFormatted]);
        await this.updateVerseDisplay(data[todayFormatted]);
      } else {
        console.log('No verse found. Current data state:', {
          hasData: !!data,
          availableDates: data ? Object.keys(data) : 'no data',
          requestedDate: todayFormatted
        });
        this.showDefaultVerse();
      }
    } catch (error) {
      console.error('Error loading daily verse:', error);
      this.showDefaultVerse();
    }
  }

  async updateVerseDisplay(verseData) {
    const { verse, surah } = this.elements;
    console.log('Updating verse display with:', verseData);

    if (verse && verseData.gununAyeti) {
      verse.textContent = '📖 ' + verseData.gununAyeti;
      verse.style.opacity = '0';
      verse.style.transition = 'opacity 0.5s ease-in';
      requestAnimationFrame(() => {
        verse.style.opacity = '1';
      });
    }

    if (surah && verseData.gununAyetiSure) {
      surah.textContent = verseData.gununAyetiSure;
      surah.style.opacity = '0';
      surah.style.transition = 'opacity 0.5s ease-in';
      requestAnimationFrame(() => {
        surah.style.opacity = '1';
      });
    }
  }

  showDefaultVerse() {
    const { verse, surah } = this.elements;
    
    if (verse) {
      verse.textContent = '📖 Bismillahirrahmanirrahim';
      verse.classList.remove('text-red-500');
    }
    
    if (surah) {
      surah.textContent = 'Rahman ve Rahim olan Allah\'ın adıyla';
      surah.classList.remove('text-red-500');
    }
  }
} 