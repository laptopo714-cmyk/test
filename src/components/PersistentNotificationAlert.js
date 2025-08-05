// Persistent Notification Alert Component
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Close,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {
  getStudentNotifications,
  markNotificationAsRead,
} from '../firebase/notificationService';

const PersistentNotificationAlert = ({
  studentId,
  show,
  onClose,
  onAllRead,
}) => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // تحميل الإشعارات غير المقروءة
  const loadUnreadNotifications = async () => {
    if (!studentId) return;

    setLoading(true);
    try {
      const result = await getStudentNotifications(studentId);
      if (result.success) {
        const unreadNotifications = result.notifications.filter(
          notification => !notification.readBy?.includes(studentId)
        );
        setNotifications(unreadNotifications);
        setUnreadCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error('خطأ في تحميل الإشعارات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && studentId) {
      loadUnreadNotifications();
    }
  }, [show, studentId]);

  // تمييز إشعار كمقروء
  const handleMarkAsRead = async notificationId => {
    try {
      const result = await markNotificationAsRead(notificationId, studentId);
      if (result.success) {
        await loadUnreadNotifications();

        // إذا لم تعد هناك إشعارات غير مقروءة، أغلق التنبيه
        const remainingUnread = notifications.filter(
          n => n.id !== notificationId
        );
        if (remainingUnread.length === 0) {
          onAllRead && onAllRead();
        }
      }
    } catch (error) {
      console.error('خطأ في تمييز الإشعار كمقروء:', error);
    }
  };

  // تمييز جميع الإشعارات كمقروءة
  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      const promises = notifications.map(notification =>
        markNotificationAsRead(notification.id, studentId)
      );

      await Promise.all(promises);
      onAllRead && onAllRead();
    } catch (error) {
      console.error('خطأ في تمييز جميع الإشعارات كمقروءة:', error);
    } finally {
      setLoading(false);
    }
  };

  // تنسيق التاريخ
  const formatDate = timestamp => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ar-EG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!show || unreadCount === 0) return null;

  return (
    <Dialog
      open={show}
      onClose={null} // منع الإغلاق بالنقر خارج الحوار
      disableEscapeKeyDown // منع الإغلاق بمفتاح Escape
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: '3px solid #f44336',
          boxShadow: '0 0 20px rgba(244, 67, 54, 0.3)',
          animation: 'pulse 2s ease-in-out infinite alternate',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge badgeContent={unreadCount} color="warning">
            <NotificationsActive sx={{ fontSize: 28 }} />
          </Badge>
          <Typography variant="h6" fontWeight="bold">
            لديك إشعارات غير مقروءة!
          </Typography>
        </Box>
        <Warning
          sx={{ fontSize: 28, animation: 'shake 1s ease-in-out infinite' }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight="medium">
            يجب قراءة جميع الإشعارات قبل المتابعة
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom color="error">
          الإشعارات غير المقروءة ({unreadCount}):
        </Typography>

        <Box sx={{ maxHeight: '300px', overflowY: 'auto', mt: 2 }}>
          {notifications.map((notification, index) => (
            <Box key={notification.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2,
                  bgcolor:
                    notification.priority === 'high'
                      ? 'error.light'
                      : 'grey.100',
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                <NotificationsActive
                  color={notification.priority === 'high' ? 'error' : 'primary'}
                />

                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {notification.title}
                    </Typography>
                    {notification.priority === 'high' && (
                      <Chip label="عاجل" color="error" size="small" />
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {notification.message}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {formatDate(notification.createdAt)}
                  </Typography>
                </Box>

                <Button
                  onClick={() => handleMarkAsRead(notification.id)}
                  color="success"
                  size="small"
                  variant="contained"
                  startIcon={<CheckCircle />}
                  sx={{ minWidth: 'auto', fontSize: '0.75rem' }}
                >
                  قرأت
                </Button>
              </Box>

              {index < notifications.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
        <Button
          onClick={handleMarkAllAsRead}
          variant="contained"
          color="success"
          size="large"
          startIcon={<CheckCircle />}
          disabled={loading}
          sx={{ px: 4, py: 1.5 }}
        >
          {loading ? 'جاري التحديث...' : 'تمييز الكل كمقروء'}
        </Button>
      </DialogActions>

      {/* CSS للأنيميشن */}
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 20px rgba(244, 67, 54, 0.3); }
            100% { box-shadow: 0 0 30px rgba(244, 67, 54, 0.6); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}
      </style>
    </Dialog>
  );
};

export default PersistentNotificationAlert;
