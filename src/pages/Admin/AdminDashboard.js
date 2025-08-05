// Advanced Admin Dashboard
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  People,
  VideoLibrary,
  Notifications,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Send,
  Code,
  Security,
  Analytics,
  Settings,
  Refresh,
  Attachment,
  DevicesOther,
  LockOpen,
} from '@mui/icons-material';
import {
  getAllAccessCodes,
  createAccessCode,
  updateAccessCode,
  deleteAccessCode,
  toggleAccessCode,
  assignVideosToStudent,
  resetDeviceForAccessCode,
} from '../../firebase/accessCodes';
import {
  getAllSections,
  getAllVideos,
  createSection,
  createVideo,
  updateSection,
  updateVideo,
  deleteSection,
  deleteVideo,
  toggleVideoVisibility,
  toggleSectionVisibility,
  extractGoogleDriveId,
  extractYouTubeId,
  removeSectionPassword,
  removeVideoPassword,
} from '../../firebase/videoService';
import {
  sendNotificationToAll,
  sendNotificationToSelected,
  sendNotificationToCategory,
  getAllNotifications,
} from '../../firebase/notificationService';
import {
  createTestAccessCode,
  createMultipleTestCodes,
} from '../../utils/createTestAccessCode';
import {
  formatDate,
  formatDateTime,
  isDateExpired,
} from '../../utils/dateUtils';
import {
  exportStatisticsToTXT,
  exportCustomStatisticsToTXT,
} from '../../utils/txtExportService';
import { cleanAttachedFiles } from '../../utils/firebaseUtils';
import {
  uploadFileToGofile,
  uploadMultipleFiles,
  deleteFileFromGofile,
  formatFileSize,
  validateGofileLink,
} from '../../utils/gofileService';
import NotificationManagement from '../../components/Admin/NotificationManagement';
import SentNotificationsView from '../../components/Admin/SentNotificationsView';

