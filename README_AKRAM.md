# منصة مسيو أكرم إبراهيم التعليمية

## نظرة عامة

منصة تعليمية متخصصة للمسيو أكرم إبراهيم، مبنية باستخدام React و Firebase مع نظام رموز الوصول الآمن.

## معلومات المسيو

- **الاسم:** أكرم إبراهيم
- **رقم الهاتف:** 01023232323
- **العنوان:** المنصورة - الدقهلية

## المميزات الرئيسية

- ✅ نظام رموز وصول آمن
- ✅ حماية الفيديوهات من التحميل
- ✅ ربط كل رمز بجهاز واحد فقط
- ✅ لوحة تحكم للطلاب
- ✅ لوحة إدارة للمسيو
- ✅ واجهة عربية كاملة
- ✅ تصميم متجاوب

## التقنيات المستخدمة

- **Frontend:** React 18, Material-UI
- **Backend:** Firebase (Firestore, Storage, Auth)
- **Styling:** Material-UI Theme, CSS
- **Icons:** Material-UI Icons

## التشغيل المحلي

```bash
# تثبيت المتطلبات
npm install

# تشغيل المشروع
npm start
```

## البناء للإنتاج

```bash
# بناء المشروع
npm run build

# رفع على Firebase
firebase deploy
```

## إعداد Firebase

راجع ملف `FIREBASE_SETUP_GUIDE.md` للحصول على تعليمات مفصلة.

## الدعم الفني

**المطور:** كريم عطية عطية  
**الهاتف:** 01095288373

---

© 2025 . جميع الحقوق محفوظة لمسيو أكرم إبراهيم  
تطوير: كريم عطية عطية

### Admin Credentials Update

Admin credentials are stored in `src/pages/Admin/SecretAdminLogin.js` with basic Base64 obfuscation. To update:

1. Encode new credentials:
   ```bash
   echo -n "username" | base64
   echo -n "password" | base64
   ```
2. Update the `encodedUsername` and `encodedPassword` variables
3. Update the demo credentials section with plaintext values
4. Add security warning about hardcoded credentials

**Warning:** This is not production-grade security. For production use:

- Move credentials to environment variables
- Implement proper encryption
- Remove demo credentials section
