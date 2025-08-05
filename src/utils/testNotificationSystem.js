// Test Notification System
import {
  sendNotificationToAll,
  sendNotificationToSelected,
  sendNotificationToSingleStudent,
  getStudentNotifications,
  markNotificationAsRead,
  deleteReadNotificationsForStudent,
  deleteAllNotifications,
} from '../firebase/notificationService';

// اختبار إرسال إشعار لجميع الطلاب
export const testSendToAll = async () => {
  console.log('🧪 اختبار إرسال إشعار لجميع الطلاب...');

  const notificationData = {
    title: 'إشعار تجريبي للجميع',
    message: 'هذا إشعار تجريبي لاختبار النظام المحسن',
    type: 'general',
    priority: 'normal',
  };

  try {
    const result = await sendNotificationToAll(notificationData);
    console.log('✅ نتيجة الإرسال للجميع:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ في الإرسال للجميع:', error);
    return { success: false, error: error.message };
  }
};

// اختبار إرسال إشعار لطالب واحد
export const testSendToSingleStudent = async studentCode => {
  console.log('🧪 اختبار إرسال إشعار لطالب واحد...');

  const notificationData = {
    title: 'إشعار شخصي',
    message: `مرحباً! هذا إشعار خاص بك يا ${studentCode}`,
    type: 'info',
    priority: 'high',
  };

  try {
    const result = await sendNotificationToSingleStudent(
      notificationData,
      studentCode
    );
    console.log('✅ نتيجة الإرسال للطالب الواحد:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ في الإرسال للطالب الواحد:', error);
    return { success: false, error: error.message };
  }
};

// اختبار جلب إشعارات الطالب
export const testGetStudentNotifications = async studentCode => {
  console.log('🧪 اختبار جلب إشعارات الطالب...');

  try {
    const result = await getStudentNotifications(studentCode);
    console.log('✅ إشعارات الطالب:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ في جلب الإشعارات:', error);
    return { success: false, error: error.message };
  }
};

// اختبار تحديد إشعار كمقروء
export const testMarkAsRead = async (notificationId, studentCode) => {
  console.log('🧪 اختبار تحديد إشعار كمقروء...');

  try {
    const result = await markNotificationAsRead(notificationId, studentCode);
    console.log('✅ نتيجة تحديد كمقروء:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ في تحديد كمقروء:', error);
    return { success: false, error: error.message };
  }
};

// اختبار حذف الإشعارات المقروءة
export const testDeleteReadNotifications = async studentCode => {
  console.log('🧪 اختبار حذف الإشعارات المقروءة...');

  try {
    const result = await deleteReadNotificationsForStudent(studentCode);
    console.log('✅ نتيجة حذف المقروءة:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ في حذف المقروءة:', error);
    return { success: false, error: error.message };
  }
};

// اختبار حذف جميع الإشعارات (للإدارة)
export const testDeleteAllNotifications = async () => {
  console.log('🧪 اختبار حذف جميع الإشعارات...');

  try {
    const result = await deleteAllNotifications();
    console.log('✅ نتيجة حذف الجميع:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ في حذف الجميع:', error);
    return { success: false, error: error.message };
  }
};

// اختبار شامل للنظام
export const runFullNotificationTest = async (studentCode = 'TEST001') => {
  console.log('🚀 بدء الاختبار الشامل لنظام الإشعارات المحسن...');

  const results = {
    sendToAll: null,
    sendToSingle: null,
    getNotifications: null,
    markAsRead: null,
    deleteRead: null,
  };

  // 1. إرسال إشعار للجميع
  results.sendToAll = await testSendToAll();

  // 2. إرسال إشعار لطالب واحد
  results.sendToSingle = await testSendToSingleStudent(studentCode);

  // انتظار قصير
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 3. جلب إشعارات الطالب
  results.getNotifications = await testGetStudentNotifications(studentCode);

  if (
    results.getNotifications.success &&
    results.getNotifications.notifications.length > 0
  ) {
    const firstNotification = results.getNotifications.notifications[0];

    // 4. تحديد أول إشعار كمقروء
    results.markAsRead = await testMarkAsRead(
      firstNotification.id,
      studentCode
    );

    // انتظار قصير
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 5. حذف الإشعارات المقروءة
    results.deleteRead = await testDeleteReadNotifications(studentCode);
  }

  console.log('📊 نتائج الاختبار الشامل:', results);

  // تقرير النتائج
  const successCount = Object.values(results).filter(r => r?.success).length;
  const totalTests = Object.values(results).filter(r => r !== null).length;

  console.log(`✅ نجح ${successCount} من ${totalTests} اختبارات`);

  if (successCount === totalTests) {
    console.log('🎉 جميع الاختبارات نجحت! النظام يعمل بشكل مثالي');
  } else {
    console.log('⚠️ بعض الاختبارات فشلت، يرجى مراجعة الأخطاء أعلاه');
  }

  return results;
};

// تصدير دالة سريعة للاختبار من وحدة التحكم
window.testNotifications = runFullNotificationTest;
