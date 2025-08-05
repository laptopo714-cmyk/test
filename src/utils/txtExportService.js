// TXT Export Service - Beautiful formatted text reports
import { formatDate, formatDateTime } from './dateUtils';

// تنسيق التاريخ للتقرير
const formatReportDate = date => {
  if (!date) return 'غير محدد';
  return formatDate(date);
};

// تنسيق التاريخ والوقت للتقرير
const formatReportDateTime = date => {
  if (!date) return 'غير محدد';
  return formatDateTime(date);
};

// إنشاء خط فاصل مزخرف
const createSeparator = (char = '═', length = 80) => {
  return char.repeat(length);
};

// إنشاء عنوان مزخرف
const createTitle = (title, emoji = '📊') => {
  const separator = createSeparator('═', 80);
  const titleLine = `${emoji} ${title} ${emoji}`;
  const padding = Math.max(0, (80 - titleLine.length) / 2);
  const centeredTitle = ' '.repeat(Math.floor(padding)) + titleLine;

  return `${separator}\n${centeredTitle}\n${separator}`;
};

// إنشاء قسم فرعي
const createSection = (title, emoji = '📋') => {
  const line = `${emoji} ${title}`;
  const underline = '─'.repeat(line.length);
  return `\n${line}\n${underline}`;
};

// تنسيق الإحصائيات العامة
const formatGeneralStats = stats => {
  let content = createSection('الإحصائيات العامة', '📈');

  content += `\n✅ إجمالي رموز الوصول: ${stats.totalAccessCodes || 0}`;
  content += `\n🟢 الحسابات النشطة: ${stats.activeAccounts || 0}`;
  content += `\n🔴 الحسابات المعطلة: ${stats.inactiveAccounts || 0}`;
  content += `\n📁 إجمالي الأقسام: ${stats.totalSections || 0}`;
  content += `\n🎥 إجمالي الفيديوهات: ${stats.totalVideos || 0}`;
  content += `\n👁️ إجمالي المشاهدات: ${stats.totalViews || 0}`;

  return content;
};

// دالة مساعدة للتعامل مع التواريخ بأمان
const safeFormatDate = dateValue => {
  if (!dateValue) return 'دائم';

  try {
    // إذا كان Firebase Timestamp
    if (dateValue && typeof dateValue.toDate === 'function') {
      return formatReportDate(dateValue.toDate());
    }
    // إذا كان Date object عادي
    else if (dateValue instanceof Date) {
      return formatReportDate(dateValue);
    }
    // إذا كان string
    else if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return formatReportDate(date);
      }
    }
    // إذا كان timestamp number
    else if (typeof dateValue === 'number') {
      return formatReportDate(new Date(dateValue));
    }

    return 'دائم';
  } catch (error) {
    console.warn('خطأ في تنسيق التاريخ:', error);
    return 'دائم';
  }
};

// تنسيق تفاصيل رموز الوصول
const formatAccessCodesDetails = accessCodes => {
  if (!accessCodes || accessCodes.length === 0) {
    return '';
  }

  let content = createSection('تفاصيل رموز الوصول', '🔑');

  accessCodes.forEach((code, index) => {
    content += `\n\n${index + 1}. 🎫 الرمز: ${code.code || 'غير محدد'}`;
    content += `\n   👤 اسم الطالب: ${code.studentName || 'غير محدد'}`;
    content += `\n   🏷️ الفئة: ${code.category || 'عام'}`;
    content += `\n   ${code.isActive ? '🟢' : '🔴'} الحالة: ${
      code.isActive ? 'نشط' : 'معطل'
    }`;
    content += `\n   📅 تاريخ الانتهاء: ${safeFormatDate(code.expiryDate)}`;
    content += `\n   🕐 آخر دخول: ${formatReportDateTime(code.lastLoginAt)}`;

    if (index < accessCodes.length - 1) {
      content += `\n   ${createSeparator('·', 50)}`;
    }
  });

  return content;
};

// تنسيق تفاصيل الأقسام
const formatSectionsDetails = (sections, videos) => {
  if (!sections || sections.length === 0) {
    return '';
  }

  let content = createSection('تفاصيل الأقسام', '📚');

  sections.forEach((section, index) => {
    const sectionVideos = videos.filter(v => v.sectionId === section.id);
    const totalViews = sectionVideos.reduce(
      (sum, v) => sum + (v.viewCount || 0),
      0
    );

    content += `\n\n${index + 1}. 📖 القسم: ${section.title || 'غير محدد'}`;
    content += `\n   🎬 عدد الفيديوهات: ${sectionVideos.length}`;
    content += `\n   👁️ إجمالي المشاهدات: ${totalViews}`;
    content += `\n   ${section.password ? '🔒' : '🔓'} الحماية: ${
      section.password ? 'محمي بكلمة مرور' : 'مفتوح'
    }`;
    content += `\n   ${section.isHidden ? '👁️‍🗨️' : '👁️'} الرؤية: ${
      section.isHidden ? 'مخفي' : 'ظاهر'
    }`;
    content += `\n   📅 تاريخ الإنشاء: ${formatReportDate(section.createdAt)}`;

    if (index < sections.length - 1) {
      content += `\n   ${createSeparator('·', 50)}`;
    }
  });

  return content;
};

