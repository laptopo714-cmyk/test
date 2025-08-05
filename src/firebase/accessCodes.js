// Access Codes Management Service
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
import { cleanFirebaseData } from '../utils/firebaseUtils';
import { isDateExpired } from '../utils/dateUtils';

// إعادة تعيين الجهاز لرمز وصول (للإدارة فقط)
export const resetDeviceForAccessCode = async codeId => {
  try {
    console.log('🔄 بدء إعادة تعيين الجهاز للرمز:', codeId);

    const codeRef = doc(db, 'accessCodes', codeId);

    // الحصول على بيانات الطالب أولاً
    const codeDoc = await getDoc(codeRef);
    if (!codeDoc.exists()) {
      return {
        success: false,
        error: 'رمز الوصول غير موجود',
      };
    }

    const codeData = codeDoc.data();

    // إنشاء session token جديد لإجبار إعادة تسجيل الدخول
    const newSessionToken = `reset_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 12)}`;

    // تحديث بيانات الرمز
    await updateDoc(codeRef, {
      deviceId: null,
      deviceInfo: null,
      lastLoginAt: null,
      sessionToken: newSessionToken, // إضافة session token جديد
      sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // انتهاء الصلاحية خلال 24 ساعة
      forceReauth: true, // علامة لإجبار إعادة المصادقة
      resetAt: serverTimestamp(), // وقت إعادة التعيين
      resetCount: (codeData.resetCount || 0) + 1, // عداد مرات إعادة التعيين
    });

    // إرسال إشارة إعادة تعيين عبر localStorage (للطلاب المتصلين حالياً)
    try {
      const resetSignal = {
        studentId: codeId,
        timestamp: Date.now(),
        message: 'تم إعادة تعيين حسابك من قبل الإدارة',
        resetDeviceId: true, // إشارة لإعادة تعيين معرف الجهاز أيضاً
      };
      localStorage.setItem('admin_reset_signal', JSON.stringify(resetSignal));

      // إزالة الإشارة بعد ثانية واحدة
      setTimeout(() => {
        localStorage.removeItem('admin_reset_signal');
      }, 1000);
    } catch (storageError) {
      console.warn('تعذر إرسال إشارة إعادة التعيين:', storageError);
    }

    // تسجيل العملية في سجل الأمان
    try {
      const { logSuspiciousActivity } = await import(
        '../utils/securityMonitor'
      );
      await logSuspiciousActivity({
        type: 'admin_device_reset',
        description: `إعادة تعيين الجهاز للطالب ${codeData.studentName} من قبل الإدارة`,
        userId: codeId,
        severity: 'medium',
        metadata: {
          studentName: codeData.studentName,
          previousDeviceId: codeData.deviceId,
          resetCount: (codeData.resetCount || 0) + 1,
        },
      });
    } catch (logError) {
      console.warn('تعذر تسجيل عملية إعادة التعيين:', logError);
    }

    console.log('✅ تم إعادة تعيين الجهاز بنجاح');
    return {
      success: true,
      message:
        'تم إعادة تعيين الجهاز بنجاح. تم إغلاق جميع الجلسات النشطة. يمكن للطالب الآن تسجيل الدخول من جهاز جديد فقط.',
    };
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين الجهاز:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// إنشاء رمز وصول جديد
export const createAccessCode = async studentData => {
  try {
    // إنشاء رمز فريد
    const accessCode = generateUniqueCode();

    const codeData = {
      code: accessCode,
      studentName: studentData.studentName,
      phoneNumber: studentData.phoneNumber || '',
      parentPhoneNumber: studentData.parentPhoneNumber || '', // رقم ولي الأمر
      category: studentData.category || '', // فئة الطالب
      allowedSections: studentData.allowedSections || [], // الأقسام المسموحة
      isActive: true,
      deviceId: null, // سيتم تعيينه عند أول تسجيل دخول
      deviceInfo: null,
      assignedVideos: [], // قائمة معرفات الفيديوهات المخصصة
      loginHistory: [],
      createdAt: serverTimestamp(),
      lastLoginAt: null,
      expiryDate: studentData.expiryDate || null,
      notes: studentData.notes || '',
    };

    const docRef = await addDoc(collection(db, 'accessCodes'), codeData);

    return {
      success: true,
      codeId: docRef.id,
      accessCode: accessCode,
      message: 'تم إنشاء رمز الوصول بنجاح',
    };
  } catch (error) {
    console.error('خطأ في إنشاء رمز الوصول:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// الحصول على جميع رموز الوصول (للإدارة)
export const getAllAccessCodes = async () => {
  try {
    const q = query(
      collection(db, 'accessCodes'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const codes = [];

    querySnapshot.forEach(doc => {
      codes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {
      success: true,
      codes: codes,
    };
  } catch (error) {
    console.error('خطأ في جلب رموز الوصول:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تحديث رمز الوصول
export const updateAccessCode = async (codeId, updateData) => {
  try {
    // تنظيف البيانات من القيم null و undefined
    const cleanedData = cleanFirebaseData(updateData);

    await updateDoc(doc(db, 'accessCodes', codeId), {
      ...cleanedData,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'تم تحديث رمز الوصول بنجاح',
    };
  } catch (error) {
    console.error('خطأ في تحديث رمز الوصول:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// حذف رمز الوصول
export const deleteAccessCode = async codeId => {
  try {
    await deleteDoc(doc(db, 'accessCodes', codeId));

    return {
      success: true,
      message: 'تم حذف رمز الوصول بنجاح',
    };
  } catch (error) {
    console.error('خطأ في حذف رمز الوصول:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تعطيل/تفعيل رمز الوصول
export const toggleAccessCode = async (codeId, isActive) => {
  try {
    await updateDoc(doc(db, 'accessCodes', codeId), {
      isActive: isActive,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: isActive ? 'تم تفعيل رمز الوصول' : 'تم تعطيل رمز الوصول',
    };
  } catch (error) {
    console.error('خطأ في تغيير حالة رمز الوصول:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// التحقق من صحة رمز الوصول وتسجيل الدخول
export const validateAccessCode = async (accessCode, deviceInfo) => {
  try {
    console.log('🔍 بدء التحقق من رمز الوصول:', accessCode);
    console.log('📱 معلومات الجهاز:', deviceInfo);

    // البحث عن رمز الوصول
    const q = query(
      collection(db, 'accessCodes'),
      where('code', '==', accessCode)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('❌ رمز الوصول غير موجود');
      return {
        success: false,
        error: 'رمز الوصول غير صحيح',
      };
    }

    const codeDoc = querySnapshot.docs[0];
    const codeData = codeDoc.data();
    console.log('📋 بيانات رمز الوصول:', {
      id: codeDoc.id,
      isActive: codeData.isActive,
      deviceId: codeData.deviceId,
      studentName: codeData.studentName,
    });

    // التحقق من أن الرمز نشط
    if (!codeData.isActive) {
      console.log('❌ رمز الوصول معطل');
      return {
        success: false,
        error: 'رمز الوصول معطل. يرجى التواصل مع الإدارة',
      };
    }

    // التحقق من انتهاء الصلاحية
    if (codeData.expiryDate && isDateExpired(codeData.expiryDate)) {
      console.log('❌ رمز الوصول منتهي الصلاحية');
      return {
        success: false,
        error: 'رمز الوصول منتهي الصلاحية',
      };
    }

    // التحقق المُحسن من الجهاز
    if (codeData.deviceId) {
      console.log('🔒 التحقق من الجهاز المسجل:', codeData.deviceId);
      console.log('🔒 الجهاز الحالي:', deviceInfo.deviceId);

      if (codeData.deviceId !== deviceInfo.deviceId) {
        console.log('❌ الجهاز مختلف - رفض الوصول');

        // تسجيل محاولة الوصول المشبوهة
        const { logSuspiciousActivity } = await import(
          '../utils/securityMonitor'
        );
        await logSuspiciousActivity({
          type: 'unauthorized_device_access',
          description: `محاولة وصول من جهاز غير مصرح به لرمز الوصول ${accessCode}`,
          userId: codeDoc.id,
          deviceId: deviceInfo.deviceId,
          severity: 'high',
          metadata: {
            registeredDevice: codeData.deviceId,
            attemptedDevice: deviceInfo.deviceId,
            studentName: codeData.studentName,
            userAgent: deviceInfo.userAgent,
          },
        });

        return {
          success: false,
          error:
            'هذا الرمز مسجل على جهاز آخر. لا يمكن استخدامه على أكثر من جهاز واحد. يرجى التواصل مع الإدارة إذا كنت تحتاج لتغيير الجهاز.',
        };
      }
      console.log('✅ الجهاز متطابق');
    } else {
      console.log('🆕 تسجيل جهاز جديد لأول مرة');
    }

    // إنشاء session token محسن
    const sessionToken = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 12)}_${codeDoc.id.substr(0, 4)}`;

    // تحديث بيانات الجهاز وآخر تسجيل دخول مع معلومات إضافية
    const updateData = {
      deviceId: deviceInfo.deviceId,
      deviceInfo: {
        ...deviceInfo,
        lastLoginIP: await getClientIP(),
        registrationTime: codeData.deviceId
          ? codeData.deviceInfo?.registrationTime
          : serverTimestamp(),
      },
      lastLoginAt: serverTimestamp(),
      sessionToken: sessionToken,
      sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 ساعة
      forceReauth: false, // إزالة علامة إجبار إعادة المصادقة
      loginCount: (codeData.loginCount || 0) + 1, // عداد مرات تسجيل الدخول
    };

    await updateDoc(doc(db, 'accessCodes', codeDoc.id), updateData);
    console.log('✅ تم تحديث بيانات الجهاز والجلسة');

    // إرجاع بيانات الطالب مع session token
    const studentData = {
      id: codeDoc.id,
      ...codeData,
      sessionToken: sessionToken,
      deviceId: deviceInfo.deviceId,
      lastLoginAt: new Date(),
      loginCount: updateData.loginCount,
    };

    console.log('✅ تم التحقق من رمز الوصول بنجاح');
    return {
      success: true,
      studentData: studentData,
    };
  } catch (error) {
    console.error('❌ خطأ في التحقق من رمز الوصول:', error);
    return {
      success: false,
      error: 'حدث خطأ في التحقق من رمز الوصول',
    };
  }
};

// تخصيص فيديوهات لطالب
export const assignVideosToStudent = async (codeId, videoIds) => {
  try {
    await updateDoc(doc(db, 'accessCodes', codeId), {
      assignedVideos: videoIds,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'تم تخصيص الفيديوهات للطالب بنجاح',
    };
  } catch (error) {
    console.error('خطأ في تخصيص الفيديوهات:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// إنشاء رمز فريد
const generateUniqueCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// الحصول على IP العميل
const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
};

// التحقق من صحة الجلسة النشطة
export const validateActiveSession = async (
  studentId,
  sessionToken,
  deviceId
) => {
  try {
    console.log('🔍 التحقق من صحة الجلسة:', { studentId, deviceId });

    const studentDoc = await getDoc(doc(db, 'accessCodes', studentId));

    if (!studentDoc.exists()) {
      console.log('❌ الطالب غير موجود');
      return { success: false, error: 'الحساب غير موجود' };
    }

    const studentData = studentDoc.data();

    // التحقق من حالة الحساب
    if (!studentData.isActive) {
      console.log('❌ الحساب معطل');
      return { success: false, error: 'تم إيقاف حسابك' };
    }

    // التحقق من انتهاء الصلاحية
    if (studentData.expiryDate && isDateExpired(studentData.expiryDate)) {
      console.log('❌ انتهت صلاحية الحساب');
      return { success: false, error: 'انتهت صلاحية حسابك' };
    }

    // التحقق من الجهاز
    if (studentData.deviceId !== deviceId) {
      console.log('❌ الجهاز مختلف');

      // تسجيل محاولة الوصول المشبوهة
      const { logSuspiciousActivity } = await import(
        '../utils/securityMonitor'
      );
      await logSuspiciousActivity({
        type: 'session_hijack_attempt',
        description: `محاولة اختطاف جلسة من جهاز مختلف`,
        userId: studentId,
        deviceId: deviceId,
        severity: 'critical',
        metadata: {
          registeredDevice: studentData.deviceId,
          attemptedDevice: deviceId,
          sessionToken: sessionToken,
        },
      });

      return { success: false, error: 'تم اكتشاف نشاط مشبوه' };
    }

    // التحقق من session token
    if (studentData.sessionToken !== sessionToken) {
      console.log('❌ session token مختلف');
      return { success: false, error: 'انتهت صلاحية الجلسة' };
    }

    // التحقق من انتهاء صلاحية الجلسة
    if (
      studentData.sessionExpiry &&
      new Date() > studentData.sessionExpiry.toDate()
    ) {
      console.log('❌ انتهت صلاحية الجلسة');
      return { success: false, error: 'انتهت صلاحية الجلسة' };
    }

    // التحقق من علامة إجبار إعادة المصادقة
    if (studentData.forceReauth) {
      console.log('❌ مطلوب إعادة مصادقة');
      return { success: false, error: 'مطلوب تسجيل دخول جديد' };
    }

    console.log('✅ الجلسة صحيحة');
    return { success: true, studentData };
  } catch (error) {
    console.error('خطأ في التحقق من الجلسة:', error);
    return { success: false, error: 'خطأ في التحقق من الجلسة' };
  }
};

// إنشاء معرف فريد ومحسن للجهاز (ثابت لنفس الجهاز)
export const generateDeviceId = () => {
  try {
    // التحقق من وجود معرف محفوظ مسبقاً
    const savedDeviceId = localStorage.getItem('persistent_device_id');
    if (savedDeviceId) {
      console.log(
        '🔐 استخدام معرف الجهاز المحفوظ:',
        savedDeviceId.substring(0, 8) + '...'
      );
      return savedDeviceId;
    }

    // إنشاء Canvas fingerprint محسن
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;

    // رسم نص مع خصائص مختلفة
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Device Security Check 🔒', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Security Layer', 4, 35);

    const canvasFingerprint = canvas.toDataURL();

    // جمع معلومات الجهاز المحسنة (بدون timestamp متغير)
    const deviceInfo = {
      // معلومات الشاشة
      screen: `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`,
      availScreen: `${window.screen.availWidth}x${window.screen.availHeight}`,

      // معلومات المتصفح
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages ? navigator.languages.join(',') : '',
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,

      // معلومات النظام
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),

      // معلومات إضافية للأمان
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,

      // معلومات الذاكرة (إذا كانت متاحة)
      deviceMemory: navigator.deviceMemory || 0,

      // معلومات الشبكة (إذا كانت متاحة) - بدون القيم المتغيرة
      connection: navigator.connection
        ? {
            effectiveType: navigator.connection.effectiveType,
          }
        : null,
    };

    // إضافة WebGL fingerprint
    let webglFingerprint = '';
    try {
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          webglFingerprint =
            gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) +
            gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    } catch (e) {
      webglFingerprint = 'webgl_error';
    }

    // دمج جميع المعلومات
    const combined =
      canvasFingerprint + JSON.stringify(deviceInfo) + webglFingerprint;

    // إنشاء hash محسن باستخدام خوارزمية أكثر تعقيداً
    let hash = 0;
    let hash2 = 0;

    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // تحويل إلى 32bit integer

      // hash ثانوي للمزيد من التعقيد
      hash2 = (hash2 << 3) - hash2 + char;
      hash2 = hash2 & hash2;
    }

    // دمج الـ hashes بدون timestamp متغير
    const finalHash = Math.abs(hash) + Math.abs(hash2);
    const deviceId = 'device_' + finalHash.toString(36);

    // حفظ معرف الجهاز بشكل دائم
    localStorage.setItem('persistent_device_id', deviceId);

    console.log(
      '🔐 تم إنشاء معرف جهاز جديد:',
      deviceId.substring(0, 8) + '...'
    );
    return deviceId;
  } catch (error) {
    console.error('خطأ في إنشاء معرف الجهاز:', error);
    // fallback إلى طريقة بسيطة مع حفظ دائم
    const fallbackId = 'fallback_' + Math.random().toString(36).substr(2, 12);
    localStorage.setItem('persistent_device_id', fallbackId);
    return fallbackId;
  }
};

// إعادة تعيين معرف الجهاز (للاستخدام في حالات خاصة)
export const resetDeviceId = () => {
  try {
    localStorage.removeItem('persistent_device_id');
    console.log('🔄 تم إعادة تعيين معرف الجهاز');
    return generateDeviceId(); // سيتم إنشاء معرف جديد
  } catch (error) {
    console.error('خطأ في إعادة تعيين معرف الجهاز:', error);
    return null;
  }
};
