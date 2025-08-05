// Enhanced Unified Theme Toggle Component
import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { LightMode, DarkMode, AutoAwesome } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({
  variant = 'icon',
  size = 'medium',
  showLabel = false,
  enhanced = false,
}) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  // تأكد من التحميل الصحيح
  useEffect(() => {
    setMounted(true);

    // تطبيق الثيم على data-theme attribute
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );
  }, [darkMode]);

  // منع عرض المكون قبل التحميل الكامل لتجنب الوميض
  if (!mounted) {
    return null;
  }

  const handleToggle = () => {
    toggleDarkMode();

    // إضافة تأثير انتقال سلس
    document.documentElement.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  };

  // نسخة Switch للنماذج
  if (variant === 'switch') {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={darkMode}
            onChange={handleToggle}
            sx={{
              '& .MuiSwitch-switchBase': {
                color: darkMode ? '#7c7ce8' : '#f97316',
                '&.Mui-checked': {
                  color: '#7c7ce8',
                  '& + .MuiSwitch-track': {
                    backgroundColor: darkMode
                      ? 'rgba(124, 124, 232, 0.3)'
                      : 'rgba(249, 115, 22, 0.3)',
                  },
                },
              },
              '& .MuiSwitch-track': {
                backgroundColor: darkMode
                  ? 'rgba(124, 124, 232, 0.2)'
                  : 'rgba(249, 115, 22, 0.2)',
              },
            }}
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {darkMode ? (
              <DarkMode sx={{ color: '#7c7ce8' }} />
            ) : (
              <LightMode sx={{ color: '#f97316' }} />
            )}
            {darkMode ? 'الوضع الليلي' : 'الوضع النهاري'}
          </Box>
        }
        sx={{
          color: 'text.primary',
          '& .MuiFormControlLabel-label': {
            fontSize: '0.9rem',
            fontWeight: 500,
          },
        }}
      />
    );
  }

  // النسخة المحسنة مع تأثيرات متقدمة
  if (enhanced) {
    return (
      <Tooltip
        title={darkMode ? 'تبديل إلى الوضع النهاري' : 'تبديل إلى الوضع الليلي'}
        arrow
      >
        <IconButton
          onClick={handleToggle}
          className="hover-pro"
          aria-label={
            darkMode ? 'تبديل إلى الوضع النهاري' : 'تبديل إلى الوضع الليلي'
          }
          sx={{
            background: darkMode
              ? 'linear-gradient(135deg, #7c7ce8 0%, #b491d4 50%, #6bb6a7 100%)'
              : 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
            color: 'white',
            width: 52,
            height: 52,
            borderRadius: '16px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: darkMode
              ? '0 8px 25px rgba(124, 124, 232, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 8px 25px rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            border: darkMode
              ? '1px solid rgba(153, 153, 255, 0.2)'
              : '1px solid rgba(255, 255, 255, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              transition: 'left 0.8s ease',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: darkMode
                ? 'conic-gradient(from 0deg, transparent, rgba(124, 124, 232, 0.1), transparent)'
                : 'conic-gradient(from 0deg, transparent, rgba(249, 115, 22, 0.1), transparent)',
              animation: 'rotate 4s linear infinite',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover': {
              transform: 'translateY(-3px) scale(1.08)',
              boxShadow: darkMode
                ? '0 15px 35px rgba(124, 124, 232, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                : '0 15px 35px rgba(249, 115, 22, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              background: darkMode
                ? 'linear-gradient(135deg, #9999ff 0%, #d4b3e8 50%, #8dd4c7 100%)'
                : 'linear-gradient(135deg, #fb923c 0%, #fdba74 50%, #fed7aa 100%)',
            },
            '&:hover::before': {
              left: '100%',
            },
            '&:hover::after': {
              opacity: 1,
            },
            '&:active': {
              transform: 'translateY(-1px) scale(0.95)',
            },
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease',
              transform: darkMode ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
          >
            {darkMode ? (
              <DarkMode
                sx={{
                  fontSize: 26,
                  filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.8 },
                  },
                }}
              />
            ) : (
              <LightMode
                sx={{
                  fontSize: 26,
                  filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.5))',
                  animation: 'glow 2s ease-in-out infinite',
                  '@keyframes glow': {
                    '0%, 100%': {
                      filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.5))',
                      transform: 'scale(1)',
                    },
                    '50%': {
                      filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))',
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              />
            )}
          </Box>

          {/* تأثير النجمة المزخرفة */}
          <AutoAwesome
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              fontSize: 14,
              opacity: darkMode ? 0.8 : 0.6,
              color: darkMode ? '#d4b3e8' : '#fed7aa',
              animation: 'sparkle 3s ease-in-out infinite',
              filter: darkMode
                ? 'drop-shadow(0 0 6px rgba(212, 179, 232, 0.6))'
                : 'drop-shadow(0 0 6px rgba(254, 215, 170, 0.6))',
              '@keyframes sparkle': {
                '0%, 100%': {
                  opacity: darkMode ? 0.8 : 0.6,
                  transform: 'scale(1) rotate(0deg)',
                },
                '25%': {
                  opacity: 1,
                  transform: 'scale(1.2) rotate(90deg)',
                },
                '50%': {
                  opacity: darkMode ? 0.4 : 0.3,
                  transform: 'scale(0.8) rotate(180deg)',
                },
                '75%': {
                  opacity: 1,
                  transform: 'scale(1.1) rotate(270deg)',
                },
              },
            }}
          />
        </IconButton>
      </Tooltip>
    );
  }

  // النسخة الأساسية المحسنة
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title={darkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع المظلم'}>
        <IconButton
          onClick={handleToggle}
          color="inherit"
          size={size}
          aria-label={darkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع المظلم'}
          sx={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '12px',
            background: darkMode
              ? 'rgba(124, 124, 232, 0.1)'
              : 'rgba(249, 115, 22, 0.1)',
            border: darkMode
              ? '1px solid rgba(124, 124, 232, 0.2)'
              : '1px solid rgba(249, 115, 22, 0.2)',
            color: darkMode ? '#7c7ce8' : '#f97316',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
              background: darkMode
                ? 'rgba(124, 124, 232, 0.2)'
                : 'rgba(249, 115, 22, 0.2)',
              boxShadow: darkMode
                ? '0 5px 15px rgba(124, 124, 232, 0.3)'
                : '0 5px 15px rgba(249, 115, 22, 0.3)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          {darkMode ? (
            <LightMode
              sx={{
                fontSize: size === 'large' ? 32 : size === 'small' ? 20 : 24,
                filter: 'drop-shadow(0 0 8px rgba(124, 124, 232, 0.5))',
              }}
            />
          ) : (
            <DarkMode
              sx={{
                fontSize: size === 'large' ? 32 : size === 'small' ? 20 : 24,
                filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))',
              }}
            />
          )}
        </IconButton>
      </Tooltip>

      {showLabel && (
        <Box
          sx={{
            fontSize: '0.875rem',
            color: 'text.secondary',
            fontWeight: 500,
            transition: 'color 0.3s ease',
          }}
        >
          {darkMode ? 'مظلم' : 'فاتح'}
        </Box>
      )}
    </Box>
  );
};

export default ThemeToggle;
