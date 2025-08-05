// Student Protected Route Component
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogContent,
  Alert,
  Button,
} from '@mui/material';
import {
  Block as BlockIcon,
  Warning as WarningIcon,
  ContactSupport as ContactIcon,
} from '@mui/icons-material';
import { useStudent } from '../contexts/StudentContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { isDateExpired } from '../utils/dateUtils';

const AccountSuspendedDialog = ({ open, onClose }) => {
  // منع إغلاق الحوار بأي طريقة
  const handleClose = (event, reason) => {
    // منع الإغلاق بالضغط خارج الحوار أو بـ Escape
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
  };

  // منع النقر بالزر الأيمن والاختصارات
  useEffect(() => {
    const preventActions = e => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const preventKeyboard = e => {
      // منع جميع الاختصارات
      if (
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.key === 'F5' ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    if (open) {
      document.addEventListener('contextmenu', preventActions);
      document.addEventListener('keydown', preventKeyboard);
      document.addEventListener('selectstart', preventActions);
      document.addEventListener('dragstart', preventActions);

      // منع التحديد
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
    }

    return () => {
      document.removeEventListener('contextmenu', preventActions);
      document.removeEventListener('keydown', preventKeyboard);
      document.removeEventListener('selectstart', preventActions);
      document.removeEventListener('dragstart', preventActions);

      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
    };
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown
      disableBackdropClick
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'error.main',
          color: 'white',
          border: '3px solid #f44336',
          boxShadow: '0 0 30px rgba(244, 67, 54, 0.5)',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 0 30px rgba(244, 67, 54, 0.5)',
            },
            '50%': {
              boxShadow: '0 0 50px rgba(244, 67, 54, 0.8)',
            },
            '100%': {
              boxShadow: '0 0 30px rgba(244, 67, 54, 0.5)',
            },
          },
        },
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <BlockIcon sx={{ fontSize: 80, color: 'white', mb: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            تم إيقاف حسابك
          </Typography>
        </Box>

        <Alert
          severity="error"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            ⚠️ تنبيه هام ⚠️
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            تم إيقاف حسابك من قبل الإدارة. لا يمكنك الوصول إلى أي محتوى في
            المنصة حتى يتم تفعيل حسابك مرة أخرى.
          </Typography>
        </Alert>

        <Box
          sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            p: 3,
            borderRadius: 2,
            mb: 3,
            border: '2px dashed white',
          }}
        >
          <ContactIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            للتفعيل مرة أخرى
          </Typography>
          <Typography variant="body1">
            الرجاء التواصل مع الإدارة للحصول على المساعدة وتفعيل حسابك
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
          هذه الرسالة لا يمكن إغلاقها أو تجاهلها
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

const StudentProtectedRoute = ({ children }) => {
  const { loading, isLoggedIn, student, logout } = useStudent();
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [accountSuspended, setAccountSuspended] = useState(false);

  // التحقق من حالة الحساب
  useEffect(() => {
    const checkAccountStatus = async () => {
      if (student && student.id) {
        // منع التحقق أثناء مشاهدة الفيديو لتجنب انقطاع المشاهدة
        const isOnVideoPage =
          window.location.pathname.startsWith('/student/video/');
        if (isOnVideoPage) {
          console.log('🎬 تم تأجيل التحقق من حالة الحساب - الطالب يشاهد فيديو');
          return;
        }

        setCheckingStatus(true);
        try {
          // جلب أحدث بيانات الحساب من قاعدة البيانات
          const codeDoc = await getDoc(doc(db, 'accessCodes', student.id));

          if (codeDoc.exists()) {
            const codeData = codeDoc.data();

            // التحقق من حالة التفعيل
            if (!codeData.isActive) {
              setAccountSuspended(true);
              return;
            }

            // التحقق من انتهاء الصلاحية
            if (codeData.expiryDate && isDateExpired(codeData.expiryDate)) {
              setAccountSuspended(true);
              return;
            }
          } else {
            // الحساب غير موجود
            setAccountSuspended(true);
            return;
          }
        } catch (error) {
          console.error('خطأ في التحقق من حالة الحساب:', error);
        } finally {
          setCheckingStatus(false);
        }
      }
    };

    if (isLoggedIn && student) {
      checkAccountStatus();

      // التحقق الدوري كل دقيقة مع حماية من التحديث أثناء مشاهدة الفيديو
      const interval = setInterval(() => {
        const isOnVideoPage =
          window.location.pathname.startsWith('/student/video/');
        if (!isOnVideoPage) {
          checkAccountStatus();
        } else {
          console.log('🎬 تم تخطي التحقق من حالة الحساب - الطالب يشاهد فيديو');
        }
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, student]);

  if (loading || checkingStatus) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">
          {loading
            ? 'جاري التحقق من بيانات الطالب...'
            : 'جاري التحقق من حالة الحساب...'}
        </Typography>
      </Box>
    );
  }

  if (!isLoggedIn || !student) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان الحساب معطل، عرض الرسالة المزعجة
  if (accountSuspended) {
    return <AccountSuspendedDialog open={true} />;
  }

  return children;
};

export default StudentProtectedRoute;
