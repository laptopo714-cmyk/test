// Enhanced Modern Footer Component with Advanced Animations
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  AutoAwesome,
  Rocket,
  Security,
  School,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      className="glass-morphism"
      sx={{
        background:
          'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        color: 'white',
        py: 6,
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background:
            'linear-gradient(90deg, #f093fb, #f5576c, #4facfe, #00f2fe)',
          animation: 'gradientShift 4s ease infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          animation: 'float 15s ease-in-out infinite',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Enhanced Platform Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  className="floating pulse-glow"
                  sx={{
                    background:
                      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    width: 50,
                    height: 50,
                    mr: 2,
                    boxShadow: '0 8px 25px rgba(240, 147, 251, 0.4)',
                  }}
                >
                  <School sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  أكرم إبراهيم
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.8,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1.1rem',
                }}
              >
                منصة تعليمية متطورة وآمنة تهدف إلى توفير أفضل التجارب التعليمية
                باستخدام أحدث التقنيات والأساليب التفاعلية.
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                <Chip
                  icon={<Security />}
                  label="آمن"
                  className="hover-lift"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
                <Chip
                  icon={<Rocket />}
                  label="سريع"
                  className="hover-lift"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
                <Chip
                  icon={<AutoAwesome />}
                  label="متطور"
                  className="hover-lift"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Enhanced Social Media */}
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 700, mb: 2 }}
            >
              تابعنا على
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: <Facebook />, color: '#1877f2' },
                { icon: <Twitter />, color: '#1da1f2' },
                { icon: <Instagram />, color: '#e4405f' },
                { icon: <LinkedIn />, color: '#0077b5' },
                { icon: <YouTube />, color: '#ff0000' },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  className="hover-lift"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: social.color,
                      transform: 'translateY(-3px) scale(1.1)',
                      boxShadow: `0 8px 25px ${social.color}40`,
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* الصفحات الأساسية */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              الصفحات
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" color="inherit" underline="hover">
                من نحن
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                اتصل بنا
              </Link>
              <Link href="/help" color="inherit" underline="hover">
                المساعدة
              </Link>
            </Box>
          </Grid>

          {/* فارغ للتوازن */}
          <Grid item xs={12} sm={6} md={2}></Grid>

          {/* فارغ للتوازن */}
          <Grid item xs={12} sm={6} md={2}></Grid>

          {/* معلومات الاتصال */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              للتواصل مع المسيو
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">01023232323</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">المنصورة - الدقهلية</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* حقوق النشر */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="body2">
              © 2025 . جميع الحقوق محفوظة لمسيو أكرم إبراهيم
            </Typography>
          </Grid>

          {/* حقوق المطور */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: { xs: 'left', md: 'center' },
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  color: 'rgba(255,255,255,0.95)',
                  fontSize: '0.9rem',
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'flex-start', md: 'center' },
                  gap: 1,
                }}
              >
                👨‍💻 تطوير: كريم عطية عطية
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'flex-start', md: 'center' },
                  gap: 1,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                <Phone sx={{ fontSize: 16, color: 'success.light' }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: 'medium',
                    letterSpacing: '0.5px',
                  }}
                >
                  📞 01095288373
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                gap: 2,
              }}
            >
              <Link href="/privacy" color="inherit" underline="hover">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" color="inherit" underline="hover">
                شروط الاستخدام
              </Link>
              <Link href="/cookies" color="inherit" underline="hover">
                سياسة الكوكيز
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
