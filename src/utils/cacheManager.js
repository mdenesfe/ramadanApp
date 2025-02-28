export class CacheManager {
  constructor(cacheName = 'ramazan-data-cache-v1') {
    this.cacheName = cacheName;
    this.startPeriodicCacheCleaning();
  }

  async cacheData(key, data, expirationInHours = 24) {
    try {
      const cacheData = {
        data,
        timestamp: new Date().getTime(),
        expirationInHours
      };
      
      await localStorage.setItem(key, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Cache error:', error);
      return false;
    }
  }

  async getCachedData(key) {
    try {
      const cachedData = localStorage.getItem(key);
      if (!cachedData) return null;

      const { data, timestamp, expirationInHours } = JSON.parse(cachedData);
      const now = new Date().getTime();
      const expirationTime = timestamp + (expirationInHours * 60 * 60 * 1000);

      if (now > expirationTime) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  startPeriodicCacheCleaning() {
    // Her 6 saatte bir cache'i kontrol et
    setInterval(() => this.cleanExpiredCache(), 6 * 60 * 60 * 1000);
    
    // Sayfa yüklendiğinde de bir kere temizle
    this.cleanExpiredCache();
    
    // Sekme/pencere tekrar aktif olduğunda temizle
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.cleanExpiredCache();
      }
    });
  }

  async cleanExpiredCache() {
    try {
      console.log('Cleaning expired cache items...');
      const now = new Date().getTime();
      const keys = Object.keys(localStorage);
      
      for (const key of keys) {
        if (key.startsWith('verse-')) {
          try {
            const cachedData = localStorage.getItem(key);
            if (!cachedData) continue;

            const { timestamp, expirationInHours } = JSON.parse(cachedData);
            const expirationTime = timestamp + (expirationInHours * 60 * 60 * 1000);

            if (now > expirationTime) {
              console.log(`Removing expired cache item: ${key}`);
              localStorage.removeItem(key);
            }
          } catch (parseError) {
            console.error(`Error parsing cache item ${key}:`, parseError);
            localStorage.removeItem(key);
          }
        }
      }
      console.log('Cache cleaning completed');
    } catch (error) {
      console.error('Cache cleaning error:', error);
    }
  }

  async fetchWithCache(url, key, expirationInHours = 24) {
    try {
      // Try to get data from cache first
      const cachedData = await this.getCachedData(key);
      if (cachedData) {
        return cachedData;
      }

      // If no cached data, fetch from network
      const response = await fetch(url);
      const data = await response.json();

      // Cache the new data
      await this.cacheData(key, data, expirationInHours);

      return data;
    } catch (error) {
      console.error('Fetch with cache error:', error);
      throw error;
    }
  }

  async clearCache() {
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith('verse-')) {
          localStorage.removeItem(key);
        }
      }
      console.log('Cache cleared successfully');
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }
} 