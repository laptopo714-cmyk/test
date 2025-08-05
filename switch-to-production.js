const fs = require('fs');
const path = require('path');

// سكريبت لتبديل إعدادات Firebase للإنتاج
console.log('🔄 تبديل إعدادات Firebase للإنتاج...');

const envProductionPath = path.join(__dirname, '.env.akram-production');
const envPath = path.join(__dirname, '.env');

try {
  // التحقق من وجود ملف الإنتاج
  if (!fs.existsSync(envProductionPath)) {
    console.error('❌ ملف .env.akram-production غير موجود!');
    console.log('📝 يرجى إنشاء الملف وتحديث إعدادات Firebase أولاً.');
    process.exit(1);
  }

  // نسخ احتياطية من الملف الحالي
  const backupPath = path.join(__dirname, '.env.backup');
  fs.copyFileSync(envPath, backupPath);
  console.log('💾 تم إنشاء نسخة احتياطية: .env.backup');

  // نسخ ملف الإنتاج
  fs.copyFileSync(envProductionPath, envPath);
  console.log('✅ تم تحديث إعدادات Firebase للإنتاج');

  console.log('\n📋 الخطوات التالية:');
  console.log('1. تأكد من تحديث إعدادات Firebase في .env.akram-production');
  console.log('2. قم ببناء المشروع: npm run build');
  console.log('3. ارفع المشروع: firebase deploy');
} catch (error) {
  console.error('❌ خطأ في تبديل الإعدادات:', error.message);
  process.exit(1);
}
