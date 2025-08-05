// Enhanced Modern Home Page with Advanced Animations
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Fade,
  Slide,
  Zoom,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Security,
  VideoLibrary,
  DevicesOther,
  Rocket,
  Psychology,
  EmojiEvents,
  AutoAwesome,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../../contexts/StudentContext';
import ThemeToggle from '../../components/ThemeToggle';
import '../../styles/animations.css';

const SimpleHome = () => {
  const navigate = useNavigate();
  const { isLoggedIn, student } = useStudent();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const FeatureCard = ({
    icon,
    title,
    description,
    color = 'primary',
    delay = 0,
    gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }) => (
    <Slide direction="up" in={showContent} timeout={1000 + delay}>
      <Card
        className="card-3d hover-lift stagger-item glass-morphism"
        sx={{
          height: '100%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: gradient,
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          },
          '&:hover': {
            '& .feature-icon': {
              transform: 'scale(1.2) rotate(10deg)',
              filter: 'drop-shadow(0 5px 15px rgba(102, 126, 234, 0.4))',
            },
          },
        }}
      >
        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Box
            className="feature-icon floating"
            sx={{
              color: `${color}.main`,
              mb: 3,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'inline-block',
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h6"
            gutterBottom
            fontWeight="bold"
            className="text-gradient"
            sx={{ mb: 2 }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Slide>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Theme Toggle */}
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <ThemeToggle enhanced />
      </Box>

      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Enhanced Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Fade in={showContent} timeout={1000}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 4 }}>
              <Typography
                variant="h1"
                component="h1"
                className="text-gradient-primary animate-fade-in-pro"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                  mb: 2,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100px',
                    height: '4px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '2px',
                    animation: 'gradientShift 2s ease infinite',
                  },
                }}
              >
                أكرم إبراهيم
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <AutoAwesome sx={{ fontSize: 40, color: '#f093fb' }} />
              </Box>
            </Box>
          </Fade>

          <Slide direction="up" in={showContent} timeout={1200}>
            <Typography
              variant="h4"
              color="text.secondary"
              paragraph
              sx={{
                maxWidth: 700,
                mx: 'auto',
                mb: 6,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              منصة تعليمية متطورة وآمنة للمسيو أكرم إبراهيم مع نظام رموز الوصول
              الفريدة
              <br />
              <Box
                component="span"
                className="text-gradient-secondary"
                sx={{ fontWeight: 600 }}
              >
                لضمان الحماية والخصوصية القصوى
              </Box>
            </Typography>
          </Slide>

          {/* Enhanced Action Buttons */}
          <Zoom in={showContent} timeout={1500}>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                justifyContent: 'center',
                flexWrap: 'wrap',
                mt: 6,
              }}
            >
              {isLoggedIn ? (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Rocket className="floating-fast" />}
                  onClick={() => navigate('/student/dashboard')}
                  className="btn-pro-primary hover-pro"
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: '50px',
                    background: 'var(--gradient-primary)',
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
                  }}
                >
                  متابعة التعلم
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Security className="floating" />}
                  onClick={() => navigate('/login')}
                  className="btn-pro-primary hover-pro"
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: '50px',
                    background: 'var(--gradient-primary)',
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
                  }}
                >
                  تسجيل الدخول برمز الوصول
                </Button>
              )}

              <Button
                variant="outlined"
                size="large"
                startIcon={<AdminPanelSettings className="hover-rotate" />}
                onClick={() => navigate('/secret-admin-login')}
                className="btn-pro-secondary hover-pro"
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '50px',
                  border: '2px solid var(--secondary-400)',
                  background: 'transparent',
                  color: 'var(--secondary-600)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'var(--gradient-secondary)',
                    color: 'var(--text-inverse)',
                    borderColor: 'transparent',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px -5px rgba(20, 184, 166, 0.4)',
                  },
                }}
              >
                لوحة الإدارة
              </Button>
            </Box>
          </Zoom>
        </Box>

        {/* Enhanced Features Section */}
        <Box sx={{ mb: 12 }}>
          <Fade in={showContent} timeout={2000}>
            <Typography
              variant="h3"
              textAlign="center"
              className="text-gradient-primary animate-slide-in-pro"
              sx={{
                mb: 2,
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              مميزات المنصة
            </Typography>
          </Fade>

          <Fade in={showContent} timeout={2200}>
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}
            >
              تجربة تعليمية متطورة مع أحدث تقنيات الأمان والحماية
            </Typography>
          </Fade>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6} lg={3}>
              <FeatureCard
                icon={<Security sx={{ fontSize: 70 }} />}
                delay={200}
                title="أمان متقدم"
                description="نظام رموز وصول فريدة مرتبطة بجهاز واحد فقط لضمان الحماية القصوى مع تشفير متقدم"
                color="primary"
                gradient="var(--gradient-primary)"
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <FeatureCard
                icon={<VideoLibrary sx={{ fontSize: 70 }} />}
                title="فيديوهات محمية"
                description="مشغل فيديو آمن يمنع التحميل والمشاركة مع حماية من لقطة الشاشة وتقنيات مكافحة القرصنة"
                color="secondary"
                delay={400}
                gradient="var(--gradient-secondary)"
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <FeatureCard
                icon={<DevicesOther sx={{ fontSize: 70 }} />}
                title="جهاز واحد فقط"
                description="كل رمز وصول مرتبط بجهاز واحد فقط لمنع المشاركة غير المصرح بها مع نظام تتبع متطور"
                color="info"
                delay={600}
                gradient="var(--gradient-accent)"
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <FeatureCard
                icon={<Psychology sx={{ fontSize: 70 }} />}
                title="تعلم ذكي"
                description="نظام تعلم تكيفي يتابع تقدمك ويقدم المحتوى المناسب لمستواك التعليمي"
                color="success"
                delay={800}
                gradient="var(--gradient-success)"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Enhanced How it Works Section */}
        <Paper
          className="glass-pro hover-pro card-pro"
          sx={{
            p: 6,
            mb: 10,
            borderRadius: '24px',
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'var(--gradient-hero)',
              animation: 'gradientShift 3s ease infinite',
            },
          }}
        >
          <Typography
            variant="h3"
            textAlign="center"
            className="text-gradient-primary animate-scale-pro"
            sx={{
              mb: 3,
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            كيف يعمل النظام؟
          </Typography>

          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 500, mx: 'auto' }}
          >
            ثلاث خطوات بسيطة للوصول إلى عالم التعلم الآمن
          </Typography>

          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box
                className="card-pro hover-pro animate-fade-in-pro"
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  p: 3,
                  borderRadius: '16px',
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 'var(--shadow-xl)',
                  },
                }}
              >
                <Avatar
                  className="pulse-scale"
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    background: 'var(--gradient-primary)',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    boxShadow: 'var(--shadow-colored)',
                  }}
                >
                  1
                </Avatar>
                <Typography
                  variant="h5"
                  gutterBottom
                  className="text-gradient"
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  احصل على رمز الوصول
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  يقوم المدرب بإنشاء رمز وصول فريد لك مكون من 8 أحرف وأرقام مع
                  ربطه بمعلوماتك الشخصية
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                className="stagger-item hover-lift"
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  p: 3,
                  borderRadius: '20px',
                  background:
                    'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(240, 147, 251, 0.2)',
                  },
                }}
              >
                <Avatar
                  className="pulse-scale"
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    background:
                      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 25px rgba(240, 147, 251, 0.4)',
                  }}
                >
                  2
                </Avatar>
                <Typography
                  variant="h5"
                  gutterBottom
                  className="text-gradient-secondary"
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  سجل دخولك
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  أدخل رمز الوصول في صفحة تسجيل الدخول وسيتم ربطه بجهازك بشكل
                  دائم وآمن
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                className="stagger-item hover-lift"
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  p: 3,
                  borderRadius: '20px',
                  background:
                    'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(79, 172, 254, 0.2)',
                  },
                }}
              >
                <Avatar
                  className="pulse-scale"
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    background:
                      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 25px rgba(79, 172, 254, 0.4)',
                  }}
                >
                  3
                </Avatar>
                <Typography
                  variant="h5"
                  gutterBottom
                  className="text-gradient-tertiary"
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  ابدأ التعلم
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  شاهد الفيديوهات المخصصة لك بأمان تام ومن جهازك فقط مع تتبع
                  تقدمك التعليمي
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Enhanced Security Notice */}
        <Paper
          className="glass-morphism hover-glow"
          sx={{
            p: 6,
            textAlign: 'center',
            background:
              'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '2px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '25px',
            position: 'relative',
            overflow: 'hidden',
            mb: 8,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background:
                'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
              animation: 'float 8s ease-in-out infinite',
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              className="floating pulse-glow"
              sx={{
                display: 'inline-block',
                p: 3,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mb: 3,
                boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
              }}
            >
              <Security sx={{ fontSize: 60, color: 'white' }} />
            </Box>

            <Typography
              variant="h4"
              gutterBottom
              className="text-gradient"
              sx={{ fontWeight: 800, mb: 3 }}
            >
              ضمان الأمان والخصوصية
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.7,
                mb: 4,
              }}
            >
              جميع الفيديوهات محمية ضد التحميل والمشاركة بأحدث تقنيات الحماية.
              <br />
              كل رمز وصول مرتبط بجهاز واحد فقط مع تشفير متقدم ومراقبة مستمرة.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box className="stagger-item">
                  <EmojiEvents sx={{ fontSize: 40, color: '#f093fb', mb: 1 }} />
                  <Typography variant="h6" className="text-gradient-secondary">
                    حماية متقدمة
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box className="stagger-item">
                  <Security sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                  <Typography variant="h6" className="text-gradient">
                    تشفير قوي
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box className="stagger-item">
                  <DevicesOther
                    sx={{ fontSize: 40, color: '#4facfe', mb: 1 }}
                  />
                  <Typography variant="h6" className="text-gradient-tertiary">
                    جهاز واحد
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box className="stagger-item">
                  <Psychology sx={{ fontSize: 40, color: '#48bb78', mb: 1 }} />
                  <Typography variant="h6" sx={{ color: '#48bb78' }}>
                    مراقبة ذكية
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Enhanced Current User Info */}
        {isLoggedIn && student && (
          <Paper
            className="glass-morphism hover-lift zoom-in"
            sx={{
              mt: 6,
              p: 6,
              textAlign: 'center',
              background:
                'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%)',
              border: '2px solid rgba(72, 187, 120, 0.3)',
              borderRadius: '25px',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #48bb78, #38a169, #2f855a)',
                animation: 'gradientShift 3s ease infinite',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Avatar
                className="pulse-scale floating"
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 3,
                  background:
                    'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  fontSize: '3rem',
                  boxShadow: '0 15px 35px rgba(72, 187, 120, 0.4)',
                }}
              >
                👋
              </Avatar>

              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: '#48bb78',
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                مرحباً، {student.studentName}!
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                أنت مسجل دخول برمز الوصول:
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: '#48bb78',
                    background: 'rgba(72, 187, 120, 0.1)',
                    px: 2,
                    py: 0.5,
                    borderRadius: '15px',
                    mx: 1,
                  }}
                >
                  {student.code}
                </Box>
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<Rocket className="floating-fast" />}
                onClick={() => navigate('/student/dashboard')}
                className="hover-lift pulse-glow"
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: '50px',
                  background:
                    'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  boxShadow: '0 10px 25px rgba(72, 187, 120, 0.4)',
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
                      'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: '0 15px 35px rgba(72, 187, 120, 0.6)',
                  },
                }}
              >
                الذهاب إلى لوحة التحكم
              </Button>
            </Box>
          </Paper>
        )}

        {/* Enhanced CSS Animations */}
        <style>
          {`
          @keyframes advancedPulse {
            0% { 
              opacity: 0.8; 
              transform: scale(1);
              filter: brightness(1);
            }
            50% { 
              opacity: 1; 
              transform: scale(1.02);
              filter: brightness(1.1);
            }
            100% { 
              opacity: 0.8; 
              transform: scale(1);
              filter: brightness(1);
            }
          }
          
          @keyframes advancedFloat {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg); 
            }
            25% { 
              transform: translateY(-15px) rotate(2deg); 
            }
            50% { 
              transform: translateY(-8px) rotate(0deg); 
            }
            75% { 
              transform: translateY(-20px) rotate(-2deg); 
            }
          }
          
          @keyframes sparkle {
            0%, 100% { 
              opacity: 0;
              transform: scale(0) rotate(0deg);
            }
            50% { 
              opacity: 1;
              transform: scale(1) rotate(180deg);
            }
          }
          
          @keyframes backgroundShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .advanced-floating {
            animation: advancedFloat 4s ease-in-out infinite;
          }
          
          .sparkle-effect::after {
            content: '✨';
            position: absolute;
            top: -10px;
            right: -10px;
            animation: sparkle 2s ease-in-out infinite;
            font-size: 1.5rem;
          }
          
          .gradient-background {
            background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
            background-size: 400% 400%;
            animation: backgroundShift 8s ease infinite;
          }
          
          .text-shadow-glow {
            text-shadow: 
              0 0 10px rgba(102, 126, 234, 0.5),
              0 0 20px rgba(102, 126, 234, 0.3),
              0 0 30px rgba(102, 126, 234, 0.2);
          }
          
          .card-hover-effect {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .card-hover-effect:hover {
            transform: perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(20px);
            box-shadow: 
              0 25px 50px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(255, 255, 255, 0.1);
          }
          
          @media (max-width: 768px) {
            .card-hover-effect:hover {
              transform: translateY(-5px) scale(1.02);
            }
            
            .advanced-floating {
              animation-duration: 3s;
            }
          }
        `}
        </style>
      </Container>
    </Box>
  );
};

export default SimpleHome;
