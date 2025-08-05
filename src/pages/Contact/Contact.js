// Contact Us Page
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  Alert,
  Divider,
} from '@mui/material';
import {
  ContactMail,
  Home,
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Send,
  Person,
  WhatsApp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // هنا يمكن إضافة منطق إرسال الرسالة
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // إخفاء رسالة النجاح بعد 5 ثوان
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const contactInfo = [
    {
      icon: <Person sx={{ fontSize: 30, color: 'primary.main' }} />,
      title: 'المسيو',
      details: ['الأستاذ أكرم إبراهيم', 'مسيو متخصص في اللغه الفرنسية'],
      primary: true,
    },
    {
      icon: <Phone sx={{ fontSize: 30, color: 'success.main' }} />,
      title: 'الهاتف',
      details: ['01023232323', 'متاح من 9 صباحاً حتى 9 مساءً'],
      action: 'tel:01023232323',
    },
    {
      icon: <WhatsApp sx={{ fontSize: 30, color: 'success.main' }} />,
      title: 'واتساب',
      details: ['01023232323', 'للاستفسارات السريعة'],
      action: 'https://wa.me/201023232323',
    },
    {
      icon: <Email sx={{ fontSize: 30, color: 'info.main' }} />,
      title: 'البريد الإلكتروني',
      details: ['akram.ibrahim@gmail.com', 'نرد خلال 24 ساعة'],
      action: 'mailto:akram.ibrahim@gmail.com',
    },
    {
      icon: <LocationOn sx={{ fontSize: 30, color: 'warning.main' }} />,
      title: 'الموقع',
      details: ['المنصورة - الدقهلية', 'للقاءات المباشرة بموعد مسبق'],
    },
    {
      icon: <AccessTime sx={{ fontSize: 30, color: 'secondary.main' }} />,
      title: 'ساعات العمل',
      details: ['السبت - الخميس: 9:00 ص - 9:00 م', 'الجمعة: مغلق'],
    },
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
          <ContactMail fontSize="small" />
          اتصل بنا
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper
        elevation={3}
        sx={{ p: 4, mb: 4, borderRadius: 3, textAlign: 'center' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ContactMail sx={{ fontSize: 60, color: 'primary.main' }} />
        </Box>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
        >
          تواصل معنا
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          نحن هنا لمساعدتك في رحلتك التعليمية
        </Typography>
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.8, maxWidth: '600px', mx: 'auto' }}
        >
          لديك سؤال أو استفسار؟ تحتاج مساعدة في استخدام المنصة؟ لا تتردد في
          التواصل معنا عبر أي من الطرق التالية.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        {/* معلومات الاتصال */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            معلومات الاتصال
          </Typography>
          <Grid container spacing={3}>
            {contactInfo.map((info, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    cursor: info.action ? 'pointer' : 'default',
                    transition: 'all 0.3s ease',
                    border: info.primary ? '2px solid' : 'none',
                    borderColor: info.primary ? 'primary.main' : 'transparent',
                    '&:hover': info.action
                      ? {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        }
                      : {},
                  }}
                  onClick={() => {
                    if (info.action) {
                      if (info.action.startsWith('http')) {
                        window.open(info.action, '_blank');
                      } else {
                        window.location.href = info.action;
                      }
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}
                    >
                      <Box sx={{ mt: 0.5 }}>{info.icon}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 'bold', mb: 1 }}
                        >
                          {info.title}
                        </Typography>
                        {info.details.map((detail, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            color={
                              idx === 0 ? 'text.primary' : 'text.secondary'
                            }
                            sx={{
                              mb: idx === 0 ? 0.5 : 0,
                              fontWeight: idx === 0 ? 'medium' : 'normal',
                            }}
                          >
                            {detail}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* نموذج الاتصال */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}
            >
              أرسل رسالة
            </Typography>

            {showSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="الاسم الكامل"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="الموضوع"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="الرسالة"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
                sx={{ mb: 3 }}
                variant="outlined"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Send />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                }}
              >
                إرسال الرسالة
              </Button>
            </Box>
          </Paper>

          {/* معلومات إضافية */}
          <Paper
            elevation={2}
            sx={{ p: 3, mt: 3, borderRadius: 3, bgcolor: 'primary.50' }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
            >
              💡 نصائح للتواصل الفعال
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                • كن واضحاً ومحدداً في استفسارك
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • اذكر رقم الطالب إذا كان لديك حساب
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • للاستفسارات العاجلة، استخدم الواتساب
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • نرد على الرسائل خلال 24 ساعة
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;
