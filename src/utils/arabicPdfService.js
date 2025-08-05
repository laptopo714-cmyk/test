// Arabic PDF Export Service with proper encoding support
import html2pdf from 'html2pdf.js';

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

// إنشاء HTML للتقرير مع دعم العربية الكامل
const createReportHTML = (
  title,
  stats,
  accessCodes = [],
  sections = [],
  videos = []
) => {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Cairo', 'Amiri', 'Arial', sans-serif;
          direction: rtl;
          text-align: right;
          line-height: 1.8;
          color: #333;
          background: white;
          font-size: 16px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          background: linear-gradient(135deg, #2980b9, #3498db);
          color: white;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
          border-radius: 10px;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .header .date {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .section {
          margin-bottom: 30px;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-right: 4px solid #3498db;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #ecf0f1;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .stat-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #2980b9;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #7f8c8d;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .table th {
          background: #34495e;
          color: white;
          padding: 12px;
          text-align: center;
          font-weight: 600;
        }
        
        .table td {
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ecf0f1;
        }
        
        .table tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        .table tr:hover {
          background: #e3f2fd;
        }
        
        .status-active {
          background: #27ae60;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .status-inactive {
          background: #e74c3c;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .footer {
          text-align: center;
          margin-top: 40px;
          padding: 20px;
          background: #ecf0f1;
          border-radius: 8px;
          color: #7f8c8d;
        }
        
        @media print {
          body { font-size: 12px; }
          .header { break-inside: avoid; }
          .section { break-inside: avoid; }
          .table { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>${title}</h1>
          <div class="date">تاريخ التقرير: ${formatDateTime(new Date())}</div>
        </div>

        <!-- General Statistics -->
        <div class="section">
          <h2 class="section-title">الإحصائيات العامة</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${stats.totalAccessCodes || 0}</div>
              <div class="stat-label">إجمالي رموز الوصول</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.activeAccounts || 0}</div>
              <div class="stat-label">الحسابات النشطة</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.inactiveAccounts || 0}</div>
              <div class="stat-label">الحسابات المعطلة</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.totalSections || 0}</div>
              <div class="stat-label">إجمالي الأقسام</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.totalVideos || 0}</div>
              <div class="stat-label">إجمالي الفيديوهات</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.totalViews || 0}</div>
              <div class="stat-label">إجمالي المشاهدات</div>
            </div>
          </div>
        </div>

        ${
          accessCodes.length > 0
            ? `
        <!-- Access Codes Details -->
        <div class="section">
          <h2 class="section-title">تفاصيل رموز الوصول</h2>
          <table class="table">
            <thead>
              <tr>
                <th>الرمز</th>
                <th>اسم الطالب</th>
                <th>الفئة</th>
                <th>الحالة</th>
                <th>تاريخ الانتهاء</th>
                <th>آخر دخول</th>
              </tr>
            </thead>
            <tbody>
              ${accessCodes
                .map(
                  code => `
                <tr>
                  <td>${code.code || 'غير محدد'}</td>
                  <td>${code.studentName || 'غير محدد'}</td>
                  <td>${code.category || 'عام'}</td>
                  <td>
                    <span class="${
                      code.isActive ? 'status-active' : 'status-inactive'
                    }">
                      ${code.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td>${
                    code.expiryDate
                      ? formatDate(code.expiryDate.toDate())
                      : 'دائم'
                  }</td>
                  <td>${formatDateTime(code.lastLoginAt)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
        `
            : ''
        }

        ${
          sections.length > 0
            ? `
        <!-- Sections Details -->
        <div class="section">
          <h2 class="section-title">تفاصيل الأقسام</h2>
          <table class="table">
            <thead>
              <tr>
                <th>اسم القسم</th>
                <th>عدد الفيديوهات</th>
                <th>إجمالي المشاهدات</th>
                <th>الحماية</th>
                <th>الرؤية</th>
                <th>تاريخ الإنشاء</th>
              </tr>
            </thead>
            <tbody>
              ${sections
                .map(section => {
                  const sectionVideos = videos.filter(
                    v => v.sectionId === section.id
                  );
                  const totalViews = sectionVideos.reduce(
                    (sum, v) => sum + (v.views || 0),
                    0
                  );
                  return `
                  <tr>
                    <td>${section.title || 'غير محدد'}</td>
                    <td>${sectionVideos.length}</td>
                    <td>${totalViews}</td>
                    <td>${section.requiresAccessCode ? 'محمي' : 'مفتوح'}</td>
                    <td>${section.isHidden ? 'مخفي' : 'ظاهر'}</td>
                    <td>${formatDate(section.createdAt)}</td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
        `
            : ''
        }

        <!-- Footer -->
        <div class="footer">
          <p>تم إنشاء هذا التقرير بواسطة أكرم ابراهيم</p>
          <p>جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// تصدير الإحصائيات إلى PDF مع دعم العربية
export const exportStatisticsToPDF = async (
  stats,
  accessCodes = [],
  sections = [],
  videos = []
) => {
  try {
    const title = 'تقرير الإحصائيات الشامل';
    const htmlContent = createReportHTML(
      title,
      stats,
      accessCodes,
      sections,
      videos
    );

    // إنشاء عنصر مؤقت لعرض المحتوى
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '800px';
    document.body.appendChild(tempDiv);

    // انتظار تحميل الخطوط
    await new Promise(resolve => setTimeout(resolve, 2000));

    const options = {
      margin: 0.5,
      filename: `تقرير_الإحصائيات_${
        new Date().toISOString().split('T')[0]
      }.pdf`,
      image: {
        type: 'jpeg',
        quality: 1.0,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: tempDiv.scrollHeight,
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
    };

    try {
      await html2pdf().set(options).from(tempDiv).save();
      document.body.removeChild(tempDiv);
    } catch (error) {
      document.body.removeChild(tempDiv);
      throw error;
    }

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
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
          
          body {
            font-family: 'Cairo', 'Arial', sans-serif;
            direction: rtl;
            text-align: right;
            line-height: 1.6;
            color: #333;
            background: white;
            margin: 0;
            padding: 20px;
          }
          
          .header {
            background: linear-gradient(135deg, #2980b9, #3498db);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
            border-radius: 10px;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .table th {
            background: #34495e;
            color: white;
            padding: 12px;
            text-align: center;
            font-weight: 600;
          }
          
          .table td {
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #ecf0f1;
          }
          
          .table tr:nth-child(even) {
            background: #f8f9fa;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <div>تاريخ التقرير: ${formatDateTime(new Date())}</div>
        </div>
        
        ${
          data && data.length > 0
            ? `
          <table class="table">
            <thead>
              <tr>
                ${Object.keys(data[0])
                  .map(key => `<th>${key}</th>`)
                  .join('')}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  item => `
                <tr>
                  ${Object.values(item)
                    .map(value => `<td>${value}</td>`)
                    .join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        `
            : '<p>لا توجد بيانات للعرض</p>'
        }
      </body>
      </html>
    `;

    // إنشاء عنصر مؤقت لعرض المحتوى
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '800px';
    document.body.appendChild(tempDiv);

    // انتظار تحميل الخطوط
    await new Promise(resolve => setTimeout(resolve, 2000));

    const options = {
      margin: 0.5,
      filename: `${title.replace(/\s+/g, '_')}_${
        new Date().toISOString().split('T')[0]
      }.pdf`,
      image: {
        type: 'jpeg',
        quality: 1.0,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: tempDiv.scrollHeight,
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
    };

    try {
      await html2pdf().set(options).from(tempDiv).save();
      document.body.removeChild(tempDiv);
    } catch (error) {
      document.body.removeChild(tempDiv);
      throw error;
    }

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
