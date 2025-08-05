// Firebase Utilities
// دوال مساعدة للتعامل مع Firebase

/**
 * تنظيف البيانات من القيم null و undefined قبل إرسالها إلى Firebase
 * Firebase Firestore لا يقبل قيم null أو undefined في updateDoc()
 * @param {Object} data - البيانات المراد تنظيفها
 * @returns {Object} - البيانات المنظفة
 */
export const cleanFirebaseData = data => {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const cleanedData = {};

  Object.keys(data).forEach(key => {
    const value = data[key];

    // تجاهل القيم null و undefined و empty strings
    if (value !== null && value !== undefined && value !== '') {
      // إذا كانت القيمة كائن، تنظيفها بشكل تكراري
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date) &&
        value !== null
      ) {
        const cleanedNestedData = cleanFirebaseData(value);
        // إضافة الكائن المنظف فقط إذا لم يكن فارغاً
        if (Object.keys(cleanedNestedData).length > 0) {
          cleanedData[key] = cleanedNestedData;
        }
      } else if (Array.isArray(value)) {
        // تنظيف المصفوفات بشكل أعمق
        const cleanedArray = value
          .filter(item => item !== null && item !== undefined)
          .map(item => {
            if (
              typeof item === 'object' &&
              item !== null &&
              !(item instanceof Date)
            ) {
              return cleanFirebaseData(item);
            }
            return item;
          })
          .filter(item => {
            // إزالة الكائنات الفارغة من المصفوفة
            if (
              typeof item === 'object' &&
              item !== null &&
              !(item instanceof Date)
            ) {
              return Object.keys(item).length > 0;
            }
            return item !== null && item !== undefined;
          });

        if (cleanedArray.length > 0) {
          cleanedData[key] = cleanedArray;
        }
      } else {
        // التأكد من أن القيمة ليست undefined وليست string فارغة
        if (
          value !== undefined &&
          (typeof value !== 'string' || value.trim() !== '')
        ) {
          cleanedData[key] = value;
        }
      }
    }
  });

  return cleanedData;
};

/**
 * تحويل القيم الفارغة إلى null بدلاً من undefined
 * مفيد عندما نريد حذف حقل من Firebase بشكل صريح
 * @param {Object} data - البيانات المراد معالجتها
 * @returns {Object} - البيانات المعالجة
 */
export const normalizeFirebaseData = data => {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const normalizedData = {};

  Object.keys(data).forEach(key => {
    const value = data[key];

    if (value === undefined) {
      // تحويل undefined إلى null للحذف الصريح
      normalizedData[key] = null;
    } else if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      value !== null
    ) {
      normalizedData[key] = normalizeFirebaseData(value);
    } else {
      normalizedData[key] = value;
    }
  });

  return normalizedData;
};

/**
 * التحقق من صحة البيانات قبل إرسالها إلى Firebase
 * @param {Object} data - البيانات المراد التحقق منها
 * @returns {Object} - نتيجة التحقق
 */
