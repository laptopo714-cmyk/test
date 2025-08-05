// Main App Component - Access Code Based Learning Platform
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Theme and Context Providers
import { CustomThemeProvider } from './contexts/ThemeContext';
import { StudentProvider } from './contexts/StudentContext';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import './styles/professional-colors.css';
import './styles/animations.css';
import './styles/modern-enhancements.css';
import './styles/dark-mode-enhancements.css';
import './styles/arabic-dark-theme.css';
import './styles/theme-transitions.css';

// Layout and Protection
import Layout from './components/Layout/Layout';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import StudentProtectedRoute from './components/StudentProtectedRoute';
import ThemeInitializer from './components/ThemeInitializer';

// Pages
import SimpleHome from './pages/Home/SimpleHome';
import AccessCodeLogin from './pages/Auth/AccessCodeLogin';
import StudentDashboard from './pages/Student/StudentDashboard';
import VideoPlayer from './pages/Student/VideoPlayer';
import SecretAdminLogin from './pages/Admin/SecretAdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Unauthorized from './pages/Unauthorized';

// Legal Pages
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfUse from './pages/Legal/TermsOfUse';
import CookiesPolicy from './pages/Legal/CookiesPolicy';

// Additional Pages
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Help from './pages/Help/Help';

// Demo Components
import ThemeDemo from './components/ThemeDemo';

// Loading Component
import { Box, CircularProgress, Typography } from '@mui/material';
import { attachVideoEventListeners } from './hooks/useVideoPlaybackState';

const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: 2,
    }}
  >
    <CircularProgress size={60} />
    <Typography variant="h6">جاري التحميل...</Typography>
  </Box>
);

const NotFoundPage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h4" color="error">
      404 - الصفحة غير موجودة
    </Typography>
    <Typography variant="body1" sx={{ mt: 2 }}>
      عذراً، الصفحة التي تبحث عنها غير موجودة
    </Typography>
  </Box>
);

function App() {
  // تهيئة مراقبة عناصر الفيديو عند تحميل التطبيق
  useEffect(() => {
    console.log('🎬 تهيئة مراقبة عناصر الفيديو...');
    const cleanup = attachVideoEventListeners();

    return () => {
      console.log('🧹 تنظيف مراقبة عناصر الفيديو...');
      cleanup();
    };
  }, []);

  return (
    <CustomThemeProvider>
      <ThemeInitializer />
      <AuthProvider>
        <StudentProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<SimpleHome />} />
                <Route path="/login" element={<AccessCodeLogin />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Legal Pages */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfUse />} />
                <Route path="/cookies" element={<CookiesPolicy />} />

                {/* Additional Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />

                {/* Demo Pages */}
                <Route path="/theme-demo" element={<ThemeDemo />} />

                {/* Student Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <StudentProtectedRoute>
                      <StudentDashboard />
                    </StudentProtectedRoute>
                  }
                />
                <Route
                  path="/student/video/:videoId"
                  element={
                    <StudentProtectedRoute>
                      <VideoPlayer />
                    </StudentProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/secret-admin-login"
                  element={<SecretAdminLogin />}
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />

                {/* Catch all route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </Router>
        </StudentProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
