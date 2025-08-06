// Video Management Service
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import {
  cleanFirebaseData,
  prepareFirebaseData,
  cleanAttachedFiles,
  handlePasswordRemoval,
  cleanFirebaseDataWithPassword,
} from '../utils/firebaseUtils';

// إنشاء قسم جديد
export const createSection = async sectionData => {
  try {
    const section = {
      title: sectionData.title,
      description: sectionData.description || '',
      order: sectionData.order || 0,
      password: sectionData.password || null,
      isActive: true,
      isHidden: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'sections'), section);

    return {
      success: true,
      sectionId: docRef.id,
      message: 'تم إنشاء القسم بنجاح',
    };
  } catch (error) {
    console.error('خطأ في إنشاء القسم:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// إنشاء فيديو جديد
export const createVideo = async videoData => {
  try {
    const video = {
      title: videoData.title,
      description: videoData.description || '',
      videoSource: videoData.videoSource || 'googleDrive',
      sectionId: videoData.sectionId,
      order: videoData.order || 0,
      duration: videoData.duration || '',
      password: videoData.password || null,
      isActive: true,
      isHidden: false,
      viewCount: 0,
      watchHistory: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // إضافة معرف الفيديو حسب المصدر
    if (videoData.googleDriveId) {
      video.googleDriveId = videoData.googleDriveId;
    }
    if (videoData.youtubeId) {
      video.youtubeId = videoData.youtubeId;
    }

    const docRef = await addDoc(collection(db, 'videos'), video);

    return {
      success: true,
      videoId: docRef.id,
      message: 'تم إنشاء الفيديو بنجاح',
    };
  } catch (error) {
    console.error('خطأ في إنشاء الفيديو:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// الحصول على جميع الأقسام مع التخزين المؤقت
export const getAllSections = async () => {
  // فحص التخزين المؤقت أولاً
  const cacheKey = 'sectionsCache';
  const cachedData = localStorage.getItem(cacheKey);
  const now = Date.now();

  if (cachedData) {
    const { sections, timestamp } = JSON.parse(cachedData);
    // إذا مر أقل من 24 ساعة، استخدام البيانات المخزنة
    if (now - timestamp < 24 * 60 * 60 * 1000) {
      console.log('📦 استخدام الأقسام المخزنة محلياً');
      return {
        success: true,
        sections: sections,
      };
    }
  }

  try {
    const sectionsQuery = query(
      collection(db, 'sections'),
      orderBy('order', 'asc')
    );
    const sectionsSnapshot = await getDocs(sectionsQuery);

    const sections = [];
    sectionsSnapshot.forEach(doc => {
      sections.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // تحديث التخزين المؤقت
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        sections: sections,
        timestamp: now,
      })
    );

    return {
      success: true,
      sections: sections,
    };
  } catch (error) {
    console.error('خطأ في جلب الأقسام:', error);

    // إذا فشل الاتصال، حاول استخدام النسخة المخزنة حتى لو انتهت صلاحيتها
    if (cachedData) {
      console.log('⚠️ استخدام الأقسام المخزنة رغم انتهاء الصلاحية');
      const { sections } = JSON.parse(cachedData);
      return {
        success: true,
        sections: sections,
      };
    }

    return {
      success: false,
      error: error.message,
    };
  }
};

// الحصول على جميع الفيديوهات
export const getAllVideos = async () => {
  try {
    const videosQuery = query(
      collection(db, 'videos'),
      orderBy('createdAt', 'desc')
    );
    const videosSnapshot = await getDocs(videosQuery);

    const videos = [];
    videosSnapshot.forEach(doc => {
      videos.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {
      success: true,
      videos: videos,
    };
  } catch (error) {
    console.error('خطأ في جلب الفيديوهات:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// الحصول على الفيديوهات المخصصة لطالب
export const getAssignedVideos = async videoIds => {
  try {
    if (!videoIds || videoIds.length === 0) {
      return {
        success: true,
        videos: [],
      };
    }

    const videos = [];

    for (const videoId of videoIds) {
      const videoDoc = await getDoc(doc(db, 'videos', videoId));
      if (videoDoc.exists()) {
        const videoData = videoDoc.data();
        // إظهار الفيديو فقط إذا كان نشط وغير مخفي
        if (videoData.isActive === true && videoData.isHidden !== true) {
          videos.push({
            id: videoDoc.id,
            ...videoData,
          });
        }
      }
    }

    videos.sort((a, b) => {
      if (a.sectionId !== b.sectionId) {
        return a.sectionId.localeCompare(b.sectionId);
      }
      return a.order - b.order;
    });

    return {
      success: true,
      videos: videos,
    };
  } catch (error) {
    console.error('خطأ في جلب الفيديوهات المخصصة:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تحديث قسم
export const updateSection = async (sectionId, updateData) => {
  try {
    console.log('البيانات الأصلية للقسم:', updateData);

    // معالجة كلمة المرور وتنظيف البيانات
    const processedData = handlePasswordRemoval(updateData);
    const cleanedData = cleanFirebaseDataWithPassword(processedData);

    console.log('البيانات المحضرة للقسم:', cleanedData);

    await updateDoc(doc(db, 'sections', sectionId), {
      ...cleanedData,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'تم تحديث القسم بنجاح',
    };
  } catch (error) {
    console.error('خطأ في تحديث القسم:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تحديث فيديو
export const updateVideo = async (videoId, updateData) => {
  try {
    console.log('البيانات الأصلية للفيديو:', updateData);

    // معالجة كلمة المرور
    const processedData = handlePasswordRemoval(updateData);

    // معالجة خاصة للملفات المرفقة
    if (processedData.attachedFiles) {
      processedData.attachedFiles = cleanAttachedFiles(
        processedData.attachedFiles
      );
      console.log('الملفات المرفقة بعد التنظيف:', processedData.attachedFiles);
    }

    // تنظيف البيانات مع معالجة خاصة لكلمة المرور
    const cleanedData = cleanFirebaseDataWithPassword(processedData);

    console.log('البيانات المحضرة للفيديو:', cleanedData);

    // التحديث في Firebase
    await updateDoc(doc(db, 'videos', videoId), {
      ...cleanedData,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'تم تحديث الفيديو بنجاح',
    };
  } catch (error) {
    console.error('خطأ في تحديث الفيديو:', error);
    console.error('البيانات التي تسببت في الخطأ:', updateData);
    return {
      success: false,
      error: error.message,
    };
  }
};

// حذف قسم
export const deleteSection = async sectionId => {
  try {
    const videosQuery = query(
      collection(db, 'videos'),
      where('sectionId', '==', sectionId)
    );
    const videosSnapshot = await getDocs(videosQuery);

    if (!videosSnapshot.empty) {
      return {
        success: false,
        error: 'لا يمكن حذف القسم لأنه يحتوي على فيديوهات',
      };
    }

    await deleteDoc(doc(db, 'sections', sectionId));

    return {
      success: true,
      message: 'تم حذف القسم بنجاح',
    };
  } catch (error) {
    console.error('خطأ في حذف القسم:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// حذف فيديو
export const deleteVideo = async videoId => {
  try {
    await deleteDoc(doc(db, 'videos', videoId));

    return {
      success: true,
      message: 'تم حذف الفيديو بنجاح',
    };
  } catch (error) {
    console.error('خطأ في حذف الفيديو:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تبديل رؤية الفيديو (إخفاء/إظهار)
export const toggleVideoVisibility = async videoId => {
  try {
    const videoRef = doc(db, 'videos', videoId);
    const videoDoc = await getDoc(videoRef);

    if (!videoDoc.exists()) {
      return {
        success: false,
        error: 'الفيديو غير موجود',
      };
    }

    const currentData = videoDoc.data();
    const newHiddenStatus = !currentData.isHidden;

    await updateDoc(videoRef, {
      isHidden: newHiddenStatus,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: newHiddenStatus ? 'تم إخفاء الفيديو' : 'تم إظهار الفيديو',
      isHidden: newHiddenStatus,
    };
  } catch (error) {
    console.error('خطأ في تبديل رؤية الفيديو:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تبديل رؤية القسم (إخفاء/إظهار)
export const toggleSectionVisibility = async sectionId => {
  try {
    const sectionRef = doc(db, 'sections', sectionId);
    const sectionDoc = await getDoc(sectionRef);

    if (!sectionDoc.exists()) {
      return {
        success: false,
        error: 'القسم غير موجود',
      };
    }

    const currentData = sectionDoc.data();
    const newHiddenStatus = !currentData.isHidden;

    await updateDoc(sectionRef, {
      isHidden: newHiddenStatus,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: newHiddenStatus ? 'تم إخفاء القسم' : 'تم إظهار القسم',
      isHidden: newHiddenStatus,
    };
  } catch (error) {
    console.error('خطأ في تبديل رؤية القسم:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تسجيل مشاهدة فيديو
export const recordVideoWatch = async (videoId, studentId, watchData) => {
  try {
    const videoRef = doc(db, 'videos', videoId);
    const videoDoc = await getDoc(videoRef);

    if (!videoDoc.exists()) {
      return {
        success: false,
        error: 'الفيديو غير موجود',
      };
    }

    const currentData = videoDoc.data();

    // إنشاء إدخال المشاهدة بتاريخ عادي بدلاً من serverTimestamp
    const watchEntry = {
      studentId,
      watchedAt: new Date(), // استخدام Date عادي بدلاً من serverTimestamp
      duration: watchData.duration || 0,
      watchTime: watchData.watchTime || 0,
    };

    const watchHistory = currentData.watchHistory || [];

    // التحقق من عدم تكرار المشاهدة من نفس الطالب في نفس الجلسة
    const existingWatchIndex = watchHistory.findIndex(
      watch =>
        watch.studentId === studentId &&
        new Date() - new Date(watch.watchedAt) < 60000 // أقل من دقيقة
    );

    if (existingWatchIndex === -1) {
      // إضافة مشاهدة جديدة فقط إذا لم تكن موجودة
      watchHistory.push(watchEntry);
      const newViewCount = (currentData.viewCount || 0) + 1;

      await updateDoc(videoRef, {
        watchHistory,
        viewCount: newViewCount,
        updatedAt: serverTimestamp(),
      });

      console.log('✅ تم تسجيل المشاهدة بنجاح:', {
        videoId,
        studentId,
        newViewCount,
      });

      return {
        success: true,
        message: 'تم تسجيل المشاهدة بنجاح',
        viewCount: newViewCount,
      };
    } else {
      // تحديث المشاهدة الموجودة
      watchHistory[existingWatchIndex] = {
        ...watchHistory[existingWatchIndex],
        watchTime: Math.max(
          watchHistory[existingWatchIndex].watchTime,
          watchData.watchTime || 0
        ),
        duration:
          watchData.duration || watchHistory[existingWatchIndex].duration,
      };

      await updateDoc(videoRef, {
        watchHistory,
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        message: 'تم تحديث المشاهدة',
        viewCount: currentData.viewCount || 0,
      };
    }
  } catch (error) {
    console.error('❌ خطأ في تسجيل المشاهدة:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// التحقق من كلمة مرور القسم
export const validateSectionPassword = async (sectionId, password) => {
  try {
    const sectionDoc = await getDoc(doc(db, 'sections', sectionId));

    if (!sectionDoc.exists()) {
      return {
        success: false,
        error: 'القسم غير موجود',
      };
    }

    const sectionData = sectionDoc.data();

    // إذا لم تكن هناك كلمة مرور، فالقسم مفتوح
    if (!sectionData.password) {
      return {
        success: true,
        message: 'القسم غير محمي بكلمة مرور',
        hasPassword: false,
      };
    }

    // التحقق من كلمة المرور
    if (password === sectionData.password) {
      return {
        success: true,
        message: 'كلمة المرور صحيحة',
        hasPassword: true,
      };
    } else {
      return {
        success: false,
        error: 'كلمة المرور غير صحيحة',
        hasPassword: true,
      };
    }
  } catch (error) {
    console.error('خطأ في التحقق من كلمة مرور القسم:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// التحقق من كلمة مرور الفيديو
export const validateVideoPassword = async (videoId, password) => {
  try {
    const videoDoc = await getDoc(doc(db, 'videos', videoId));

    if (!videoDoc.exists()) {
      return {
        success: false,
        error: 'الفيديو غير موجود',
      };
    }

    const videoData = videoDoc.data();

    // إذا لم تكن هناك كلمة مرور، فالفيديو مفتوح
    if (!videoData.password) {
      return {
        success: true,
        message: 'الفيديو غير محمي بكلمة مرور',
        hasPassword: false,
      };
    }

    // التحقق من كلمة المرور
    if (password === videoData.password) {
      return {
        success: true,
        message: 'كلمة المرور صحيحة',
        hasPassword: true,
      };
    } else {
      return {
        success: false,
        error: 'كلمة المرور غير صحيحة',
        hasPassword: true,
      };
    }
  } catch (error) {
    console.error('خطأ في التحقق من كلمة مرور الفيديو:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// الحصول على إحصائيات الفيديوهات
export const getVideoStatistics = async () => {
  try {
    const videosResult = await getAllVideos();
    const sectionsResult = await getAllSections();

    if (!videosResult.success || !sectionsResult.success) {
      return {
        success: false,
        error: 'خطأ في جلب البيانات',
      };
    }

    const totalVideos = videosResult.videos.length;
    const totalSections = sectionsResult.sections.length;
    const totalViews = videosResult.videos.reduce(
      (sum, video) => sum + (video.viewCount || 0),
      0
    );

    const sectionStats = sectionsResult.sections.map(section => {
      const sectionVideos = videosResult.videos.filter(
        video => video.sectionId === section.id
      );
      const sectionViews = sectionVideos.reduce(
        (sum, video) => sum + (video.viewCount || 0),
        0
      );

      return {
        sectionId: section.id,
        sectionTitle: section.title,
        videosCount: sectionVideos.length,
        totalViews: sectionViews,
      };
    });

    return {
      success: true,
      statistics: {
        totalVideos,
        totalSections,
        totalViews,
        sectionStats,
      },
    };
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// استخراج معرف Google Drive من الرابط
export const extractGoogleDriveId = url => {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};

// إنشاء رابط مشاهدة آمن لـ Google Drive
export const createSecureGoogleDriveUrl = driveId => {
  return `https://drive.google.com/file/d/${driveId}/preview`;
};

// استخراج معرف YouTube من الرابط
export const extractYouTubeId = url => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};

// إنشاء رابط مشاهدة آمن لـ YouTube
export const createSecureYouTubeUrl = youtubeId => {
  return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&showinfo=0`;
};

// إزالة كلمة مرور القسم
export const removeSectionPassword = async sectionId => {
  try {
    await updateDoc(doc(db, 'sections', sectionId), {
      password: null,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'تم إزالة كلمة مرور القسم بنجاح',
    };
  } catch (error) {
    console.error('خطأ في إزالة كلمة مرور القسم:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// إزالة كلمة مرور الفيديو
export const removeVideoPassword = async videoId => {
  try {
    await updateDoc(doc(db, 'videos', videoId), {
      password: null,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'تم إزالة كلمة مرور الفيديو بنجاح',
    };
  } catch (error) {
    console.error('خطأ في إزالة كلمة مرور الفيديو:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
