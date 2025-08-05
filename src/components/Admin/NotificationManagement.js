// Admin Notification Management Component
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import {
  Send,
  Delete,
  DeleteSweep,
  Notifications,
  Person,
  Group,
  Warning,
  CheckCircle,
  Cancel,
  Refresh,
  AttachFile,
  CloudUpload,
  Close,
  DevicesOther,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {
  sendNotificationToAll,
  sendNotificationToSelected,
  sendNotificationToSingleStudent,
  deleteAllNotifications,
  getNotificationStatistics,
} from '../../firebase/notificationService';
import {
  getAllAccessCodes,
  resetDeviceForAccessCode,
} from '../../firebase/accessCodes';
import { uploadFileToGofile } from '../../utils/gofileService';

const NotificationManagement = () => {
  const theme = useTheme();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // حالة النموذج
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'normal',
    targetType: 'all', // all, selected (تم حذف single)
    selectedStudents: [],
    attachedFile: null, // الملف المرفق
  });

  // حالة الحوارات
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // تحميل قائمة الطلاب
  const loadStudents = async () => {
    try {
      const result = await getAllAccessCodes();
      if (result.success) {
        setStudents(result.codes.filter(code => code.isActive));
      }
    } catch (error) {
      console.error('خطأ في تحميل الطلاب:', error);
    }
  };

  // تحميل الإحصائيات
  const loadStatistics = async () => {
    try {
      const result = await getNotificationStatistics();
      if (result.success) {
        setStatistics(result.statistics);
      }
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
    }
  };

  useEffect(() => {
    loadStudents();
    loadStatistics();
  }, []);

  // معالجة تغيير البيانات
  const handleInputChange = field => event => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  // معالجة رفع الملف
  const handleFileUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;

    setFileUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadFileToGofile(file, progress =>
        setUploadProgress(progress)
      );

      if (result.success) {
        setFormData({
          ...formData,
          attachedFile: {
            name: file.name,
            size: file.size,
            url: result.data.downloadPage,
            directLink: result.data.directLink,
          },
        });
        setSuccessMessage(`تم رفع الملف "${file.name}" بنجاح`);
      } else {
        setErrorMessage(`فشل في رفع الملف: ${result.error}`);
      }
    } catch (error) {
      setErrorMessage('حدث خطأ أثناء رفع الملف');
      console.error('خطأ في رفع الملف:', error);
    } finally {
      setFileUploading(false);
      setUploadProgress(0);
    }
  };

  // حذف الملف المرفق
  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      attachedFile: null,
    });
  };

  // إعادة تعيين الجهاز للطالب
  const handleResetDevice = async (studentId, studentName) => {
    if (
      !window.confirm(
        `هل أنت متأكد من إعادة تعيين الجهاز للطالب "${studentName}"؟\nسيتمكن الطالب من تسجيل الدخول من جهاز جديد.`
      )
    ) {
      return;
    }

    try {
      const result = await resetDeviceForAccessCode(studentId);
      if (result.success) {
        setSuccessMessage(
          `تم إعادة تعيين الجهاز للطالب "${studentName}" بنجاح`
        );
        // تحديث قائمة الطلاب
        await loadStudents();
      } else {
        setErrorMessage(`فشل في إعادة تعيين الجهاز: ${result.error}`);
      }
    } catch (error) {
      setErrorMessage('حدث خطأ أثناء إعادة تعيين الجهاز');
      console.error('خطأ في إعادة تعيين الجهاز:', error);
    }
  };

  // إرسال الإشعار
  const handleSendNotification = async () => {
    if (!formData.title || !formData.message) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let finalMessage = formData.message;

      // إضافة رابط الملف إلى الرسالة إذا كان موجوداً
      if (formData.attachedFile) {
        finalMessage += `\n\n📎 ملف مرفق: ${formData.attachedFile.name}\n🔗 رابط التحميل: ${formData.attachedFile.url}`;
      }

      const notificationData = {
        title: formData.title,
        message: finalMessage,
        type: formData.type,
        priority: formData.priority,
        attachedFile: formData.attachedFile, // إضافة معلومات الملف
      };

      let result;

      switch (formData.targetType) {
        case 'all':
          result = await sendNotificationToAll(notificationData);
          break;
        case 'selected':
          if (formData.selectedStudents.length === 0) {
            setErrorMessage('يرجى اختيار طلاب لإرسال الإشعار إليهم');
            return;
          }
          result = await sendNotificationToSelected(
            notificationData,
            formData.selectedStudents.map(student => student.code)
          );
          break;
        default:
          setErrorMessage('نوع الهدف غير صحيح');
          return;
      }

      if (result.success) {
        setSuccessMessage(result.message);
        // إعادة تعيين النموذج
        setFormData({
          title: '',
          message: '',
          type: 'general',
          priority: 'normal',
          targetType: 'all',
          selectedStudents: [],
          attachedFile: null,
        });
        // تحديث الإحصائيات
        await loadStatistics();
      } else {
        setErrorMessage(result.error || 'حدث خطأ في إرسال الإشعار');
      }
    } catch (error) {
      setErrorMessage('حدث خطأ في إرسال الإشعار');
      console.error('خطأ في إرسال الإشعار:', error);
    } finally {
      setLoading(false);
    }
  };

  // حذف جميع الإشعارات
  const handleDeleteAllNotifications = async () => {
    setDeleteLoading(true);
    try {
      const result = await deleteAllNotifications();
      if (result.success) {
        setSuccessMessage(result.message);
        await loadStatistics();
      } else {
        setErrorMessage(result.error || 'حدث خطأ في حذف الإشعارات');
      }
    } catch (error) {
      setErrorMessage('حدث خطأ في حذف الإشعارات');
      console.error('خطأ في حذف الإشعارات:', error);
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        إدارة الإشعارات
      </Typography>

      {/* الإحصائيات */}
      {statistics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {statistics.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  إجمالي الإشعارات
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {statistics.read}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  المقروءة
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {statistics.unread}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  غير المقروءة
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  {statistics.high_priority}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  عالية الأولوية
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* رسائل النجاح والخطأ */}
      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setErrorMessage('')}
        >
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* نموذج إرسال الإشعار */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              إرسال إشعار جديد
            </Typography>

            <Grid container spacing={2}>
              {/* العنوان */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="عنوان الإشعار"
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  required
                />
              </Grid>

              {/* الرسالة */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="نص الإشعار"
                  value={formData.message}
                  onChange={handleInputChange('message')}
                  multiline
                  rows={4}
                  required
                />
              </Grid>

              {/* نوع الإشعار */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>نوع الإشعار</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={handleInputChange('type')}
                    label="نوع الإشعار"
                  >
                    <MenuItem value="general">عام</MenuItem>
                    <MenuItem value="announcement">إعلان</MenuItem>
                    <MenuItem value="warning">تحذير</MenuItem>
                    <MenuItem value="info">معلومات</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* الأولوية */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>الأولوية</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={handleInputChange('priority')}
                    label="الأولوية"
                  >
                    <MenuItem value="low">منخفضة</MenuItem>
                    <MenuItem value="normal">عادية</MenuItem>
                    <MenuItem value="high">عالية</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* نوع الهدف */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>إرسال إلى</InputLabel>
                  <Select
                    value={formData.targetType}
                    onChange={handleInputChange('targetType')}
                    label="إرسال إلى"
                  >
                    <MenuItem value="all">جميع الطلاب</MenuItem>
                    <MenuItem value="selected">طلاب محددين</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* اختيار الطلاب المحددين */}
              {formData.targetType === 'selected' && (
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={students}
                    getOptionLabel={option =>
                      `${option.studentName} (${option.code})`
                    }
                    value={formData.selectedStudents}
                    onChange={(event, newValue) => {
                      setFormData({
                        ...formData,
                        selectedStudents: newValue,
                      });
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="اختر الطلاب"
                        placeholder="ابحث عن الطلاب..."
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            key={key}
                            variant="outlined"
                            label={option.studentName}
                            {...tagProps}
                          />
                        );
                      })
                    }
                  />
                </Grid>
              )}

              {/* رفع ملف مرفق */}
              <Grid item xs={12}>
                <Box sx={{ border: '1px dashed #ccc', borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    ملف مرفق (اختياري)
                  </Typography>

                  {!formData.attachedFile ? (
                    <Box>
                      <input
                        accept="*/*"
                        style={{ display: 'none' }}
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        disabled={fileUploading}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={
                            fileUploading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <CloudUpload />
                            )
                          }
                          disabled={fileUploading}
                          fullWidth
                        >
                          {fileUploading
                            ? `جاري الرفع... ${uploadProgress}%`
                            : 'اختر ملف للرفع'}
                        </Button>
                      </label>
                      {fileUploading && (
                        <Box sx={{ mt: 1 }}>
                          <div
                            style={{
                              width: '100%',
                              backgroundColor: '#f0f0f0',
                              borderRadius: '4px',
                              height: '8px',
                            }}
                          >
                            <div
                              style={{
                                width: `${uploadProgress}%`,
                                backgroundColor: '#4caf50',
                                height: '100%',
                                borderRadius: '4px',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#f5f5f5',
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <AttachFile color="primary" />
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {formData.attachedFile.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(formData.attachedFile.size / 1024 / 1024).toFixed(
                              2
                            )}{' '}
                            MB
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        onClick={handleRemoveFile}
                        size="small"
                        color="error"
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    سيتم رفع الملف على Gofile.io وإضافة رابط التحميل تلقائياً
                    للإشعار
                  </Typography>
                </Box>
              </Grid>

              {/* أزرار الإجراءات */}
              <Grid item xs={12}>
                <Box
                  sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={handleSendNotification}
                    disabled={loading}
                  >
                    {loading ? 'جاري الإرسال...' : 'إرسال الإشعار'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* أدوات الإدارة */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              أدوات الإدارة
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  loadStudents();
                  loadStatistics();
                }}
                fullWidth
              >
                تحديث البيانات
              </Button>

              <Divider />

              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteSweep />}
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={deleteLoading}
                fullWidth
              >
                حذف جميع الإشعارات
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                ⚠️ هذا الإجراء سيحذف جميع الإشعارات من قاعدة البيانات ولا يمكن
                التراجع عنه
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* إدارة الأجهزة */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              إدارة أجهزة الطلاب
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              يمكنك إعادة تعيين الجهاز للطالب ليتمكن من تسجيل الدخول من جهاز
              جديد
            </Typography>

            <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              {students.length > 0 ? (
                <Grid container spacing={2}>
                  {students.map(student => (
                    <Grid item xs={12} sm={6} md={4} key={student.id}>
                      <Card
                        sx={{
                          border: student.deviceId
                            ? '1px solid #e0e0e0'
                            : '1px solid #ffeb3b',
                          backgroundColor: student.deviceId
                            ? 'inherit'
                            : '#fffde7',
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {student.studentName}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            الرمز: {student.accessCode}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            الهاتف: {student.phoneNumber}
                          </Typography>

                          <Box sx={{ mt: 2 }}>
                            {student.deviceId ? (
                              <Box>
                                <Chip
                                  icon={<DevicesOther />}
                                  label="مرتبط بجهاز"
                                  color="success"
                                  size="small"
                                  sx={{ mb: 1 }}
                                />
                                <Button
                                  variant="outlined"
                                  color="warning"
                                  size="small"
                                  startIcon={<DevicesOther />}
                                  onClick={() =>
                                    handleResetDevice(
                                      student.id,
                                      student.studentName
                                    )
                                  }
                                  fullWidth
                                >
                                  إعادة تعيين الجهاز
                                </Button>
                              </Box>
                            ) : (
                              <Chip
                                icon={<DevicesOther />}
                                label="غير مرتبط بجهاز"
                                color="warning"
                                size="small"
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  لا توجد بيانات طلاب
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* حوار تأكيد الحذف */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            تأكيد حذف جميع الإشعارات
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد من رغبتك في حذف جميع الإشعارات من قاعدة البيانات؟
          </Typography>
          <Typography color="error" sx={{ mt: 2 }}>
            ⚠️ هذا الإجراء لا يمكن التراجع عنه وسيؤثر على جميع الطلاب.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>إلغاء</Button>
          <Button
            onClick={handleDeleteAllNotifications}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? <CircularProgress size={20} /> : <Delete />
            }
          >
            {deleteLoading ? 'جاري الحذف...' : 'حذف جميع الإشعارات'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationManagement;
