// مكون React لرفع الملفات إلى Gofile.io
import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  AttachFile,
  CheckCircle,
  Error,
  Delete,
  Link as LinkIcon,
} from '@mui/icons-material';
import {
  uploadFileToGofile,
  uploadMultipleFiles,
  formatFileSize,
  displayDownloadLink,
  testConnection,
} from '../utils/gofileService';

const GofileUploader = ({
  multiple = false,
  onUploadComplete = null,
  maxFiles = 5,
  folderId = null,
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null);
  const fileInputRef = useRef(null);

  // اختبار الاتصال مع Gofile.io
  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    const result = await testConnection();
    setConnectionStatus(result.success ? 'connected' : 'failed');

    if (!result.success) {
      setError(result.error);
    } else {
      setError('');
    }
  };

  // اختيار الملفات
  const handleFileSelect = event => {
    const selectedFiles = Array.from(event.target.files);

    if (multiple) {
      if (selectedFiles.length > maxFiles) {
        setError(`يمكن رفع ${maxFiles} ملفات كحد أقصى`);
        return;
      }
      setFiles(selectedFiles);
    } else {
      setFiles(selectedFiles.slice(0, 1));
    }

    setError('');
    setResults([]);
  };

  // حذف ملف من القائمة
  const handleRemoveFile = index => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  // رفع الملفات
  const handleUpload = async () => {
    if (files.length === 0) {
      setError('يرجى اختيار ملف واحد على الأقل');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);
    setResults([]);

    try {
      if (multiple && files.length > 1) {
        // رفع عدة ملفات
        const result = await uploadMultipleFiles(
          files,
          progressData => {
            setProgress(progressData.overallProgress);
          },
          folderId
        );

        setResults(result.results);

        if (result.success) {
          if (onUploadComplete) {
            onUploadComplete(result);
          }
        } else {
          setError(
            `فشل في رفع بعض الملفات: ${result.failureCount} من ${result.totalFiles}`
          );
        }
      } else {
        // رفع ملف واحد
        const result = await uploadFileToGofile(
          files[0],
          progressPercent => {
            setProgress(progressPercent);
          },
          folderId
        );

        setResults([
          {
            fileName: files[0].name,
            fileSize: files[0].size,
            fileType: files[0].type,
            ...result,
          },
        ]);

        if (result.success) {
          if (onUploadComplete) {
            onUploadComplete(result);
          }
        } else {
          setError(result.error || 'فشل في رفع الملف');
        }
      }
    } catch (error) {
      console.error('خطأ في رفع الملفات:', error);
      setError('حدث خطأ غير متوقع أثناء رفع الملفات');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // نسخ رابط التحميل
  const handleCopyLink = downloadPage => {
    navigator.clipboard
      .writeText(downloadPage)
      .then(() => {
        alert('تم نسخ الرابط إلى الحافظة ✅');
      })
      .catch(() => {
        alert('فشل في نسخ الرابط');
      });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        رفع الملفات إلى Gofile.io 📁
      </Typography>

      {/* اختبار الاتصال */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleTestConnection}
          disabled={connectionStatus === 'testing'}
          startIcon={
            connectionStatus === 'connected' ? <CheckCircle /> : <Error />
          }
          color={connectionStatus === 'connected' ? 'success' : 'primary'}
        >
          {connectionStatus === 'testing'
            ? 'جاري الاختبار...'
            : connectionStatus === 'connected'
            ? 'متصل ✅'
            : connectionStatus === 'failed'
            ? 'فشل الاتصال ❌'
            : 'اختبار الاتصال'}
        </Button>
      </Box>

      {/* اختيار الملفات */}
      <Box sx={{ mb: 2 }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple={multiple}
          style={{ display: 'none' }}
          accept="*/*"
        />
        <Button
          variant="contained"
          startIcon={<AttachFile />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          fullWidth
        >
          {multiple ? 'اختيار ملفات' : 'اختيار ملف'}
        </Button>
      </Box>

      {/* قائمة الملفات المختارة */}
      {files.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            الملفات المختارة ({files.length}):
          </Typography>
          <List dense>
            {files.map((file, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <AttachFile />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={`${formatFileSize(file.size)} - ${
                    file.type || 'نوع غير محدد'
                  }`}
                />
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveFile(index)}
                  disabled={uploading}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* زر الرفع */}
      {files.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUpload />}
          onClick={handleUpload}
          disabled={uploading || connectionStatus === 'failed'}
          fullWidth
          sx={{ mb: 2 }}
        >
          {uploading ? 'جاري الرفع...' : 'رفع الملفات'}
        </Button>
      )}

      {/* شريط التقدم */}
      {uploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 1 }}
          >
            {progress}%
          </Typography>
        </Box>
      )}

      {/* رسائل الخطأ */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* نتائج الرفع */}
      {results.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            نتائج الرفع:
          </Typography>
          <List>
            {results.map((result, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  {result.success ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Error color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{result.fileName}</Typography>
                      <Chip
                        label={result.success ? 'نجح' : 'فشل'}
                        color={result.success ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    result.success ? (
                      <Box>
                        <Typography variant="caption" display="block">
                          {formatFileSize(result.fileSize || 0)}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          color="primary"
                        >
                          {result.data?.downloadPage}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="error">
                        {result.error}
                      </Typography>
                    )
                  }
                />
                {result.success && result.data?.downloadPage && (
                  <IconButton
                    edge="end"
                    onClick={() => handleCopyLink(result.data.downloadPage)}
                    size="small"
                    title="نسخ رابط التحميل"
                  >
                    <LinkIcon />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default GofileUploader;
