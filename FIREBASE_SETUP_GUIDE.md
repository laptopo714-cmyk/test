# دليل إعداد Firebase لمنصة مسيو أكرم إبراهيم

## خطوات إنشاء مشروع Firebase جديد

### 1. إنشاء المشروع

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر على "إنشاء مشروع" أو "Create a project"
3. اختر اسم المشروع: `akram-edu` أو أي اسم تفضله
4. فعّل Google Analytics (اختياري)
5. انقر على "إنشاء المشروع"

### 2. إعداد التطبيق

1. في لوحة تحكم المشروع، انقر على أيقونة الويب `</>`
2. اختر اسم التطبيق: `Akram Ibrahim Platform`
3. فعّل Firebase Hosting (اختياري)
4. انقر على "تسجيل التطبيق"

### 3. نسخ إعدادات Firebase

بعد إنشاء التطبيق، ستحصل على كود التكوين. انسخ القيم التالية:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'akram-edu.firebaseapp.com',
  databaseURL: 'https://akram-edu-default-rtdb.firebaseio.com',
  projectId: 'akram-edu',
  storageBucket: 'akram-edu.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
};
```

### 4. تحديث ملف البيئة

1. افتح ملف `.env.akram-production`
2. استبدل القيم التالية بالقيم الجديدة من Firebase:
   - `YOUR_NEW_API_KEY` → `apiKey`
   - `YOUR_SENDER_ID` → `messagingSenderId`
   - `YOUR_APP_ID` → `appId`
   - `YOUR_MEASUREMENT_ID` → `measurementId`

### 5. إعداد قاعدة البيانات

1. في Firebase Console، اذهب إلى "Firestore Database"
2. انقر على "إنشاء قاعدة بيانات"
3. اختر "Start in test mode" للبداية
4. اختر الموقع الجغرافي الأقرب

### 6. إعداد Realtime Database

1. اذهب إلى "Realtime Database"
2. انقر على "إنشاء قاعدة بيانات"
3. اختر "Start in test mode"
4. اختر الموقع الجغرافي

### 7. إعداد Storage

1. اذهب إلى "Storage"
2. انقر على "البدء"
3. اختر "Start in test mode"
4. اختر الموقع الجغرافي

### 8. إعداد Authentication

1. اذهب إلى "Authentication"
2. انقر على "البدء"
3. في تبويب "Sign-in method"، لا تحتاج لتفعيل أي طريقة (المنصة تستخدم نظام رموز الوصول)

### 9. رفع المشروع

```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# تهيئة المشروع
firebase init

# اختر:
# - Hosting
# - Firestore
# - Storage
# - Functions (اختياري)

# بناء المشروع
npm run build

# رفع المشروع
firebase deploy
```

### 10. تحديث قواعد الأمان

انسخ محتوى الملفات التالية إلى Firebase Console:

- `firestore.rules` → Firestore Rules
- `storage.rules` → Storage Rules

## ملاحظات مهمة

- احتفظ بنسخة احتياطية من إعدادات Firebase
- لا تشارك مفاتيح API في أماكن عامة
- راجع قواعد الأمان بانتظام
- فعّل النسخ الاحتياطي التلقائي لقاعدة البيانات

## الدعم الفني

في حالة وجود أي مشاكل، تواصل مع المطور:

- كريم عطية عطية
- 📞 01095288373
