// Expiry Countdown Component
import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Alert } from '@mui/material';
import { Schedule, Warning, CheckCircle } from '@mui/icons-material';
import { useStudent } from '../contexts/StudentContext';
import { formatDate } from '../utils/dateUtils';

const ExpiryCountdown = ({ expiryDate, studentName }) => {
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [status, setStatus] = useState('active'); // active, warning, expired
  const { logout } = useStudent();

  useEffect(() => {
    if (!expiryDate) {
      setDaysRemaining(null);
      setStatus('unlimited');
      return;
    }

    const calculateDaysRemaining = () => {
      const now = new Date();
      let expiry;

      // Handle different date formats safely
      if (expiryDate && typeof expiryDate.toDate === 'function') {
        expiry = expiryDate.toDate();
      } else if (expiryDate && typeof expiryDate.seconds === 'number') {
        expiry = new Date(expiryDate.seconds * 1000);
      } else if (expiryDate instanceof Date) {
        expiry = expiryDate;
      } else if (typeof expiryDate === 'number') {
        expiry = new Date(expiryDate);
      } else if (typeof expiryDate === 'string') {
        expiry = new Date(expiryDate);
      } else {
        // Invalid date format
        setDaysRemaining(null);
        setStatus('unlimited');
        return;
      }

      // Check if date is valid
      if (isNaN(expiry.getTime())) {
        setDaysRemaining(null);
        setStatus('unlimited');
        return;
      }

      const diffTime = expiry - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setDaysRemaining(diffDays);

      if (diffDays <= 0) {
        setStatus('expired');
        // تسجيل خروج تلقائي عند انتهاء الصلاحية (مرة واحدة فقط)
        if (status !== 'expired') {
          setTimeout(() => {
            alert('انتهت صلاحية حسابك. سيتم تسجيل خروجك الآن.');
            logout();
          }, 2000);
        }
      } else if (diffDays <= 7) {
        setStatus('warning');
      } else {
        setStatus('active');
      }
    };

    // حساب الأيام المتبقية فوراً
    calculateDaysRemaining();

    // تحديث العداد كل دقيقة
    const interval = setInterval(calculateDaysRemaining, 60000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  if (!expiryDate) {
    return (
      <Chip
        icon={<CheckCircle />}
        label="حساب دائم"
        color="success"
        variant="outlined"
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    );
  }

  const getStatusColor = () => {
    switch (status) {
      case 'expired':
        return 'error';
      case 'warning':
        return 'warning';
      case 'active':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'expired':
        return <Warning />;
      case 'warning':
        return <Warning />;
      case 'active':
        return <Schedule />;
      default:
        return <Schedule />;
    }
  };

  const getStatusText = () => {
    if (status === 'expired') {
      return 'انتهت الصلاحية';
    } else if (
      status === 'unlimited' ||
      daysRemaining === null ||
      isNaN(daysRemaining)
    ) {
      return 'حساب دائم';
    } else if (daysRemaining === 1) {
      return 'متبقي يوم واحد';
    } else if (daysRemaining === 2) {
      return 'متبقي يومان';
    } else if (daysRemaining <= 10) {
      return `متبقي ${daysRemaining} أيام`;
    } else {
      return `متبقي ${daysRemaining} يوم`;
    }
  };

  const formatExpiryDate = () => {
    let expiry;

    // Handle different date formats safely
    if (expiryDate && typeof expiryDate.toDate === 'function') {
      expiry = expiryDate.toDate();
    } else if (expiryDate && typeof expiryDate.seconds === 'number') {
      expiry = new Date(expiryDate.seconds * 1000);
    } else if (expiryDate instanceof Date) {
      expiry = expiryDate;
    } else if (typeof expiryDate === 'number') {
      expiry = new Date(expiryDate);
    } else if (typeof expiryDate === 'string') {
      expiry = new Date(expiryDate);
    } else {
      return 'تاريخ غير صحيح';
    }

    // Check if date is valid
    if (isNaN(expiry.getTime())) {
      return 'تاريخ غير صحيح';
    }

    return expiry.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Chip
        icon={getStatusIcon()}
        label={getStatusText()}
        color={getStatusColor()}
        variant={status === 'expired' ? 'filled' : 'outlined'}
        size="small"
        sx={{
          fontWeight: 'bold',
          animation:
            status === 'warning' || status === 'expired'
              ? 'pulse 2s infinite'
              : 'none',
        }}
      />

      {status === 'expired' && (
        <Alert severity="error" sx={{ mt: 1, fontSize: '0.8rem' }}>
          <Typography variant="caption">
            انتهت صلاحية حسابك في {formatExpiryDate()}. يرجى التواصل مع الإدارة
            لتجديد الاشتراك.
          </Typography>
        </Alert>
      )}

      {status === 'warning' && (
        <Alert severity="warning" sx={{ mt: 1, fontSize: '0.8rem' }}>
          <Typography variant="caption">
            ستنتهي صلاحية حسابك في {formatExpiryDate()}. يرجى التواصل مع الإدارة
            لتجديد الاشتراك.
          </Typography>
        </Alert>
      )}

      {/* CSS للأنيميشن */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default ExpiryCountdown;
