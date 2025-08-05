// اختبار بسيط للاستيرادات
console.log('🧪 اختبار الاستيرادات...');

try {
  // اختبار استيراد دوال accessCodes
  import('./src/firebase/accessCodes.js')
    .then(module => {
      console.log('✅ تم استيراد accessCodes بنجاح');
      console.log('الدوال المتاحة:', Object.keys(module));

      // اختبار generateDeviceId
      if (module.generateDeviceId) {
        const deviceId = module.generateDeviceId();
        console.log(
          '✅ generateDeviceId يعمل:',
          deviceId.substring(0, 8) + '...'
        );
      }

      // اختبار resetDeviceId
      if (module.resetDeviceId) {
        console.log('✅ resetDeviceId متاح');
      }
    })
    .catch(error => {
      console.error('❌ خطأ في استيراد accessCodes:', error);
    });

  // اختبار استيراد StudentContext
  import('./src/contexts/StudentContext.js')
    .then(module => {
      console.log('✅ تم استيراد StudentContext بنجاح');
      console.log('المكونات المتاحة:', Object.keys(module));
    })
    .catch(error => {
      console.error('❌ خطأ في استيراد StudentContext:', error);
    });

  // اختبار استيراد useVideoPlaybackState
  import('./src/hooks/useVideoPlaybackState.js')
    .then(module => {
      console.log('✅ تم استيراد useVideoPlaybackState بنجاح');
      console.log('الدوال المتاحة:', Object.keys(module));
    })
    .catch(error => {
      console.error('❌ خطأ في استيراد useVideoPlaybackState:', error);
    });
} catch (error) {
  console.error('❌ خطأ عام في الاختبار:', error);
}

console.log('🎉 انتهى اختبار الاستيرادات!');
