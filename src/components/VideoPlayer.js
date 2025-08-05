// Enhanced Video Player Component with Security Monitoring
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Visibility,
} from '@mui/icons-material';
import { recordVideoWatch } from '../firebase/videoService';
import { resourceMonitor, sessionMonitor } from '../utils/securityMonitor';
import { useAuth } from '../contexts/AuthContext';

const VideoPlayer = ({ video, onViewCountUpdate }) => {
  const { userData } = useAuth();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasRecordedView, setHasRecordedView] = useState(false);
  const [viewCount, setViewCount] = useState(video?.viewCount || 0);
  const [isVisible, setIsVisible] = useState(true);
  const [suspiciousActivity, setSuspiciousActivity] = useState(0);

  // مراقبة رؤية الصفحة
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden = document.hidden;
      setIsVisible(!isHidden);

      if (isHidden && isPlaying) {
        console.log('⚠️ تم اكتشاف فقدان التركيز أثناء تشغيل الفيديو');
        setSuspiciousActivity(prev => prev + 1);

        // إيقاف الفيديو مؤقتاً عند فقدان التركيز
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying]);

  // تسجيل المشاهدة
  const recordView = async () => {
    if (hasRecordedView || !userData?.id || !video?.id) return;

    try {
      console.log('📊 تسجيل مشاهدة الفيديو:', video.id);

      // تتبع الوصول للفيديو
      await resourceMonitor.trackVideoAccess(video.id, userData.id, {
        videoTitle: video.title,
        timestamp: new Date().toISOString(),
      });

      const result = await recordVideoWatch(video.id, userData.id, {
        duration: duration,
        watchTime: currentTime,
      });

      if (result.success) {
        setHasRecordedView(true);
        const newViewCount = result.viewCount || viewCount + 1;
        setViewCount(newViewCount);

        if (onViewCountUpdate) {
          onViewCountUpdate(newViewCount);
        }

        console.log('✅ تم تسجيل المشاهدة بنجاح. العدد الجديد:', newViewCount);
      } else {
        console.error('❌ فشل في تسجيل المشاهدة:', result.error);
      }
    } catch (error) {
      console.error('❌ خطأ في تسجيل المشاهدة:', error);
    }
  };

  // معالجة تشغيل الفيديو
  const handlePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();

      // تسجيل المشاهدة عند بدء التشغيل
      if (!hasRecordedView) {
        recordView();
      }
    }
  };

  // معالجة كتم الصوت
  const handleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // معالجة الشاشة الكاملة
  const handleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // تحديث التقدم
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;

    setCurrentTime(current);
    setProgress((current / total) * 100);

    // تحديث نشاط الجلسة
    const sessionId = `${userData?.id}_${navigator.userAgent}`;
    sessionMonitor.updateActivity(sessionId);
  };

  // معالجة أحداث الفيديو
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // تنسيق الوقت
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // إنشاء رابط الفيديو
  const getVideoUrl = () => {
    if (video.videoSource === 'youtube' && video.youtubeId) {
      return `https://www.youtube.com/embed/${video.youtubeId}`;
    } else if (video.videoSource === 'googleDrive' && video.googleDriveId) {
      return `https://drive.google.com/file/d/${video.googleDriveId}/preview`;
    }
    return null;
  };

  const videoUrl = getVideoUrl();

  if (!videoUrl) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        لا يمكن تحميل الفيديو. يرجى التحقق من صحة الرابط.
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ p: 0 }}>
        {/* معلومات الفيديو */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {video.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              icon={<Visibility />}
              label={`${viewCount} مشاهدة`}
              size="small"
              color="primary"
              variant="outlined"
            />

            {suspiciousActivity > 0 && (
              <Chip
                label={`⚠️ ${suspiciousActivity} تحذير`}
                size="small"
                color="warning"
                variant="outlined"
              />
            )}

            {!isVisible && (
              <Chip
                label="🔍 غير مرئي"
                size="small"
                color="error"
                variant="outlined"
              />
            )}
          </Box>

          {video.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {video.description}
            </Typography>
          )}
        </Box>

        {/* مشغل الفيديو */}
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%',
            overflow: 'hidden',
          }}
        >
          {video.videoSource === 'youtube' ? (
            <iframe
              src={videoUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '0 0 8px 8px',
              }}
            />
          ) : (
            <iframe
              src={videoUrl}
              title={video.title}
              frameBorder="0"
              allow="autoplay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '0 0 8px 8px',
              }}
            />
          )}
        </Box>

        {/* شريط التحكم المخصص (للفيديوهات المحلية فقط) */}
        {video.videoSource === 'local' && (
          <Box sx={{ p: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mb: 1, height: 6, borderRadius: 3 }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={handlePlay} color="primary">
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>

                <IconButton onClick={handleMute} color="primary">
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>

                <Typography variant="body2" color="text.secondary">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
              </Box>

              <IconButton onClick={handleFullscreen} color="primary">
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
