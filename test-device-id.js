// اختبار بسيط لمعرف الجهاز الثابت
// يمكن تشغيله في console المتصفح

console.log('🧪 بدء اختبار معرف الجهاز الثابت...');

// محاكاة استيراد الدالة (في البيئة الحقيقية)
// import { generateDeviceId } from './src/firebase/accessCodes.js';

// اختبار 1: التحقق من ثبات معرف الجهاز
console.log('\n📋 اختبار 1: ثبات معرف الجهاز');
const deviceId1 = generateDeviceId();
const deviceId2 = generateDeviceId();
const deviceId3 = generateDeviceId();

console.log('المعرف الأول:', deviceId1);
console.log('المعرف الثاني:', deviceId2);
console.log('المعرف الثالث:', deviceId3);

const isConsistent = deviceId1 === deviceId2 && deviceId2 === deviceId3;
console.log('✅ النتيجة:', isConsistent ? 'ثابت' : '❌ غير ثابت');

// اختبار 2: التحقق من الحفظ في localStorage
console.log('\n📋 اختبار 2: الحفظ في localStorage');
const savedId = localStorage.getItem('persistent_device_id');
console.log('المعرف المحفوظ:', savedId);
console.log(
  '✅ النتيجة:',
  savedId === deviceId1 ? 'محفوظ بشكل صحيح' : '❌ غير محفوظ'
);

// اختبار 3: محاكاة تحديث الصفحة
console.log('\n📋 اختبار 3: محاكاة تحديث الصفحة');
console.log('محاكاة إعادة تحميل الصفحة...');

// محاكاة إعادة تحميل بحذف المتغيرات المؤقتة
const deviceIdAfterReload = generateDeviceId();
console.log('المعرف بعد إعادة التحميل:', deviceIdAfterReload);
console.log(
  '✅ النتيجة:',
  deviceIdAfterReload === deviceId1
    ? 'ثابت بعد إعادة التحميل'
    : '❌ تغير بعد إعادة التحميل'
);

// اختبار 4: اختبار إعادة التعيين
console.log('\n📋 اختبار 4: إعادة تعيين معرف الجهاز');
console.log('المعرف قبل إعادة التعيين:', deviceIdAfterReload);

// محاكاة إعادة التعيين
localStorage.removeItem('persistent_device_id');
const newDeviceId = generateDeviceId();
console.log('المعرف الجديد بعد إعادة التعيين:', newDeviceId);
console.log(
  '✅ النتيجة:',
  newDeviceId !== deviceIdAfterReload
    ? 'تم إنشاء معرف جديد'
    : '❌ لم يتغير المعرف'
);

// ملخص النتائج
console.log('\n📊 ملخص نتائج الاختبار:');
console.log('1. ثبات المعرف:', isConsistent ? '✅' : '❌');
console.log('2. الحفظ في localStorage:', savedId === deviceId1 ? '✅' : '❌');
console.log(
  '3. الثبات بعد إعادة التحميل:',
  deviceIdAfterReload === deviceId1 ? '✅' : '❌'
);
console.log(
  '4. إعادة التعيين:',
  newDeviceId !== deviceIdAfterReload ? '✅' : '❌'
);

console.log('\n🎉 انتهى الاختبار!');
