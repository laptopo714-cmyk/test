// Login Page
import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUser, signInWithGoogle } from '../../firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await loginUser(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(getErrorMessage(result.error));
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    const result = await signInWithGoogle();

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(getErrorMessage(result.error));
    }

    setLoading(false);
  };

  const getErrorMessage = error => {
    switch (error) {
      case 'auth/user-not-found':
        return 'البريد الإلكتروني غير مسجل';
      case 'auth/wrong-password':
        return 'كلمة المرور غير صحيحة';
      case 'auth/invalid-email':
        return 'البريد الإلكتروني غير صالح';
      case 'auth/user-disabled':
        return 'تم تعطيل هذا الحساب';
      default:
        return 'حدث خطأ أثناء تسجيل الدخول';
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography component="h1" variant="h4" fontWeight="bold">
            تسجيل الدخول
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            مرحباً بك في أكرم ابراهيم
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="البريد الإلكتروني"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="كلمة المرور"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>

          {/* Forgot Password */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
              underline="hover"
            >
              نسيت كلمة المرور؟
            </Link>
          </Box>

          <Divider sx={{ my: 2 }}>أو</Divider>

          {/* Google Sign In */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{ mb: 2, py: 1.5 }}
          >
            تسجيل الدخول بـ Google
          </Button>

          {/* Register Link */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              ليس لديك حساب؟{' '}
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                underline="hover"
                fontWeight="medium"
              >
                إنشاء حساب جديد
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
