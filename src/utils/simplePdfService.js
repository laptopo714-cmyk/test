// Simple PDF Export Service - Alternative approach
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// تنسيق التاريخ
const formatDate = date => {
  if (!date) return 'غير محدد';
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// تنسيق الوقت
const formatDateTime = date => {
  if (!date) return 'غير محدد';
  return new Date(date).toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// إعداد الخط العربي
const setupArabicFont = doc => {
  // استخدام خط يدعم العربية
  doc.setFont('helvetica');
  doc.setFontSize(12);
};

// إضافة عنوان الصفحة
const addHeader = (doc, title) => {
  setupArabicFont(doc);
  const pageWidth = doc.internal.pageSize.width;

  // خلفية العنوان
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // نص العنوان
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(title, pageWidth / 2, 25, { align: 'center' });

  // التاريخ
  doc.setFontSize(12);
  doc.text(`تاريخ التقرير: ${formatDateTime(new Date())}`, pageWidth / 2, 35, {
    align: 'center',
  });

  return 50; // موضع Y التالي
};

// إضافة تذييل الصفحة
const addFooter = (doc, pageNumber, totalPages) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  doc.setTextColor(128, 128, 128);
  doc.setFontSize(10);
  doc.text(
    `صفحة ${pageNumber} من ${totalPages}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};

// إضافة الإحصائيات العامة
const addGeneralStats = (doc, stats, yPosition) => {
  let currentY = yPosition;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text('الإحصائيات العامة', 20, currentY);
  currentY += 20;

  const statsData = [
    ['إجمالي رموز الوصول', stats.totalAccessCodes || 0],
    ['الحسابات النشطة', stats.activeAccounts || 0],
    ['الحسابات المعطلة', stats.inactiveAccounts || 0],
    ['إجمالي الأقسام', stats.totalSections || 0],
    ['إجمالي الفيديوهات', stats.totalVideos || 0],
    ['إجمالي المشاهدات', stats.totalViews || 0],
  ];

  doc.autoTable({
    startY: currentY,
    head: [['الإحصائية', 'القيمة']],
    body: statsData,
    theme: 'striped',
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: [255, 255, 255],
      fontSize: 12,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 11,
      halign: 'center',
    },
    margin: { left: 20, right: 20 },
  });

  return doc.lastAutoTable.finalY + 20;
};

// إضافة تفاصيل رموز الوصول
const addAccessCodesDetails = (doc, accessCodes, yPosition) => {
  if (!accessCodes || accessCodes.length === 0) {
    return yPosition;
  }

  let currentY = yPosition;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text('تفاصيل رموز الوصول', 20, currentY);
  currentY += 20;

  const accessCodesData = accessCodes.map(code => [
    code.code || 'غير محدد',
    code.studentName || 'غير محدد',
    code.category || 'عام',
    code.isActive ? 'نشط' : 'معطل',
    code.expiryDate ? formatDate(code.expiryDate.toDate()) : 'دائم',
    formatDateTime(code.lastLoginAt),
  ]);

  doc.autoTable({
    startY: currentY,
    head: [
      ['الرمز', 'اسم الطالب', 'الفئة', 'الحالة', 'تاريخ الانتهاء', 'آخر دخول'],
    ],
    body: accessCodesData,
    theme: 'striped',
    headStyles: {
      fillColor: [46, 204, 113],
      textColor: [255, 255, 255],
      fontSize: 10,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 9,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 30 },
      5: { cellWidth: 35 },
    },
  });

  return doc.lastAutoTable.finalY + 20;
};

// إضافة تفاصيل الأقسام
const addSectionsDetails = (doc, sections, videos, yPosition) => {
  if (!sections || sections.length === 0) {
    return yPosition;
  }

  let currentY = yPosition;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text('تفاصيل الأقسام', 20, currentY);
  currentY += 20;

  const sectionsData = sections.map(section => {
    const sectionVideos = videos.filter(v => v.sectionId === section.id);
    const totalViews = sectionVideos.reduce(
      (sum, v) => sum + (v.views || 0),
      0
    );

    return [
      section.title || 'غير محدد',
      sectionVideos.length.toString(),
      totalViews.toString(),
      section.requiresAccessCode ? 'محمي' : 'مفتوح',
      section.isHidden ? 'مخفي' : 'ظاهر',
      formatDate(section.createdAt),
    ];
  });

  doc.autoTable({
    startY: currentY,
    head: [
      [
        'اسم القسم',
        'عدد الفيديوهات',
        'إجمالي المشاهدات',
        'الحماية',
        'الرؤية',
        'تاريخ الإنشاء',
      ],
    ],
    body: sectionsData,
    theme: 'striped',
    headStyles: {
      fillColor: [155, 89, 182],
      textColor: [255, 255, 255],
      fontSize: 10,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 9,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 35 },
    },
  });

  return doc.lastAutoTable.finalY + 20;
};

// تصدير الإحصائيات إلى PDF
export const exportStatisticsToPDF = async (
  stats,
  accessCodes = [],
  sections = [],
  videos = []
) => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    let currentY = 0;

    // إضافة العنوان
    currentY = addHeader(doc, 'تقرير الإحصائيات الشامل');

    // إضافة الإحصائيات العامة
    currentY = addGeneralStats(doc, stats, currentY);

    // التحقق من الحاجة لصفحة جديدة
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    // إضافة تفاصيل رموز الوصول
    if (accessCodes.length > 0) {
      currentY = addAccessCodesDetails(doc, accessCodes, currentY);
    }

    // التحقق من الحاجة لصفحة جديدة
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    // إضافة تفاصيل الأقسام
    if (sections.length > 0) {
      currentY = addSectionsDetails(doc, sections, videos, currentY);
    }

    // إضافة أرقام الصفحات
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(doc, i, totalPages);
    }

    const fileName = `تقرير_الإحصائيات_${
      new Date().toISOString().split('T')[0]
    }.pdf`;
    doc.save(fileName);

    return {
      success: true,
      message: 'تم تصدير التقرير بنجاح',
    };
  } catch (error) {
    console.error('خطأ في تصدير PDF:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تصدير تقرير مخصص
export const exportCustomStatistics = async (title, data, chartData = null) => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    let currentY = 0;

    // إضافة العنوان
    currentY = addHeader(doc, title);

    // إضافة البيانات إذا توفرت
    if (data && data.length > 0) {
      doc.autoTable({
        startY: currentY,
        head: [Object.keys(data[0])],
        body: data.map(item => Object.values(item)),
        theme: 'striped',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontSize: 12,
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 10,
          halign: 'center',
        },
        margin: { left: 20, right: 20 },
      });

      currentY = doc.lastAutoTable.finalY + 20;
    }

    // إضافة أرقام الصفحات
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(doc, i, totalPages);
    }

    const fileName = `${title.replace(/\s+/g, '_')}_${
      new Date().toISOString().split('T')[0]
    }.pdf`;
    doc.save(fileName);

    return {
      success: true,
      message: 'تم تصدير التقرير المخصص بنجاح',
    };
  } catch (error) {
    console.error('خطأ في تصدير PDF المخصص:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
