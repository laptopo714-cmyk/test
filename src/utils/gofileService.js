// Gofile.io Upload Service - Updated for New API
import axios from 'axios';

const GOFILE_CONFIG = {
  accountId: '9eade542-d847-4085-aaac-2d7e7b20eaa6',
  accountToken: 'LbsBA7JotWj7YtFHbUiC27YiNdC0I4cd',
  uploadEndpoint: 'https://upload.gofile.io/uploadfile', // New API endpoint
  maxFileSize: 30 * 1024 * 1024, // 30MB in bytes
  allowedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed',
    'video/mp4',
    'video/avi',
    'video/mov',
    'audio/mp3',
    'audio/wav',
  ],
};

// التحقق من صحة الملف
const validateFile = file => {
  const errors = [];

  // التحقق من حجم الملف
  if (file.size > GOFILE_CONFIG.maxFileSize) {
    errors.push(
      `حجم الملف كبير جداً. الحد الأقصى هو ${
        GOFILE_CONFIG.maxFileSize / (1024 * 1024)
      }MB`
    );
  }

  // التحقق من نوع الملف (اختياري - يمكن تعطيله للسماح بجميع الأنواع)
  if (
    GOFILE_CONFIG.allowedTypes.length > 0 &&
    !GOFILE_CONFIG.allowedTypes.includes(file.type)
  ) {
    errors.push(
      'نوع الملف غير مدعوم. الأنواع المدعومة: PDF, صور, مستندات, فيديو, صوت'
    );
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

/**
 * رفع ملف إلى Gofile.io باستخدام الـ API الجديد
 * @param {File} file - الملف المراد رفعه
 * @param {Function} onProgress - دالة لتتبع تقدم الرفع (اختيارية)
 * @param {string} folderId - معرف المجلد (اختياري، افتراضي: root)
 * @returns {Promise<Object>} نتيجة عملية الرفع
 */
export const uploadFileToGofile = async (
  file,
  onProgress = null,
  folderId = null
) => {
  try {
    // التحقق من صحة الملف
    const validation = validateFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // إنشاء FormData مع الحقول المطلوبة
    const formData = new FormData();
    formData.append('file', file); // الحقل المطلوب للـ API الجديد

    // إضافة معرف المجلد إذا تم تحديده
    if (folderId) {
      formData.append('folderId', folderId);
    }

    // إعداد خيارات الطلب
    const config = {
      method: 'POST',
      url: GOFILE_CONFIG.uploadEndpoint,
      data: formData,
      headers: {
        Authorization: `Bearer ${GOFILE_CONFIG.accountToken}`, // Authentication header
        'Content-Type': 'multipart/form-data',
      },
      // تتبع تقدم الرفع
      onUploadProgress: onProgress
        ? progressEvent => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        : undefined,
      // زيادة timeout للملفات الكبيرة
      timeout: 300000, // 5 minutes
    };

    // تنفيذ طلب الرفع
    const response = await axios(config);
    const uploadData = response.data;

    // التحقق من نجاح العملية
    if (uploadData.status === 'ok' && uploadData.data) {
      return {
        success: true,
        data: {
          fileId: uploadData.data.fileId,
          fileName: uploadData.data.fileName || file.name, // استخدام اسم الملف الأصلي كـ fallback
          originalFileName: file.name, // حفظ اسم الملف الأصلي
          downloadPage: uploadData.data.downloadPage,
          directLink:
            uploadData.data.directLink || uploadData.data.downloadPage,
          fileSize: uploadData.data.fileSize || file.size,
          fileType: file.type, // حفظ نوع الملف الأصلي
          uploadTime: new Date().toISOString(),
          // معلومات إضافية من الاستجابة
          parentFolder: uploadData.data.parentFolder,
          code: uploadData.data.code,
        },
        message: 'تم رفع الملف بنجاح ✅',
      };
    } else {
      return {
        success: false,
        error:
          uploadData.errorMessage || uploadData.message || 'فشل في رفع الملف',
      };
    }
  } catch (error) {
    console.error('خطأ في رفع الملف:', error);

    // معالجة أخطاء مختلفة
    if (error.response) {
      // الخادم رد بخطأ
      const errorMessage =
        error.response.data?.errorMessage ||
        error.response.data?.message ||
        `خطأ HTTP: ${error.response.status}`;
      return {
        success: false,
        error: errorMessage,
        statusCode: error.response.status,
      };
    } else if (error.request) {
      // لم يتم استلام رد من الخادم
      return {
        success: false,
        error: 'لا يمكن الوصول إلى خادم Gofile. تحقق من الاتصال بالإنترنت.',
      };
    } else {
      // خطأ في إعداد الطلب
      return {
        success: false,
        error: error.message || 'حدث خطأ غير متوقع أثناء رفع الملف',
      };
    }
  }
};

/**
 * رفع عدة ملفات إلى Gofile.io
 * @param {FileList|Array} files - قائمة الملفات المراد رفعها
 * @param {Function} onProgress - دالة لتتبع تقدم الرفع الإجمالي (اختيارية)
 * @param {string} folderId - معرف المجلد (اختياري)
 * @returns {Promise<Object>} نتائج عمليات الرفع
 */
export const uploadMultipleFiles = async (
  files,
  onProgress = null,
  folderId = null
) => {
  const results = [];
  const totalFiles = files.length;

  // التحقق من وجود ملفات
  if (!files || files.length === 0) {
    return {
      success: false,
      error: 'لا توجد ملفات للرفع',
      results: [],
      successCount: 0,
      failureCount: 0,
    };
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // تحديث التقدم الإجمالي - بداية رفع الملف
    if (onProgress) {
      onProgress({
        currentFile: i + 1,
        totalFiles: totalFiles,
        fileName: file.name,
        fileProgress: 0,
        overallProgress: Math.round((i / totalFiles) * 100),
        status: 'uploading',
      });
    }

    // رفع الملف الحالي
    const result = await uploadFileToGofile(
      file,
      fileProgress => {
        if (onProgress) {
          onProgress({
            currentFile: i + 1,
            totalFiles: totalFiles,
            fileName: file.name,
            fileProgress: fileProgress,
            overallProgress: Math.round(
              ((i + fileProgress / 100) / totalFiles) * 100
            ),
            status: 'uploading',
          });
        }
      },
      folderId
    );

    // إضافة النتيجة مع معلومات الملف
    results.push({
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      ...result,
    });

    // تحديث التقدم - انتهاء رفع الملف
    if (onProgress) {
      onProgress({
        currentFile: i + 1,
        totalFiles: totalFiles,
        fileName: file.name,
        fileProgress: 100,
        overallProgress: Math.round(((i + 1) / totalFiles) * 100),
        status: result.success ? 'completed' : 'failed',
      });
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  return {
    success: successCount > 0, // نجح إذا تم رفع ملف واحد على الأقل
    results: results,
    successCount: successCount,
    failureCount: failureCount,
    totalFiles: totalFiles,
    message: `تم رفع ${successCount} من ${totalFiles} ملف بنجاح`,
  };
};

/**
 * حذف ملف من Gofile.io
 * @param {string} fileId - معرف الملف المراد حذفه
 * @returns {Promise<Object>} نتيجة عملية الحذف
 */
export const deleteFileFromGofile = async fileId => {
  try {
    if (!fileId) {
      return {
        success: false,
        error: 'معرف الملف مطلوب',
      };
    }

    const response = await axios({
      method: 'DELETE',
      url: 'https://api.gofile.io/deleteContent',
      headers: {
        Authorization: `Bearer ${GOFILE_CONFIG.accountToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        contentId: fileId,
      },
      timeout: 30000, // 30 seconds
    });

    const data = response.data;

    if (data.status === 'ok') {
      return {
        success: true,
        message: 'تم حذف الملف بنجاح ✅',
      };
    } else {
      return {
        success: false,
        error: data.errorMessage || data.message || 'فشل في حذف الملف',
      };
    }
  } catch (error) {
    console.error('خطأ في حذف الملف:', error);

    if (error.response) {
      const errorMessage =
        error.response.data?.errorMessage ||
        error.response.data?.message ||
        `خطأ HTTP: ${error.response.status}`;
      return {
        success: false,
        error: errorMessage,
        statusCode: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'لا يمكن الوصول إلى خادم Gofile',
      };
    } else {
      return {
        success: false,
        error: error.message || 'حدث خطأ أثناء حذف الملف',
      };
    }
  }
};

/**
 * الحصول على معلومات الملف من Gofile.io
 * @param {string} fileId - معرف الملف
 * @returns {Promise<Object>} معلومات الملف
 */
export const getFileInfo = async fileId => {
  try {
    if (!fileId) {
      return {
        success: false,
        error: 'معرف الملف مطلوب',
      };
    }

    const response = await axios({
      method: 'GET',
      url: `https://api.gofile.io/getContent`,
      headers: {
        Authorization: `Bearer ${GOFILE_CONFIG.accountToken}`,
      },
      params: {
        contentId: fileId,
      },
      timeout: 30000,
    });

    const data = response.data;

    if (data.status === 'ok') {
      return {
        success: true,
        data: data.data,
      };
    } else {
      return {
        success: false,
        error:
          data.errorMessage ||
          data.message ||
          'فشل في الحصول على معلومات الملف',
      };
    }
  } catch (error) {
    console.error('خطأ في الحصول على معلومات الملف:', error);

    if (error.response) {
      const errorMessage =
        error.response.data?.errorMessage ||
        error.response.data?.message ||
        `خطأ HTTP: ${error.response.status}`;
      return {
        success: false,
        error: errorMessage,
        statusCode: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'لا يمكن الوصول إلى خادم Gofile',
      };
    } else {
      return {
        success: false,
        error: error.message || 'حدث خطأ أثناء الحصول على معلومات الملف',
      };
    }
  }
};

/**
 * إنشاء مجلد جديد في Gofile.io
 * @param {string} folderName - اسم المجلد
 * @param {string} parentFolderId - معرف المجلد الأب (اختياري)
 * @returns {Promise<Object>} معلومات المجلد الجديد
 */
export const createFolder = async (folderName, parentFolderId = null) => {
  try {
    if (!folderName) {
      return {
        success: false,
        error: 'اسم المجلد مطلوب',
      };
    }

    const response = await axios({
      method: 'POST',
      url: 'https://api.gofile.io/createFolder',
      headers: {
        Authorization: `Bearer ${GOFILE_CONFIG.accountToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        folderName: folderName,
        parentFolderId: parentFolderId || 'root',
      },
      timeout: 30000,
    });

    const data = response.data;

    if (data.status === 'ok') {
      return {
        success: true,
        data: {
          folderId: data.data.folderId,
          folderName: data.data.name,
          parentFolder: data.data.parentFolder,
          createTime: new Date().toISOString(),
        },
        message: 'تم إنشاء المجلد بنجاح ✅',
      };
    } else {
      return {
        success: false,
        error: data.errorMessage || data.message || 'فشل في إنشاء المجلد',
      };
    }
  } catch (error) {
    console.error('خطأ في إنشاء المجلد:', error);

    if (error.response) {
      const errorMessage =
        error.response.data?.errorMessage ||
        error.response.data?.message ||
        `خطأ HTTP: ${error.response.status}`;
      return {
        success: false,
        error: errorMessage,
        statusCode: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'لا يمكن الوصول إلى خادم Gofile',
      };
    } else {
      return {
        success: false,
        error: error.message || 'حدث خطأ أثناء إنشاء المجلد',
      };
    }
  }
};

/**
 * إنشاء رابط تحميل آمن من بيانات الملف
 * @param {Object} fileData - بيانات الملف
 * @returns {Object} روابط التحميل المنسقة
 */
export const createSecureDownloadLink = fileData => {
  return {
    downloadPage: fileData.downloadPage,
    directLink: fileData.directLink || fileData.downloadPage,
    fileName: fileData.fileName,
    fileSize: fileData.fileSize,
    uploadTime: fileData.uploadTime,
    fileId: fileData.fileId,
  };
};

// تنسيق حجم الملف
export const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// التحقق من صحة رابط Gofile
export const validateGofileLink = link => {
  const gofilePattern = /^https:\/\/(www\.)?gofile\.io\/(d\/)?[a-zA-Z0-9]+$/;
  return gofilePattern.test(link);
};

// استخراج معرف الملف من الرابط
export const extractFileIdFromLink = link => {
  const match = link.match(/gofile\.io\/(d\/)?([a-zA-Z0-9]+)/);
  return match ? match[2] : null;
};

/**
 * اختبار الاتصال مع Gofile.io API
 * @returns {Promise<Object>} نتيجة اختبار الاتصال
 */
export const testConnection = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'https://api.gofile.io/getAccountDetails',
      headers: {
        Authorization: `Bearer ${GOFILE_CONFIG.accountToken}`,
      },
      timeout: 10000,
    });

    const data = response.data;

    if (data.status === 'ok') {
      return {
        success: true,
        data: {
          accountId: data.data.id,
          email: data.data.email,
          tier: data.data.tier,
          rootFolder: data.data.rootFolder,
        },
        message: 'الاتصال مع Gofile.io يعمل بشكل صحيح ✅',
      };
    } else {
      return {
        success: false,
        error:
          data.errorMessage || data.message || 'فشل في الاتصال مع Gofile.io',
      };
    }
  } catch (error) {
    console.error('خطأ في اختبار الاتصال:', error);

    if (error.response) {
      return {
        success: false,
        error: `خطأ في المصادقة: ${error.response.status}`,
        statusCode: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'لا يمكن الوصول إلى خادم Gofile.io',
      };
    } else {
      return {
        success: false,
        error: error.message || 'حدث خطأ في اختبار الاتصال',
      };
    }
  }
};

/**
 * دالة مساعدة لعرض رابط التحميل للمستخدم
 * @param {Object} uploadResult - نتيجة عملية الرفع
 * @returns {string} رسالة منسقة مع رابط التحميل
 */
export const displayDownloadLink = uploadResult => {
  if (!uploadResult.success || !uploadResult.data) {
    return 'فشل في رفع الملف';
  }

  const { fileName, downloadPage, directLink } = uploadResult.data;

  return `
✅ تم رفع الملف بنجاح!
📁 اسم الملف: ${fileName}
🔗 رابط التحميل: ${downloadPage}
${directLink ? `🔗 الرابط المباشر: ${directLink}` : ''}
  `.trim();
};

// تصدير جميع الدوال
export default {
  uploadFileToGofile,
  uploadMultipleFiles,
  deleteFileFromGofile,
  getFileInfo,
  createFolder,
  createSecureDownloadLink,
  formatFileSize,
  validateGofileLink,
  extractFileIdFromLink,
  testConnection,
  displayDownloadLink,
  GOFILE_CONFIG,
};
