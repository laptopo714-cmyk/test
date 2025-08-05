// اختبار بسيط لخدمة Gofile.io
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const GOFILE_CONFIG = {
  accountToken: 'LbsBA7JotWj7YtFHbUiC27YiNdC0I4cd',
  uploadEndpoint: 'https://upload.gofile.io/uploadfile',
  maxFileSize: 30 * 1024 * 1024, // 30MB
};

/**
 * رفع ملف إلى Gofile.io باستخدام الـ API الجديد
 * @param {string} filePath - مسار الملف
 * @returns {Promise<Object>} نتيجة عملية الرفع
 */
async function uploadFileToGofile(filePath) {
  try {
    // التحقق من وجود الملف
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: 'الملف غير موجود',
      };
    }

    // الحصول على معلومات الملف
    const stats = fs.statSync(filePath);
    const fileName = path.basename(filePath);

    // التحقق من حجم الملف
    if (stats.size > GOFILE_CONFIG.maxFileSize) {
      return {
        success: false,
        error: `حجم الملف كبير جداً. الحد الأقصى هو ${
          GOFILE_CONFIG.maxFileSize / (1024 * 1024)
        }MB`,
      };
    }

    console.log(`📁 رفع الملف: ${fileName}`);
    console.log(`📊 حجم الملف: ${(stats.size / 1024).toFixed(2)} KB`);

    // إنشاء FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    // إعداد خيارات الطلب
    const config = {
      method: 'POST',
      url: GOFILE_CONFIG.uploadEndpoint,
      data: formData,
      headers: {
        Authorization: `Bearer ${GOFILE_CONFIG.accountToken}`,
        ...formData.getHeaders(),
      },
      timeout: 300000, // 5 minutes
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };

    console.log('🚀 بدء الرفع...');

    // تنفيذ طلب الرفع
    const response = await axios(config);
    const uploadData = response.data;

    console.log('📥 استجابة الخادم:', JSON.stringify(uploadData, null, 2));

    // التحقق من نجاح العملية
    if (uploadData.status === 'ok' && uploadData.data) {
      const result = {
        success: true,
        data: {
          fileId: uploadData.data.fileId,
          fileName: uploadData.data.fileName,
          downloadPage: uploadData.data.downloadPage,
          directLink:
            uploadData.data.directLink || uploadData.data.downloadPage,
          fileSize: uploadData.data.fileSize || stats.size,
          uploadTime: new Date().toISOString(),
        },
        message: 'تم رفع الملف بنجاح ✅',
      };

      console.log('✅ نجح الرفع!');
      console.log(`🔗 رابط التحميل: ${result.data.downloadPage}`);
      console.log(`📁 اسم الملف: ${result.data.fileName}`);
      console.log(`🆔 معرف الملف: ${result.data.fileId}`);

      return result;
    } else {
      return {
        success: false,
        error:
          uploadData.errorMessage || uploadData.message || 'فشل في رفع الملف',
      };
    }
  } catch (error) {
    console.error('❌ خطأ في رفع الملف:', error.message);

    if (error.response) {
      console.error('📄 تفاصيل الخطأ:', error.response.data);
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
        error: 'لا يمكن الوصول إلى خادم Gofile. تحقق من الاتصال بالإنترنت.',
      };
    } else {
      return {
        success: false,
        error: error.message || 'حدث خطأ غير متوقع أثناء رفع الملف',
      };
    }
  }
}

/**
 * اختبار الاتصال مع Gofile.io
 */
async function testConnection() {
  try {
    console.log('🔍 اختبار الاتصال مع Gofile.io...');

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
      console.log('✅ الاتصال ناجح!');
      console.log(`📧 البريد الإلكتروني: ${data.data.email}`);
      console.log(`🏷️ نوع الحساب: ${data.data.tier}`);
      console.log(`🆔 معرف الحساب: ${data.data.id}`);
      return { success: true, data: data.data };
    } else {
      console.log('❌ فشل الاتصال:', data.errorMessage || data.message);
      return { success: false, error: data.errorMessage || data.message };
    }
  } catch (error) {
    console.error('❌ خطأ في اختبار الاتصال:', error.message);
    return { success: false, error: error.message };
  }
}

// تشغيل الاختبار
async function runTest() {
  console.log('🚀 بدء اختبار Gofile.io API');
  console.log('='.repeat(50));

  // اختبار الاتصال
  await testConnection();

  console.log('\n' + '='.repeat(50));

  // إنشاء ملف تجريبي للاختبار
  const testFilePath = path.join(__dirname, 'test-file.txt');
  const testContent = `هذا ملف اختبار تم إنشاؤه في ${new Date().toISOString()}\n\nمحتوى تجريبي للاختبار مع Gofile.io API الجديد.\n\n✅ تم الإنشاء بنجاح!`;

  fs.writeFileSync(testFilePath, testContent, 'utf8');
  console.log(`📝 تم إنشاء ملف اختبار: ${testFilePath}`);

  // رفع الملف
  const result = await uploadFileToGofile(testFilePath);

  if (result.success) {
    console.log('\n🎉 اختبار ناجح! يمكنك تحميل الملف من:');
    console.log(`🔗 ${result.data.downloadPage}`);
  } else {
    console.log('\n❌ فشل الاختبار:', result.error);
  }

  // حذف الملف التجريبي
  fs.unlinkSync(testFilePath);
  console.log('🗑️ تم حذف الملف التجريبي');

  console.log('\n' + '='.repeat(50));
  console.log('✅ انتهى الاختبار');
}

// تشغيل الاختبار إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  runTest().catch(console.error);
}

module.exports = {
  uploadFileToGofile,
  testConnection,
  GOFILE_CONFIG,
};
