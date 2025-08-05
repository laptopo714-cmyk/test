// Secret Admin Login Page
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  AdminPanelSettings,
  Visibility,
  VisibilityOff,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DeveloperCredit from '../../components/DeveloperCredit';

const SecretAdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Admin credentials (في التطبيق الحقيقي، يجب أن تكون في قاعدة البيانات مع تشفير)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'Admin@2024',
  };

  // التحقق من وجود جلسة إدارة
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      const session = JSON.parse(adminSession);
      // التحقق من انتهاء الجلسة (24 ساعة)
      if (new Date().getTime() - session.timestamp < 24 * 60 * 60 * 1000) {
        navigate('/admin/dashboard');
      } else {
        localStorage.removeItem('adminSession');
      }
    }
  }, [navigate]);

  const handleInputChange = field => event => {
    setCredentials({
      ...credentials,
      [field]: event.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1000));

      // التحقق من بيانات الاعتماد
      if (
        credentials.username === ADMIN_CREDENTIALS.username &&
        credentials.password === ADMIN_CREDENTIALS.password
      ) {
        // إنشاء جلسة إدارة
        const adminSession = {
          username: credentials.username,
          timestamp: new Date().getTime(),
          role: 'admin',
        };

        localStorage.setItem('adminSession', JSON.stringify(adminSession));

        // إعادة توجيه إلى لوحة التحكم
        navigate('/admin/dashboard');
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (error) {
      setError('حدث خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={12}
        sx={{
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }}
        />

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AdminPanelSettings sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              لوحة تحكم الإدارة
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              تسجيل دخول آمن للمديرين فقط
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            {/* Username Field */}
            <TextField
              fullWidth
              label="اسم المستخدم"
              value={credentials.username}
              onChange={handleInputChange('username')}
              InputProps={{
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  color: 'white',
                },
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.7)' },
              }}
              sx={{ mb: 3 }}
              disabled={loading}
              required
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="كلمة المرور"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={handleInputChange('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  color: 'white',
                },
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.7)' },
              }}
              sx={{ mb: 4 }}
              disabled={loading}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={
                loading || !credentials.username || !credentials.password
              }
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={20} color="inherit" />
                  جاري التحقق...
                </Box>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </Box>

          {/* Security Notice */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Security sx={{ mr: 1, opacity: 0.7 }} />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                منطقة آمنة - للمديرين فقط
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{ opacity: 0.7, display: 'block' }}
            >
              جميع محاولات الدخول يتم تسجيلها ومراقبتها
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.7, display: 'block', mt: 1 }}
            >
              في حالة نسيان كلمة المرور، يرجى التواصل مع مطور النظام
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Demo Credentials Info */}
      <Paper
        elevation={2}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          color="warning.main"
          textAlign="center"
        >
          بيانات تجريبية للاختبار
        </Typography>
        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>اسم المستخدم:</strong> admin
          </Typography>
          <Typography variant="body2">
            <strong>كلمة المرور:</strong> Admin@2024
          </Typography>
        </Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          هذه بيانات تجريبية للاختبار فقط. في النظام الحقيقي، يجب تغيير هذه
          البيانات وتشفيرها.
        </Alert>
      </Paper>

      {/* حقوق المطور */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <DeveloperCredit variant="minimal" showPhone={false} />
      </Box>
    </Container>
  );
};

export default SecretAdminLogin;
