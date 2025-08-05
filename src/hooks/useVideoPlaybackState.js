// Hook لتتبع حالة تشغيل الفيديو
import { useState, useEffect, useCallback } from 'react';

// متغير عام لتتبع حالة تشغيل الفيديو
let globalVideoPlayingState = false;
let globalVideoElement = null;
let stateChangeListeners = new Set();

// دالة لإضافة مستمع لتغييرات حالة التشغيل
const addStateChangeListener = listener => {
  stateChangeListeners.add(listener);
  return () => stateChangeListeners.delete(listener);
};

// دالة لتحديث الحالة العامة
const updateGlobalState = (isPlaying, videoElement = null) => {
  globalVideoPlayingState = isPlaying;
  globalVideoElement = videoElement;

  // إشعار جميع المستمعين
  stateChangeListeners.forEach(listener => {
    try {
      listener(isPlaying, videoElement);
    } catch (error) {
      console.error('خطأ في مستمع حالة الفيديو:', error);
    }
  });
};

// Hook لتتبع حالة تشغيل الفيديو
export const useVideoPlaybackState = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(globalVideoPlayingState);

  useEffect(() => {
    // إضافة مستمع لتغييرات الحالة
    const removeListener = addStateChangeListener(isPlaying => {
      setIsVideoPlaying(isPlaying);
    });

    return removeListener;
  }, []);

  // دالة لتسجيل بداية تشغيل الفيديو
  const setVideoPlaying = useCallback((videoElement = null) => {
    console.log('🎥 بدء تشغيل الفيديو - إيقاف التحديث التلقائي');
    updateGlobalState(true, videoElement);
  }, []);

  // دالة لتسجيل إيقاف تشغيل الفيديو
  const setVideoStopped = useCallback(() => {
    console.log('⏹️ إيقاف تشغيل الفيديو - تفعيل التحديث التلقائي');
    updateGlobalState(false, null);
  }, []);

  // دالة للتحقق من حالة التشغيل
  const checkVideoPlayback = useCallback(() => {
    // التحقق من عناصر الفيديو في الصفحة
    const videoElements = document.querySelectorAll(
      'video, iframe[src*="youtube"], iframe[src*="drive.google"]'
    );
    let isAnyVideoPlaying = false;

    videoElements.forEach(element => {
      if (element.tagName === 'VIDEO') {
        // فيديو HTML5
        if (!element.paused && !element.ended && element.currentTime > 0) {
          isAnyVideoPlaying = true;
        }
      } else if (element.tagName === 'IFRAME') {
        // iframe (YouTube أو Google Drive)
        // نفترض أن وجود iframe يعني أن الفيديو قد يكون قيد التشغيل
        // يمكن تحسين هذا لاحقاً بالتواصل مع YouTube API
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          isAnyVideoPlaying = true;
        }
      }
    });

    if (isAnyVideoPlaying !== globalVideoPlayingState) {
      updateGlobalState(isAnyVideoPlaying);
    }

    return isAnyVideoPlaying;
  }, []);

  return {
    isVideoPlaying,
    setVideoPlaying,
    setVideoStopped,
    checkVideoPlayback,
    // دالة للحصول على الحالة العامة مباشرة
    getGlobalState: () => globalVideoPlayingState,
  };
};

// دالة مساعدة للتحقق من حالة التشغيل من أي مكان
export const isAnyVideoCurrentlyPlaying = () => {
  return globalVideoPlayingState;
};

// دالة لإضافة مستمعين للأحداث على عناصر الفيديو
export const attachVideoEventListeners = () => {
  // مراقبة عناصر الفيديو الجديدة
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // البحث عن عناصر الفيديو الجديدة
          const videos = node.querySelectorAll
            ? node.querySelectorAll('video')
            : [];
          const iframes = node.querySelectorAll
            ? node.querySelectorAll(
                'iframe[src*="youtube"], iframe[src*="drive.google"]'
              )
            : [];

          // إضافة مستمعين لعناصر الفيديو
          videos.forEach(video => {
            video.addEventListener('play', () =>
              updateGlobalState(true, video)
            );
            video.addEventListener('pause', () =>
              updateGlobalState(false, video)
            );
            video.addEventListener('ended', () =>
              updateGlobalState(false, video)
            );
          });

          // للـ iframes، نحتاج طريقة أخرى للمراقبة
          iframes.forEach(iframe => {
            // يمكن تحسين هذا لاحقاً
            iframe.addEventListener('load', () => {
              // نفترض أن تحميل iframe يعني بداية التشغيل
              updateGlobalState(true, iframe);
            });
          });
        }
      });
    });
  });

  // بدء مراقبة التغييرات في DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // إضافة مستمعين للعناصر الموجودة
  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => updateGlobalState(true, video));
    video.addEventListener('pause', () => updateGlobalState(false, video));
    video.addEventListener('ended', () => updateGlobalState(false, video));
  });

  return () => observer.disconnect();
};

// تصدير افتراضي للـ hook
export default useVideoPlaybackState;
