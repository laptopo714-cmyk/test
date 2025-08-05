// Student Dashboard with Access Code System
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Badge,
  Divider,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Collapse,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  Notifications,
  VideoLibrary,
  Schedule,
  Person,
  Security,
  Refresh,
  ExitToApp,
  NewReleases,
  ExpandMore,
  ExpandLess,
  Lock,
  LockOpen,
} from '@mui/icons-material';
import { useStudent } from '../../contexts/StudentContext';
import { useNavigate } from 'react-router-dom';
import { formatDateTime, formatRelativeTime } from '../../utils/dateUtils';
import {
  getAllSections,
  getAllVideos,
  validateSectionPassword,
  validateVideoPassword,
} from '../../firebase/videoService';
import { getStudentNotifications } from '../../firebase/notificationService';
import DeveloperCredit from '../../components/DeveloperCredit';
import NotificationPanel from '../../components/NotificationPanel';
import SmartNotificationAlert from '../../components/SmartNotificationAlert';
import ExpandableText from '../../components/ExpandableText';
import LinkifiedText from '../../components/LinkifiedText';
import PersistentNotificationAlert from '../../components/PersistentNotificationAlert';
import AttachedFiles from '../../components/Student/AttachedFiles';
import ExpiryCountdown from '../../components/ExpiryCountdown';
import sectionPasswordManager from '../../utils/sectionPasswordManager';
import {
  useVideoPlaybackState,
  isAnyVideoCurrentlyPlaying,
} from '../../hooks/useVideoPlaybackState';

