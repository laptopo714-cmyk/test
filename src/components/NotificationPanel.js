// Enhanced Notification Panel Component
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Badge,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Notifications,
  NotificationsActive,
  CheckCircle,
  Delete,
  DeleteSweep,
  Info,
  Warning,
  Error,
  VideoLibrary,
  Announcement,
  School,
  Phone,
  Person,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {
  getStudentNotifications,
  markNotificationAsRead,
  hideReadNotificationsForStudent,
} from '../firebase/notificationService';
import DeveloperCredit from './DeveloperCredit';
import LinkifiedText from './LinkifiedText';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const NotificationPanel = ({ studentId, open, onClose }) => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedNotifications, setExpandedNotifications] = useState(new Set());

  // تحميل الإشعارات
  const loadNotifications = async () => {
    if (!studentId) return;

    setLoading(true);
    try {
      const result = await getStudentNotifications(studentId);
      if (result.success) {
        setNotifications(result.notifications);
        // حساب الإشعارات غير المقروءة
        const unread = result.notifications.filter(
          notification => !notification.readBy?.includes(studentId)
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('خطأ في تحميل الإشعارات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && studentId) {
      loadNotifications();
    }
  }, [open, studentId]);

  // تحديد إشعار كمقروء
  const handleMarkAsRead = async notificationId => {
    try {
      const result = await markNotificationAsRead(notificationId, studentId);
      if (result.success) {
        await loadNotifications(); // إعادة تحميل الإشعارات
      }
    } catch (error) {
      console.error('خطأ في تحديد الإشعار كمقروء:', error);
    }
  };

  // توسيع/طي الإشعار
  const toggleNotificationExpansion = notificationId => {
    const newExpanded = new Set(expandedNotifications);
    if (newExpanded.has(notificationId)) {
      newExpanded.delete(notificationId);
    } else {
      newExpanded.add(notificationId);
    }
    setExpandedNotifications(newExpanded);
  };

  // إخفاء جميع الإشعارات المقروءة (بدلاً من حذفها)
  const handleDeleteReadNotifications = async () => {
    setDeleteLoading(true);
    try {
      const result = await hideReadNotificationsForStudent(studentId);
      if (result.success) {
        await loadNotifications(); // إعادة تحميل الإشعارات
        alert(result.message); // إظهار رسالة نجاح
      } else {
        alert(`خطأ: ${result.error}`);
      }
    } catch (error) {
      console.error('خطأ في إخفاء الإشعارات:', error);
      alert('حدث خطأ في إخفاء الإشعارات');
    } finally {
      setDeleteLoading(false);
    }
  };

  // الحصول على أيقونة نوع الإشعار
  const getNotificationIcon = type => {
    switch (type) {
      case 'new_video':
        return <VideoLibrary color="primary" />;
      case 'announcement':
        return <Announcement color="warning" />;
      case 'warning':
        return <Warning color="error" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <Notifications color="action" />;
    }
  };

  // الحصول على لون الأولوية
  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'normal':
        return 'primary';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  // تنسيق التاريخ
  const formatDate = timestamp => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsActive />
          </Badge>
          <Typography variant="h6" fontWeight="bold">
            الإشعارات
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Notifications
              sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              لا توجد إشعارات حالياً
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            {/* أزرار التحكم */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<DeleteSweep />}
                onClick={handleDeleteReadNotifications}
                disabled={deleteLoading}
                color="warning"
                size="small"
              >
                {deleteLoading ? 'جاري الإخفاء...' : 'إخفاء المقروءة'}
              </Button>
            </Box>

            {/* قائمة الإشعارات */}
            <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {notifications.map((notification, index) => {
                const isRead = notification.readBy?.includes(studentId);
                const isLongMessage =
                  notification.message && notification.message.length > 200;
                const isExpanded = expandedNotifications.has(notification.id);
                const displayMessage =
                  isLongMessage && !isExpanded
                    ? notification.message.substring(0, 200) + '...'
                    : notification.message;

                return (
                  <Card
                    key={notification.id}
                    sx={{
                      mb: 2,
                      border: isRead
                        ? '1px solid #e0e0e0'
                        : '2px solid #4f46e5',
                      backgroundColor: isRead
                        ? theme.palette.mode === 'dark'
                          ? '#2a2a2a'
                          : '#f9f9f9'
                        : theme.palette.mode === 'dark'
                        ? '#1e1e2e'
                        : '#fff',
                      opacity: isRead ? 0.7 : 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                        }}
                      >
                        {/* أيقونة الإشعار */}
                        <Box sx={{ mt: 0.5 }}>
                          {getNotificationIcon(notification.type)}
                        </Box>

                        {/* محتوى الإشعار */}
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Typography variant="h6" fontWeight="bold">
                              {notification.title}
                            </Typography>
                            <Chip
                              label={
                                notification.priority === 'high'
                                  ? 'عاجل'
                                  : 'عادي'
                              }
                              color={getPriorityColor(notification.priority)}
                              size="small"
                            />
                            {isRead && (
                              <Chip
                                label="مقروء"
                                color="success"
                                size="small"
                                icon={<CheckCircle />}
                              />
                            )}
                          </Box>

                          <LinkifiedText
                            text={displayMessage}
                            variant="body1"
                            sx={{ mb: isLongMessage ? 1 : 2 }}
                          />

                          {/* زر قراءة المزيد/أقل */}
                          {isLongMessage && (
                            <Button
                              size="small"
                              onClick={() =>
                                toggleNotificationExpansion(notification.id)
                              }
                              sx={{
                                mb: 2,
                                textTransform: 'none',
                                fontSize: '0.8rem',
                              }}
                            >
                              {isExpanded ? 'عرض أقل' : 'قراءة المزيد'}
                            </Button>
                          )}

                          <Typography variant="caption" color="text.secondary">
                            {formatDate(notification.createdAt)}
                          </Typography>
                        </Box>

                        {/* زر تمييز كمقروء */}
                        {!isRead && (
                          <Button
                            onClick={() => handleMarkAsRead(notification.id)}
                            color="success"
                            size="small"
                            variant="outlined"
                            startIcon={<CheckCircle />}
                            sx={{
                              minWidth: 'auto',
                              fontSize: '0.75rem',
                              px: 1.5,
                              py: 0.5,
                            }}
                          >
                            تمييز كمقروء
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}

        {/* معلومات المطور */}
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <DeveloperCredit variant="minimal" showPhone={true} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPanel;
