// Sent Notifications View Component
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Tooltip,
  CircularProgress,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import {
  Visibility,
  Person,
  Group,
  CheckCircle,
  Schedule,
  Close,
  Refresh,
  NotificationsActive,
  Warning,
  Info,
  Announcement,
  VideoLibrary,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getAllNotifications } from '../../firebase/notificationService';
import { getAllAccessCodes } from '../../firebase/accessCodes';

const SentNotificationsView = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [readersDialogOpen, setReadersDialogOpen] = useState(false);

  // تحميل البيانات
  const loadData = async () => {
    setLoading(true);
    try {
      const [notificationsResult, studentsResult] = await Promise.all([
        getAllNotifications(),
        getAllAccessCodes(),
      ]);

      if (notificationsResult.success) {
        setNotifications(notificationsResult.notifications);
      }

      if (studentsResult.success) {
        setStudents(studentsResult.codes.filter(code => code.isActive));
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // الحصول على أيقونة نوع الإشعار
  const getNotificationIcon = type => {
    switch (type) {
      case 'new_video':
      case 'video':
        return <VideoLibrary color="primary" />;
      case 'announcement':
        return <Announcement color="warning" />;
      case 'warning':
        return <Warning color="error" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <NotificationsActive color="action" />;
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

  // الحصول على أسماء الطلاب الذين قرأوا الإشعار
  const getReadersInfo = notification => {
    const readBy = notification.readBy || [];
    const readers = readBy.map(studentId => {
      const student = students.find(s => s.code === studentId);
      return student
        ? { name: student.studentName, code: student.code }
        : { name: `طالب ${studentId}`, code: studentId };
    });

    return {
      count: readBy.length,
      readers: readers,
      totalTarget:
        notification.targetType === 'all'
          ? students.length
          : notification.targetIds
          ? notification.targetIds.length
          : 0,
    };
  };

  // فتح حوار عرض القراء
  const handleShowReaders = notification => {
    setSelectedNotification(notification);
    setReadersDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          الإشعارات المرسلة
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadData}
          disabled={loading}
        >
          تحديث
        </Button>
      </Box>

      {notifications.length === 0 ? (
        <Alert severity="info">لا توجد إشعارات مرسلة حالياً</Alert>
      ) : (
        <Grid container spacing={2}>
          {notifications.map(notification => {
            const readersInfo = getReadersInfo(notification);
            const readPercentage =
              readersInfo.totalTarget > 0
                ? Math.round(
                    (readersInfo.count / readersInfo.totalTarget) * 100
                  )
                : 0;

            return (
              <Grid item xs={12} key={notification.id}>
                <Card
                  sx={{
                    mb: 2,
                    border:
                      notification.priority === 'high'
                        ? '2px solid #f44336'
                        : '1px solid #e0e0e0',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}
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
                                : notification.priority === 'low'
                                ? 'منخفض'
                                : 'عادي'
                            }
                            color={getPriorityColor(notification.priority)}
                            size="small"
                          />

                          <Chip
                            label={
                              notification.targetType === 'all'
                                ? 'جميع الطلاب'
                                : notification.targetType === 'selected'
                                ? 'طلاب محددين'
                                : 'فئة محددة'
                            }
                            variant="outlined"
                            size="small"
                            icon={
                              notification.targetType === 'all' ? (
                                <Group />
                              ) : (
                                <Person />
                              )
                            }
                          />
                        </Box>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {notification.message}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          تم الإرسال: {formatDate(notification.createdAt)}
                        </Typography>
                      </Box>

                      {/* إحصائيات القراءة */}
                      <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                        <Tooltip
                          title={`${readersInfo.count} من ${readersInfo.totalTarget} قرأوا الإشعار`}
                        >
                          <IconButton
                            onClick={() => handleShowReaders(notification)}
                            color="primary"
                            sx={{
                              flexDirection: 'column',
                              gap: 0.5,
                              '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'white',
                              },
                            }}
                          >
                            <Badge
                              badgeContent={readersInfo.count}
                              color="success"
                              max={999}
                            >
                              <Visibility />
                            </Badge>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: '0.7rem' }}
                            >
                              {readPercentage}%
                            </Typography>
                          </IconButton>
                        </Tooltip>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {readersInfo.count}/{readersInfo.totalTarget}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* حوار عرض القراء */}
      <Dialog
        open={readersDialogOpen}
        onClose={() => setReadersDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle />
            <Typography variant="h6">الطلاب الذين قرأوا الإشعار</Typography>
          </Box>
          <IconButton
            onClick={() => setReadersDialogOpen(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {selectedNotification && (
            <>
              {/* معلومات الإشعار */}
              <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {selectedNotification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedNotification.message}
                </Typography>
              </Box>

              <Divider />

              {/* قائمة القراء */}
              <Box sx={{ p: 2 }}>
                {(() => {
                  const readersInfo = getReadersInfo(selectedNotification);

                  if (readersInfo.count === 0) {
                    return (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Schedule
                          sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                        />
                        <Typography variant="h6" color="text.secondary">
                          لم يقرأ أحد هذا الإشعار بعد
                        </Typography>
                      </Box>
                    );
                  }

                  return (
                    <List>
                      {readersInfo.readers.map((reader, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.main' }}>
                              <CheckCircle />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Typography variant="body1" fontWeight="medium">
                                  {reader.name}
                                </Typography>
                                <Chip
                                  label={reader.code}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              </Box>
                            }
                            secondary="قرأ الإشعار"
                          />
                        </ListItem>
                      ))}
                    </List>
                  );
                })()}
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReadersDialogOpen(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SentNotificationsView;
