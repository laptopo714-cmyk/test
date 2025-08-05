// Security Monitoring Service
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// تسجيل محاولات الوصول المشبوهة
export const logSuspiciousActivity = async activityData => {
  try {
    const logEntry = {
      type: activityData.type || 'suspicious_access',
      description: activityData.description,
      userId: activityData.userId || null,
      deviceId: activityData.deviceId || null,
      ipAddress: activityData.ipAddress || null,
      userAgent: activityData.userAgent || navigator.userAgent,
      timestamp: serverTimestamp(),
      severity: activityData.severity || 'medium', // low, medium, high, critical
      metadata: activityData.metadata || {},
    };

    await addDoc(collection(db, 'security_logs'), logEntry);

    // إرسال تنبيه للكونسول حسب مستوى الخطورة
    if (logEntry.severity === 'critical') {
      console.error('🚨 نشاط أمني حرج:', logEntry);
    } else if (logEntry.severity === 'high') {
      console.warn('⚠️ نشاط أمني مشبوه:', logEntry);
    } else {
      console.log('ℹ️ تم تسجيل نشاط أمني:', logEntry);
    }

    return { success: true };
  } catch (error) {
    console.error('خطأ في تسجيل النشاط الأمني:', error);
    return { success: false, error: error.message };
  }
};

// مراقبة محاولات تسجيل الدخول المتكررة
export const monitorLoginAttempts = (() => {
  const attempts = new Map();
  const MAX_ATTEMPTS = 5;
  const BLOCK_DURATION = 15 * 60 * 1000; // 15 دقيقة

  return {
    recordAttempt: (identifier, success = false) => {
      const now = Date.now();
      const key = identifier;

      if (!attempts.has(key)) {
        attempts.set(key, { count: 0, lastAttempt: now, blocked: false });
      }

      const record = attempts.get(key);

      // إعادة تعيين العداد إذا مر وقت كافي
      if (now - record.lastAttempt > BLOCK_DURATION) {
        record.count = 0;
        record.blocked = false;
      }

      if (success) {
        // نجح تسجيل الدخول - إعادة تعيين العداد
        record.count = 0;
        record.blocked = false;
      } else {
        // فشل تسجيل الدخول
        record.count++;
        record.lastAttempt = now;

        if (record.count >= MAX_ATTEMPTS) {
          record.blocked = true;

          // تسجيل النشاط المشبوه
          logSuspiciousActivity({
            type: 'multiple_failed_logins',
            description: `محاولات تسجيل دخول متكررة فاشلة من ${identifier}`,
            severity: 'high',
            metadata: {
              identifier,
              attemptCount: record.count,
              timeWindow: BLOCK_DURATION / 1000 / 60 + ' دقيقة',
            },
          });
        }
      }

      attempts.set(key, record);
      return record;
    },

    isBlocked: identifier => {
      const record = attempts.get(identifier);
      if (!record) return false;

      const now = Date.now();
      if (now - record.lastAttempt > BLOCK_DURATION) {
        record.blocked = false;
        record.count = 0;
        attempts.set(identifier, record);
        return false;
      }

      return record.blocked;
    },

    getRemainingBlockTime: identifier => {
      const record = attempts.get(identifier);
      if (!record || !record.blocked) return 0;

      const now = Date.now();
      const remaining = BLOCK_DURATION - (now - record.lastAttempt);
      return Math.max(0, remaining);
    },
  };
})();

// مراقبة الجلسات النشطة
export const sessionMonitor = (() => {
  const activeSessions = new Map();
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 دقيقة

  return {
    startSession: (userId, deviceId, sessionData = {}) => {
      const sessionId = `${userId}_${deviceId}`;
      const session = {
        userId,
        deviceId,
        startTime: Date.now(),
        lastActivity: Date.now(),
        ...sessionData,
      };

      activeSessions.set(sessionId, session);

      console.log('🟢 بدء جلسة جديدة:', { userId, deviceId });
      return sessionId;
    },

    updateActivity: sessionId => {
      const session = activeSessions.get(sessionId);
      if (session) {
        session.lastActivity = Date.now();
        activeSessions.set(sessionId, session);
      }
    },

    endSession: sessionId => {
      const session = activeSessions.get(sessionId);
      if (session) {
        const duration = Date.now() - session.startTime;
        console.log('🔴 انتهاء الجلسة:', {
          sessionId,
          duration: Math.round(duration / 1000 / 60) + ' دقيقة',
        });

        activeSessions.delete(sessionId);
      }
    },

    cleanupExpiredSessions: () => {
      const now = Date.now();
      let cleanedCount = 0;

      for (const [sessionId, session] of activeSessions.entries()) {
        if (now - session.lastActivity > SESSION_TIMEOUT) {
          activeSessions.delete(sessionId);
          cleanedCount++;

          console.log('⏰ انتهت صلاحية الجلسة:', sessionId);
        }
      }

      if (cleanedCount > 0) {
        console.log(`🧹 تم تنظيف ${cleanedCount} جلسة منتهية الصلاحية`);
      }

      return cleanedCount;
    },

    getActiveSessionsCount: () => activeSessions.size,

    isSessionActive: sessionId => {
      const session = activeSessions.get(sessionId);
      if (!session) return false;

      const now = Date.now();
      if (now - session.lastActivity > SESSION_TIMEOUT) {
        activeSessions.delete(sessionId);
        return false;
      }

      return true;
    },
  };
})();

// مراقبة استخدام الموارد
export const resourceMonitor = {
  trackVideoAccess: async (videoId, userId, metadata = {}) => {
    try {
      await logSuspiciousActivity({
        type: 'video_access',
        description: `وصول إلى الفيديو ${videoId}`,
        userId,
        severity: 'low',
        metadata: {
          videoId,
          ...metadata,
        },
      });
    } catch (error) {
      console.error('خطأ في تتبع الوصول للفيديو:', error);
    }
  },

  trackFileDownload: async (fileId, userId, metadata = {}) => {
    try {
      await logSuspiciousActivity({
        type: 'file_download',
        description: `تحميل الملف ${fileId}`,
        userId,
        severity: 'low',
        metadata: {
          fileId,
          ...metadata,
        },
      });
    } catch (error) {
      console.error('خطأ في تتبع تحميل الملف:', error);
    }
  },
};

// تشغيل مراقب الجلسات تلقائياً
if (typeof window !== 'undefined') {
  // تنظيف الجلسات المنتهية كل 5 دقائق
  setInterval(() => {
    sessionMonitor.cleanupExpiredSessions();
  }, 5 * 60 * 1000);

  // مراقبة إغلاق النافذة
  window.addEventListener('beforeunload', () => {
    // يمكن إضافة منطق لإنهاء الجلسة هنا
    console.log('🔄 المستخدم يغادر الصفحة');
  });

  // مراقبة فقدان التركيز
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('👁️ فقدان تركيز الصفحة');
    } else {
      console.log('👁️ استعادة تركيز الصفحة');
    }
  });
}

export default {
  logSuspiciousActivity,
  monitorLoginAttempts,
  sessionMonitor,
  resourceMonitor,
};
