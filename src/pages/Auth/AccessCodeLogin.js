// Access Code Login Page
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
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { VpnKey, Security, DevicesOther, Login } from '@mui/icons-material';
import { useStudent } from '../../contexts/StudentContext';
import { useNavigate } from 'react-router-dom';
import DeveloperCredit from '../../components/DeveloperCredit';

const AccessCodeLogin = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(true); // حفظ تسجيل الدخول افتراضياً
  const { loginWithAccessCode, loading, error, isLoggedIn, clearError } =
    useStudent();
  const navigate = useNavigate();

  // إعادة توجيه إذا كان مسجل دخول بالفعل
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/student/dashboard');
    }
  }, [isLoggedIn, navigate]);

  // مسح الخطأ عند تغيير رمز الوصول
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [accessCode]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!accessCode.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(
        '🔄 محاولة تسجيل الدخول برمز:',
        accessCode.trim().toUpperCase()
      );
      const result = await loginWithAccessCode(
        accessCode.trim().toUpperCase(),
        rememberLogin
      );

      console.log('📊 نتيجة تسجيل الدخول:', result);

      if (result.success) {
        console.log('✅ تم تسجيل الدخول بنجاح');
        // تأخير قصير للتأكد من تحديث الحالة
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 100);
      } else {
        console.error('❌ فشل تسجيل الدخول:', result.error);
        // The error will be handled by the context and displayed via the error state
      }
    } catch (error) {
      console.error('❌ خطأ في تسجيل الدخول:', error);
      // The error will be handled by the context and displayed via the error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccessCodeChange = e => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 8) {
      setAccessCode(value);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Security sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            تسجيل الدخول
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            أدخل رمز الوصول الخاص بك للدخول إلى المنصة
          </Typography>
        </Box>

        <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.3)' }} />

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={clearError}
            >
              {error}
            </Alert>
          )}

          {/* Access Code Input */}
          <TextField
            fullWidth
            label="رمز الوصول"
            value={accessCode}
            onChange={handleAccessCodeChange}
            placeholder="أدخل رمز الوصول المكون من 8 أحرف"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKey sx={{ color: 'rgba(255,255,255,0.7)' }} />
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
                fontSize: '1.2rem',
                letterSpacing: '0.2em',
                textAlign: 'center',
              },
            }}
            InputLabelProps={{
              sx: { color: 'rgba(255,255,255,0.7)' },
            }}
            sx={{ mb: 3 }}
            disabled={isSubmitting}
            autoFocus
            inputProps={{
              maxLength: 8,
              style: { textTransform: 'uppercase' },
            }}
          />

          {/* Remember Login Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberLogin}
                onChange={e => setRememberLogin(e.target.checked)}
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-checked': {
                    color: 'white',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.9)' }}
              >
                حفظ تسجيل الدخول (البقاء متصلاً)
              </Typography>
            }
            sx={{ mb: 2, alignSelf: 'flex-start' }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!accessCode.trim() || isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Login />
              )
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
            {isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </Button>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.3)' }} />

        {/* Security Info */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <DevicesOther sx={{ mr: 1, opacity: 0.7 }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              حماية الجهاز الواحد
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
            رمز الوصول مرتبط بجهاز واحد فقط لضمان الأمان
          </Typography>
          <Typography
            variant="caption"
            sx={{ opacity: 0.7, display: 'block', mt: 1 }}
          >
            في حالة فقدان رمز الوصول، يرجى التواصل مع الإدارة
          </Typography>
        </Box>
      </Paper>

      {/* Additional Info */}
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
          color="primary"
          textAlign="center"
        >
          تعليمات مهمة
        </Typography>
        <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            رمز الوصول مكون من 8 أحرف وأرقام
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            كل رمز مرتبط بجهاز واحد فقط
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            لا تشارك رمز الوصول مع أي شخص آخر
          </Typography>
          <Typography component="li" variant="body2">
            في حالة تغيير الجهاز، يرجى التواصل مع الإدارة
          </Typography>
        </Box>
      </Paper>

      {/* حقوق المطور */}
      <Box sx={{ mt: 3 }}>
        <DeveloperCredit variant="chip" showPhone={false} />
      </Box>
    </Container>
  );
};

export default AccessCodeLogin;
