// Attached Files Component for Students
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
} from '@mui/material';
import {
  AttachFile,
  PictureAsPdf,
  Image,
  Description,
  Download,
  Visibility,
  Close,
} from '@mui/icons-material';
import { formatFileSize } from '../../utils/gofileService';

const AttachedFiles = ({ files = [], videoTitle = '' }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // تحديد أيقونة الملف حسب النوع
  const getFileIcon = fileName => {
    const extension = fileName.split('.').pop().toLowerCase();

    switch (extension) {
      case 'pdf':
        return <PictureAsPdf color="error" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <Image color="primary" />;
      case 'doc':
      case 'docx':
        return <Description color="info" />;
      default:
        return <AttachFile color="action" />;
    }
  };

  // تحديد لون الشريحة حسب نوع الملف
  const getFileChipColor = fileName => {
    const extension = fileName.split('.').pop().toLowerCase();

    switch (extension) {
      case 'pdf':
        return 'error';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'primary';
      case 'doc':
      case 'docx':
        return 'info';
      default:
        return 'default';
    }
  };

  // فتح ملف للمعاينة
  const handlePreviewFile = file => {
    setSelectedFile(file);
    setOpenDialog(true);
  };

  // تحميل ملف
  const handleDownloadFile = file => {
    // فتح صفحة التحميل في تبويب جديد
    window.open(file.downloadPage, '_blank');
  };

  // إذا لم تكن هناك ملفات
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: { xs: 2, sm: 3 } }}>
      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 2 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              justifyContent: { xs: 'center', sm: 'flex-start' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <AttachFile sx={{ mr: 1, color: 'primary.main' }} />
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              الملفات المرفقة ({files.length})
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            ملفات مساعدة ومواد إضافية لهذا الفيديو
          </Typography>

          <List dense>
            {files.map((file, index) => (
              <React.Fragment key={index}>
                <ListItem
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: { xs: 1, sm: 1.5 },
                    mb: 1,
                    p: { xs: 1, sm: 2 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: { xs: 1, sm: 0 },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: 0,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: { xs: 32, sm: 40 } }}>
                      {getFileIcon(file.fileName)}
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: { xs: 0.5, sm: 1 },
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                              wordBreak: 'break-word',
                              flex: 1,
                            }}
                          >
                            {file.fileName}
                          </Typography>
                          <Chip
                            label={file.fileName.split('.').pop().toUpperCase()}
                            size="small"
                            color={getFileChipColor(file.fileName)}
                            sx={{
                              fontSize: { xs: '0.6rem', sm: '0.75rem' },
                              height: { xs: 20, sm: 24 },
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        >
                          {formatFileSize(file.fileSize)} • تم الرفع:{' '}
                          {new Date(file.uploadTime).toLocaleDateString(
                            'ar-SA'
                          )}
                        </Typography>
                      }
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      justifyContent: { xs: 'center', sm: 'flex-end' },
                      mt: { xs: 1, sm: 0 },
                    }}
                  >
                    <IconButton
                      onClick={() => handlePreviewFile(file)}
                      color="primary"
                      size="small"
                      title="معاينة"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '1rem' },
                        p: { xs: 0.5, sm: 1 },
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDownloadFile(file)}
                      color="success"
                      size="small"
                      title="تحميل"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '1rem' },
                        p: { xs: 0.5, sm: 1 },
                      }}
                    >
                      <Download fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              💡 <strong>نصيحة:</strong> اضغط على أيقونة المعاينة لرؤية الملف،
              أو أيقونة التحميل لحفظه على جهازك.
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* حوار معاينة الملف */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {selectedFile && getFileIcon(selectedFile.fileName)}
              <Typography variant="h6" sx={{ ml: 1 }}>
                معاينة الملف
              </Typography>
            </Box>
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {selectedFile && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {selectedFile.fileName}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                الحجم: {formatFileSize(selectedFile.fileSize)} • تاريخ الرفع:{' '}
                {new Date(selectedFile.uploadTime).toLocaleDateString('ar-SA')}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  سيتم فتح الملف في تبويب جديد للمعاينة والتحميل
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Visibility />}
                  onClick={() => {
                    window.open(selectedFile.downloadPage, '_blank');
                    setOpenDialog(false);
                  }}
                >
                  فتح الملف
                </Button>

                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<Download />}
                  onClick={() => {
                    handleDownloadFile(selectedFile);
                    setOpenDialog(false);
                  }}
                >
                  تحميل مباشر
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttachedFiles;