const StudentDashboard = () => {
  const {
    student,
    assignedVideos,
    notifications,
    unreadCount,
    refreshAssignedVideos,
    refreshNotifications,
    logout,
    loading,
    error,
  } = useStudent();

  const navigate = useNavigate();

  // تتبع حالة تشغيل الفيديو لمنع التحديث أثناء المشاهدة
  const { isVideoPlaying, checkVideoPlayback } = useVideoPlaybackState();

  // مراقبة حالة تشغيل الفيديو وتحديث المؤشر
  useEffect(() => {
    setUpdatePaused(isVideoPlaying);
  }, [isVideoPlaying]);

  // All state hooks must be declared before any conditional returns
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sections, setSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [passwordDialog, setPasswordDialog] = useState({
    open: false,
    sectionId: null,
    sectionTitle: '',
    videoId: null,
    videoTitle: '',
    type: 'section', // 'section' أو 'video'
  });
  const [sectionPassword, setSectionPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updatePaused, setUpdatePaused] = useState(false);

  // حالة الإشعارات المحلية
  const [localNotifications, setLocalNotifications] = useState([]);
  const [localUnreadCount, setLocalUnreadCount] = useState(0);
  const [showNewNotificationAlert, setShowNewNotificationAlert] =
    useState(false);
  const [showPersistentAlert, setShowPersistentAlert] = useState(false);

  // جلب الأقسام مع تنظيف العناصر غير المحمية
  const loadSections = async () => {
    try {
      const result = await getAllSections();
      if (result.success) {
        const newSections = result.sections;

        // التحقق من الأقسام التي تم إزالة كلمة المرور منها
        const previousSections = sections;
        const newExpandedSections = new Set(expandedSections);

        newSections.forEach(newSection => {
          const oldSection = previousSections.find(s => s.id === newSection.id);

          // إذا كان القسم محمياً سابقاً والآن غير محمي، قم بفتحه تلقائياً
          if (oldSection && oldSection.password && !newSection.password) {
            newExpandedSections.add(newSection.id);
            // إضافة القسم إلى قائمة الأقسام المفتوحة في المدير
            sectionPasswordManager.unlockSection(newSection.id);
          }

          // إذا كان القسم غير محمي سابقاً والآن محمي، قم بإغلاقه
          if (oldSection && !oldSection.password && newSection.password) {
            newExpandedSections.delete(newSection.id);
            // إزالة القسم من قائمة الأقسام المفتوحة في المدير
            sectionPasswordManager.lockSection(newSection.id);
          }

          // إذا كان القسم مفتوحاً في المدير وغير محمي، أضفه للأقسام المفتوحة
          if (
            !newSection.password &&
            sectionPasswordManager.isSectionUnlocked(newSection.id)
          ) {
            newExpandedSections.add(newSection.id);
          }
        });

        setSections(newSections);
        setExpandedSections(newExpandedSections);

        // تنظيف العناصر غير المحمية من المدير
        if (assignedVideos && assignedVideos.length > 0) {
          sectionPasswordManager.cleanupUnprotectedItems(
            newSections,
            assignedVideos
          );
        }
      }
    } catch (error) {
      console.error('خطأ في جلب الأقسام:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // تحديث البيانات بالكامل
      await Promise.all([
        refreshAssignedVideos(),
        refreshNotifications(),
        loadSections(), // إعادة تحميل الأقسام أيضاً
        loadLocalNotifications(), // تحميل الإشعارات المحلية
      ]);
    } catch (error) {
      console.error('خطأ في تحديث البيانات:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // دالة تحديث سريع للبيانات (بدون مؤشر تحميل)
  const quickRefresh = async () => {
    try {
      // التحقق من حالة تشغيل الفيديو قبل التحديث
      const isVideoCurrentlyPlaying = isAnyVideoCurrentlyPlaying();
      if (isVideoCurrentlyPlaying) {
        console.log('🎥 تم تأجيل التحديث - يوجد فيديو قيد التشغيل');
        return;
      }

      console.log('🔄 تنفيذ التحديث السريع...');
      await Promise.all([refreshAssignedVideos(), loadSections()]);
    } catch (error) {
      console.error('خطأ في التحديث السريع:', error);
    }
  };

  // تحميل البيانات عند تحميل المكون
  React.useEffect(() => {
    if (student) {
      loadSections();
      loadLocalNotifications();
    }
  }, [student]);

  // تحديث تلقائي كل 30 ثانية للتحقق من تغييرات كلمات المرور
  React.useEffect(() => {
    if (!student) return;

    const interval = setInterval(() => {
      // التحقق من صفحة الفيديو أولاً
      const isOnVideoPage =
        window.location.pathname.startsWith('/student/video/');
      if (isOnVideoPage) {
        console.log('🎬 تم تأجيل التحديث التلقائي - الطالب في صفحة فيديو');
        return;
      }

      // التحقق من حالة تشغيل الفيديو قبل التحديث
      const isVideoCurrentlyPlaying = isAnyVideoCurrentlyPlaying();
      if (isVideoCurrentlyPlaying) {
        console.log('🎥 تم تأجيل التحديث التلقائي - يوجد فيديو قيد التشغيل');
        return;
      }

      console.log('⏰ تنفيذ التحديث التلقائي المجدول...');
      quickRefresh();
    }, 30000); // 30 ثانية

    return () => clearInterval(interval);
  }, [student]);

  // مستمع لإشارات التحديث من لوحة الإدارة
  React.useEffect(() => {
    if (!student) return;

    const handleStorageChange = e => {
      if (e.key === 'admin_refresh_signal' && e.newValue) {
        try {
          const signalData = JSON.parse(e.newValue);
          const now = Date.now();
          // إذا كانت الإشارة حديثة (أقل من دقيقة)
          if (now - signalData.timestamp < 60000) {
            console.log('📡 تم استلام إشارة تحديث من لوحة الإدارة');

            // التحقق من حالة تشغيل الفيديو
            const isVideoCurrentlyPlaying = isAnyVideoCurrentlyPlaying();
            if (isVideoCurrentlyPlaying) {
              console.log(
                '🎥 تم تأجيل التحديث من لوحة الإدارة - يوجد فيديو قيد التشغيل'
              );
              // يمكن إضافة آلية لإعادة المحاولة لاحقاً
              setTimeout(() => {
                if (!isAnyVideoCurrentlyPlaying()) {
                  console.log('🔄 إعادة محاولة التحديث بعد انتهاء الفيديو');
                  handleStorageChange(e); // إعادة المحاولة
                }
              }, 10000); // إعادة المحاولة بعد 10 ثوان
              return;
            }

            // إذا كانت الإشارة تطلب مسح ذاكرة كلمات المرور
            if (signalData.clearPasswordCache) {
              console.log('🔄 مسح ذاكرة كلمات المرور...');
              sectionPasswordManager.lockAll();
              setExpandedSections(new Set());
            }

            quickRefresh();
          }
        } catch (error) {
          console.error('خطأ في معالجة إشارة التحديث:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // أيضاً التحقق من الإشارة عند تحميل المكون
    const checkRefreshSignal = () => {
      const signal = localStorage.getItem('admin_refresh_signal');
      if (signal) {
        try {
          const signalData = JSON.parse(signal);
          const now = Date.now();
          // إذا كانت الإشارة حديثة (أقل من دقيقة)
          if (now - signalData.timestamp < 60000) {
            console.log('📡 تم العثور على إشارة تحديث حديثة');

            // التحقق من حالة تشغيل الفيديو
            const isVideoCurrentlyPlaying = isAnyVideoCurrentlyPlaying();
            if (isVideoCurrentlyPlaying) {
              console.log(
                '🎥 تم تأجيل التحديث عند التحميل - يوجد فيديو قيد التشغيل'
              );
              return;
            }

            // إذا كانت الإشارة تطلب مسح ذاكرة كلمات المرور
            if (signalData.clearPasswordCache) {
              console.log('🔄 مسح ذاكرة كلمات المرور...');
              sectionPasswordManager.lockAll();
              setExpandedSections(new Set());
            }

            quickRefresh();
          }
        } catch (error) {
          console.error('خطأ في قراءة إشارة التحديث:', error);
        }
      }
    };

    checkRefreshSignal();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [student]);

  // تحميل الإشعارات المحلية مع إدارة التنبيهات
  const loadLocalNotifications = async () => {
    if (!student?.code) return;

    try {
      const result = await getStudentNotifications(student.code);
      if (result.success) {
        const newNotifications = result.notifications;
        setLocalNotifications(newNotifications);

        // حساب الإشعارات غير المقروءة
        const unread = newNotifications.filter(
          notification => !notification.readBy?.includes(student.code)
        );

        const newUnreadCount = unread.length;

        // إظهار تنبيه إذا كان هناك إشعارات جديدة غير مقروءة
        if (newUnreadCount > localUnreadCount && localUnreadCount !== 0) {
          setShowNewNotificationAlert(true);
          // إخفاء التنبيه تلقائياً بعد 5 ثوان
          setTimeout(() => {
            setShowNewNotificationAlert(false);
          }, 5000);
        }

        setLocalUnreadCount(newUnreadCount);

        // إظهار التنبيه المزعج إذا كان هناك إشعارات غير مقروءة
        if (newUnreadCount > 0) {
          setShowPersistentAlert(true);
        } else {
          setShowPersistentAlert(false);
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل الإشعارات:', error);
    }
  };

  // تحديث البيانات عند تحميل الصفحة
  useEffect(() => {
    handleRefresh();
    loadSections();

    // تحميل حالة الأقسام المفتوحة من الجلسة
    const unlockedSections = sectionPasswordManager.getUnlockedSections();
    setExpandedSections(new Set(unlockedSections));
  }, []);

  // تحديث الإشعارات دورياً كل دقيقة
  useEffect(() => {
    if (student?.code) {
      loadLocalNotifications();

      const interval = setInterval(() => {
        loadLocalNotifications();
      }, 60000); // كل دقيقة

      return () => clearInterval(interval);
    }
  }, [student?.code, localUnreadCount]);

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!loading && !student) {
      console.log('🚫 المستخدم غير مسجل دخول - إعادة توجيه');
      navigate('/auth/access-code');
    }
  }, [student, loading, navigate]);

  // عرض شاشة التحميل
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 2,
          }}
        >
          <LinearProgress sx={{ width: '100%', mb: 2 }} />
          <Typography variant="h6" color="primary">
            جارٍ التحقق من حالة الحساب...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            يرجى الانتظار قليلاً
          </Typography>
        </Box>
      </Container>
    );
  }

  // عرض رسالة الخطأ
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate('/auth/access-code')}
            >
              تسجيل الدخول
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // إذا لم يكن هناك طالب مسجل دخول
  if (!student) {
    return null; // سيتم إعادة التوجيه بواسطة useEffect
  }

  // إخفاء التنبيه عند فتح الإشعارات
  const handleOpenNotifications = () => {
    setShowNotifications(true);
    setShowNewNotificationAlert(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleVideoClick = async video => {
    // التحقق من كلمة مرور الفيديو
    if (video.password && !sectionPasswordManager.isVideoUnlocked(video.id)) {
      // التحقق من حالة كلمة المرور الحالية
      try {
        const validationResult = await validateVideoPassword(video.id, '');

        // إذا لم يعد الفيديو محمياً، افتحه مباشرة
        if (validationResult.success && !validationResult.hasPassword) {
          navigate(`/student/video/${video.id}`);
          return;
        }
      } catch (error) {
        console.error('خطأ في التحقق من حالة الفيديو:', error);
      }

      setPasswordDialog({
        open: true,
        sectionId: null,
        sectionTitle: '',
        videoId: video.id,
        videoTitle: video.title,
        type: 'video',
      });
    } else {
      navigate(`/student/video/${video.id}`);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  // التعامل مع توسيع/طي الأقسام
  const handleSectionClick = async section => {
    // التحقق من البيانات الحديثة للقسم
    const currentSection = sections.find(s => s.id === section.id) || section;

    // إذا كان القسم محمياً ولم يتم فتحه بعد
    if (currentSection.password && !expandedSections.has(currentSection.id)) {
      // التحقق من حالة كلمة المرور الحالية
      try {
        const validationResult = await validateSectionPassword(
          currentSection.id,
          ''
        );

        // إذا لم يعد القسم محمياً، افتحه مباشرة
        if (validationResult.success && !validationResult.hasPassword) {
          const newExpanded = new Set(expandedSections);
          newExpanded.add(currentSection.id);
          setExpandedSections(newExpanded);
          // تحديث قائمة الأقسام
          await loadSections();
          return;
        }
      } catch (error) {
        console.error('خطأ في التحقق من حالة القسم:', error);
      }

      // القسم محمي بكلمة مرور ولم يتم فتحه بعد
      setPasswordDialog({
        open: true,
        sectionId: currentSection.id,
        sectionTitle: currentSection.title,
        videoId: null,
        videoTitle: '',
        type: 'section',
      });
    } else {
      // القسم غير محمي أو تم فتحه مسبقاً
      const newExpanded = new Set(expandedSections);
      if (newExpanded.has(currentSection.id)) {
        newExpanded.delete(currentSection.id);
        // إزالة القسم من المدير إذا كان محمياً
        if (currentSection.password) {
          sectionPasswordManager.lockSection(currentSection.id);
        }
      } else {
        newExpanded.add(currentSection.id);
        // إضافة القسم للمدير إذا كان محمياً
        if (currentSection.password) {
          sectionPasswordManager.unlockSection(currentSection.id);
        }
      }
      setExpandedSections(newExpanded);
    }
  };

  // التحقق من كلمة مرور القسم أو الفيديو
  const handlePasswordSubmit = async () => {
    if (passwordDialog.type === 'section') {
      // التعامل مع كلمة مرور القسم
      try {
        const validationResult = await validateSectionPassword(
          passwordDialog.sectionId,
          sectionPassword
        );

        if (validationResult.success) {
          // إذا لم يعد القسم محمياً بكلمة مرور
          if (!validationResult.hasPassword) {
            const newExpanded = new Set(expandedSections);
            newExpanded.add(passwordDialog.sectionId);
            setExpandedSections(newExpanded);

            // تحديث قائمة الأقسام
            await loadSections();

            setPasswordDialog({
              open: false,
              sectionId: null,
              sectionTitle: '',
              videoId: null,
              videoTitle: '',
              type: 'section',
            });
            setSectionPassword('');
            setPasswordError('');
            return;
          }

          // كلمة المرور صحيحة
          const newExpanded = new Set(expandedSections);
          newExpanded.add(passwordDialog.sectionId);
          setExpandedSections(newExpanded);
          sectionPasswordManager.unlockSection(passwordDialog.sectionId);

          // تحديث قائمة الأقسام
          await loadSections();

          setPasswordDialog({
            open: false,
            sectionId: null,
            sectionTitle: '',
            videoId: null,
            videoTitle: '',
            type: 'section',
          });
          setSectionPassword('');
          setPasswordError('');
        } else {
          setPasswordError(validationResult.error || 'كلمة المرور غير صحيحة');
        }
      } catch (error) {
        console.error('خطأ في التحقق من كلمة مرور القسم:', error);
        setPasswordError('حدث خطأ في التحقق من كلمة المرور');
      }
    } else if (passwordDialog.type === 'video') {
      // التعامل مع كلمة مرور الفيديو
      try {
        const validationResult = await validateVideoPassword(
          passwordDialog.videoId,
          sectionPassword
        );

        if (validationResult.success) {
          // إذا لم يعد الفيديو محمياً بكلمة مرور
          if (!validationResult.hasPassword) {
            navigate(`/student/video/${passwordDialog.videoId}`);
            setPasswordDialog({
              open: false,
              sectionId: null,
              sectionTitle: '',
              videoId: null,
              videoTitle: '',
              type: 'section',
            });
            setSectionPassword('');
            setPasswordError('');
            return;
          }

          // كلمة المرور صحيحة
          sectionPasswordManager.unlockVideo(passwordDialog.videoId);
          navigate(`/student/video/${passwordDialog.videoId}`);
          setPasswordDialog({
            open: false,
            sectionId: null,
            sectionTitle: '',
            videoId: null,
            videoTitle: '',
            type: 'section',
          });
          setSectionPassword('');
          setPasswordError('');
        } else {
          setPasswordError(validationResult.error || 'كلمة المرور غير صحيحة');
        }
      } catch (error) {
        console.error('خطأ في التحقق من كلمة مرور الفيديو:', error);
        setPasswordError('حدث خطأ في التحقق من كلمة المرور');
      }
    }
  };

  // إغلاق حوار كلمة المرور
  const handlePasswordDialogClose = () => {
    setPasswordDialog({
      open: false,
      sectionId: null,
      sectionTitle: '',
      videoId: null,
      videoTitle: '',
      type: 'section',
    });
    setSectionPassword('');
    setPasswordError('');
  };

  // تجميع الفيديوهات حسب القسم
  const videosBySection = assignedVideos.reduce((acc, video) => {
    const sectionId = video.sectionId || 'other';
    const section = sections.find(s => s.id === sectionId);
    const sectionTitle = section
      ? section.title
      : sectionId === 'other'
      ? 'فيديوهات أخرى'
      : `قسم ${sectionId}`;

    if (!acc[sectionTitle]) {
      acc[sectionTitle] = [];
    }
    acc[sectionTitle].push(video);
    return acc;
  }, {});

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card
      sx={{
        height: '100%',
        background: theme =>
          `linear-gradient(135deg, ${theme.palette[color].light}, ${theme.palette[color].main})`,
        color: 'white',
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="div"
              fontWeight="bold"
              sx={{ color: 'white' }}
            >
              {value}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ opacity: 0.8, color: 'white' }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  const VideoCard = ({ video }) => (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
      onClick={() => handleVideoClick(video)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* أيقونة الفيديو */}
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <PlayArrow sx={{ fontSize: 30 }} />
          </Avatar>

          {/* محتوى الفيديو */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {video.title}
            </Typography>

            {video.description && (
              <ExpandableText
                text={video.description}
                maxLength={150}
                variant="body2"
                color="text.secondary"
                gutterBottom
              />
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              {video.duration && (
                <Chip
                  icon={<Schedule />}
                  label={video.duration}
                  size="small"
                  variant="outlined"
                />
              )}

              <Chip
                label={`${video.viewCount || 0} مشاهدة`}
                size="small"
                color="primary"
                variant="outlined"
              />

              {video.attachedFiles && video.attachedFiles.length > 0 && (
                <Chip
                  label={`${video.attachedFiles.length} ملف مرفق`}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}

              {video.password &&
                !sectionPasswordManager.isVideoUnlocked(video.id) && (
                  <Chip
                    icon={<Lock />}
                    label="محمي"
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                )}
            </Box>
          </Box>

          {/* زر التشغيل */}
          <IconButton
            color="primary"
            size="large"
            sx={{
              bgcolor: 'primary.light',
              '&:hover': { bgcolor: 'primary.main', color: 'white' },
            }}
          >
            <PlayArrow />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  const NotificationItem = ({ notification }) => (
    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor:
              notification.priority === 'high' ? 'error.main' : 'info.main',
            width: 32,
            height: 32,
          }}
        >
          <Notifications sx={{ fontSize: 16 }} />
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" fontWeight="medium">
            {notification.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {notification.message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatRelativeTime(notification.createdAt)}
          </Typography>
        </Box>

        {notification.priority === 'high' && (
          <Chip label="عاجل" color="error" size="small" />
        )}
      </Box>
    </Box>
  );

  // مكون عرض القسم
  const SectionCard = ({ sectionTitle, videos, section }) => {
    const isExpanded = expandedSections.has(section?.id);
    const isProtected = section?.password;

    return (
      <Box sx={{ mb: 3 }}>
        <Card
          sx={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: 3,
            },
          }}
          onClick={() => section && handleSectionClick(section)}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isProtected ? (
                  <Lock color={isExpanded ? 'success' : 'action'} />
                ) : (
                  <LockOpen color="success" />
                )}
                <Typography variant="h6" color="primary">
                  {sectionTitle}
                </Typography>
                <Chip
                  label={`${videos.length} فيديو`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </Box>
          </CardContent>
        </Card>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, ml: 2 }}>
            {videos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  };

  if (!student) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error">
          لم يتم العثور على بيانات الطالب. يرجى تسجيل الدخول مرة أخرى.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          تسجيل الدخول
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* التنبيه الذكي للإشعارات الجديدة */}
      <SmartNotificationAlert
        show={showNewNotificationAlert}
        unreadCount={localUnreadCount}
        onView={handleOpenNotifications}
        onClose={() => setShowNewNotificationAlert(false)}
        autoHideDuration={8000}
      />

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            مرحباً، {student.studentName}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            استمتع بمشاهدة الفيديوهات المخصصة لك
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* زر الإشعارات */}
          <IconButton
            onClick={handleOpenNotifications}
            color={localUnreadCount > 0 ? 'error' : 'default'}
          >
            <Badge badgeContent={localUnreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* مؤشر حالة التحديث */}
          {updatePaused && (
            <Chip
              icon={<PlayArrow />}
              label="التحديث متوقف - فيديو قيد التشغيل"
              color="warning"
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
          )}

          {/* زر التحديث */}
          <Tooltip
            title={
              updatePaused
                ? 'التحديث متوقف أثناء تشغيل الفيديو لعدم المقاطعة'
                : isRefreshing
                ? 'جاري التحديث...'
                : 'تحديث البيانات'
            }
          >
            <span>
              <IconButton
                onClick={handleRefresh}
                disabled={isRefreshing || updatePaused}
                color="primary"
              >
                <Refresh
                  sx={{
                    animation: isRefreshing
                      ? 'spin 1s linear infinite'
                      : 'none',
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* إحصائيات سريعة */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="الفيديوهات المتاحة"
            value={assignedVideos.length}
            icon={<VideoLibrary sx={{ fontSize: 40 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="الإشعارات الجديدة"
            value={unreadCount}
            icon={<Notifications sx={{ fontSize: 40 }} />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="رمز الوصول"
            value={student.code}
            icon={<Security sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: theme =>
                `linear-gradient(135deg, ${theme.palette.info.light}, ${theme.palette.info.main})`,
              color: 'white',
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.9, color: 'white', mb: 1 }}
                  >
                    صلاحية الحساب
                  </Typography>
                  <ExpiryCountdown
                    expiryDate={student.expiryDate}
                    studentName={student.studentName}
                  />
                </Box>
                <Box sx={{ opacity: 0.8, color: 'white' }}>
                  <Schedule sx={{ fontSize: 40 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* الفيديوهات */}
        <Grid item xs={12} md={showNotifications ? 8 : 12}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h5">الفيديوهات المخصصة لك</Typography>
              {isRefreshing && <LinearProgress sx={{ width: 100 }} />}
            </Box>

            {assignedVideos.length > 0 ? (
              Object.keys(videosBySection).map(sectionTitle => {
                const sectionVideos = videosBySection[sectionTitle];
                const section = sections.find(s => s.title === sectionTitle);

                return (
                  <SectionCard
                    key={sectionTitle}
                    sectionTitle={sectionTitle}
                    videos={sectionVideos}
                    section={section}
                  />
                );
              })
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <VideoLibrary
                  sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  لا توجد فيديوهات مخصصة لك حالياً
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  سيتم إشعارك عند إضافة فيديوهات جديدة
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* الإشعارات */}
        {showNotifications && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, maxHeight: 600, overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                الإشعارات
              </Typography>

              {notifications.length > 0 ? (
                notifications
                  .slice(0, 10)
                  .map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Notifications
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    لا توجد إشعارات
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* معلومات الأمان */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{ p: 3, bgcolor: 'info.light', color: 'info.contrastText' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Security sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  معلومات الأمان
                </Typography>
                <Typography variant="body2">
                  رمز الوصول الخاص بك مرتبط بهذا الجهاز فقط. في حالة محاولة
                  الدخول من جهاز آخر، سيتم رفض الوصول تلقائياً.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* حقوق المطور */}
        <Grid item xs={12} md={4}>
          <DeveloperCredit variant="default" showPhone={true} />
        </Grid>
      </Grid>

      {/* حوار كلمة مرور القسم */}
      <Dialog
        open={passwordDialog.open}
        onClose={handlePasswordDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Lock color="primary" />
            <Typography variant="h6">
              {passwordDialog.type === 'section'
                ? `قسم محمي: ${passwordDialog.sectionTitle}`
                : `فيديو محمي: ${passwordDialog.videoTitle}`}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {passwordDialog.type === 'section'
              ? 'هذا القسم محمي بكلمة مرور. يرجى إدخال كلمة المرور للوصول إلى محتوى القسم.'
              : 'هذا الفيديو محمي بكلمة مرور. يرجى إدخال كلمة المرور لمشاهدة الفيديو.'}
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="كلمة المرور"
            value={sectionPassword}
            onChange={e => setSectionPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handlePasswordSubmit();
              }
            }}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose}>إلغاء</Button>
          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            disabled={!sectionPassword.trim()}
          >
            {passwordDialog.type === 'section' ? 'فتح القسم' : 'مشاهدة الفيديو'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* التنبيه المزعج للإشعارات غير المقروءة */}
      <PersistentNotificationAlert
        studentId={student?.code}
        show={showPersistentAlert}
        onAllRead={() => {
          setShowPersistentAlert(false);
          loadLocalNotifications();
        }}
      />

      {/* مكون الإشعارات المحسن */}
      <NotificationPanel
        studentId={student?.code}
        open={showNotifications}
        onClose={() => {
          setShowNotifications(false);
          // إعادة تحميل الإشعارات بعد الإغلاق لتحديث العدد
          loadLocalNotifications();
        }}
      />

      {/* رسالة توضيحية حول نظام التحديث الذكي */}
      {updatePaused && (
        <Alert severity="info" sx={{ mt: 3, mb: 2 }} icon={<PlayArrow />}>
          <Typography variant="body2">
            🎥 <strong>نظام التحديث الذكي:</strong> تم إيقاف التحديث التلقائي
            مؤقتاً لضمان عدم مقاطعة مشاهدتك للفيديو. سيتم استئناف التحديث
            تلقائياً عند انتهاء المشاهدة.
          </Typography>
        </Alert>
      )}

      {/* CSS للأنيميشن */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Container>
  );
};

export default StudentDashboard;
