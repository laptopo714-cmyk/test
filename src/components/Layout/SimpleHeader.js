// Enhanced Modern Header Component with Advanced Animations
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Chip,
} from '@mui/material';
import {
  School,
  ExitToApp,
  AdminPanelSettings,
  AutoAwesome,
  Rocket,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStudent } from '../../contexts/StudentContext';
import ThemeToggle from '../ThemeToggle';

const SimpleHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { student, logout, isLoggedIn } = useStudent();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdminRoute = location.pathname.includes('/admin');
  const isStudentRoute = location.pathname.includes('/student');

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: scrolled
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(102, 126, 234, 0.2)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: scrolled
          ? '0 8px 32px rgba(0, 0, 0, 0.1)'
          : '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Enhanced Logo */}
        <IconButton
          edge="start"
          onClick={() => navigate('/')}
          className="hover-lift"
          sx={{
            mr: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '15px',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              transform: 'scale(1.1) rotate(5deg)',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            },
          }}
        >
          <School sx={{ fontSize: 28 }} />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          }}
          onClick={() => navigate('/')}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 900,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mr: 1,
            }}
          >
            أكرم إبراهيم
          </Typography>
          <AutoAwesome
            className="floating"
            sx={{
              color: '#f093fb',
              fontSize: 20,
              animation: 'float 3s ease-in-out infinite',
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Enhanced Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Enhanced Theme Toggle */}
          <ThemeToggle enhanced={true} />

          {/* Enhanced Student Info */}
          {isLoggedIn && student && isStudentRoute && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                avatar={
                  <Avatar
                    sx={{
                      background:
                        'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                      width: 32,
                      height: 32,
                    }}
                  >
                    👋
                  </Avatar>
                }
                label={`مرحباً، ${student.studentName}`}
                className="hover-lift"
                sx={{
                  background: 'rgba(72, 187, 120, 0.1)',
                  color: '#48bb78',
                  fontWeight: 600,
                  border: '1px solid rgba(72, 187, 120, 0.3)',
                  display: { xs: 'none', sm: 'flex' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(72, 187, 120, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 15px rgba(72, 187, 120, 0.3)',
                  },
                }}
              />
              <Button
                startIcon={<ExitToApp />}
                onClick={handleLogout}
                className="hover-lift"
                sx={{
                  borderRadius: '25px',
                  px: 3,
                  py: 1,
                  background:
                    'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                  color: 'white',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(245, 101, 101, 0.4)',
                  },
                }}
              >
                خروج
              </Button>
            </Box>
          )}

          {/* Enhanced Admin Info */}
          {isAdminRoute && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                avatar={
                  <Avatar
                    sx={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      width: 32,
                      height: 32,
                    }}
                  >
                    <AdminPanelSettings sx={{ fontSize: 18 }} />
                  </Avatar>
                }
                label="لوحة الإدارة"
                className="hover-lift"
                sx={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  fontWeight: 600,
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  display: { xs: 'none', sm: 'flex' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
                  },
                }}
              />
              <Button
                startIcon={<ExitToApp />}
                onClick={() => {
                  localStorage.removeItem('adminSession');
                  navigate('/');
                }}
                className="hover-lift"
                sx={{
                  borderRadius: '25px',
                  px: 3,
                  py: 1,
                  background:
                    'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                  color: 'white',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(245, 101, 101, 0.4)',
                  },
                }}
              >
                خروج
              </Button>
            </Box>
          )}

          {/* Enhanced Login Button for Public Pages */}
          {!isLoggedIn && !isAdminRoute && (
            <Button
              onClick={() => navigate('/login')}
              startIcon={<Rocket className="floating-fast" />}
              className="hover-lift pulse-glow"
              sx={{
                borderRadius: '25px',
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.6s',
                },
                '&:hover::before': {
                  left: '100%',
                },
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-2px) scale(1.05)',
                  boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              تسجيل الدخول
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SimpleHeader;
