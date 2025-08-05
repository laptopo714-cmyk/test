// Notification Service
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { getAllAccessCodes } from './accessCodes';
import { db } from './config';

// إرسال إشعار لجميع الطلاب
export const sendNotificationToAll = async notificationData => {
  try {
    const notification = {
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'general', // general, video, announcement
      targetType: 'all',
      targetIds: [],
      isRead: false,
      createdAt: serverTimestamp(),
      expiryDate: notificationData.expiryDate || null,
      priority: notificationData.priority || 'normal', // low, normal, high
      actionUrl: notificationData.actionUrl || null,
    };

    const docRef = await addDoc(collection(db, 'notifications'), notification);

    return {
      success: true,
      notificationId: docRef.id,
      message: 'تم إرسال الإشعار لجميع الطلاب بنجاح',
    };
  } catch (error) {
    console.error('خطأ في إرسال الإشعار:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// إرسال إشعار لطلاب محددين
export const sendNotificationToSelected = async (
  notificationData,
  studentIds
) => {
  try {
    const notification = {
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'general',
      targetType: 'selected',
      targetIds: studentIds,
      isRead: false,
      createdAt: serverTimestamp(),
      expiryDate: notificationData.expiryDate || null,
      priority: notificationData.priority || 'normal',
      actionUrl: notificationData.actionUrl || null,
      readBy: [], // قائمة الطلاب الذين قرأوا الإشعار
    };

    const docRef = await addDoc(collection(db, 'notifications'), notification);

    return {
      success: true,
      notificationId: docRef.id,
      message: `تم إرسال الإشعار لـ ${studentIds.length} طالب بنجاح`,
    };
  } catch (error) {
    console.error('خطأ في إرسال الإشعار:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// إرسال إشعار لطالب واحد فقط
export const sendNotificationToSingleStudent = async (
  notificationData,
  studentId
) => {
  try {
    const notification = {
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'general',
      targetType: 'single',
      targetIds: [studentId],
      isRead: false,
      createdAt: serverTimestamp(),
      expiryDate: notificationData.expiryDate || null,
      priority: notificationData.priority || 'normal',
      actionUrl: notificationData.actionUrl || null,
      readBy: [],
    };

    const docRef = await addDoc(collection(db, 'notifications'), notification);

    return {
      success: true,
      notificationId: docRef.id,
      message: 'تم إرسال الإشعار للطالب بنجاح',
    };
  } catch (error) {
    console.error('خطأ في إرسال الإشعار:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// إرسال إشعار لفئة معينة
export const sendNotificationToCategory = async (
  notificationData,
  category
) => {
  try {
    // الحصول على جميع رموز الوصول
    const codesResult = await getAllAccessCodes();

    if (!codesResult.success) {
      throw new Error('فشل في جلب رموز الوصول');
    }

    // تصفية الطلاب حسب الفئة
    const categoryStudents = codesResult.codes.filter(
      code => code.category === category && code.isActive
    );

    if (categoryStudents.length === 0) {
      return {
        success: false,
        error: `لا يوجد طلاب نشطون في فئة "${category}"`,
      };
    }

    const studentIds = categoryStudents.map(student => student.id);

    const notification = {
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'general',
      targetType: 'category',
      targetCategory: category,
      targetIds: studentIds,
      isRead: false,
      createdAt: serverTimestamp(),
      expiryDate: notificationData.expiryDate || null,
      priority: notificationData.priority || 'normal',
      actionUrl: notificationData.actionUrl || null,
    };

    const docRef = await addDoc(collection(db, 'notifications'), notification);

    return {
      success: true,
      notificationId: docRef.id,
      message: `تم إرسال الإشعار لفئة "${category}" (${studentIds.length} طالب)`,
    };
  } catch (error) {
    console.error('خطأ في إرسال الإشعار للفئة:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// جلب الإشعارات المخفية للطالب
export const getStudentHiddenNotifications = async studentId => {
  try {
    const hiddenNotificationsRef = doc(
      db,
      'studentHiddenNotifications',
      studentId
    );
    const hiddenDoc = await getDoc(hiddenNotificationsRef);

    if (hiddenDoc.exists()) {
      return hiddenDoc.data().hiddenNotifications || [];
    }
    return [];
  } catch (error) {
    console.error('خطأ في جلب الإشعارات المخفية:', error);
    return [];
  }
};

// الحصول على إشعارات طالب معين
export const getStudentNotifications = async (
  studentId,
  studentCategory = null
) => {
  try {
    const notifications = [];
    const addedIds = new Set(); // لتجنب التكرار

    // جلب قائمة الإشعارات المخفية للطالب
    const hiddenNotifications = await getStudentHiddenNotifications(studentId);
    const hiddenSet = new Set(hiddenNotifications);

    // جلب الإشعارات العامة
    try {
      const generalQuery = query(
        collection(db, 'notifications'),
        where('targetType', '==', 'all'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const generalSnapshot = await getDocs(generalQuery);

      generalSnapshot.forEach(doc => {
        const data = doc.data();
        if (
          !addedIds.has(doc.id) &&
          !hiddenSet.has(doc.id) && // تجاهل الإشعارات المخفية
          (!data.expiryDate || new Date() <= data.expiryDate.toDate())
        ) {
          notifications.push({
            id: doc.id,
            ...data,
          });
          addedIds.add(doc.id);
        }
      });
    } catch (error) {
      console.warn('خطأ في جلب الإشعارات العامة:', error);
    }

    // جلب الإشعارات المخصصة
    try {
      const specificQuery = query(
        collection(db, 'notifications'),
        where('targetType', '==', 'selected'),
        where('targetIds', 'array-contains', studentId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const specificSnapshot = await getDocs(specificQuery);

      specificSnapshot.forEach(doc => {
        const data = doc.data();
        if (
          !addedIds.has(doc.id) &&
          !hiddenSet.has(doc.id) && // تجاهل الإشعارات المخفية
          (!data.expiryDate || new Date() <= data.expiryDate.toDate())
        ) {
          notifications.push({
            id: doc.id,
            ...data,
          });
          addedIds.add(doc.id);
        }
      });
    } catch (error) {
      console.warn('خطأ في جلب الإشعارات المخصصة:', error);
    }

    // جلب إشعارات الفئة (إذا كان الطالب ينتمي لفئة)
    if (studentCategory) {
      try {
        const categoryQuery = query(
          collection(db, 'notifications'),
          where('targetType', '==', 'category'),
          where('targetCategory', '==', studentCategory),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        const categorySnapshot = await getDocs(categoryQuery);

        categorySnapshot.forEach(doc => {
          const data = doc.data();
          if (
            !addedIds.has(doc.id) &&
            !hiddenSet.has(doc.id) && // تجاهل الإشعارات المخفية
            (!data.expiryDate || new Date() <= data.expiryDate.toDate())
          ) {
            notifications.push({
              id: doc.id,
              ...data,
            });
            addedIds.add(doc.id);
          }
        });
      } catch (error) {
        console.warn('خطأ في جلب إشعارات الفئة:', error);
      }
    }

    // ترتيب الإشعارات حسب التاريخ والأولوية
    notifications.sort((a, b) => {
      // ترتيب حسب الأولوية أولاً
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      // ثم حسب التاريخ
      const aDate = a.createdAt?.toDate?.() || new Date(0);
      const bDate = b.createdAt?.toDate?.() || new Date(0);
      return bDate - aDate;
    });

    return {
      success: true,
      notifications: notifications,
    };
  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error);
    return {
      success: false,
      error: error.message,
      notifications: [], // إرجاع قائمة فارغة بدلاً من undefined
    };
  }
};

// الحصول على جميع الإشعارات (للإدارة)
export const getAllNotifications = async () => {
  try {
    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const querySnapshot = await getDocs(q);
    const notifications = [];

    querySnapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {
      success: true,
      notifications: notifications,
    };
  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تم نقل دالة markNotificationAsRead إلى الأسفل مع التحسينات الجديدة

// التحقق من الإشعارات المقروءة لطالب
export const getReadNotifications = async studentId => {
  try {
    const q = query(
      collection(db, 'notificationReads'),
      where('studentId', '==', studentId)
    );

    const querySnapshot = await getDocs(q);
    const readNotificationIds = [];

    querySnapshot.forEach(doc => {
      readNotificationIds.push(doc.data().notificationId);
    });

    return {
      success: true,
      readNotificationIds: readNotificationIds,
    };
  } catch (error) {
    console.error('خطأ في جلب الإشعارات المقروءة:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// حذف إشعار
export const deleteNotification = async notificationId => {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));

    return {
      success: true,
      message: 'تم حذف الإشعار بنجاح',
    };
  } catch (error) {
    console.error('خطأ في حذف الإشعار:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// إحصائيات الإشعارات
export const getNotificationStatistics = async () => {
  try {
    const notificationsResult = await getAllNotifications();

    if (!notificationsResult.success) {
      throw new Error('فشل في جلب الإشعارات');
    }

    const notifications = notificationsResult.notifications;

    // حساب الإشعارات المقروءة وغير المقروءة
    let totalReadCount = 0;
    let totalUnreadCount = 0;

    notifications.forEach(notification => {
      const readByCount = notification.readBy ? notification.readBy.length : 0;
      if (readByCount > 0) {
        totalReadCount += readByCount;
      }

      // حساب عدد الطلاب الذين لم يقرأوا الإشعار
      // (هذا تقدير تقريبي - يمكن تحسينه بجلب عدد الطلاب الفعلي)
      if (notification.targetType === 'all') {
        // تقدير أن هناك طلاب لم يقرأوا الإشعار
        totalUnreadCount += Math.max(0, 10 - readByCount); // تقدير 10 طلاب كحد أقصى
      } else if (notification.targetType === 'selected') {
        const targetCount = notification.targetIds
          ? notification.targetIds.length
          : 0;
        totalUnreadCount += Math.max(0, targetCount - readByCount);
      }
    });

    const stats = {
      total: notifications.length,
      read: totalReadCount,
      unread: totalUnreadCount,
      high_priority: notifications.filter(n => n.priority === 'high').length,
      byType: {
        general: notifications.filter(n => n.type === 'general').length,
        video: notifications.filter(
          n => n.type === 'video' || n.type === 'new_video'
        ).length,
        announcement: notifications.filter(n => n.type === 'announcement')
          .length,
        warning: notifications.filter(n => n.type === 'warning').length,
        info: notifications.filter(n => n.type === 'info').length,
      },
      byPriority: {
        high: notifications.filter(n => n.priority === 'high').length,
        normal: notifications.filter(n => n.priority === 'normal').length,
        low: notifications.filter(n => n.priority === 'low').length,
      },
      recent: notifications.filter(n => {
        const notificationDate = n.createdAt?.toDate();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return notificationDate && notificationDate > oneDayAgo;
      }).length,
    };

    return {
      success: true,
      statistics: stats,
    };
  } catch (error) {
    console.error('خطأ في جلب إحصائيات الإشعارات:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تنظيف الإشعارات المنتهية الصلاحية
export const cleanupExpiredNotifications = async () => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('expiryDate', '<=', new Date())
    );

    const querySnapshot = await getDocs(q);
    const deletePromises = [];

    querySnapshot.forEach(doc => {
      deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);

    return {
      success: true,
      deletedCount: deletePromises.length,
      message: `تم حذف ${deletePromises.length} إشعار منتهي الصلاحية`,
    };
  } catch (error) {
    console.error('خطأ في تنظيف الإشعارات:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تحديد إشعار كمقروء
export const markNotificationAsRead = async (notificationId, studentId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);

    // الحصول على الإشعار الحالي
    const notificationDoc = await getDocs(
      query(
        collection(db, 'notifications'),
        where('__name__', '==', notificationId)
      )
    );

    if (!notificationDoc.empty) {
      const currentData = notificationDoc.docs[0].data();
      const currentReadBy = currentData.readBy || [];

      // إضافة الطالب إلى قائمة الذين قرأوا الإشعار إذا لم يكن موجوداً
      if (!currentReadBy.includes(studentId)) {
        await updateDoc(notificationRef, {
          readBy: [...currentReadBy, studentId],
        });
      }
    }

    return {
      success: true,
      message: 'تم تحديد الإشعار كمقروء',
    };
  } catch (error) {
    console.error('خطأ في تحديد الإشعار كمقروء:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// إخفاء الإشعارات المقروءة للطالب (بدلاً من حذفها)
export const hideReadNotificationsForStudent = async studentId => {
  try {
    // بدلاً من حذف الإشعارات، سنحفظ قائمة الإشعارات المخفية للطالب
    const hiddenNotificationsRef = doc(
      db,
      'studentHiddenNotifications',
      studentId
    );

    // جلب الإشعارات المقروءة للطالب
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('readBy', 'array-contains', studentId)
    );

    const snapshot = await getDocs(notificationsQuery);
    const hiddenNotificationIds = snapshot.docs.map(doc => doc.id);

    // حفظ قائمة الإشعارات المخفية للطالب
    await setDoc(
      hiddenNotificationsRef,
      {
        studentId: studentId,
        hiddenNotifications: hiddenNotificationIds,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );

    return {
      success: true,
      message: `تم إخفاء ${hiddenNotificationIds.length} إشعار مقروء من واجهتك`,
    };
  } catch (error) {
    console.error('خطأ في إخفاء الإشعارات المقروءة:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// حذف جميع الإشعارات (للإدارة)
export const deleteAllNotifications = async () => {
  try {
    const notificationsQuery = query(collection(db, 'notifications'));
    const snapshot = await getDocs(notificationsQuery);

    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return {
      success: true,
      message: `تم حذف ${deletePromises.length} إشعار من قاعدة البيانات`,
    };
  } catch (error) {
    console.error('خطأ في حذف جميع الإشعارات:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// إرسال إشعار عند إضافة فيديو جديد
export const sendNewVideoNotification = async (
  video,
  assignedStudentIds = []
) => {
  try {
    const notificationData = {
      title: 'فيديو جديد متاح!',
      message: `تم إضافة فيديو جديد: ${video.title}`,
      type: 'new_video',
      priority: 'normal',
      targetType: assignedStudentIds.length > 0 ? 'selected' : 'all',
      targetIds: assignedStudentIds,
      targetCategory: null,
      videoId: video.id,
      sectionId: video.sectionId,
      createdAt: serverTimestamp(),
      expiryDate: null,
      isActive: true,
      readBy: [],
      metadata: {
        videoTitle: video.title,
        videoDescription: video.description,
        videoDuration: video.duration,
      },
    };

    const docRef = await addDoc(
      collection(db, 'notifications'),
      notificationData
    );

    return {
      success: true,
      notificationId: docRef.id,
      message: 'تم إرسال إشعار الفيديو الجديد بنجاح',
    };
  } catch (error) {
    console.error('خطأ في إرسال إشعار الفيديو الجديد:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
