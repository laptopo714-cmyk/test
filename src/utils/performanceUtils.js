// Performance Utilities
import { debounce, throttle } from 'lodash';

// تحسين البحث بالتأخير
export const createDebouncedSearch = (searchFunction, delay = 300) => {
  return debounce(searchFunction, delay);
};

// تحسين التمرير بالتقييد
export const createThrottledScroll = (scrollFunction, delay = 100) => {
  return throttle(scrollFunction, delay);
};

// تحسين تحديث البيانات
export const createThrottledRefresh = (refreshFunction, delay = 1000) => {
  return throttle(refreshFunction, delay);
};

// ذاكرة التخزين المؤقت للبيانات
class DataCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
    // 5 دقائق افتراضياً
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key, value) {
    // إزالة العناصر القديمة إذا تجاوز الحد الأقصى
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) return null;

    // التحقق من انتهاء الصلاحية
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// إنشاء ذاكرة تخزين مؤقت للفيديوهات
export const videoCache = new DataCache(50, 10 * 60 * 1000); // 10 دقائق

// إنشاء ذاكرة تخزين مؤقت للإشعارات
export const notificationCache = new DataCache(100, 2 * 60 * 1000); // دقيقتان

// إنشاء ذاكرة تخزين مؤقت للأقسام
export const sectionCache = new DataCache(20, 15 * 60 * 1000); // 15 دقيقة

// تحسين تحميل الصور
export const preloadImage = src => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// تحسين تحميل الصور المتعددة
export const preloadImages = async srcArray => {
  const promises = srcArray.map(src => preloadImage(src));

  try {
    return await Promise.allSettled(promises);
  } catch (error) {
    console.warn('خطأ في تحميل بعض الصور:', error);
    return [];
  }
};

// تحسين معالجة الأخطاء
export const withErrorHandling = (asyncFunction, fallbackValue = null) => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      console.error('خطأ في تنفيذ الدالة:', error);
      return fallbackValue;
    }
  };
};

// تحسين إعادة المحاولة
export const withRetry = (asyncFunction, maxRetries = 3, delay = 1000) => {
  return async (...args) => {
    let lastError;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await asyncFunction(...args);
      } catch (error) {
        lastError = error;

        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }

    throw lastError;
  };
};

// تحسين التحميل التدريجي
export const createLazyLoader = (loadFunction, threshold = 0.1) => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadFunction(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  return {
    observe: element => observer.observe(element),
    unobserve: element => observer.unobserve(element),
    disconnect: () => observer.disconnect(),
  };
};

// تحسين إدارة الذاكرة
export const cleanupResources = () => {
  // تنظيف ذاكرة التخزين المؤقت
  videoCache.clear();
  notificationCache.clear();
  sectionCache.clear();

  // تنظيف المتغيرات العامة
  if (window.gc) {
    window.gc();
  }
};

// مراقبة الأداء
export const performanceMonitor = {
  start: label => {
    performance.mark(`${label}-start`);
  },

  end: label => {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);

    const measure = performance.getEntriesByName(label)[0];
    console.log(`${label}: ${measure.duration.toFixed(2)}ms`);

    return measure.duration;
  },

  clear: () => {
    performance.clearMarks();
    performance.clearMeasures();
  },
};

// تحسين استخدام الذاكرة
export const memoryOptimizer = {
  // تنظيف دوري للذاكرة
  startCleanupInterval: (interval = 5 * 60 * 1000) => {
    // كل 5 دقائق
    return setInterval(() => {
      cleanupResources();
    }, interval);
  },

  // مراقبة استخدام الذاكرة
  getMemoryUsage: () => {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
      };
    }
    return null;
  },

  // تحذير عند استخدام ذاكرة عالية
  checkMemoryUsage: () => {
    const usage = memoryOptimizer.getMemoryUsage();
    if (usage && usage.used / usage.limit > 0.8) {
      console.warn('استخدام ذاكرة عالي:', usage);
      cleanupResources();
    }
  },
};

// تصدير الأدوات
export default {
  createDebouncedSearch,
  createThrottledScroll,
  createThrottledRefresh,
  DataCache,
  videoCache,
  notificationCache,
  sectionCache,
  preloadImage,
  preloadImages,
  withErrorHandling,
  withRetry,
  createLazyLoader,
  cleanupResources,
  performanceMonitor,
  memoryOptimizer,
};
