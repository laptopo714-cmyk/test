// إنشاء رمز وصول تجريبي
import { createAccessCode } from '../firebase/accessCodes';

export const createTestAccessCode = async () => {
  try {
    const studentData = {
      studentName: 'طالب تجريبي',
      phoneNumber: '123456789',
      notes: 'رمز تجريبي للاختبار',
      expiryDate: null, // بدون انتهاء صلاحية
    };

    const result = await createAccessCode(studentData);

    if (result.success) {
      console.log('تم إنشاء رمز الوصول التجريبي:', result.accessCode);
      console.log('معرف الرمز:', result.codeId);
      return result;
    } else {
      console.error('فشل في إنشاء رمز الوصول:', result.error);
      return result;
    }
  } catch (error) {
    console.error('خطأ في إنشاء رمز الوصول:', error);
    return { success: false, error: error.message };
  }
};

// إنشاء عدة رموز وصول تجريبية
export const createMultipleTestCodes = async (count = 3) => {
  const results = [];

  for (let i = 1; i <= count; i++) {
    const studentData = {
      studentName: `طالب تجريبي ${i}`,
      phoneNumber: `12345678${i}`,
      notes: `رمز تجريبي رقم ${i}`,
      expiryDate: null,
    };

    const result = await createAccessCode(studentData);
    results.push(result);

    if (result.success) {
      console.log(`رمز الوصول ${i}:`, result.accessCode);
    }
  }

  return results;
};
