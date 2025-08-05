// PDF Export Service
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// إعداد الخط العربي
const setupArabicFont = doc => {
  // استخدام خط يدعم العربية
  doc.setFont('helvetica');
  doc.setFontSize(12);
};

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

// إنشاء رأس الصفحة
const addHeader = (doc, title) => {
  const pageWidth = doc.internal.pageSize.width;

  // خلفية الرأس
  doc.setFillColor(41, 128, 185); // أزرق
  doc.rect(0, 0, pageWidth, 40, 'F');

  // عنوان الرأس
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(title, pageWidth / 2, 25, { align: 'center' });

  // تاريخ التصدير
  doc.setFontSize(10);
  doc.text(`تاريخ التصدير: ${formatDateTime(new Date())}`, pageWidth - 20, 35, {
    align: 'right',
  });

  // إعادة تعيين اللون
  doc.setTextColor(0, 0, 0);
};

// إنشاء تذييل الصفحة
const addFooter = (doc, pageNumber, totalPages) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // خط التذييل
  doc.setDrawColor(200, 200, 200);
  doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

  // رقم الصفحة
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `صفحة ${pageNumber} من ${totalPages}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // اسم المنصة
  doc.text('أكرم ابراهيم', 20, pageHeight - 10);
};

// إضافة قسم الإحصائيات العامة
const addGeneralStats = (doc, stats, yPosition) => {
  const pageWidth = doc.internal.pageSize.width;
  let currentY = yPosition;

  // عنوان القسم
  doc.setFillColor(52, 152, 219);
  doc.rect(20, currentY, pageWidth - 40, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('الإحصائيات العامة', 25, currentY + 10);

  currentY += 25;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  // البيانات الإحصائية
  const generalData = [
    ['إجمالي رموز الوصول', stats.totalAccessCodes || 0],
    ['الحسابات النشطة', stats.activeAccounts || 0],
    ['الحسابات المعطلة', stats.inactiveAccounts || 0],
    ['إجمالي الأقسام', stats.totalSections || 0],
    ['الأقسام المرئية', stats.visibleSections || 0],
    ['الأقسام المخفية', stats.hiddenSections || 0],
    ['إجمالي الفيديوهات', stats.totalVideos || 0],
    ['الفيديوهات النشطة', stats.activeVideos || 0],
    ['الفيديوهات المخفية', stats.hiddenVideos || 0],
    ['إجمالي المشاهدات', stats.totalViews || 0],
  ];

  doc.autoTable({
    startY: currentY,
    head: [['البيان', 'العدد']],
    body: generalData,
    theme: 'striped',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontSize: 12,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 11,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 20, right: 20 },
  });

  return doc.lastAutoTable.finalY + 20;
};

// إضافة قسم تفاصيل رموز الوصول
const addAccessCodesDetails = (doc, accessCodes, yPosition) => {
  const pageWidth = doc.internal.pageSize.width;
  let currentY = yPosition;

  // التحقق من المساحة المتاحة
  if (currentY > 250) {
    doc.addPage();
    addHeader(doc, 'تقرير الإحصائيات - تفاصيل رموز الوصول');
    currentY = 50;
  }

  // عنوان القسم
  doc.setFillColor(46, 204, 113);
  doc.rect(20, currentY, pageWidth - 40, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('تفاصيل رموز الوصول', 25, currentY + 10);

  currentY += 25;
  doc.setTextColor(0, 0, 0);

  // تحضير البيانات
  const accessCodesData = accessCodes
    .slice(0, 20)
    .map(code => [
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

// إضافة قسم تفاصيل الأقسام والفيديوهات
const addSectionsDetails = (doc, sections, videos, yPosition) => {
  let currentY = yPosition;

  // التحقق من المساحة المتاحة
  if (currentY > 250) {
    doc.addPage();
    addHeader(doc, 'تقرير الإحصائيات - تفاصيل الأقسام');
    currentY = 50;
  }

  const pageWidth = doc.internal.pageSize.width;

  // عنوان القسم
  doc.setFillColor(155, 89, 182);
  doc.rect(20, currentY, pageWidth - 40, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('تفاصيل الأقسام والفيديوهات', 25, currentY + 10);

  currentY += 25;
  doc.setTextColor(0, 0, 0);

  // تحضير البيانات
  const sectionsData = sections.map(section => {
    const sectionVideos = videos.filter(
      video => video.sectionId === section.id
    );
    const totalViews = sectionVideos.reduce(
      (sum, video) => sum + (video.viewCount || 0),
      0
    );

    return [
      section.title || 'غير محدد',
      sectionVideos.length,
      totalViews,
      section.password ? 'محمي' : 'مفتوح',
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

// إضافة رسم بياني بسيط (نصي)
const addSimpleChart = (doc, data, title, yPosition) => {
  let currentY = yPosition;
  const pageWidth = doc.internal.pageSize.width;

  // التحقق من المساحة المتاحة
  if (currentY > 220) {
    doc.addPage();
    addHeader(doc, 'تقرير الإحصائيات - الرسوم البيانية');
    currentY = 50;
  }

  // عنوان الرسم البياني
  doc.setFillColor(231, 76, 60);
  doc.rect(20, currentY, pageWidth - 40, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(title, 25, currentY + 10);

  currentY += 25;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  // رسم الأعمدة البسيطة
  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = (pageWidth - 80) / data.length;
  const maxBarHeight = 80;

  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * maxBarHeight;
    const x = 30 + index * barWidth;
    const y = currentY + maxBarHeight - barHeight;

    // رسم العمود
    doc.setFillColor(52, 152, 219);
    doc.rect(x, y, barWidth - 5, barHeight, 'F');

    // كتابة القيمة
    doc.setFontSize(10);
    doc.text(item.value.toString(), x + (barWidth - 5) / 2, y - 5, {
      align: 'center',
    });

    // كتابة التسمية
    doc.text(item.label, x + (barWidth - 5) / 2, currentY + maxBarHeight + 15, {
      align: 'center',
      maxWidth: barWidth - 5,
    });
  });

  return currentY + maxBarHeight + 30;
};

// الدالة الرئيسية لتصدير PDF
export const exportStatisticsToPDF = async data => {
  try {
    // إنشاء مستند PDF جديد
    const doc = new jsPDF('p', 'mm', 'a4');

    // إعداد الخط العربي
    setupArabicFont(doc);

    // إضافة الصفحة الأولى
    addHeader(doc, 'تقرير الإحصائيات الشامل');

    let currentY = 50;

    // إضافة الإحصائيات العامة
    const stats = {
      totalAccessCodes: data.accessCodes?.length || 0,
      activeAccounts:
        data.accessCodes?.filter(code => code.isActive).length || 0,
      inactiveAccounts:
        data.accessCodes?.filter(code => !code.isActive).length || 0,
      totalSections: data.sections?.length || 0,
      visibleSections:
        data.sections?.filter(section => !section.isHidden).length || 0,
      hiddenSections:
        data.sections?.filter(section => section.isHidden).length || 0,
      totalVideos: data.videos?.length || 0,
      activeVideos:
        data.videos?.filter(video => video.isActive && !video.isHidden)
          .length || 0,
      hiddenVideos: data.videos?.filter(video => video.isHidden).length || 0,
      totalViews:
        data.videos?.reduce((sum, video) => sum + (video.viewCount || 0), 0) ||
        0,
    };

    currentY = addGeneralStats(doc, stats, currentY);

    // إضافة رسم بياني للحسابات
    const accountsChartData = [
      { label: 'نشط', value: stats.activeAccounts },
      { label: 'معطل', value: stats.inactiveAccounts },
    ];
    currentY = addSimpleChart(
      doc,
      accountsChartData,
      'توزيع حالة الحسابات',
      currentY
    );

    // إضافة تفاصيل رموز الوصول
    if (data.accessCodes && data.accessCodes.length > 0) {
      currentY = addAccessCodesDetails(doc, data.accessCodes, currentY);
    }

    // إضافة تفاصيل الأقسام
    if (data.sections && data.sections.length > 0) {
      currentY = addSectionsDetails(
        doc,
        data.sections,
        data.videos || [],
        currentY
      );
    }

    // إضافة رسم بياني للأقسام
    if (data.sections && data.sections.length > 0) {
      const sectionsChartData = [
        { label: 'ظاهر', value: stats.visibleSections },
        { label: 'مخفي', value: stats.hiddenSections },
      ];
      currentY = addSimpleChart(
        doc,
        sectionsChartData,
        'توزيع رؤية الأقسام',
        currentY
      );
    }

    // إضافة أرقام الصفحات
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(doc, i, totalPages);
    }

    // حفظ الملف
    const fileName = `تقرير_الإحصائيات_${
      new Date().toISOString().split('T')[0]
    }.pdf`;
    doc.save(fileName);

    return {
      success: true,
      message: 'تم تصدير التقرير بنجاح',
      fileName: fileName,
    };
  } catch (error) {
    console.error('خطأ في تصدير PDF:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// تصدير إحصائيات مخصصة
export const exportCustomStatistics = async (title, data, chartData = null) => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    setupArabicFont(doc);

    addHeader(doc, title);
    let currentY = 50;

    // إضافة البيانات في جدول
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

    // إضافة رسم بياني إذا توفر
    if (chartData) {
      addSimpleChart(doc, chartData, 'الرسم البياني', currentY);
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
      fileName: fileName,
    };
  } catch (error) {
    console.error('خطأ في تصدير PDF المخصص:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