// مكون بطاقة الإحصائيات
const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card
    sx={{
      height: '100%',
      borderRadius: 2,
      boxShadow: 3,
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      },
    }}
  >
    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'center' },
          justifyContent: { xs: 'center', sm: 'space-between' },
          textAlign: { xs: 'center', sm: 'left' },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box sx={{ order: { xs: 2, sm: 1 } }}>
          <Typography
            color="text.secondary"
            gutterBottom
            variant="body2"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              mb: { xs: 0.5, sm: 1 },
              fontWeight: 'medium',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h3"
            component="div"
            color={`${color}.main`}
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.5rem' },
              fontWeight: 'bold',
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            color: `${color}.main`,
            order: { xs: 1, sm: 2 },
            opacity: 0.8,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [accessCodes, setAccessCodes] = useState([]);
  const [sections, setSections] = useState([]);
  const [videos, setVideos] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // دالة مساعدة للتعامل مع التواريخ بأمان
  const safeFormatDate = dateValue => {
    if (!dateValue) return 'دائم';

    try {
      // إذا كان Firebase Timestamp
      if (dateValue && typeof dateValue.toDate === 'function') {
        return formatDate(dateValue.toDate());
      }
      // إذا كان Date object عادي
      else if (dateValue instanceof Date) {
        return formatDate(dateValue);
      }
      // إذا كان string
      else if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return formatDate(date);
        }
      }
      // إذا كان timestamp number
      else if (typeof dateValue === 'number') {
        return formatDate(new Date(dateValue));
      }

      return 'دائم';
    } catch (error) {
      console.warn('خطأ في تنسيق التاريخ:', error);
      return 'دائم';
    }
  };

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // حالات الملفات المرفقة
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // حالة التحديث
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // دالة تحديث البيانات المحسنة
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadAllData();

      // إرسال إشارة تحديث للطلاب (عبر localStorage)
      const refreshSignal = {
        timestamp: Date.now(),
        type: 'admin_refresh',
        clearPasswordCache: true, // إشارة لمسح ذاكرة التخزين المؤقت لكلمات المرور
      };
      localStorage.setItem(
        'admin_refresh_signal',
        JSON.stringify(refreshSignal)
      );

      // إضافة تنبيه نجاح
      alert('تم تحديث البيانات بنجاح!');
    } catch (error) {
      console.error('خطأ في تحديث البيانات:', error);
      alert('حدث خطأ في تحديث البيانات');
    } finally {
      setIsRefreshing(false);
    }
  };

  // حساب تاريخ انتهاء الصلاحية
  const calculateExpiryDate = period => {
    const now = new Date();
    switch (period) {
      case '1month':
        return new Date(now.setMonth(now.getMonth() + 1));
      case '2months':
        return new Date(now.setMonth(now.getMonth() + 2));
      case '3months':
        return new Date(now.setMonth(now.getMonth() + 3));
      case '6months':
        return new Date(now.setMonth(now.getMonth() + 6));
      case '1year':
        return new Date(now.setFullYear(now.getFullYear() + 1));
      default:
        return null;
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [codesResult, sectionsResult, videosResult, notificationsResult] =
        await Promise.all([
          getAllAccessCodes(),
          getAllSections(),
          getAllVideos(),
          getAllNotifications(),
        ]);

      if (codesResult.success) setAccessCodes(codesResult.codes);
      if (sectionsResult.success) setSections(sectionsResult.sections);
      if (videosResult.success) setVideos(videosResult.videos);
      if (notificationsResult.success)
        setNotifications(notificationsResult.notifications);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  // إنشاء رموز وصول تجريبية
  const handleCreateTestCodes = async () => {
    if (!window.confirm('هل تريد إنشاء 3 رموز وصول تجريبية؟')) return;

    setSubmitting(true);
    try {
      const results = await createMultipleTestCodes(3);
      const successCount = results.filter(r => r.success).length;

      if (successCount > 0) {
        alert(`تم إنشاء ${successCount} رموز وصول تجريبية بنجاح!`);
        loadAllData(); // إعادة تحميل البيانات
      } else {
        alert('فشل في إنشاء رموز الوصول');
      }
    } catch (error) {
      console.error('خطأ في إنشاء رموز الوصول:', error);
      alert('حدث خطأ في إنشاء رموز الوصول');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openCreateDialog = type => {
    setDialogType(type);
    setSelectedItem(null);
    setFormData({});
    setAttachedFiles([]); // إعادة تعيين الملفات المرفقة
    setUploadProgress(0);
    setIsUploading(false);
    setOpenDialog(true);
  };

  const openEditDialog = (type, item) => {
    setDialogType(type);
    setSelectedItem(item);
    setFormData(item);

    // تحميل الملفات المرفقة إذا كان نوع الحوار فيديو
    if (type === 'editVideo' && item.attachedFiles) {
      setAttachedFiles(item.attachedFiles || []);
    } else {
      setAttachedFiles([]);
    }

    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setDialogType('');
    setSelectedItem(null);
    setFormData({});
    setAttachedFiles([]);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let result;

      switch (dialogType) {
        case 'createAccessCode':
          result = await createAccessCode(formData);
          break;
        case 'editAccessCode':
          result = await updateAccessCode(selectedItem.id, formData);
          break;
        case 'createSection':
          result = await createSection(formData);
          break;
        case 'editSection':
          result = await updateSection(selectedItem.id, formData);
          break;
        case 'createVideo':
          // التحقق من الحقول المطلوبة
          if (
            !formData.title ||
            !formData.sectionId ||
            (!formData.googleDriveUrl && !formData.youtubeUrl)
          ) {
            alert(
              'يرجى ملء جميع الحقول المطلوبة (العنوان، القسم، رابط الفيديو)'
            );
            setSubmitting(false);
            return;
          }

          // تحديد مصدر الفيديو ومعالجة الرابط
          if (formData.googleDriveUrl) {
            const driveId = extractGoogleDriveId(formData.googleDriveUrl);
            if (driveId) {
              formData.googleDriveId = driveId;
              formData.videoSource = 'googleDrive';
            } else {
              alert('رابط Google Drive غير صحيح. يرجى التأكد من الرابط.');
              setSubmitting(false);
              return;
            }
          } else if (formData.youtubeUrl) {
            const youtubeId = extractYouTubeId(formData.youtubeUrl);
            if (youtubeId) {
              formData.youtubeId = youtubeId;
              formData.videoSource = 'youtube';
            } else {
              alert('رابط YouTube غير صحيح. يرجى التأكد من الرابط.');
              setSubmitting(false);
              return;
            }
          }

          // إضافة الملفات المرفقة
          formData.attachedFiles = attachedFiles;
          result = await createVideo(formData);
          break;
        case 'editVideo':
          // معالجة روابط الفيديو
          if (formData.googleDriveUrl) {
            const driveId = extractGoogleDriveId(formData.googleDriveUrl);
            if (driveId) {
              formData.googleDriveId = driveId;
              formData.videoSource = 'googleDrive';
              // مسح بيانات YouTube
              delete formData.youtubeId;
              delete formData.youtubeUrl;
            } else {
              alert('رابط Google Drive غير صحيح');
              setSubmitting(false);
              return;
            }
          } else if (formData.youtubeUrl) {
            const youtubeId = extractYouTubeId(formData.youtubeUrl);
            if (youtubeId) {
              formData.youtubeId = youtubeId;
              formData.videoSource = 'youtube';
              // مسح بيانات Google Drive
              delete formData.googleDriveId;
              delete formData.googleDriveUrl;
            } else {
              alert('رابط YouTube غير صحيح');
              setSubmitting(false);
              return;
            }
          }

          // إضافة الملفات المرفقة بشكل آمن
          if (attachedFiles && attachedFiles.length > 0) {
            const cleanedFiles = cleanAttachedFiles(attachedFiles);
            if (cleanedFiles.length > 0) {
              formData.attachedFiles = cleanedFiles;
            }
          }

          // إزالة أي حقول فارغة أو undefined من formData (عدا كلمة المرور)
          Object.keys(formData).forEach(key => {
            // معالجة خاصة لكلمة المرور - نحتفظ بالقيمة الفارغة لحذفها من قاعدة البيانات
            if (key === 'password') {
              // إذا كانت كلمة المرور فارغة، نتركها كما هي لتتم معالجتها في الخلفية
              return;
            }

            if (
              formData[key] === undefined ||
              formData[key] === null ||
              formData[key] === ''
            ) {
              delete formData[key];
            }
          });

          console.log('بيانات الفيديو قبل الإرسال:', formData);

          result = await updateVideo(selectedItem.id, formData);
          break;
        case 'sendNotification':
          if (formData.targetType === 'all') {
            result = await sendNotificationToAll(formData);
          } else if (formData.targetType === 'category') {
            result = await sendNotificationToCategory(
              formData,
              formData.targetCategory
            );
          } else {
            result = await sendNotificationToSelected(
              formData,
              formData.selectedStudents || []
            );
          }
          break;
        default:
          break;
      }

      if (result?.success) {
        closeDialog();
        loadAllData();

        // إرسال إشارة تحديث للطلاب
        const refreshSignal = {
          timestamp: Date.now(),
          type: 'data_update',
          action: dialogType,
          clearPasswordCache: true, // مسح ذاكرة كلمات المرور عند أي تحديث
        };
        localStorage.setItem(
          'admin_refresh_signal',
          JSON.stringify(refreshSignal)
        );
      }
    } catch (error) {
      console.error('خطأ في العملية:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // تبديل رؤية الفيديو
  const handleToggleVideoVisibility = async videoId => {
    try {
      const result = await toggleVideoVisibility(videoId);
      if (result.success) {
        loadAllData(); // إعادة تحميل البيانات لتحديث الواجهة

        // إرسال إشارة تحديث للطلاب
        const refreshSignal = {
          timestamp: Date.now(),
          type: 'visibility_change',
          action: 'toggle_video_visibility',
          clearPasswordCache: true,
        };
        localStorage.setItem(
          'admin_refresh_signal',
          JSON.stringify(refreshSignal)
        );

        alert(result.message);
      } else {
        alert(`خطأ: ${result.error}`);
      }
    } catch (error) {
      console.error('خطأ في تبديل رؤية الفيديو:', error);
      alert('حدث خطأ في تبديل رؤية الفيديو');
    }
  };

  // تبديل رؤية القسم
  const handleToggleSectionVisibility = async sectionId => {
    try {
      const result = await toggleSectionVisibility(sectionId);
      if (result.success) {
        loadAllData(); // إعادة تحميل البيانات لتحديث الواجهة

        // إرسال إشارة تحديث للطلاب
        const refreshSignal = {
          timestamp: Date.now(),
          type: 'visibility_change',
          action: 'toggle_section_visibility',
          clearPasswordCache: true,
        };
        localStorage.setItem(
          'admin_refresh_signal',
          JSON.stringify(refreshSignal)
        );

        alert(result.message);
      } else {
        alert(`خطأ: ${result.error}`);
      }
    } catch (error) {
      console.error('خطأ في تبديل رؤية القسم:', error);
      alert('حدث خطأ في تبديل رؤية القسم');
    }
  };

  // تصدير الإحصائيات الشاملة
  const handleExportStatistics = async () => {
    try {
      setSubmitting(true);

      const stats = {
        totalAccessCodes: accessCodes.length,
        activeAccounts: accessCodes.filter(code => code.isActive).length,
        inactiveAccounts: accessCodes.filter(code => !code.isActive).length,
        totalSections: sections.length,
        totalVideos: videos.length,
        totalViews: videos.reduce(
          (sum, video) => sum + (video.viewCount || 0),
          0
        ),
        totalNotifications: notifications.length,
      };

      const result = await exportStatisticsToTXT(
        stats,
        accessCodes,
        sections,
        videos
      );

      if (result.success) {
        alert(`✅ ${result.message}\nاسم الملف: ${result.fileName}`);
      } else {
        alert(`❌ خطأ في التصدير: ${result.error}`);
      }
    } catch (error) {
      console.error('خطأ في تصدير الإحصائيات:', error);
      alert('حدث خطأ في تصدير الإحصائيات');
    } finally {
      setSubmitting(false);
    }
  };

  // تصدير تقرير مخصص
  const handleExportCustomReport = async reportType => {
    try {
      setSubmitting(true);
      let title, data, chartData;

      switch (reportType) {
        case 'accessCodes':
          title = 'تقرير رموز الوصول';
          data = accessCodes.map(code => ({
            الرمز: code.code,
            'اسم الطالب': code.studentName,
            الفئة: code.category || 'عام',
            الحالة: code.isActive ? 'نشط' : 'معطل',
            'تاريخ الانتهاء': safeFormatDate(code.expiryDate),
          }));
          chartData = [
            { label: 'نشط', value: accessCodes.filter(c => c.isActive).length },
            {
              label: 'معطل',
              value: accessCodes.filter(c => !c.isActive).length,
            },
          ];
          break;

        case 'sections':
          title = 'تقرير الأقسام';
          data = sections.map(section => ({
            'اسم القسم': section.title,
            'عدد الفيديوهات': videos.filter(v => v.sectionId === section.id)
              .length,
            الحماية: section.password ? 'محمي' : 'مفتوح',
            الرؤية: section.isHidden ? 'مخفي' : 'ظاهر',
          }));
          chartData = [
            { label: 'ظاهر', value: sections.filter(s => !s.isHidden).length },
            { label: 'مخفي', value: sections.filter(s => s.isHidden).length },
          ];
          break;

        case 'videos':
          title = 'تقرير الفيديوهات';
          data = videos.map(video => ({
            'عنوان الفيديو': video.title,
            القسم:
              sections.find(s => s.id === video.sectionId)?.title || 'غير محدد',
            المشاهدات: video.viewCount || 0,
            الحالة: video.isActive ? 'نشط' : 'معطل',
            الرؤية: video.isHidden ? 'مخفي' : 'ظاهر',
          }));
          chartData = [
            { label: 'نشط', value: videos.filter(v => v.isActive).length },
            { label: 'معطل', value: videos.filter(v => !v.isActive).length },
          ];
          break;

        default:
          throw new Error('نوع التقرير غير مدعوم');
      }

      // استخدام خدمة TXT الجديدة
      const result = await exportCustomStatisticsToTXT(
        title,
        data,
        `تقرير ${title}`
      );

      if (result.success) {
        alert(`✅ ${result.message}\nاسم الملف: ${result.fileName}`);
      } else {
        alert(`❌ خطأ في التصدير: ${result.error}`);
      }
    } catch (error) {
      console.error('خطأ في تصدير التقرير المخصص:', error);
      alert('حدث خطأ في تصدير التقرير المخصص');
    } finally {
      setSubmitting(false);
    }
  };

  // رفع الملفات إلى Gofile
  const handleFileUpload = async files => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const result = await uploadMultipleFiles(Array.from(files), progress => {
        setUploadProgress(progress.overallProgress);
      });

      if (result.success) {
        const successfulUploads = result.results.filter(r => r.success);
        setAttachedFiles(prev => [
          ...prev,
          ...successfulUploads.map(upload => upload.data),
        ]);
        alert(`✅ تم رفع ${result.successCount} ملف بنجاح`);
      } else {
        alert(`❌ فشل في رفع ${result.failureCount} ملف`);
      }
    } catch (error) {
      console.error('خطأ في رفع الملفات:', error);
      alert('حدث خطأ أثناء رفع الملفات');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // حذف ملف مرفق
  const handleRemoveAttachedFile = async (fileIndex, fileId) => {
    try {
      if (fileId) {
        const result = await deleteFileFromGofile(fileId);
        if (!result.success) {
          console.warn('فشل في حذف الملف من Gofile:', result.error);
        }
      }

      setAttachedFiles(prev => prev.filter((_, index) => index !== fileIndex));
      alert('تم حذف الملف بنجاح');
    } catch (error) {
      console.error('خطأ في حذف الملف:', error);
      alert('حدث خطأ أثناء حذف الملف');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      let result;
      switch (type) {
        case 'accessCode':
          result = await deleteAccessCode(id);
          break;
        case 'section':
          result = await deleteSection(id);
          break;
        case 'video':
          result = await deleteVideo(id);
          break;
        default:
          break;
      }

      if (result?.success) {
        loadAllData();
      }
    } catch (error) {
      console.error('خطأ في الحذف:', error);
    }
  };

  const handleToggleAccessCode = async (id, isActive) => {
    try {
      const result = await toggleAccessCode(id, !isActive);
      if (result.success) {
        loadAllData();
      }
    } catch (error) {
      console.error('خطأ في تغيير الحالة:', error);
    }
  };

  // إعادة تعيين الجهاز لرمز الوصول
  const handleResetDevice = async (codeId, studentName) => {
    const confirmMessage = `هل أنت متأكد من إعادة تعيين الجهاز للطالب "${studentName}"؟\n\nسيتمكن الطالب من تسجيل الدخول من جهاز جديد بعد هذا الإجراء.`;

    if (!window.confirm(confirmMessage)) return;

    try {
      setSubmitting(true);
      const result = await resetDeviceForAccessCode(codeId);

      if (result.success) {
        alert(`✅ ${result.message}`);
        loadAllData(); // إعادة تحميل البيانات لتحديث الجدول
      } else {
        alert(`❌ خطأ: ${result.error}`);
      }
    } catch (error) {
      console.error('خطأ في إعادة تعيين الجهاز:', error);
      alert('❌ حدث خطأ أثناء إعادة تعيين الجهاز');
    } finally {
      setSubmitting(false);
    }
  };

  const AccessCodesTab = () => (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">إدارة رموز الوصول</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            startIcon={
              <Refresh
                sx={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                }}
              />
            }
          >
            {isRefreshing ? 'تحديث...' : 'تحديث'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Code />}
            onClick={handleCreateTestCodes}
            disabled={submitting}
            color="secondary"
          >
            {submitting ? 'جاري الإنشاء...' : 'إنشاء رموز تجريبية'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openCreateDialog('createAccessCode')}
          >
            إنشاء رمز جديد
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          overflowX: 'auto',
          maxHeight: { xs: '70vh', sm: '80vh' },
        }}
      >
        <Table sx={{ minWidth: { xs: 800, sm: 'auto' } }} stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  minWidth: { xs: 80, sm: 100 },
                }}
              >
                🎫 الرمز
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  minWidth: { xs: 120, sm: 150 },
                }}
              >
                👤 اسم الطالب
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  minWidth: { xs: 80, sm: 100 },
                  display: { xs: 'none', sm: 'table-cell' },
                }}
              >
                🏷️ الفئة
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  minWidth: { xs: 100, sm: 120 },
                  display: { xs: 'none', md: 'table-cell' },
                }}
              >
                📱 رقم الهاتف
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  minWidth: 80,
                }}
              >
                🔄 الحالة
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  minWidth: 80,
                  display: { xs: 'none', lg: 'table-cell' },
                }}
              >
                📱 الجهاز
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  minWidth: { xs: 100, sm: 140 },
                  display: { xs: 'none', md: 'table-cell' },
                }}
              >
                🕐 آخر دخول
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  minWidth: { xs: 100, sm: 120 },
                  display: { xs: 'none', sm: 'table-cell' },
                }}
              >
                📅 تاريخ الانتهاء
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  minWidth: 100,
                }}
              >
                ⚙️ الإجراءات
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accessCodes.map(code => (
              <TableRow
                key={code.id}
                sx={{
                  '&:hover': { backgroundColor: 'grey.50' },
                  '&:nth-of-type(odd)': { backgroundColor: 'grey.25' },
                }}
              >
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  <Chip
                    label={code.code}
                    color="primary"
                    size="small"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    maxWidth: { xs: 100, sm: 'none' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {code.studentName}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {code.category ? (
                    <Chip
                      label={code.category}
                      color="secondary"
                      size="small"
                      sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    maxWidth: { xs: 80, sm: 'none' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {code.phoneNumber || '-'}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={code.isActive}
                    onChange={() =>
                      handleToggleAccessCode(code.id, code.isActive)
                    }
                    color="success"
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {code.deviceId ? (
                    <Chip
                      label="مرتبط"
                      color="success"
                      size="small"
                      sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
                    />
                  ) : (
                    <Chip
                      label="غير مرتبط"
                      color="default"
                      size="small"
                      sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
                    />
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    maxWidth: { xs: 80, sm: 'none' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {formatDateTime(code.lastLoginAt)}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {code.expiryDate ? (
                    <Chip
                      label={formatDate(code.expiryDate)}
                      color={
                        isDateExpired(code.expiryDate) ? 'error' : 'default'
                      }
                      size="small"
                      sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
                    />
                  ) : (
                    <Chip
                      label="دائم"
                      color="success"
                      size="small"
                      sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <IconButton
                      onClick={() => openEditDialog('editAccessCode', code)}
                      size="small"
                      color="primary"
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                      title="تعديل"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    {code.deviceId && (
                      <IconButton
                        onClick={() =>
                          handleResetDevice(code.id, code.studentName)
                        }
                        size="small"
                        color="warning"
                        sx={{ p: { xs: 0.5, sm: 1 } }}
                        title="تغيير الجهاز"
                        disabled={submitting}
                      >
                        <DevicesOther fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => handleDelete('accessCode', code.id)}
                      color="error"
                      size="small"
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                      title="حذف"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const NotificationsTab = () => (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">إدارة الإشعارات</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            startIcon={
              <Refresh
                sx={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                }}
              />
            }
          >
            {isRefreshing ? 'تحديث...' : 'تحديث'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={() => openCreateDialog('sendNotification')}
          >
            إرسال إشعار
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>العنوان</TableCell>
              <TableCell>الرسالة</TableCell>
              <TableCell>النوع</TableCell>
              <TableCell>الهدف</TableCell>
              <TableCell>الأولوية</TableCell>
              <TableCell>التاريخ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map(notification => (
              <TableRow key={notification.id}>
                <TableCell>{notification.title}</TableCell>
                <TableCell>{notification.message}</TableCell>
                <TableCell>
                  <Chip label={notification.type} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      notification.targetType === 'all'
                        ? 'الجميع'
                        : notification.targetType === 'category'
                        ? `فئة: ${notification.targetCategory}`
                        : 'محدد'
                    }
                    color={
                      notification.targetType === 'all'
                        ? 'primary'
                        : notification.targetType === 'category'
                        ? 'info'
                        : 'secondary'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={notification.priority}
                    color={
                      notification.priority === 'high' ? 'error' : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDateTime(notification.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Videos Tab Component
  const VideosTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        إدارة الفيديوهات والأقسام 🎥
      </Typography>

      {/* أزرار الإجراءات */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openCreateDialog('createSection')}
          >
            إضافة قسم جديد
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={() => openCreateDialog('createVideo')}
          >
            إضافة فيديو جديد
          </Button>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={handleRefreshData}
          disabled={isRefreshing}
          startIcon={
            <Refresh
              sx={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
          }
        >
          {isRefreshing ? 'تحديث...' : 'تحديث'}
        </Button>
      </Box>

      {/* جدول الأقسام */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        الأقسام ({sections.length})
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>العنوان</TableCell>
              <TableCell>الوصف</TableCell>
              <TableCell>الترتيب</TableCell>
              <TableCell>الحماية</TableCell>
              <TableCell>الرؤية</TableCell>
              <TableCell>عدد الفيديوهات</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map(section => (
              <TableRow key={section.id}>
                <TableCell>{section.title}</TableCell>
                <TableCell>{section.description || '-'}</TableCell>
                <TableCell>{section.order}</TableCell>
                <TableCell>
                  {section.password ? (
                    <Chip label="محمي" color="warning" size="small" />
                  ) : (
                    <Chip label="مفتوح" color="success" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={section.isHidden ? 'مخفي' : 'ظاهر'}
                    color={section.isHidden ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {videos.filter(v => v.sectionId === section.id).length}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleToggleSectionVisibility(section.id)}
                    color={section.isHidden ? 'success' : 'warning'}
                    title={section.isHidden ? 'إظهار القسم' : 'إخفاء القسم'}
                  >
                    {section.isHidden ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                  <IconButton
                    onClick={() => openEditDialog('editSection', section)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete('section', section.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* جدول الفيديوهات */}
      <Typography variant="h6" gutterBottom>
        الفيديوهات ({videos.length})
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>العنوان</TableCell>
              <TableCell>القسم</TableCell>
              <TableCell>المصدر</TableCell>
              <TableCell>المدة</TableCell>
              <TableCell>المشاهدات</TableCell>
              <TableCell>الحماية</TableCell>
              <TableCell>الملفات المرفقة</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map(video => (
              <TableRow key={video.id}>
                <TableCell>{video.title}</TableCell>
                <TableCell>
                  {sections.find(s => s.id === video.sectionId)?.title ||
                    'غير محدد'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      video.videoSource === 'googleDrive'
                        ? 'Google Drive'
                        : 'YouTube'
                    }
                    color={
                      video.videoSource === 'googleDrive' ? 'primary' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{video.duration || '-'}</TableCell>
                <TableCell>{video.viewCount || 0}</TableCell>
                <TableCell>
                  {video.password ? (
                    <Chip label="محمي" color="warning" size="small" />
                  ) : (
                    <Chip label="مفتوح" color="success" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  {video.attachedFiles && video.attachedFiles.length > 0 ? (
                    <Chip
                      label={`${video.attachedFiles.length} ملف`}
                      color="info"
                      size="small"
                      icon={<Attachment />}
                    />
                  ) : (
                    <Chip label="لا توجد ملفات" color="default" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      video.isActive
                        ? video.isHidden
                          ? 'مخفي'
                          : 'نشط'
                        : 'معطل'
                    }
                    color={
                      video.isActive
                        ? video.isHidden
                          ? 'warning'
                          : 'success'
                        : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleToggleVideoVisibility(video.id)}
                    color={video.isHidden ? 'success' : 'warning'}
                    title={video.isHidden ? 'إظهار الفيديو' : 'إخفاء الفيديو'}
                  >
                    {video.isHidden ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                  <IconButton
                    onClick={() => openEditDialog('editVideo', video)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete('video', video.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const SettingsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        إعدادات النظام والتقارير 📊
      </Typography>

      {/* تصدير الإحصائيات */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            📈 تصدير الإحصائيات والتقارير
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            قم بتصدير تقارير شاملة ومفصلة بتنسيق PDF احترافي
          </Typography>

          <Grid container spacing={2}>
            {/* تصدير التقرير الشامل */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  📋 التقرير الشامل
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  تقرير كامل يشمل جميع الإحصائيات والبيانات مع الرسوم البيانية
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExportStatistics}
                  disabled={submitting}
                  startIcon={
                    submitting ? <CircularProgress size={20} /> : <Add />
                  }
                  fullWidth
                >
                  {submitting ? 'جاري التصدير...' : 'تصدير التقرير الشامل'}
                </Button>
              </Card>
            </Grid>

            {/* تصدير تقرير رموز الوصول */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  👥 تقرير رموز الوصول
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  تقرير مفصل عن جميع رموز الوصول وحالتها
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleExportCustomReport('accessCodes')}
                  disabled={submitting}
                  startIcon={<People />}
                  fullWidth
                >
                  تصدير تقرير رموز الوصول
                </Button>
              </Card>
            </Grid>

            {/* تصدير تقرير الأقسام */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  📚 تقرير الأقسام
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  تقرير عن جميع الأقسام ومحتوياتها
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleExportCustomReport('sections')}
                  disabled={submitting}
                  startIcon={<VideoLibrary />}
                  fullWidth
                >
                  تصدير تقرير الأقسام
                </Button>
              </Card>
            </Grid>

            {/* تصدير تقرير الفيديوهات */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  🎥 تقرير الفيديوهات
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  تقرير مفصل عن جميع الفيديوهات والمشاهدات
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => handleExportCustomReport('videos')}
                  disabled={submitting}
                  startIcon={<VideoLibrary />}
                  fullWidth
                >
                  تصدير تقرير الفيديوهات
                </Button>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* إحصائيات عامة */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                إحصائيات عامة
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary">
                      {accessCodes.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      إجمالي رموز الوصول
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="secondary">
                      {accessCodes.filter(code => code.isActive).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      رموز نشطة
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="success.main">
                      {sections.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      إجمالي الأقسام
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="warning.main">
                      {videos.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      إجمالي الفيديوهات
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* إحصائيات الفئات */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                إحصائيات الفئات
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>الفئة</TableCell>
                      <TableCell align="right">عدد الطلاب</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(
                      accessCodes.reduce((acc, code) => {
                        const category = code.category || 'بدون فئة';
                        acc[category] = (acc[category] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([category, count]) => (
                      <TableRow key={category}>
                        <TableCell>{category}</TableCell>
                        <TableCell align="right">
                          <Chip label={count} size="small" color="primary" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* إحصائيات الأقسام المحمية */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                حالة الأقسام
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  الأقسام المحمية: {sections.filter(s => s.password).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  الأقسام المفتوحة: {sections.filter(s => !s.password).length}
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>القسم</TableCell>
                      <TableCell align="center">الحالة</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sections.slice(0, 5).map(section => (
                      <TableRow key={section.id}>
                        <TableCell>{section.title}</TableCell>
                        <TableCell align="center">
                          {section.password ? (
                            <Chip label="محمي" color="warning" size="small" />
                          ) : (
                            <Chip label="مفتوح" color="success" size="small" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* إعدادات النظام */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                إعدادات النظام
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                جميع التواريخ في النظام تُعرض بالتقويم الميلادي
              </Alert>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                  startIcon={
                    <Refresh
                      sx={{
                        animation: isRefreshing
                          ? 'spin 1s linear infinite'
                          : 'none',
                      }}
                    />
                  }
                >
                  {isRefreshing ? 'جاري التحديث...' : 'تحديث البيانات'}
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => {
                    if (window.confirm('هل تريد تصدير البيانات؟')) {
                      const data = {
                        accessCodes: accessCodes.length,
                        sections: sections.length,
                        videos: videos.length,
                        notifications: notifications.length,
                        exportDate: new Date().toISOString(),
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: 'application/json',
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `system-stats-${formatDate(
                        new Date()
                      )}.json`;
                      a.click();
                    }
                  }}
                >
                  تصدير الإحصائيات
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderDialog = () => {
    const isEdit = dialogType.includes('edit');

    return (
      <Dialog
        open={openDialog}
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            margin: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 'bold',
            borderBottom: '1px solid',
            borderColor: 'divider',
            mb: 2,
          }}
        >
          {dialogType === 'createAccessCode' && '👤 إنشاء رمز وصول جديد'}
          {dialogType === 'editAccessCode' && '✏️ تعديل رمز الوصول'}
          {dialogType === 'createSection' && '📚 إنشاء قسم جديد'}
          {dialogType === 'editSection' && '📝 تعديل القسم'}
          {dialogType === 'createVideo' && '🎥 إضافة فيديو جديد'}
          {dialogType === 'editVideo' && '✏️ تعديل الفيديو'}
          {dialogType === 'sendNotification' && '📢 إرسال إشعار'}
        </DialogTitle>

        <DialogContent
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 2 },
            maxHeight: { xs: '70vh', sm: '60vh' },
            overflowY: 'auto',
          }}
        >
          <Box sx={{ pt: { xs: 1, sm: 2 } }}>
            {(dialogType === 'createAccessCode' ||
              dialogType === 'editAccessCode') && (
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="اسم الطالب"
                    value={formData.studentName || ''}
                    onChange={e =>
                      setFormData({ ...formData, studentName: e.target.value })
                    }
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="رقم الهاتف"
                    value={formData.phoneNumber || ''}
                    onChange={e =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="رقم ولي الأمر"
                    value={formData.parentPhoneNumber || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        parentPhoneNumber: e.target.value,
                      })
                    }
                    placeholder="رقم هاتف ولي الأمر"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="الفئة"
                    value={formData.category || ''}
                    onChange={e =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="مثال: طلاب الصف الأول، طلاب الصف الثاني"
                    helperText="أدخل فئة الطالب لتجميع الطلاب في مجموعات"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>الأقسام المسموحة</InputLabel>
                    <Select
                      multiple
                      value={formData.allowedSections || []}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          allowedSections: e.target.value,
                        })
                      }
                      renderValue={selected => (
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          {selected.map(value => {
                            const section = sections.find(s => s.id === value);
                            return (
                              <Chip
                                key={value}
                                label={section?.title || value}
                                size="small"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {sections.map(section => (
                        <MenuItem key={section.id} value={section.id}>
                          {section.title}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      اتركه فارغاً للسماح بالوصول لجميع الأقسام
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>مدة الصلاحية</InputLabel>
                    <Select
                      value={formData.expiryPeriod || 'permanent'}
                      onChange={e => {
                        const period = e.target.value;
                        setFormData({
                          ...formData,
                          expiryPeriod: period,
                          expiryDate:
                            period === 'permanent'
                              ? null
                              : calculateExpiryDate(period),
                        });
                      }}
                    >
                      <MenuItem value="1month">شهر واحد</MenuItem>
                      <MenuItem value="2months">شهرين</MenuItem>
                      <MenuItem value="3months">3 شهور</MenuItem>
                      <MenuItem value="6months">6 شهور</MenuItem>
                      <MenuItem value="1year">سنة واحدة</MenuItem>
                      <MenuItem value="permanent">دائم (بدون انتهاء)</MenuItem>
                    </Select>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {formData.expiryPeriod &&
                        formData.expiryPeriod !== 'permanent' &&
                        formData.expiryDate &&
                        `سينتهي في: ${new Date(
                          formData.expiryDate
                        ).toLocaleDateString('ar-SA')}`}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="تاريخ انتهاء مخصص (اختياري)"
                    type="date"
                    value={formData.customExpiryDate || ''}
                    onChange={e => {
                      const customDate = e.target.value;
                      setFormData({
                        ...formData,
                        customExpiryDate: customDate,
                        expiryDate: customDate
                          ? new Date(customDate)
                          : formData.expiryDate,
                        expiryPeriod: customDate
                          ? 'custom'
                          : formData.expiryPeriod,
                      });
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="يمكنك تحديد تاريخ انتهاء مخصص بدلاً من الفترات المحددة مسبقاً"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ملاحظات"
                    multiline
                    rows={3}
                    value={formData.notes || ''}
                    onChange={e =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            )}

            {(dialogType === 'createSection' ||
              dialogType === 'editSection') && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="عنوان القسم"
                    value={formData.title || ''}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="الوصف"
                    multiline
                    rows={3}
                    value={formData.description || ''}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="الترتيب"
                    type="number"
                    value={formData.order || 0}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="كلمة المرور (اختياري)"
                    type="password"
                    value={formData.password || ''}
                    onChange={e =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    helperText="اتركه فارغاً إذا كنت لا تريد حماية القسم بكلمة مرور"
                  />
                  {formData.password && (
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      onClick={() => setFormData({ ...formData, password: '' })}
                      sx={{ mt: 1 }}
                      startIcon={<LockOpen />}
                    >
                      إزالة كلمة المرور
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isHidden || false}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            isHidden: e.target.checked,
                          })
                        }
                        color="warning"
                      />
                    }
                    label="إخفاء القسم بالكامل"
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    عند تفعيل هذا الخيار، سيتم إخفاء القسم وجميع الفيديوهات
                    الموجودة به عن الطلاب
                  </Typography>
                </Grid>
              </Grid>
            )}

            {(dialogType === 'createVideo' || dialogType === 'editVideo') && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="عنوان الفيديو *"
                    value={formData.title || ''}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    error={!formData.title}
                    helperText={!formData.title ? 'هذا الحقل مطلوب' : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="الوصف"
                    multiline
                    rows={3}
                    value={formData.description || ''}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!formData.sectionId}>
                    <InputLabel>القسم *</InputLabel>
                    <Select
                      value={formData.sectionId || ''}
                      onChange={e =>
                        setFormData({ ...formData, sectionId: e.target.value })
                      }
                    >
                      {sections.map(section => (
                        <MenuItem key={section.id} value={section.id}>
                          {section.title}
                        </MenuItem>
                      ))}
                    </Select>
                    {!formData.sectionId && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 2 }}
                      >
                        يرجى اختيار قسم
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>مصدر الفيديو *</InputLabel>
                    <Select
                      value={formData.videoSource || 'googleDrive'}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          videoSource: e.target.value,
                          // مسح الروابط عند تغيير المصدر
                          googleDriveUrl: '',
                          youtubeUrl: '',
                        });
                      }}
                    >
                      <MenuItem value="googleDrive">Google Drive</MenuItem>
                      <MenuItem value="youtube">YouTube</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="المدة"
                    value={formData.duration || ''}
                    onChange={e =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="مثال: 15:30"
                  />
                </Grid>
                {formData.videoSource === 'googleDrive' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="رابط Google Drive *"
                      value={formData.googleDriveUrl || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          googleDriveUrl: e.target.value,
                        })
                      }
                      placeholder="https://drive.google.com/file/d/..."
                      required
                      error={
                        !formData.googleDriveUrl &&
                        formData.videoSource === 'googleDrive'
                      }
                      helperText="يجب أن يكون الرابط من Google Drive"
                    />
                  </Grid>
                )}
                {formData.videoSource === 'youtube' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="رابط YouTube *"
                      value={formData.youtubeUrl || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          youtubeUrl: e.target.value,
                        })
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                      error={
                        !formData.youtubeUrl &&
                        formData.videoSource === 'youtube'
                      }
                      helperText="يجب أن يكون الرابط من YouTube"
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="الترتيب"
                    type="number"
                    value={formData.order || 0}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="كلمة المرور (اختياري)"
                    type="password"
                    value={formData.password || ''}
                    onChange={e =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    helperText="اتركه فارغاً إذا كنت لا تريد حماية الفيديو بكلمة مرور"
                  />
                  {formData.password && (
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      onClick={() => setFormData({ ...formData, password: '' })}
                      sx={{ mt: 1 }}
                      startIcon={<LockOpen />}
                    >
                      إزالة كلمة المرور
                    </Button>
                  )}
                </Grid>

                {/* قسم الملفات المرفقة */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    📎 الملفات المرفقة
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    يمكنك رفع ملفات PDF أو صور لتكون متاحة للطلاب مع هذا الفيديو
                  </Typography>
                </Grid>

                {/* رفع الملفات */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                        onChange={e => handleFileUpload(e.target.files)}
                        style={{ display: 'none' }}
                        id="file-upload-input"
                        disabled={isUploading}
                      />
                      <label htmlFor="file-upload-input">
                        <Button
                          variant="outlined"
                          component="span"
                          disabled={isUploading}
                          startIcon={
                            isUploading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Add />
                            )
                          }
                          fullWidth
                        >
                          {isUploading
                            ? `جاري الرفع... ${uploadProgress}%`
                            : 'رفع ملفات جديدة'}
                        </Button>
                      </label>
                    </Box>

                    {isUploading && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          تقدم الرفع: {uploadProgress}%
                        </Typography>
                        <Box
                          sx={{
                            width: '100%',
                            bgcolor: 'grey.300',
                            borderRadius: 1,
                            height: 8,
                          }}
                        >
                          <Box
                            sx={{
                              width: `${uploadProgress}%`,
                              bgcolor: 'primary.main',
                              height: '100%',
                              borderRadius: 1,
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      الأنواع المدعومة: PDF, صور (JPG, PNG, GIF), مستندات Word |
                      الحد الأقصى: 30MB لكل ملف
                    </Typography>
                  </Card>
                </Grid>

                {/* عرض الملفات المرفقة */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    الملفات المرفقة ({attachedFiles.length})
                  </Typography>
                  {attachedFiles.length > 0 ? (
                    <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                      {attachedFiles.map((file, index) => (
                        <Card
                          key={index}
                          variant="outlined"
                          sx={{ mb: 1, p: 2 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight="bold">
                                {file.fileName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatFileSize(file.fileSize)} • تم الرفع:{' '}
                                {formatDate(new Date(file.uploadTime))}
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  window.open(file.downloadPage, '_blank')
                                }
                                title="معاينة الملف"
                              >
                                <Visibility />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleRemoveAttachedFile(index, file.fileId)
                                }
                                title="حذف الملف"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        لا توجد ملفات مرفقة حالياً. يمكنك رفع ملفات PDF أو صور
                        لتكون متاحة للطلاب مع هذا الفيديو.
                      </Typography>
                    </Alert>
                  )}
                </Grid>
              </Grid>
            )}

            {dialogType === 'sendNotification' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="عنوان الإشعار"
                    value={formData.title || ''}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="نص الإشعار"
                    multiline
                    rows={4}
                    value={formData.message || ''}
                    onChange={e =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>الأولوية</InputLabel>
                    <Select
                      value={formData.priority || 'normal'}
                      onChange={e =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      <MenuItem value="low">منخفضة</MenuItem>
                      <MenuItem value="normal">عادية</MenuItem>
                      <MenuItem value="high">عالية</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>الهدف</InputLabel>
                    <Select
                      value={formData.targetType || 'all'}
                      onChange={e =>
                        setFormData({ ...formData, targetType: e.target.value })
                      }
                    >
                      <MenuItem value="all">جميع الطلاب</MenuItem>
                      <MenuItem value="category">فئة معينة</MenuItem>
                      <MenuItem value="selected">طلاب محددين</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {formData.targetType === 'category' && (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>اختر الفئة</InputLabel>
                      <Select
                        value={formData.targetCategory || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            targetCategory: e.target.value,
                          })
                        }
                      >
                        {/* استخراج الفئات الفريدة من رموز الوصول */}
                        {[
                          ...new Set(
                            accessCodes
                              .map(code => code.category)
                              .filter(Boolean)
                          ),
                        ].map(category => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>إلغاء</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? (
              <CircularProgress size={20} />
            ) : isEdit ? (
              'تحديث'
            ) : (
              'إنشاء'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          جاري تحميل لوحة التحكم...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Header */}
      <Box
        sx={{
          mb: { xs: 3, sm: 4 },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            fontWeight: 'bold',
          }}
        >
          لوحة تحكم الإدارة 👨‍💼
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          إدارة شاملة للمنصة التعليمية
        </Typography>
      </Box>

      {/* Statistics */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="رموز الوصول"
            value={accessCodes.length}
            icon={<Code sx={{ fontSize: { xs: 32, sm: 40 } }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="الفيديوهات"
            value={videos.length}
            icon={<VideoLibrary sx={{ fontSize: { xs: 32, sm: 40 } }} />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="الأقسام"
            value={sections.length}
            icon={<Analytics sx={{ fontSize: { xs: 32, sm: 40 } }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="الإشعارات"
            value={notifications.length}
            icon={<Notifications sx={{ fontSize: { xs: 32, sm: 40 } }} />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-flexContainer': {
              display: 'flex',
              alignItems: 'stretch',
              minHeight: { xs: 64, sm: 72 },
            },
            '& .MuiTab-root': {
              flex: { xs: 'none', md: 1 },
              minWidth: { xs: 120, sm: 140, md: 'auto' },
              maxWidth: { xs: 200, sm: 250, md: 'none' },
              minHeight: { xs: 64, sm: 72 },
              padding: { xs: '8px 12px', sm: '12px 16px' },
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9rem' },
              fontWeight: 'medium',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(196, 211, 215, 0.1)',
                transform: 'translateY(-1px)',
              },
              '&.Mui-selected': {
                fontWeight: 'bold',
                color: 'primary.main',
                backgroundColor: 'grey.200',
                '& .MuiSvgIcon-root': {
                  color: 'primary.main',
                },
              },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                transition: 'color 0.3s ease',
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              background: 'linear-gradient(45deg, #c4d3d7 30%, #e1eaed 90%)',
            },
            '& .MuiTabs-scrollButtons': {
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            },
          }}
        >
          <Tab
            label="رموز الوصول"
            icon={<Code />}
            iconPosition="start"
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0.5, sm: 1 },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <Tab
            label="الفيديوهات والأقسام"
            icon={<VideoLibrary />}
            iconPosition="start"
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0.5, sm: 1 },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <Tab
            label="إدارة الإشعارات"
            icon={<Notifications />}
            iconPosition="start"
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0.5, sm: 1 },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <Tab
            label="الإشعارات المرسلة"
            icon={<Visibility />}
            iconPosition="start"
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0.5, sm: 1 },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <Tab
            label="الإعدادات"
            icon={<Settings />}
            iconPosition="start"
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0.5, sm: 1 },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          boxShadow: 3,
          minHeight: '60vh',
        }}
      >
        {tabValue === 0 && <AccessCodesTab />}
        {tabValue === 1 && <VideosTab />}
        {tabValue === 2 && <NotificationManagement />}
        {tabValue === 3 && <SentNotificationsView />}
        {tabValue === 4 && (
          <SettingsTab
            accessCodes={accessCodes}
            sections={sections}
            videos={videos}
            loadAllData={loadAllData}
            handleCreateTestCodes={handleCreateTestCodes}
            submitting={submitting}
          />
        )}
      </Paper>

      {/* Dialog */}
      {renderDialog()}
    </Container>
  );
};

// مكون قسم الإعدادات
const SettingsTab = ({
  accessCodes,
  sections,
  videos,
  loadAllData,
  handleCreateTestCodes,
  submitting,
}) => {
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportStatistics = async () => {
    setExportLoading(true);
    try {
      const stats = {
        totalAccessCodes: accessCodes.length,
        activeAccounts: accessCodes.filter(code => code.isActive).length,
        inactiveAccounts: accessCodes.filter(code => !code.isActive).length,
        totalSections: sections.length,
        totalVideos: videos.length,
        totalViews: videos.reduce(
          (sum, video) => sum + (video.viewCount || 0),
          0
        ),
      };

      const result = await exportStatisticsToTXT(
        stats,
        accessCodes,
        sections,
        videos
      );

      if (result.success) {
        alert('✅ ' + result.message);
      } else {
        alert('❌ خطأ في التصدير: ' + result.error);
      }
    } catch (error) {
      console.error('خطأ في تصدير الإحصائيات:', error);
      alert('❌ حدث خطأ أثناء تصدير الإحصائيات');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 3,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 'bold',
          color: 'primary.main',
        }}
      >
        ⚙️ إعدادات النظام
      </Typography>

      <Grid container spacing={3}>
        {/* قسم التصدير */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              boxShadow: 3,
              transition:
                'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Analytics sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                📊 تصدير الإحصائيات
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.6 }}
            >
              قم بتصدير تقرير شامل يحتوي على جميع الإحصائيات والبيانات المهمة
              للمنصة بصيغة TXT منسقة وجميلة مع الإيموجي.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  📈 إجمالي رموز الوصول: {accessCodes.length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  🎥 إجمالي الفيديوهات: {videos.length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  📚 إجمالي الأقسام: {sections.length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  👁️ إجمالي المشاهدات:{' '}
                  {videos.reduce(
                    (sum, video) => sum + (video.viewCount || 0),
                    0
                  )}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleExportStatistics}
              disabled={exportLoading}
              startIcon={
                exportLoading ? <CircularProgress size={20} /> : <Analytics />
              }
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: 2,
              }}
            >
              {exportLoading ? 'جاري التصدير...' : '📄 تصدير التقرير (TXT)'}
            </Button>
          </Card>
        </Grid>

        {/* قسم إعدادات النظام */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              boxShadow: 3,
              transition:
                'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Settings sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                🔧 إعدادات عامة
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.6 }}
            >
              إعدادات النظام العامة وأدوات الصيانة والإدارة.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={loadAllData}
                startIcon={<Refresh />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                🔄 تحديث البيانات
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleCreateTestCodes}
                disabled={submitting}
                startIcon={
                  submitting ? <CircularProgress size={20} /> : <Add />
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                {submitting ? 'جاري الإنشاء...' : '🧪 إنشاء رموز تجريبية'}
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* قسم معلومات النظام */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ℹ️ معلومات النظام
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography
                    variant="h4"
                    color="primary.main"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {accessCodes.filter(code => code.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    🟢 حسابات نشطة
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography
                    variant="h4"
                    color="warning.main"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {accessCodes.filter(code => !code.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    🔴 حسابات معطلة
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography
                    variant="h4"
                    color="success.main"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {
                      videos.filter(video => video.isActive && !video.isHidden)
                        .length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    👁️ فيديوهات مرئية
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography
                    variant="h4"
                    color="secondary.main"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {
                      sections.filter(
                        section => section.isActive && !section.isHidden
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📚 أقسام مرئية
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* CSS للأنيميشن */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default AdminDashboard;
