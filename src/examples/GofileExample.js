// مثال على استخدام خدمة Gofile.io
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import { CloudUpload, TestTube, Folder } from '@mui/icons-material';
import GofileUploader from '../components/GofileUploader';
import {
  uploadFileToGofile,
  testConnection,
  createFolder,
  displayDownloadLink,
} from '../utils/gofileService';

const GofileExample = () => {
  const [testResult, setTestResult] = useState('');
  const [folderResult, setFolderResult] = useState('');
  const [loading, setLoading] = useState(false);

  // اختبار الاتصال
  const handleTestConnection = async () => {
    setLoading(true);
    setTestResult('جاري اختبار الاتصال...');

    try {
      const result = await testConnection();
      if (result.success) {
        setTestResult(
          `✅ ${result.message}\n📧 البريد الإلكتروني: ${result.data.email}\n🏷️ نوع الحساب: ${result.data.tier}`
        );
      } else {
        setTestResult(`❌ ${result.error}`);
      }
    } catch (error) {
      setTestResult(`❌ خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // إنشاء مجلد تجريبي
  const handleCreateFolder = async () => {
    setLoading(true);
    setFolderResult('جاري إنشاء المجلد...');

    try {
      const folderName = `Test_Folder_${Date.now()}`;
      const result = await createFolder(folderName);

      if (result.success) {
        setFolderResult(
          `✅ ${result.message}\n📁 اسم المجلد: ${result.data.folderName}\n🆔 معرف المجلد: ${result.data.folderId}`
        );
      } else {
        setFolderResult(`❌ ${result.error}`);
      }
    } catch (error) {
      setFolderResult(`❌ خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // معالج اكتمال الرفع
  const handleUploadComplete = result => {
    console.log('تم الرفع بنجاح:', result);

    if (result.success) {
      // يمكن إضافة منطق إضافي هنا
      alert(displayDownloadLink(result));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        مثال على استخدام Gofile.io API 🚀
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mb: 4 }}
      >
        هذا المثال يوضح كيفية استخدام الـ API الجديد لـ Gofile.io مع React و
        Axios
      </Typography>

      <Grid container spacing={3}>
        {/* اختبار الاتصال */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              <TestTube sx={{ mr: 1, verticalAlign: 'middle' }} />
              اختبار الاتصال
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              اختبر الاتصال مع Gofile.io والتحقق من صحة المصادقة
            </Typography>

            <Button
              variant="contained"
              onClick={handleTestConnection}
              disabled={loading}
              fullWidth
              sx={{ mb: 2 }}
            >
              اختبار الاتصال
            </Button>

            {testResult && (
              <Alert
                severity={testResult.includes('✅') ? 'success' : 'error'}
                sx={{ whiteSpace: 'pre-line' }}
              >
                {testResult}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* إنشاء مجلد */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              <Folder sx={{ mr: 1, verticalAlign: 'middle' }} />
              إنشاء مجلد
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              إنشاء مجلد جديد في حسابك على Gofile.io
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleCreateFolder}
              disabled={loading}
              fullWidth
              sx={{ mb: 2 }}
            >
              إنشاء مجلد تجريبي
            </Button>

            {folderResult && (
              <Alert
                severity={folderResult.includes('✅') ? 'success' : 'error'}
                sx={{ whiteSpace: 'pre-line' }}
              >
                {folderResult}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* رفع ملف واحد */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            <CloudUpload sx={{ mr: 1, verticalAlign: 'middle' }} />
            رفع ملف واحد
          </Typography>
          <GofileUploader
            multiple={false}
            onUploadComplete={handleUploadComplete}
          />
        </Grid>

        {/* رفع عدة ملفات */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            <CloudUpload sx={{ mr: 1, verticalAlign: 'middle' }} />
            رفع عدة ملفات
          </Typography>
          <GofileUploader
            multiple={true}
            maxFiles={5}
            onUploadComplete={handleUploadComplete}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* معلومات إضافية */}
      <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          📋 معلومات مهمة
        </Typography>

        <Box component="ul" sx={{ pl: 2 }}>
          <li>
            <Typography variant="body2">
              <strong>الحد الأقصى لحجم الملف:</strong> 30 ميجابايت
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>الـ API المستخدم:</strong>{' '}
              https://upload.gofile.io/uploadfile (الجديد)
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>المصادقة:</strong> Bearer Token في الـ Authorization
              header
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>نوع البيانات:</strong> multipart/form-data مع حقل "file"
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>المكتبة المستخدمة:</strong> Axios للطلبات HTTP
            </Typography>
          </li>
        </Box>
      </Paper>
    </Container>
  );
};

export default GofileExample;
