// Custom Hook for Notifications Management
import { useState, useEffect, useCallback } from 'react';
import { useStudent } from '../contexts/StudentContext';
import {
  formatNotificationTime,
  sortNotifications,
  groupNotificationsByDate,
  createNotificationSummary,
} from '../utils/notificationUtils';

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    refreshNotifications,
  } = useStudent();
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [groupedNotifications, setGroupedNotifications] = useState({});
  const [summary, setSummary] = useState({});
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    sortBy: 'date',
  });

  // تطبيق الفلاتر والترتيب
  useEffect(() => {
    let filtered = [...notifications];

    // فلترة حسب النوع
    if (filters.type !== 'all') {
      filtered = filtered.filter(n => n.type === filters.type);
    }

    // فلترة حسب الأولوية
    if (filters.priority !== 'all') {
      filtered = filtered.filter(n => n.priority === filters.priority);
    }

    // ترتيب الإشعارات
    filtered = sortNotifications(filtered, filters.sortBy);

    setFilteredNotifications(filtered);

    // تجميع الإشعارات حسب التاريخ
    const grouped = groupNotificationsByDate(filtered);
    setGroupedNotifications(grouped);

    // إنشاء ملخص الإشعارات
    const notificationSummary = createNotificationSummary(notifications);
    setSummary(notificationSummary);
  }, [notifications, filters]);

  // تحديث الفلاتر
  const updateFilters = useCallback(newFilters => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // تحديد إشعار كمقروء
  const markAsRead = useCallback(
    async notificationId => {
      try {
        await markNotificationAsRead(notificationId);
      } catch (error) {
        console.error('خطأ في تحديد الإشعار كمقروء:', error);
      }
    },
    [markNotificationAsRead]
  );

  // تحديث الإشعارات
  const refresh = useCallback(async () => {
    try {
      await refreshNotifications();
    } catch (error) {
      console.error('خطأ في تحديث الإشعارات:', error);
    }
  }, [refreshNotifications]);

  // تنسيق وقت الإشعار
  const formatTime = useCallback(timestamp => {
    return formatNotificationTime(timestamp);
  }, []);

  // الحصول على الإشعارات غير المقروءة
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.isRead);
  }, [notifications]);

  // الحصول على الإشعارات الجديدة (آخر 24 ساعة)
  const getRecentNotifications = useCallback(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notifications.filter(n => {
      const notificationDate = n.createdAt?.toDate?.() || new Date(n.createdAt);
      return notificationDate > oneDayAgo;
    });
  }, [notifications]);

  // الحصول على إشعارات عالية الأولوية
  const getHighPriorityNotifications = useCallback(() => {
    return notifications.filter(n => n.priority === 'high');
  }, [notifications]);

  return {
    // البيانات
    notifications,
    filteredNotifications,
    groupedNotifications,
    unreadCount,
    summary,
    filters,

    // الدوال
    updateFilters,
    markAsRead,
    refresh,
    formatTime,

    // دوال مساعدة
    getUnreadNotifications,
    getRecentNotifications,
    getHighPriorityNotifications,
  };
};

export default useNotifications;
