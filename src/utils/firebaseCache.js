// Firebase Data Caching Service
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

const cache = {
  videos: {
    data: null,
    timestamp: 0,
  },
  sections: {
    data: null,
    timestamp: 0,
  },
  student: {
    data: null,
    timestamp: 0,
  },
  notifications: {
    data: null,
    timestamp: 0,
  },
};

// Get cached data if valid, otherwise fetch fresh
export const getCachedData = async (key, fetchFn) => {
  const now = Date.now();

  if (cache[key].data && now - cache[key].timestamp < CACHE_TTL) {
    console.log(`📦 Using cached ${key}`);
    return cache[key].data;
  }

  console.log(`🔄 Fetching fresh ${key} data`);
  try {
    const result = await fetchFn();
    if (result.success) {
      cache[key] = {
        data: result,
        timestamp: now,
      };
      return result;
    }
    return cache[key].data || result; // Fallback to stale data if available
  } catch (error) {
    console.error(`Cache fetch error for ${key}:`, error);
    return cache[key].data || { success: false, error };
  }
};

// Invalidate specific cache
export const invalidateCache = key => {
  if (cache[key]) {
    cache[key].timestamp = 0;
    console.log(`♻️ Invalidated ${key} cache`);
  }
};

// Cache student data after login
export const cacheStudentData = studentData => {
  cache.student = {
    data: { success: true, studentData },
    timestamp: Date.now(),
  };
};

// Get cached student data
export const getCachedStudent = () => {
  return cache.student.data;
};
