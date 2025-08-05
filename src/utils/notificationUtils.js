// Notification Utilities
import { sendNewVideoNotification } from '../firebase/notificationService';

// إرسال إشعار عند إضافة فيديو جديد
export const notifyNewVideo = async (video, targetStudents = []) => {
  try {
    const result = await sendNewVideoNotification(video, targetStudents);

    if (result.success) {
      console.log(
        'تم إرسال إشعار الفيديو الجديد بنجاح:',
        result.notificationId
      );
    } else {
      console.warn('فشل في إرسال إشعار الفيديو الجديد:', result.error);
    }

    return result;
  } catch (error) {
    console.error('خطأ في إرسال إشعار الفيديو الجديد:', error);
    return { success: false, error: error.message };
  }
};

// تنسيق وقت الإشعار
export const formatNotificationTime = timestamp => {
  if (!timestamp) return '';

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return 'الآن';
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `منذ ${diffInDays} يوم`;

  return date.toLocaleDateString('ar-SA');
};

// تحديد أولوية الإشعار
export const getNotificationPriority = type => {
  const priorities = {
    new_video: 'normal',
    announcement: 'high',
    system: 'high',
    reminder: 'low',
    general: 'normal',
  };

  return priorities[type] || 'normal';
};

// تحديد أيقونة الإشعار
export const getNotificationIcon = type => {
  const icons = {
    new_video: 'VideoLibrary',
    announcement: 'Campaign',
    system: 'Settings',
    reminder: 'Schedule',
    general: 'Notifications',
  };

  return icons[type] || 'Notifications';
};

// تحديد لون الإشعار
export const getNotificationColor = priority => {
  const colors = {
    high: 'error',
    normal: 'info',
    low: 'success',
  };

  return colors[priority] || 'info';
};

// فلترة الإشعارات حسب النوع
export const filterNotificationsByType = (notifications, type) => {
  if (!type || type === 'all') return notifications;
  return notifications.filter(notification => notification.type === type);
};

// فلترة الإشعارات حسب الأولوية
export const filterNotificationsByPriority = (notifications, priority) => {
  if (!priority || priority === 'all') return notifications;
  return notifications.filter(
    notification => notification.priority === priority
  );
};

// ترتيب الإشعارات
export const sortNotifications = (notifications, sortBy = 'date') => {
  const sorted = [...notifications];

  switch (sortBy) {
    case 'priority':
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      return sorted.sort((a, b) => {
        const aPriority = priorityOrder[a.priority] || 2;
        const bPriority = priorityOrder[b.priority] || 2;
        return bPriority - aPriority;
      });

    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type));

    case 'date':
    default:
      return sorted.sort((a, b) => {
        const aDate = a.createdAt?.toDate?.() || new Date(0);
        const bDate = b.createdAt?.toDate?.() || new Date(0);
        return bDate - aDate;
      });
  }
};

// تجميع الإشعارات حسب التاريخ
export const groupNotificationsByDate = notifications => {
  const groups = {};

  notifications.forEach(notification => {
    const date = notification.createdAt?.toDate?.() || new Date();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey;
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'اليوم';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'أمس';
    } else {
      groupKey = date.toLocaleDateString('ar-SA');
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
  });

  return groups;
};

// تحديد ما إذا كان الإشعار جديد (أقل من 24 ساعة)
export const isNotificationNew = notification => {
  if (!notification.createdAt) return false;

  const date = notification.createdAt.toDate
    ? notification.createdAt.toDate()
    : new Date(notification.createdAt);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  return diffInHours < 24;
};

// إنشاء ملخص الإشعارات
export const createNotificationSummary = notifications => {
  const total = notifications.length;
  const unread = notifications.filter(n => !n.isRead).length;
  const byPriority = {
    high: notifications.filter(n => n.priority === 'high').length,
    normal: notifications.filter(n => n.priority === 'normal').length,
    low: notifications.filter(n => n.priority === 'low').length,
  };
  const byType = {};

  notifications.forEach(notification => {
    const type = notification.type || 'general';
    byType[type] = (byType[type] || 0) + 1;
  });

  return {
    total,
    unread,
    byPriority,
    byType,
  };
};
