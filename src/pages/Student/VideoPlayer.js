// Secure Video Player Component
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ArrowBack,
  Security,
  Warning,
  PlayArrow,
  Pause,
  VolumeUp,
  Fullscreen,
  Lock,
  Home,
  VideoLibrary,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../../contexts/StudentContext';
import AttachedFiles from '../../components/Student/AttachedFiles';
import LinkifiedText from '../../components/LinkifiedText';
import {
  recordVideoWatch,
  validateSectionPassword,
  createSecureGoogleDriveUrl,
  createSecureYouTubeUrl,
} from '../../firebase/videoService';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { formatDateTime } from '../../utils/dateUtils';
import sectionPasswordManager from '../../utils/sectionPasswordManager';
import {
  useVideoPlaybackState,
  attachVideoEventListeners,
} from '../../hooks/useVideoPlaybackState';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { student, assignedVideos } = useStudent();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // تتبع حالة تشغيل الفيديو
  const { setVideoPlaying, setVideoStopped } = useVideoPlaybackState();

  const [video, setVideo] = useState(null);
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [watchStartTime, setWatchStartTime] = useState(null);
  const [hasRecordedView, setHasRecordedView] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);

  // دوال التحكم في الفيديو
  const handlePlayPause = () => {
    // بما أن الفيديو في iframe، لا يمكن التحكم به مباشرة
    // يمكن إضافة رسالة للمستخدم أو إخفاء الأزرار
    alert('يرجى استخدام أدوات التحكم الخاصة بالفيديو');
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  const formatTime = seconds => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLoadedMetadata = () => {
    // بما أن الفيديو في iframe، لا يمكن الحصول على metadata مباشرة
    // يمكن تعيين قيم افتراضية أو إخفاء المعلومات
    setDuration(0);
    setCurrentTime(0);
  };

  // منع التحديث التلقائي أثناء مشاهدة الفيديو
  useEffect(() => {
    // منع التحديث التلقائي للصفحة
    const preventRefresh = e => {
      e.preventDefault();
      e.returnValue = '';
      return 'هل أنت متأكد من مغادرة الصفحة؟ سيتم فقدان تقدم المشاهدة.';
    };

    // منع F5 و Ctrl+R
    const preventKeyRefresh = e => {
      if (
        e.key === 'F5' ||
        (e.ctrlKey && e.key === 'r') ||
        (e.ctrlKey && e.key === 'R')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // إضافة مستمعي الأحداث
    window.addEventListener('beforeunload', preventRefresh);
    window.addEventListener('keydown', preventKeyRefresh);

    // تنظيف المستمعين عند مغادرة المكون
    return () => {
      window.removeEventListener('beforeunload', preventRefresh);
      window.removeEventListener('keydown', preventKeyRefresh);
    };
  }, []);

  // البحث عن الفيديو والتحقق من الصلاحيات
  useEffect(() => {
    if (student && videoId) {
      loadVideoWithPermissions();
    }
  }, [student, videoId]);

  const loadVideoWithPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      // البحث في الفيديوهات المخصصة أولاً
      let foundVideo = null;
      if (assignedVideos && assignedVideos.length > 0) {
        foundVideo = assignedVideos.find(v => v.id === videoId);
      }

      // إذا لم يوجد في المخصصة، جلب من قاعدة البيانات مباشرة
      if (!foundVideo) {
        const videoDoc = await getDoc(doc(db, 'videos', videoId));
        if (videoDoc.exists()) {
          foundVideo = { id: videoDoc.id, ...videoDoc.data() };
        }
      }

      if (!foundVideo) {
        setError('الفيديو غير موجود');
        setLoading(false);
        return;
      }

      // التحقق من أن الفيديو نشط
      if (!foundVideo.isActive) {
        setError('هذا الفيديو غير متاح حالياً');
        setLoading(false);
        return;
      }

      // جلب بيانات القسم
      const sectionDoc = await getDoc(
        doc(db, 'sections', foundVideo.sectionId)
      );
      if (!sectionDoc.exists()) {
        setError('القسم غير موجود');
        setLoading(false);
        return;
      }

      const sectionData = { id: sectionDoc.id, ...sectionDoc.data() };

      // التحقق من صلاحية الوصول للقسم
      if (student.allowedSections && student.allowedSections.length > 0) {
        if (!student.allowedSections.includes(sectionData.id)) {
          setError('أنت غير مصرح لك بالوصول لهذا القسم');
          setLoading(false);
          return;
        }
      }

      // التحقق من أن الفيديو مخصص للطالب (إذا كان هناك تخصيص)
      if (student.assignedVideos && student.assignedVideos.length > 0) {
        if (!student.assignedVideos.includes(videoId)) {
          setError('هذا الفيديو غير مخصص لك');
          setLoading(false);
          return;
        }
      }

      setVideo(foundVideo);
      setSection(sectionData);

      // التحقق من كلمة مرور القسم
      if (
        sectionData.password &&
        !sectionPasswordManager.isSectionUnlocked(sectionData.id)
      ) {
        setPasswordDialog(true);
        setLoading(false);
      } else {
        setAccessGranted(true);
        setWatchStartTime(Date.now());
        setLoading(false);
      }
    } catch (error) {
      console.error('خطأ في جلب الفيديو:', error);
      setError('حدث خطأ في تحميل الفيديو');
      setLoading(false);
    }
  };

  // التحقق من كلمة مرور القسم
  const handlePasswordSubmit = async () => {
    try {
      setPasswordError('');

      const result = await validateSectionPassword(section.id, password);

      if (result.success) {
        // حفظ القسم كمفتوح في الجلسة
        sectionPasswordManager.unlockSection(section.id);
        setPasswordDialog(false);
        setAccessGranted(true);
        setWatchStartTime(Date.now());
      } else {
        setPasswordError(result.error);
      }
    } catch (error) {
      setPasswordError('حدث خطأ في التحقق من كلمة المرور');
    }
  };

  // الحصول على رابط الفيديو الآمن
  const getSecureVideoUrl = () => {
    if (!video) return '';

    if (video.videoSource === 'youtube' && video.youtubeId) {
      return createSecureYouTubeUrl(video.youtubeId);
    } else if (video.googleDriveId) {
      return createSecureGoogleDriveUrl(video.googleDriveId);
    }

    return '';
  };

  // تحميل بيانات الفيديو عند تحميل المكون (تم نقله إلى مكان آخر)

  // مراقبة حالة تشغيل الفيديو وتسجيلها
  useEffect(() => {
    if (!accessGranted || !video) return;

    // تسجيل أن الفيديو بدأ (افتراضياً عند تحميل الصفحة)
    setVideoPlaying();
    console.log('🎥 تم تسجيل بداية مشاهدة الفيديو - إيقاف التحديث التلقائي');

    // إضافة مستمعين لأحداث الفيديو
    const cleanup = attachVideoEventListeners();

    // تنظيف عند مغادرة الصفحة
    const handleBeforeUnload = () => {
      setVideoStopped();
      console.log('⏹️ تم تسجيل انتهاء مشاهدة الفيديو - تفعيل التحديث التلقائي');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      setVideoStopped();
      cleanup();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      console.log('⏹️ تنظيف مراقبة الفيديو');
    };
  }, [accessGranted, video, setVideoPlaying, setVideoStopped]);

  // حماية متقدمة من لقطة الشاشة والتسجيل
  useEffect(() => {
    const preventScreenshot = e => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('⚠️ لقطة الشاشة غير مسموحة! تم رصد المحاولة.');
        // إرسال تنبيه للإدارة (يمكن إضافة هذا لاحقاً)
        return false;
      }
    };

    const preventRightClick = e => {
      e.preventDefault();
      alert('⚠️ النقر بالزر الأيمن غير مسموح!');
      return false;
    };

    const preventDevTools = e => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'S')
      ) {
        e.preventDefault();
        alert('⚠️ أدوات المطور غير مسموحة! تم رصد المحاولة.');
        return false;
      }
    };

    const preventCopy = e => {
      if (
        e.ctrlKey &&
        (e.key === 'c' ||
          e.key === 'a' ||
          e.key === 's' ||
          e.key === 'C' ||
          e.key === 'A' ||
          e.key === 'S')
      ) {
        e.preventDefault();
        alert('⚠️ النسخ غير مسموح!');
        return false;
      }
    };

    // منع تسجيل الشاشة
    const preventScreenRecording = () => {
      // محاولة اكتشاف تسجيل الشاشة
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        navigator.mediaDevices.getDisplayMedia = function () {
          alert('⚠️ تسجيل الشاشة غير مسموح! تم رصد المحاولة.');
          return Promise.reject(new Error('Screen recording blocked'));
        };
      }
    };

    // منع تغيير حجم النافذة أثناء المشاهدة (لمنع التسجيل الخفي)
    const preventResize = e => {
      if (document.fullscreenElement) {
        e.preventDefault();
        return false;
      }
    };

    // اكتشاف فقدان التركيز (قد يشير لتسجيل)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.warn('تم اكتشاف فقدان التركيز - قد يكون هناك محاولة تسجيل');
      }
    };

    // تفعيل الحماية
    preventScreenRecording();

    // إضافة مستمعي الأحداث
    document.addEventListener('keydown', preventScreenshot);
    document.addEventListener('keydown', preventDevTools);
    document.addEventListener('keydown', preventCopy);
    document.addEventListener('contextmenu', preventRightClick);
    document.addEventListener('resize', preventResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // منع السحب والإفلات
    document.addEventListener('dragstart', e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());

    // منع الطباعة
    window.addEventListener('beforeprint', e => {
      e.preventDefault();
      alert('⚠️ الطباعة غير مسموحة!');
      return false;
    });

    // إضافة CSS لمنع التحديد والحماية المتقدمة
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.webkitTouchCallout = 'none';
    document.body.style.webkitUserDrag = 'none';
    document.body.style.webkitTapHighlightColor = 'transparent';

    // منع تسجيل الشاشة عبر CSS
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      /* منع تسجيل الشاشة */
      @media screen {
        body::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          pointer-events: none;
          z-index: 9999;
        }
      }
      
      /* إخفاء المحتوى عند الطباعة */
      @media print {
        * {
          display: none !important;
        }
        body::after {
          content: "المحتوى محمي ولا يمكن طباعته";
          display: block !important;
          text-align: center;
          font-size: 24px;
          color: red;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('keydown', preventScreenshot);
      document.removeEventListener('keydown', preventDevTools);
      document.removeEventListener('keydown', preventCopy);
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('resize', preventResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('dragstart', e => e.preventDefault());
      document.removeEventListener('selectstart', e => e.preventDefault());

      // إزالة CSS
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
      document.body.style.webkitTouchCallout = '';
      document.body.style.webkitUserDrag = '';
      document.body.style.webkitTapHighlightColor = '';

      // إزالة الستايل المضاف
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // تسجيل مشاهدة الفيديو
  useEffect(() => {
    if (video && student && !hasRecordedView) {
      const recordView = async () => {
        try {
          await recordVideoWatch(video.id, student.id, {
            duration: 0,
            completed: false,
            deviceInfo: {
              deviceId: student.deviceId,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
            },
          });
          setHasRecordedView(true);
        } catch (error) {
          console.error('خطأ في تسجيل المشاهدة:', error);
        }
      };

      recordView();
    }
  }, [video, student, hasRecordedView]);

  // تسجيل إكمال المشاهدة عند الخروج
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (video && student && watchStartTime) {
        const watchDuration = Math.floor((Date.now() - watchStartTime) / 1000);
        const completed = currentTime >= duration * 0.8; // اعتبار الفيديو مكتمل إذا شوهد 80%

        try {
          await recordVideoWatch(video.id, student.id, {
            duration: watchDuration,
            completed: completed,
            deviceInfo: {
              deviceId: student.deviceId,
              finalTime: currentTime,
              totalDuration: duration,
            },
          });
        } catch (error) {
          console.error('خطأ في تسجيل إكمال المشاهدة:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [video, student, watchStartTime, currentTime, duration]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVolumeChange = newVolume => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          جاري تحميل الفيديو...
        </Typography>
      </Container>
    );
  }

  if (error || !video) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'الفيديو غير موجود'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/student')}
        >
          العودة للرئيسية
        </Button>
      </Container>
    );
  }

  // إذا كان القسم محمي ولم يتم منح الوصول بعد
  if (section?.password && !accessGranted) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          يتطلب هذا القسم كلمة مرور للوصول
        </Alert>

        <Dialog open={passwordDialog} onClose={() => navigate('/student')}>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lock />
              قسم محمي
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              يتطلب الوصول لقسم "{section?.title}" إدخال كلمة المرور
            </Typography>
            <TextField
              fullWidth
              type="password"
              label="كلمة المرور"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate('/student')}>إلغاء</Button>
            <Button
              variant="contained"
              onClick={handlePasswordSubmit}
              disabled={!password}
            >
              دخول
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  // إذا لم يتم منح الوصول بعد
  if (!accessGranted) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          جاري التحقق من الصلاحيات...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: { xs: 2, sm: 3 },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            order: { xs: 1, sm: 1 },
          }}
        >
          <IconButton
            onClick={() => navigate('/student/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                wordBreak: 'break-word',
                lineHeight: 1.3,
              }}
            >
              {video.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              القسم: {section?.title}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: { xs: 'center', sm: 'flex-end' },
            order: { xs: 2, sm: 2 },
            flexWrap: 'wrap',
          }}
        >
          <Chip
            icon={<Security />}
            label="محمي"
            color="success"
            variant="outlined"
            size="small"
          />
          {section?.password && (
            <Chip
              icon={<Lock />}
              label="قسم محمي"
              color="warning"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      </Box>

      {/* Video Player Container */}
      <Paper
        ref={containerRef}
        elevation={8}
        sx={{
          position: 'relative',
          backgroundColor: 'black',
          borderRadius: { xs: 1, sm: 2 },
          overflow: 'hidden',
          mb: { xs: 2, sm: 3 },
          mx: { xs: -1, sm: 0 }, // تمديد على الجوانب في الموبايل
        }}
      >
        {/* Security Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)',
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Watermark */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 2,
            pointerEvents: 'none',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {student.studentName} - {student.code}
        </Box>

        {/* Video Element */}
        <iframe
          ref={videoRef}
          src={getSecureVideoUrl()}
          width="100%"
          height="auto"
          style={{
            border: 'none',
            display: 'block',
            aspectRatio: '16/9',
            minHeight: '250px',
            maxHeight: '500px',
          }}
          onLoad={handleLoadedMetadata}
          allow="autoplay; encrypted-media"
          sandbox="allow-scripts allow-same-origin"
          title={video.title}
        />

        {/* Custom Controls Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            p: 2,
            zIndex: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              color: 'white',
            }}
          >
            <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            <Typography variant="body2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <IconButton onClick={handleFullscreen} sx={{ color: 'white' }}>
              <Fullscreen />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Video Info */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            wordBreak: 'break-word',
          }}
        >
          {video.title}
        </Typography>

        {video.description && (
          <LinkifiedText
            text={video.description}
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' },
              lineHeight: 1.6,
              mb: 2,
            }}
          />
        )}

        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        >
          {video.duration && (
            <Chip
              label={`المدة: ${video.duration}`}
              variant="outlined"
              size="small"
            />
          )}
          <Chip
            label={`المشاهدات: ${video.viewCount || 0}`}
            variant="outlined"
            size="small"
          />
          <Chip
            label="محمي بالحماية المتقدمة"
            color="success"
            variant="outlined"
            size="small"
          />
        </Box>
      </Paper>

      {/* Attached Files */}
      {video.attachedFiles && video.attachedFiles.length > 0 && (
        <AttachedFiles files={video.attachedFiles} videoTitle={video.title} />
      )}

      {/* Security Warning */}
      <Alert severity="warning" sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning />
          <Typography variant="body2">
            هذا الفيديو محمي ضد التحميل والمشاركة. أي محاولة لتسجيل الشاشة أو
            أخذ لقطات سيتم رصدها ومنعها.
          </Typography>
        </Box>
      </Alert>

      {/* CSS للحماية الإضافية */}
      <style>
        {`
          /* منع التحديد */
          .video-container * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          
          /* منع السحب */
          .video-container img,
          .video-container video {
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
            pointer-events: none !important;
          }
          
          /* إخفاء شريط التمرير في وضع ملء الشاشة */
          .video-container:fullscreen {
            overflow: hidden !important;
          }
          
          /* منع النقر بالزر الأيمن */
          .video-container {
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            -khtml-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
          }
        `}
      </style>
    </Container>
  );
};

export default VideoPlayer;