// تنسيق تفاصيل الفيديوهات الأكثر مشاهدة
const formatTopVideos = videos => {
  if (!videos || videos.length === 0) {
    return '';
  }

  // ترتيب الفيديوهات حسب المشاهدات
  const sortedVideos = videos
    .filter(v => v.viewCount > 0)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 10); // أفضل 10 فيديوهات

  if (sortedVideos.length === 0) {
    return '';
  }

  let content = createSection('الفيديوهات الأكثر مشاهدة (أفضل 10)', '🏆');

  sortedVideos.forEach((video, index) => {
    const medal =
      index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
    content += `\n\n${medal} ${index + 1}. ${video.title || 'غير محدد'}`;
    content += `\n   👁️ المشاهدات: ${video.viewCount || 0}`;
    content += `\n   📅 تاريخ الإنشاء: ${formatReportDate(video.createdAt)}`;
    content += `\n   🎥 المصدر: ${
      video.videoSource === 'youtube' ? 'YouTube' : 'Google Drive'
    }`;
  });

  return content;
};

// إنشاء تذييل التقرير
const createFooter = () => {
  const separator = createSeparator('═', 80);
  const timestamp = formatReportDateTime(new Date());
  const footerText = `📊 تم إنشاء هذا التقرير في: ${timestamp}`;
  const padding = Math.max(0, (80 - footerText.length) / 2);
  const centeredFooter = ' '.repeat(Math.floor(padding)) + footerText;

  return `\n\n${separator}\n${centeredFooter}\n${separator}`;
};

// تصدير الإحصائيات إلى TXT
export const exportStatisticsToTXT = async (
  stats,
  accessCodes = [],
  sections = [],
  videos = []
) => {
  try {
    let content = '';

    // العنوان الرئيسي
    content += createTitle('تقرير الإحصائيات الشامل', '📊');

    // معلومات التقرير
    content += `\n\n📅 تاريخ التقرير: ${formatReportDateTime(new Date())}`;
    content += `\n🏢 اسم المنصة: منصة التعلم الإلكتروني`;
    content += `\n📋 نوع التقرير: تقرير شامل`;

    // الإحصائيات العامة
    content += `\n\n${formatGeneralStats(stats)}`;

    // تفاصيل رموز الوصول
    if (accessCodes.length > 0) {
      content += `\n\n${formatAccessCodesDetails(accessCodes)}`;
    }

    // تفاصيل الأقسام
    if (sections.length > 0) {
      content += `\n\n${formatSectionsDetails(sections, videos)}`;
    }

    // الفيديوهات الأكثر مشاهدة
    if (videos.length > 0) {
      content += `\n\n${formatTopVideos(videos)}`;
    }

    // التذييل
    content += createFooter();

    // إنشاء اسم الملف
    const fileName = `تقرير_الإحصائيات_${
      new Date().toISOString().split('T')[0]
    }.txt`;

    // إنشاء وتحميل الملف
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'تم تصدير التقرير بصيغة TXT بنجاح! 📄✨',
    };
  } catch (error) {
    console.error('خطأ في تصدير TXT:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تصدير تقرير مخصص بصيغة TXT
export const exportCustomStatisticsToTXT = async (
  title,
  data,
  description = ''
) => {
  try {
    let content = '';

    // العنوان الرئيسي
    content += createTitle(title, '📋');

    // معلومات التقرير
    content += `\n\n📅 تاريخ التقرير: ${formatReportDateTime(new Date())}`;
    if (description) {
      content += `\n📝 الوصف: ${description}`;
    }

    // البيانات
    if (data && data.length > 0) {
      content += createSection('البيانات', '📊');

      data.forEach((item, index) => {
        content += `\n\n${index + 1}. `;
        Object.entries(item).forEach(([key, value], entryIndex) => {
          if (entryIndex === 0) {
            content += `🔹 ${key}: ${value}`;
          } else {
            content += `\n   📌 ${key}: ${value}`;
          }
        });

        if (index < data.length - 1) {
          content += `\n   ${createSeparator('·', 40)}`;
        }
      });
    }

    // التذييل
    content += createFooter();

    // إنشاء اسم الملف
    const fileName = `${title.replace(/\s+/g, '_')}_${
      new Date().toISOString().split('T')[0]
    }.txt`;

    // إنشاء وتحميل الملف
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'تم تصدير التقرير المخصص بصيغة TXT بنجاح! 📄✨',
    };
  } catch (error) {
    console.error('خطأ في تصدير TXT المخصص:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// دالة مساعدة لتصدير قائمة بسيطة
export const exportSimpleListToTXT = async (title, items, emoji = '📋') => {
  try {
    let content = '';

    content += createTitle(title, emoji);
    content += `\n\n📅 تاريخ التقرير: ${formatReportDateTime(new Date())}`;

    content += createSection('القائمة', '📝');

    items.forEach((item, index) => {
      content += `\n${index + 1}. ✅ ${item}`;
    });

    content += createFooter();

    const fileName = `${title.replace(/\s+/g, '_')}_${
      new Date().toISOString().split('T')[0]
    }.txt`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'تم تصدير القائمة بصيغة TXT بنجاح! 📄✨',
    };
  } catch (error) {
    console.error('خطأ في تصدير القائمة:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
