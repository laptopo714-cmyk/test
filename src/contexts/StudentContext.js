// Student Context for Access Code Authentication
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  validateAccessCode,
  generateDeviceId,
  validateActiveSession,
} from '../firebase/accessCodes';
import { getAssignedVideos, getAllVideos } from '../firebase/videoService';
import {
  getStudentNotifications,
  getReadNotifications,
} from '../firebase/notificationService';
import { sortNotifications } from '../utils/notificationUtils';
import { isDateExpired } from '../utils/dateUtils';

const StudentContext = createContext();

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedVideos, setAssignedVideos] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  // متغير لتتبع حالة مشاهدة الفيديو
  const [isWatchingVideo, setIsWatchingVideo] = useState(false);

  // التحقق من وجود جلسة محفوظة عند تحميل التطبيق
  useEffect(() => {
    checkSavedSession();
  }, []);

  // مراقبة تغييرات localStorage لاكتشاف تسجيل الدخول من أجهزة أخرى
  useEffect(() => {
    const handleStorageChange = e => {
      // التحقق من تغيير في بيانات الطالب
      if (e.key === 'studentSession' && student) {
        const newStudentData = e.newValue ? JSON.parse(e.newValue) : null;

        if (newStudentData && newStudentData.id === student.id) {
          // التحقق من session token
          if (newStudentData.sessionToken !== student.sessionToken) {
            console.log('🚨 تم اكتشاف تسجيل دخول من جهاز آخر');
            setError('تم تسجيل الدخول من جهاز آخر. سيتم تسجيل خروجك.');
            logout();
          }
        }
      }

      // التحقق من إشارة إعادة تعيين من الإدارة
      if (e.key === 'admin_reset_signal') {
        const resetSignal = e.newValue ? JSON.parse(e.newValue) : null;
        if (resetSignal && resetSignal.studentId === student?.id) {
          console.log('🔄 تم استلام إشارة إعادة تعيين من الإدارة');

          // إعادة تعيين معرف الجهاز إذا طُلب ذلك
          if (resetSignal.resetDeviceId) {
            console.log('🔄 إعادة تعيين معرف الجهاز...');
            import('../firebase/accessCodes')
              .then(({ resetDeviceId }) => {
                resetDeviceId();
              })
              .catch(error => {
                console.error('خطأ في إعادة تعيين معرف الجهاز:', error);
              });
          }

          setError(
            'تم إعادة تعيين حسابك من قبل الإدارة. يرجى تسجيل الدخول مرة أخرى.'
          );
          logout();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [student]);

  // جلب البيانات عند تسجيل الدخول (مرة واحدة فقط)
  useEffect(() => {
    if (student && student.id) {
      console.log('📚 تحميل بيانات الطالب...');
      loadStudentData();
    }
  }, [student?.id]); // تشغيل فقط عند تغيير معرف الطالب

  // التحقق من الجلسة المحفوظة باستخدام التخزين المؤقت
  const checkSavedSession = async () => {
    try {
      console.log('🔍 التحقق من الجلسة المحفوظة...');

      // استخدام التخزين المؤقت في الذاكرة أولاً
      const { getCachedStudent } = await import('../utils/firebaseCache');
      const cachedStudent = getCachedStudent();

      if (cachedStudent && cachedStudent.success) {
        console.log('📱 تم العثور على جلسة مخزنة مؤقتاً');
        const studentData = cachedStudent.studentData;
        const deviceId =
          localStorage.getItem('deviceId') ||
          sessionStorage.getItem('deviceId');

        // التحقق من تطابق معرف الجهاز
        const currentDeviceId = generateDeviceId();
        if (deviceId === currentDeviceId) {
          console.log('✅ الجهاز صحيح - استعادة الجلسة');
          setStudent(studentData);
          return;
        }
      }

      // التحقق من localStorage أولاً (للجلسات المحفوظة)
      let savedStudent = localStorage.getItem('studentSession');
      let deviceId = localStorage.getItem('deviceId');
      let isFromLocalStorage = true;

      // إذا لم توجد في localStorage، تحقق من sessionStorage
      if (!savedStudent || !deviceId) {
        savedStudent = sessionStorage.getItem('studentSession');
        deviceId = sessionStorage.getItem('deviceId');
        isFromLocalStorage = false;
      }

      if (savedStudent && deviceId) {
        console.log('📱 تم العثور على جلسة محفوظة');
        const studentData = JSON.parse(savedStudent);

        // التحقق من تطابق معرف الجهاز
        const currentDeviceId = generateDeviceId();
        if (deviceId === currentDeviceId) {
          console.log('✅ الجهاز صحيح - استعادة الجلسة');

          // استخدام البيانات المخزنة مؤقتاً لتجنب قراءة Firestore
          setStudent(studentData);

          // تحديث بيانات الطالب في الخلفية
          refreshStudentData();
        } else {
          console.log('🚫 الجهاز مختلف - حذف الجلسة');
          if (isFromLocalStorage) {
            localStorage.removeItem('studentSession');
            localStorage.removeItem('deviceId');
          } else {
            sessionStorage.removeItem('studentSession');
            sessionStorage.removeItem('deviceId');
          }
          setError(
            'هذا الرمز مسجل على جهاز آخر. لا يمكن استخدامه على أكثر من جهاز واحد. يرجى التواصل مع الإدارة إذا كنت تحتاج لتغيير الجهاز.'
          );
        }
      } else {
        console.log('ℹ️ لا توجد جلسة محفوظة');
      }
    } catch (error) {
      console.error('خطأ في التحقق من الجلسة:', error);
      setError('حدث خطأ في التحقق من الجلسة. يرجى تسجيل الدخول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول برمز الوصول
  const loginWithAccessCode = async (accessCode, rememberLogin = true) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔐 بدء عملية تسجيل الدخول...');

      // إنشاء معرف الجهاز المحسن
      const deviceId = generateDeviceId();
      const deviceInfo = {
        deviceId: deviceId,
        userAgent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        timestamp: Date.now(),
        // إضافة معلومات إضافية للأمان
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
        availScreen: `${window.screen.availWidth}x${window.screen.availHeight}`,
      };

      console.log('📱 معلومات الجهاز:', {
        deviceId: deviceId.substring(0, 10) + '...',
        platform: deviceInfo.platform,
        screen: deviceInfo.screen,
      });

      // التحقق من رمز الوصول
      const result = await validateAccessCode(accessCode, deviceInfo);

      if (result.success) {
        console.log('✅ تم التحقق من رمز الوصول بنجاح');

        // إضافة معلومات إضافية للأمان
        const enhancedStudentData = {
          ...result.studentData,
          loginTimestamp: Date.now(),
          deviceFingerprint: deviceId,
          securityHash: btoa(
            deviceId + result.studentData.sessionToken
          ).substring(0, 16),
        };

        // حفظ بيانات الطالب والجهاز
        setStudent(enhancedStudentData);

        if (rememberLogin) {
          // حفظ الجلسة في localStorage للبقاء متصلاً
          localStorage.setItem(
            'studentSession',
            JSON.stringify(enhancedStudentData)
          );
          localStorage.setItem('deviceId', deviceId);
          localStorage.setItem('rememberLogin', 'true');
          localStorage.setItem('sessionHash', enhancedStudentData.securityHash);
        } else {
          // حفظ الجلسة في sessionStorage فقط (تنتهي عند إغلاق المتصفح)
          sessionStorage.setItem(
            'studentSession',
            JSON.stringify(enhancedStudentData)
          );
          sessionStorage.setItem('deviceId', deviceId);
          sessionStorage.setItem(
            'sessionHash',
            enhancedStudentData.securityHash
          );
          localStorage.setItem('rememberLogin', 'false');
        }

        return {
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
        };
      } else {
        setError(result.error);
        return {
          success: false,
          error: result.error,
        };
      }
    } catch (error) {
      const errorMessage = 'حدث خطأ في تسجيل الدخول';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج المحسن
  const logout = () => {
    console.log('🚪 تسجيل الخروج...');

    setStudent(null);
    setAssignedVideos([]);
    setNotifications([]);
    setUnreadCount(0);
    setError(null);

    // حذف جميع البيانات المتعلقة بالجلسة (مع الحفاظ على معرف الجهاز الثابت)
    const keysToRemove = [
      'studentSession',
      'deviceId',
      'studentVideos',
      'sessionHash',
      'rememberLogin',
      'sectionsCache', // إضافة مسح ذاكرة التخزين المؤقت للأقسام
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // ملاحظة: نحتفظ بـ persistent_device_id لأنه ثابت للجهاز
    console.log(
      '✅ تم تنظيف جميع بيانات الجلسة (مع الحفاظ على معرف الجهاز الثابت)'
    );
  };

  // دالة للتحقق من وجود الطالب في صفحة فيديو
  // تمنع التحديث التلقائي عندما يكون الطالب يشاهد فيديو
  const isOnVideoPage = () => {
    const currentPath = window.location.pathname;
    const isVideoPage = currentPath.startsWith('/student/video/');

    if (isVideoPage) {
      console.log(
        '🎬 الطالب في صفحة فيديو:',
        currentPath,
        '- تم إيقاف التحديث التلقائي'
      );
    }

    return isVideoPage;
  };

  // جلب بيانات الطالب
  const loadStudentData = async () => {
    if (!student) return;

    // حماية إضافية: منع التحديث أثناء مشاهدة الفيديو
    if (isOnVideoPage()) {
      console.log('🎬 تم منع تحديث بيانات الطالب - الطالب يشاهد فيديو');
      return;
    }

    try {
      // جلب الفيديوهات
      let videosResult;

      // إذا كان هناك فيديوهات مخصصة، جلبها فقط
      if (student.assignedVideos && student.assignedVideos.length > 0) {
        videosResult = await getAssignedVideos(student.assignedVideos);
      } else {
        // إذا لم يكن هناك تخصيص، جلب جميع الفيديوهات النشطة
        videosResult = await getAllVideos();
      }

      if (videosResult.success) {
        // جلب الأقسام للتحقق من حالة الإخفاء
        const { getAllSections } = await import('../firebase/videoService');
        const sectionsResult = await getAllSections();

        // تصفية الفيديوهات حسب الأقسام المسموحة والمرئية
        let filteredVideos = videosResult.videos.filter(
          video => video.isActive === true && video.isHidden !== true
        );

        // تصفية الفيديوهات التي تنتمي لأقسام مخفية
        if (sectionsResult.success) {
          const visibleSections = sectionsResult.sections.filter(
            section => !section.isHidden
          );
          const visibleSectionIds = visibleSections.map(section => section.id);

          filteredVideos = filteredVideos.filter(video =>
            visibleSectionIds.includes(video.sectionId)
          );
        }

        if (student.allowedSections && student.allowedSections.length > 0) {
          filteredVideos = filteredVideos.filter(video =>
            student.allowedSections.includes(video.sectionId)
          );
        }

        setAssignedVideos(filteredVideos);

        // حفظ الفيديوهات في localStorage كنسخة احتياطية
        localStorage.setItem('studentVideos', JSON.stringify(filteredVideos));
      } else {
        // في حالة فشل جلب الفيديوهات، محاولة استخدام النسخة المحفوظة
        const savedVideos = localStorage.getItem('studentVideos');
        if (savedVideos) {
          setAssignedVideos(JSON.parse(savedVideos));
        }
      }

      // جلب الإشعارات
      await loadNotifications();
    } catch (error) {
      console.error('خطأ في جلب بيانات الطالب:', error);

      // في حالة الخطأ، محاولة استخدام البيانات المحفوظة
      const savedVideos = localStorage.getItem('studentVideos');
      if (savedVideos) {
        setAssignedVideos(JSON.parse(savedVideos));
      }
    }
  };

  // جلب الإشعارات
  const loadNotifications = async () => {
    if (!student) return;

    // حماية إضافية: منع التحديث أثناء مشاهدة الفيديو
    if (isOnVideoPage()) {
      console.log('🎬 تم منع تحديث الإشعارات - الطالب يشاهد فيديو');
      return;
    }

    try {
      const [notificationsResult, readResult] = await Promise.all([
        getStudentNotifications(student.id, student.category),
        getReadNotifications(student.id),
      ]);

      if (notificationsResult.success) {
        const allNotifications = notificationsResult.notifications;
        const readIds = readResult.success
          ? readResult.readNotificationIds
          : [];

        // تحديد الإشعارات غير المقروءة
        const unreadNotifications = allNotifications.filter(
          notification => !readIds.includes(notification.id)
        );

        // ترتيب الإشعارات حسب الأولوية والتاريخ
        const sortedNotifications = sortNotifications(
          allNotifications,
          'priority'
        );

        setNotifications(sortedNotifications);
        setUnreadCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error);
    }
  };

  // تحديث الفيديوهات المخصصة
  const refreshAssignedVideos = async () => {
    if (!student) return;

    try {
      // جلب الفيديوهات
      let videosResult;

      // إذا كان هناك فيديوهات مخصصة، جلبها فقط
      if (student.assignedVideos && student.assignedVideos.length > 0) {
        videosResult = await getAssignedVideos(student.assignedVideos);
      } else {
        // إذا لم يكن هناك تخصيص، جلب جميع الفيديوهات النشطة
        videosResult = await getAllVideos();
      }

      if (videosResult.success) {
        // جلب الأقسام للتحقق من حالة الإخفاء
        const { getAllSections } = await import('../firebase/videoService');
        const sectionsResult = await getAllSections();

        // تصفية الفيديوهات حسب الأقسام المسموحة والمرئية
        let filteredVideos = videosResult.videos.filter(
          video => video.isActive === true && video.isHidden !== true
        );

        // تصفية الفيديوهات التي تنتمي لأقسام مخفية
        if (sectionsResult.success) {
          const visibleSections = sectionsResult.sections.filter(
            section => !section.isHidden
          );
          const visibleSectionIds = visibleSections.map(section => section.id);

          filteredVideos = filteredVideos.filter(video =>
            visibleSectionIds.includes(video.sectionId)
          );
        }

        if (student.allowedSections && student.allowedSections.length > 0) {
          filteredVideos = filteredVideos.filter(video =>
            student.allowedSections.includes(video.sectionId)
          );
        }

        setAssignedVideos(filteredVideos);
      }
    } catch (error) {
      console.error('خطأ في تحديث الفيديوهات:', error);
    }
  };

  // تحديث الإشعارات
  const refreshNotifications = async () => {
    await loadNotifications();
  };

  // تحديث بيانات الطالب من قاعدة البيانات مع التخزين المؤقت
  const refreshStudentData = async () => {
    if (!student || !student.id) return;

    // حماية إضافية: منع التحديث أثناء مشاهدة الفيديو
    if (isOnVideoPage()) {
      console.log('🎬 تم منع تحديث بيانات الطالب - الطالب يشاهد فيديو');
      return;
    }

    try {
      const { getDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../firebase/config');
      const { cacheStudentData } = await import('../utils/firebaseCache');

      const studentDoc = await getDoc(doc(db, 'accessCodes', student.id));

      if (studentDoc.exists()) {
        const updatedData = studentDoc.data();

        // التحقق من انتهاء الصلاحية
        if (
          updatedData.expiryDate &&
          new Date() > updatedData.expiryDate.toDate()
        ) {
          // حماية إضافية: لا تسجل خروج أثناء مشاهدة الفيديو
          if (isOnVideoPage()) {
            console.log('🎬 تم تأجيل تسجيل الخروج - الطالب يشاهد فيديو');
            return;
          }
          console.log('🚫 انتهت صلاحية الحساب - تسجيل خروج تلقائي');
          logout();
          setError('انتهت صلاحية حسابك. يرجى التواصل مع الإدارة.');
          return;
        }

        // التحقق من حالة الحساب
        if (!updatedData.isActive) {
          // حماية إضافية: لا تسجل خروج أثناء مشاهدة الفيديو
          if (isOnVideoPage()) {
            console.log('🎬 تم تأجيل تسجيل الخروج - الطالب يشاهد فيديو');
            return;
          }
          console.log('🚫 الحساب غير نشط - تسجيل خروج تلقائي');
          logout();
          setError('تم إيقاف حسابك. يرجى التواصل مع الإدارة.');
          return;
        }

        const updatedStudent = {
          ...student,
          ...updatedData,
          id: student.id, // الحفاظ على المعرف
        };

        // تحديث الحالة فقط إذا تغيرت البيانات
        const hasChanges =
          JSON.stringify(student) !== JSON.stringify(updatedStudent);
        if (hasChanges) {
          setStudent(updatedStudent);

          // تحديث التخزين المؤقت
          cacheStudentData(updatedStudent);

          console.log('✅ تم تحديث بيانات الطالب من قاعدة البيانات');
        }
      } else {
        // إذا لم يعد الحساب موجوداً
        // حماية إضافية: لا تسجل خروج أثناء مشاهدة الفيديو
        if (isOnVideoPage()) {
          console.log('🎬 تم تأجيل تسجيل الخروج - الطالب يشاهد فيديو');
          return;
        }
        console.log('🚫 الحساب غير موجود - تسجيل خروج تلقائي');
        logout();
        setError('لم يعد حسابك موجوداً. يرجى التواصل مع الإدارة.');
      }
    } catch (error) {
      console.error('خطأ في تحديث بيانات الطالب:', error);
    }
  };

  // تحديد إشعار كمقروء
  const markNotificationAsRead = async notificationId => {
    try {
      const { markNotificationAsRead: markAsRead } = await import(
        '../firebase/notificationService'
      );
      const result = await markAsRead(notificationId, student.id);

      if (result.success) {
        // تحديث العداد محلياً
        setUnreadCount(prev => Math.max(0, prev - 1));

        // تحديث قائمة الإشعارات
        await loadNotifications();
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الإشعار:', error);
    }
  };

  // التحقق من صحة الجلسة
  const validateSession = () => {
    // حماية إضافية: منع التحقق أثناء مشاهدة الفيديو
    if (isOnVideoPage()) {
      console.log('🎬 تم تأجيل التحقق من الجلسة - الطالب يشاهد فيديو');
      return true;
    }

    // استخدام المعرف الثابت للجهاز
    const savedDeviceId =
      localStorage.getItem('deviceId') ||
      localStorage.getItem('persistent_device_id');
    const currentDeviceId = generateDeviceId();

    console.log('🔍 التحقق من صحة الجلسة:', {
      saved: savedDeviceId?.substring(0, 8) + '...',
      current: currentDeviceId?.substring(0, 8) + '...',
      match: savedDeviceId === currentDeviceId,
    });

    if (!savedDeviceId || savedDeviceId !== currentDeviceId) {
      console.log('❌ فشل التحقق من الجلسة - معرف الجهاز مختلف');
      logout();
      setError(
        'هذا الرمز مسجل على جهاز آخر. لا يمكن استخدامه على أكثر من جهاز واحد. يرجى التواصل مع الإدارة إذا كنت تحتاج لتغيير الجهاز.'
      );
      return false;
    }

    console.log('✅ التحقق من الجلسة نجح');
    return true;
  };

  // مراقبة تغيير المسار لتحديث حالة مشاهدة الفيديو
  useEffect(() => {
    const checkVideoPage = () => {
      const isVideoPage =
        window.location.pathname.startsWith('/student/video/');
      setIsWatchingVideo(isVideoPage);

      if (isVideoPage) {
        console.log(
          '🎬 دخل الطالب صفحة فيديو - إيقاف جميع التحديثات التلقائية'
        );
      } else {
        console.log(
          '📱 خرج الطالب من صفحة الفيديو - تفعيل التحديثات التلقائية'
        );
      }
    };

    // فحص أولي
    checkVideoPage();

    // مراقبة تغيير المسار
    const handleLocationChange = () => {
      setTimeout(checkVideoPage, 100); // تأخير قصير للتأكد من تحديث المسار
    };

    // مراقبة أحداث التنقل
    window.addEventListener('popstate', handleLocationChange);

    // مراقبة تغيير المسار كل ثانية كحل احتياطي
    const pathCheckInterval = setInterval(checkVideoPage, 1000);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(pathCheckInterval);
    };
  }, []);

  const value = {
    // حالة الطالب
    student,
    loading,
    error,
    assignedVideos,
    notifications,
    unreadCount,

    // دوال المصادقة
    loginWithAccessCode,
    logout,
    validateSession,

    // دوال البيانات
    loadStudentData,
    refreshStudentData,
    refreshAssignedVideos,
    refreshNotifications,
    markNotificationAsRead,

    // دوال مساعدة
    clearError: () => setError(null),
    isLoggedIn: !!student,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
};
