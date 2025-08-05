// Theme Demo Component - لاختبار النظام الموحد للثيم
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Alert,
  Paper,
  Grid,
} from '@mui/material';
import { Star, Favorite, Share } from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';

const ThemeDemo = () => {
  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        className="arabic-heading"
      >
        عرض توضيحي للنظام الموحد للثيم
      </Typography>

      {/* أزرار التحكم في الثيم */}
      <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          أزرار التحكم في الثيم
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              النسخة الأساسية
            </Typography>
            <ThemeToggle />
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              مع التسمية
            </Typography>
            <ThemeToggle showLabel={true} />
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              النسخة المحسنة
            </Typography>
            <ThemeToggle enhanced={true} />
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              نسخة Switch
            </Typography>
            <ThemeToggle variant="switch" />
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* كارت تجريبي */}
        <Grid item xs={12} md={6}>
          <Card className="arabic-card">
            <CardContent>
              <Typography variant="h5" className="arabic-heading" gutterBottom>
                كارت تجريبي
              </Typography>
              <Typography variant="body1" className="arabic-body" paragraph>
                هذا نص تجريبي لاختبار الألوان والخطوط في الوضع الليلي والنهاري.
                يجب أن تكون الانتقالات سلسة وجميلة.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label="تقنية" color="primary" />
                <Chip label="تطوير" color="secondary" />
                <Chip label="تصميم" variant="outlined" />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Star />}
                  className="arabic-btn"
                >
                  إعجاب
                </Button>
                <Button variant="outlined" startIcon={<Share />}>
                  مشاركة
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* نموذج تجريبي */}
        <Grid item xs={12} md={6}>
          <Paper className="arabic-form">
            <Typography variant="h5" className="arabic-heading" gutterBottom>
              نموذج تجريبي
            </Typography>
            <Box
              component="form"
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="الاسم"
                variant="outlined"
                fullWidth
                className="arabic-input"
              />
              <TextField
                label="البريد الإلكتروني"
                type="email"
                variant="outlined"
                fullWidth
                className="arabic-input"
              />
              <TextField
                label="الرسالة"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                className="arabic-input"
              />
              <Button variant="contained" size="large" className="arabic-btn">
                إرسال
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* تنبيهات تجريبية */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="success" className="arabic-alert success">
              تم حفظ البيانات بنجاح!
            </Alert>
            <Alert severity="warning" className="arabic-alert warning">
              يرجى التحقق من البيانات المدخلة.
            </Alert>
            <Alert severity="error" className="arabic-alert error">
              حدث خطأ أثناء العملية.
            </Alert>
            <Alert severity="info" className="arabic-alert">
              معلومة مفيدة للمستخدم.
            </Alert>
          </Box>
        </Grid>

        {/* عناصر تفاعلية */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              عناصر تفاعلية
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Button variant="contained" color="primary">
                أساسي
              </Button>
              <Button variant="contained" color="secondary">
                ثانوي
              </Button>
              <Button variant="outlined">محدد</Button>
              <Button variant="text">نص</Button>
              <Chip label="نشط" color="success" />
              <Chip label="معلق" color="warning" />
              <Chip label="مرفوض" color="error" />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* معلومات النظام */}
      <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          معلومات النظام الموحد للثيم
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ✅ زر واحد موحد للتحكم في الثيم
          <br />
          ✅ حفظ تلقائي للإعدادات في localStorage
          <br />
          ✅ دعم تفضيلات النظام
          <br />
          ✅ انتقالات سلسة بين الأوضاع
          <br />
          ✅ دعم كامل للغة العربية
          <br />
          ✅ تحسينات خاصة للوضع الليلي
          <br />✅ متوافق مع جميع المكونات
        </Typography>
      </Paper>
    </Box>
  );
};

export default ThemeDemo;
