# نظام التحكم الموحد في الثيم (الوضع الليلي/النهاري)

## نظرة عامة

تم تطوير نظام موحد ومتقدم للتحكم في الثيم يدعم التبديل السلس بين الوضع الليلي والنهاري مع تحسينات خاصة للغة العربية.

## المميزات الرئيسية

### ✅ زر واحد موحد

- **مكون واحد**: `ThemeToggle.js` يحل محل جميع أزرار التحكم المنفصلة
- **متعدد الأشكال**: يدعم 4 أنماط مختلفة (أساسي، محسن، switch، مع تسمية)
- **موضع ثابت**: يظهر في الهيدر في جميع الصفحات

### ✅ حفظ تلقائي للإعدادات

- **localStorage**: حفظ تلقائي لاختيار المستخدم
- **تفضيلات النظام**: دعم `prefers-color-scheme`
- **استمرارية**: الإعدادات تبقى بعد إعادة تحميل الصفحة

### ✅ انتقالات سلسة

- **CSS Transitions**: انتقالات محسنة لجميع العناصر
- **منع الوميض**: تحميل سلس بدون وميض
- **تأثيرات متقدمة**: رسوم متحركة جميلة عند التبديل

### ✅ دعم كامل للعربية

- **خطوط محسنة**: دعم خطوط Cairo وAmiri
- **RTL**: دعم كامل للاتجاه من اليمين لليسار
- **تحسينات بصرية**: ظلال وتأثيرات خاصة بالنصوص العربية

## الملفات الرئيسية

### 1. مكونات التحكم

```
src/components/
├── ThemeToggle.js          # المكون الموحد للتحكم في الثيم
├── ThemeInitializer.js     # مكون تهيئة الثيم عند التحميل
└── ThemeDemo.js           # صفحة عرض توضيحي
```

### 2. إعدادات السياق

```
src/contexts/
└── ThemeContext.js        # سياق الثيم المحدث
```

### 3. ملفات الأنماط

```
src/styles/
├── theme-transitions.css       # انتقالات سلسة
├── dark-mode-enhancements.css  # تحسينات الوضع الليلي
├── arabic-dark-theme.css       # ثيم عربي للوضع الليلي
├── animations.css              # رسوم متحركة محسنة
└── professional-colors.css     # ألوان احترافية
```

## طريقة الاستخدام

### 1. الاستخدام الأساسي

```jsx
import ThemeToggle from './components/ThemeToggle';

// زر بسيط
<ThemeToggle />

// مع تسمية
<ThemeToggle showLabel={true} />

// نسخة محسنة
<ThemeToggle enhanced={true} />

// نسخة Switch
<ThemeToggle variant="switch" />
```

### 2. في السياق

```jsx
import { useTheme } from './contexts/ThemeContext';

const { darkMode, toggleDarkMode } = useTheme();
```

### 3. في CSS

```css
/* استخدام data-theme */
[data-theme='dark'] .my-element {
  background: #1a1a2e;
  color: #e2e8f0;
}

[data-theme='light'] .my-element {
  background: #ffffff;
  color: #1a202c;
}
```

## الأنماط المتاحة

### 1. النمط الأساسي (`variant="icon"`)

- زر أيقونة بسيط مع تأثيرات hover
- مناسب للاستخدام في الشريط العلوي

### 2. النمط المحسن (`enhanced={true}`)

- تصميم متقدم مع تدرجات وتأثيرات
- رسوم متحركة جميلة
- مناسب للصفحات الرئيسية

### 3. نمط Switch (`variant="switch"`)

- مفتاح تبديل تقليدي
- مناسب للنماذج والإعدادات

### 4. مع التسمية (`showLabel={true}`)

- يعرض نص "مظلم" أو "فاتح" بجانب الزر
- مناسب عندما نحتاج توضيح إضافي

## التخصيص

### 1. الألوان

```css
[data-theme='dark'] {
  --primary-color: #7c7ce8;
  --secondary-color: #b491d4;
  --accent-color: #6bb6a7;
}
```

### 2. الخطوط العربية

```css
[data-theme='dark'] {
  --arabic-font-primary: 'Cairo', 'Amiri', sans-serif;
  --arabic-font-decorative: 'Amiri', 'Scheherazade New', serif;
}
```

### 3. الانتقالات

```css
.custom-element {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## اختبار النظام

يمكن اختبار النظام عبر زيارة صفحة العرض التوضيحي:

```
http://localhost:3000/theme-demo
```

## الميزات المتقدمة

### 1. منع الوميض

- تطبيق الثيم فوراً عند التحميل
- استخدام `color-scheme` meta tag
- دعم المتصفحات القديمة

### 2. دعم إمكانية الوصول

- `aria-label` ديناميكي
- دعم `prefers-reduced-motion`
- تباين عالي للنصوص

### 3. تحسينات الأداء

- تحميل lazy للتأثيرات
- تحسين الانتقالات
- منع إعادة الرسم غير الضرورية

## استكشاف الأخطاء

### 1. الثيم لا يتم حفظه

```javascript
// تحقق من دعم localStorage
if (typeof Storage !== 'undefined') {
  // localStorage مدعوم
} else {
  // استخدم حل بديل
}
```

### 2. انتقالات بطيئة

```css
/* تقليل مدة الانتقال */
* {
  transition-duration: 0.2s !important;
}
```

### 3. مشاكل في الخطوط العربية

```css
/* تأكد من تحميل الخطوط */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
```

## التحديثات المستقبلية

- [ ] دعم ثيمات إضافية (أزرق، أخضر، إلخ)
- [ ] حفظ الإعدادات في قاعدة البيانات للمستخدمين المسجلين
- [ ] تخصيص متقدم للألوان
- [ ] دعم الوضع التلقائي (تبديل حسب الوقت)
- [ ] تأثيرات انتقال متقدمة

## الدعم

للمساعدة أو الإبلاغ عن مشاكل، يرجى التواصل مع فريق التطوير.