export const validateFirebaseData = data => {
  const errors = [];
  const warnings = [];

  if (!data || typeof data !== 'object') {
    errors.push('البيانات يجب أن تكون كائن صحيح');
    return { isValid: false, errors, warnings };
  }

  // فحص القيم المحظورة
  Object.keys(data).forEach(key => {
    const value = data[key];

    if (value === undefined) {
      warnings.push(`الحقل "${key}" يحتوي على قيمة undefined`);
    }

    if (typeof value === 'function') {
      errors.push(`الحقل "${key}" يحتوي على دالة - غير مسموح في Firebase`);
    }

    if (value instanceof Symbol) {
      errors.push(`الحقل "${key}" يحتوي على Symbol - غير مسموح في Firebase`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * دالة شاملة لتنظيف وتحضير البيانات لـ Firebase
 * @param {Object} data - البيانات المراد تحضيرها
 * @returns {Object} - البيانات المحضرة والنظيفة
 */
export const prepareFirebaseData = data => {
  // أولاً: التحقق من صحة البيانات
  const validation = validateFirebaseData(data);

  if (!validation.isValid) {
    console.error('خطأ في صحة البيانات:', validation.errors);
    throw new Error(`بيانات غير صحيحة: ${validation.errors.join(', ')}`);
  }

  if (validation.warnings.length > 0) {
    console.warn('تحذيرات في البيانات:', validation.warnings);
  }

  // ثانياً: تنظيف البيانات
  const cleanedData = cleanFirebaseData(data);

  // ثالثاً: التحقق النهائي من عدم وجود undefined
  const finalValidation = validateFirebaseData(cleanedData);
  if (!finalValidation.isValid) {
    console.error('فشل التحقق النهائي:', finalValidation.errors);
    throw new Error(
      `فشل في تنظيف البيانات: ${finalValidation.errors.join(', ')}`
    );
  }

  return cleanedData;
};

/**
 * دالة خاصة للتعامل مع إزالة كلمة المرور
 * تحول القيم الفارغة إلى null لحذف كلمة المرور من Firebase
 * @param {Object} data - البيانات المراد معالجتها
 * @returns {Object} - البيانات المعالجة
 */
export const handlePasswordRemoval = data => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const processedData = { ...data };

  // معالجة خاصة لكلمة المرور
  if (processedData.hasOwnProperty('password')) {
    const password = processedData.password;
    // إذا كانت كلمة المرور فارغة أو null أو undefined، نعينها إلى null لحذفها
    if (password === '' || password === null || password === undefined) {
      processedData.password = null;
    }
  }

  return processedData;
};

/**
 * دالة محسنة لتنظيف البيانات مع معالجة خاصة لكلمة المرور
 * @param {Object} data - البيانات المراد تنظيفها
 * @returns {Object} - البيانات المنظفة
 */
export const cleanFirebaseDataWithPassword = data => {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const cleanedData = {};

  Object.keys(data).forEach(key => {
    const value = data[key];

    // معالجة خاصة لكلمة المرور - نحتفظ بـ null لحذفها
    if (key === 'password') {
      cleanedData[key] = value;
    } else if (value !== null && value !== undefined && value !== '') {
      // للحقول الأخرى، نطبق التنظيف العادي
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date) &&
        value !== null
      ) {
        const cleanedNestedData = cleanFirebaseData(value);
        if (Object.keys(cleanedNestedData).length > 0) {
          cleanedData[key] = cleanedNestedData;
        }
      } else if (Array.isArray(value)) {
        const cleanedArray = value
          .filter(item => item !== null && item !== undefined)
          .map(item => {
            if (
              typeof item === 'object' &&
              item !== null &&
              !(item instanceof Date)
            ) {
              return cleanFirebaseData(item);
            }
            return item;
          })
          .filter(item => {
            if (
              typeof item === 'object' &&
              item !== null &&
              !(item instanceof Date)
            ) {
              return Object.keys(item).length > 0;
            }
            return item !== null && item !== undefined;
          });

        if (cleanedArray.length > 0) {
          cleanedData[key] = cleanedArray;
        }
      } else {
        if (
          value !== undefined &&
          (typeof value !== 'string' || value.trim() !== '')
        ) {
          cleanedData[key] = value;
        }
      }
    }
  });

  return cleanedData;
};

/**
 * دالة خاصة لتنظيف بيانات الملفات المرفقة
 * @param {Array} files - مصفوفة الملفات المرفقة
 * @returns {Array} - مصفوفة الملفات المنظفة
 */
export const cleanAttachedFiles = files => {
  if (!Array.isArray(files)) {
    return [];
  }

  return files
    .filter(file => file && typeof file === 'object')
    .map(file => {
      // محاولة الحصول على اسم الملف من مصادر متعددة
      let fileName = file.fileName || file.name || file.originalName;

      // إذا لم نجد اسم الملف، نحاول استخراجه من الرابط
      if (!fileName && file.downloadPage) {
        try {
          const url = new URL(file.downloadPage);
          const pathParts = url.pathname.split('/');
          fileName = pathParts[pathParts.length - 1] || 'ملف مرفق';
        } catch (e) {
          fileName = 'ملف مرفق';
        }
      }

      // إذا كان اسم الملف لا يحتوي على امتداد، نحاول إضافة امتداد من نوع الملف
      if (fileName && !fileName.includes('.') && file.fileType) {
        const typeMap = {
          'application/pdf': '.pdf',
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
          'text/plain': '.txt',
          'application/msword': '.doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            '.docx',
        };
        const extension = typeMap[file.fileType] || '';
        if (extension) {
          fileName += extension;
        }
      }

      return {
        fileName: fileName || 'ملف مرفق',
        fileSize: file.fileSize || file.size || 0,
        fileId: file.fileId || file.id || '',
        downloadPage: file.downloadPage || file.url || '',
        uploadTime:
          file.uploadTime || file.uploadedAt || new Date().toISOString(),
        fileType: file.fileType || file.type || 'unknown',
        // حفظ اسم الملف الأصلي إذا كان متوفراً
        originalFileName: file.originalFileName || file.fileName || file.name,
      };
    })
    .filter(
      file =>
        file.downloadPage &&
        file.downloadPage.trim() !== '' &&
        file.fileName &&
        file.fileName.trim() !== '' &&
        file.fileName !== 'ملف غير معروف'
    );
};
