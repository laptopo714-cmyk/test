// Enhanced Notification Badge Component
import React from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { Notifications, NotificationsActive } from '@mui/icons-material';
import { useStudent } from '../contexts/StudentContext';

const NotificationBadge = ({
  onClick,
  size = 'medium',
  showTooltip = true,
}) => {
  const { unreadCount } = useStudent();

  const badgeContent = unreadCount > 99 ? '99+' : unreadCount;
  const hasNotifications = unreadCount > 0;

  const button = (
    <IconButton
      onClick={onClick}
      size={size}
      sx={{
        color: hasNotifications ? 'primary.main' : 'text.secondary',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
          transform: 'scale(1.1)',
        },
      }}
    >
      <Badge
        badgeContent={badgeContent}
        color="error"
        sx={{
          '& .MuiBadge-badge': {
            fontSize: '0.75rem',
            minWidth: '18px',
            height: '18px',
            animation: hasNotifications ? 'pulse 2s infinite' : 'none',
          },
        }}
      >
        {hasNotifications ? (
          <NotificationsActive
            sx={{
              fontSize: size === 'large' ? 28 : size === 'small' ? 20 : 24,
              filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))',
            }}
          />
        ) : (
          <Notifications
            sx={{
              fontSize: size === 'large' ? 28 : size === 'small' ? 20 : 24,
            }}
          />
        )}
      </Badge>
    </IconButton>
  );

  if (!showTooltip) return button;

  return (
    <Tooltip
      title={
        hasNotifications
          ? `لديك ${unreadCount} إشعار${unreadCount > 1 ? 'ات' : ''} جديد${
              unreadCount > 1 ? 'ة' : ''
            }`
          : 'لا توجد إشعارات جديدة'
      }
      arrow
    >
      {button}
    </Tooltip>
  );
};

export default NotificationBadge;
