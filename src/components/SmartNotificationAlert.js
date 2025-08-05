// Smart Notification Alert Component
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Slide,
  Snackbar,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close, NotificationsActive, Visibility } from '@mui/icons-material';

const SmartNotificationAlert = ({
  show,
  unreadCount,
  onView,
  onClose,
  autoHideDuration = 5000,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (show && unreadCount > 0) {
      setOpen(true);
    }
  }, [show, unreadCount]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    if (onClose) onClose();
  };

  const handleView = () => {
    setOpen(false);
    if (onView) onView();
  };

  if (!show || unreadCount === 0) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'down' }}
    >
      <Alert
        severity="warning"
        variant="filled"
        sx={{
          minWidth: 300,
          animation: 'pulse 2s infinite',
          '& .MuiAlert-message': {
            fontWeight: 'bold',
            fontSize: '1rem',
          },
          '& .MuiAlert-action': {
            alignItems: 'center',
          },
        }}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              color="inherit"
              size="small"
              onClick={handleView}
              startIcon={<Visibility />}
              sx={{
                fontWeight: 'bold',
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              مراجعة
            </Button>
            <IconButton size="small" color="inherit" onClick={handleClose}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        }
        icon={<NotificationsActive />}
      >
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            لديك {unreadCount} إشعار جديد!
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            يرجى مراجعة الإشعارات الجديدة
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default SmartNotificationAlert;
