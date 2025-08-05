// About Us Page
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Breadcrumbs,
  Link,
  Divider,
} from '@mui/material';
import {
  School,
  Home,
  EmojiObjects,
  Group,
  Star,
  TrendingUp,
  Security,
  Support,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <EmojiObjects sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'تعلم تفاعلي',
      description: 'منصة تعليمية متطورة تقدم تجربة تعلم تفاعلية وممتعة',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'أمان عالي',
      description: 'نظام حماية متقدم يضمن أمان المحتوى وخصوصية الطلاب',
    },
    {
      icon: <Support sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'دعم مستمر',
      description: 'فريق دعم متخصص متاح لمساعدتك في أي وقت',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'تطوير مستمر',
      description: 'نحدث المنصة باستمرار لتقديم أفضل تجربة تعليمية',
    },
  ];

  const stats = [
    { number: '1000+', label: 'طالب نشط' },
    { number: '50+', label: 'دورة تدريبية' },
    { number: '20+', label: 'مدرب خبير' },
    { number: '95%', label: 'معدل الرضا' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="/"
          onClick={e => {
            e.preventDefault();
            navigate('/');
          }}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Home fontSize="small" />
          الرئيسية
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Group fontSize="small" />
          من نحن
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper
        elevation={3}
        sx={{ p: 4, mb: 4, borderRadius: 3, textAlign: 'center' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <School sx={{ fontSize: 60, color: 'primary.main' }} />
        </Box>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
        >
          أكرم إبراهيم
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          رحلتك نحو التميز تبدأ من هنا
        </Typography>
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.8, maxWidth: '800px', mx: 'auto' }}
        >
          مرحباً بكم في منصة المسيو أكرم إبراهيم التعليمية. منصة تعليمية متخصصة
          تهدف إلى تقديم تجربة تعلم استثنائية باللغة العربية. نؤمن بأن التعليم
          الجيد هو حق للجميع، ونسعى لتوفير محتوى تعليمي عالي الجودة يساعد الطلاب
          على تحقيق أهدافهم الأكاديمية والمهنية.
        </Typography>
      </Paper>

      {/* معلومات المسيو */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 4,
            color: 'primary.main',
          }}
        >
          معلومات المسيو
        </Typography>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: 'white',
                  border: '4px solid',
                  borderColor: 'primary.light',
                }}
              >
                AI
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                أكرم إبراهيم
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                مسيو متخصص
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ pl: { md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                معلومات التواصل:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone sx={{ color: 'success.main' }} />
                  <Typography variant="body1">
                    <strong>رقم الهاتف:</strong> 01023232323
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOn sx={{ color: 'info.main' }} />
                  <Typography variant="body1">
                    <strong>العنوان:</strong> المنصورة - الدقهلية
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* رؤيتنا ورسالتنا */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
              >
                🎯 رؤيتنا
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                أن نكون المنصة التعليمية الرائدة في العالم العربي، نقدم تعليماً
                متميزاً يواكب التطورات التكنولوجية الحديثة ويلبي احتياجات الطلاب
                في عصر الرقمنة.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 'bold', mb: 2, color: 'secondary.main' }}
              >
                📋 رسالتنا
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                تمكين الطلاب من الوصول إلى تعليم عالي الجودة من خلال منصة آمنة
                وسهلة الاستخدام، مع توفير أدوات تعلم متطورة وبيئة تفاعلية تحفز
                على الإبداع والتميز.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* الإحصائيات */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}
        >
          إنجازاتنا بالأرقام
        </Typography>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* مميزاتنا */}
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}
      >
        لماذا تختار منصتنا؟
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* قيمنا */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}
        >
          قيمنا الأساسية
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Star sx={{ fontSize: 50, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                الجودة
              </Typography>
              <Typography variant="body2" color="text.secondary">
                نلتزم بتقديم محتوى تعليمي عالي الجودة يلبي أعلى المعايير
                الأكاديمية
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Security sx={{ fontSize: 50, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                الأمانة
              </Typography>
              <Typography variant="body2" color="text.secondary">
                نحافظ على الثقة الممنوحة لنا من خلال الشفافية والصدق في جميع
                تعاملاتنا
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <EmojiObjects sx={{ fontSize: 50, color: 'info.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                الابتكار
              </Typography>
              <Typography variant="body2" color="text.secondary">
                نسعى دائماً لتطوير حلول تعليمية مبتكرة تواكب احتياجات العصر
                الحديث
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default About;
