// Help Page
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
  Chip,
  Alert,
} from '@mui/material';
import {
  Help as HelpIcon,
  Home,
  ExpandMore,
  Search,
  Login,
  VideoLibrary,
  Security,
  Settings,
  ContactSupport,
  QuestionAnswer,
  School,
  Download,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Help = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPanel, setExpandedPanel] = useState(false);

  const handleAccordionChange = panel => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const faqCategories = [
    {
      title: 'تسجيل الدخول والحسابات',
      icon: <Login color="primary" />,
      questions: [
        {
          question: 'كيف أسجل الدخول إلى المنصة؟',
          answer:
            'يمكنك تسجيل الدخول باستخدام رمز الوصول الخاص بك الذي حصلت عليه من المسيو. اذهب إلى صفحة تسجيل الدخول وأدخل الرمز.',
        },
        {
          question: 'نسيت رمز الوصول الخاص بي، ماذا أفعل؟',
          answer:
            'تواصل مع المسيو مباشرة للحصول على رمز الوصول الخاص بك. لا يمكن استرداد الرمز تلقائياً لأسباب أمنية.',
        },
        {
          question: 'لماذا لا يعمل رمز الوصول الخاص بي؟',
          answer:
            'تأكد من إدخال الرمز بشكل صحيح. إذا كان الرمز صحيحاً ولا يزال لا يعمل، فقد يكون منتهي الصلاحية أو معطلاً. تواصل مع المسيو.',
        },
        {
          question: 'هل يمكنني استخدام حسابي على أكثر من جهاز؟',
          answer:
            'لا، لأسباب أمنية، كل رمز وصول مرتبط بجهاز واحد فقط. إذا كنت تريد تغيير الجهاز، تواصل مع المسيو.',
        },
      ],
    },
    {
      title: 'مشاهدة الفيديوهات',
      icon: <VideoLibrary color="secondary" />,
      questions: [
        {
          question: 'كيف أشاهد الفيديوهات التعليمية؟',
          answer:
            'بعد تسجيل الدخول، ستجد قائمة بالفيديوهات المخصصة لك. اضغط على أي فيديو لبدء المشاهدة.',
        },
        {
          question: 'لماذا لا يعمل الفيديو؟',
          answer:
            'تأكد من اتصالك بالإنترنت. إذا استمرت المشكلة، جرب تحديث الصفحة أو استخدم متصفح آخر.',
        },
        {
          question: 'هل يمكنني تحميل الفيديوهات؟',
          answer:
            'لا، لا يمكن تحميل الفيديوهات لأسباب حماية حقوق الطبع والنشر. يمكنك مشاهدتها فقط عبر المنصة.',
        },
        {
          question: 'كيف أتتبع تقدمي في المشاهدة؟',
          answer:
            'المنصة تحفظ تقدمك تلقائياً. يمكنك رؤية الفيديوهات التي شاهدتها والوقت المتبقي لكل فيديو.',
        },
      ],
    },
    {
      title: 'الملفات المرفقة',
      icon: <Download color="success" />,
      questions: [
        {
          question: 'كيف أحصل على الملفات المرفقة؟',
          answer:
            'في صفحة الفيديو، ستجد قسم "الملفات المرفقة" أسفل الفيديو. اضغط على "تحميل" بجانب أي ملف.',
        },
        {
          question: 'لا أستطيع تحميل الملفات، ما الحل؟',
          answer:
            'تأكد من أن متصفحك يسمح بالتحميل. قد تحتاج لتعطيل مانع الإعلانات أو السماح للموقع بالتحميل.',
        },
        {
          question: 'ما أنواع الملفات المدعومة؟',
          answer:
            'المنصة تدعم معظم أنواع الملفات: PDF، Word، PowerPoint، الصور، والملفات المضغوطة.',
        },
      ],
    },
    {
      title: 'الأمان والخصوصية',
      icon: <Security color="error" />,
      questions: [
        {
          question: 'كيف تحمي المنصة بياناتي؟',
          answer:
            'نستخدم أحدث تقنيات التشفير لحماية بياناتك. جميع المعلومات محفوظة بشكل آمن ولا نشاركها مع أطراف ثالثة.',
        },
        {
          question: 'هل يمكن لأشخاص آخرين رؤية نشاطي؟',
          answer:
            'لا، نشاطك خاص بك فقط. المسيو يمكنه رؤية تقدمك التعليمي فقط لأغراض المتابعة الأكاديمية.',
        },
        {
          question: 'ماذا لو اشتبهت في اختراق حسابي؟',
          answer: 'تواصل مع المسيو فوراً لإعادة تعيين رمز الوصول وتأمين حسابك.',
        },
      ],
    },
    {
      title: 'المشاكل التقنية',
      icon: <Settings color="warning" />,
      questions: [
        {
          question: 'المنصة بطيئة، كيف أحسن الأداء؟',
          answer:
            'تأكد من سرعة الإنترنت، أغلق التطبيقات الأخرى، واستخدم متصفح محدث. Chrome أو Firefox يعطيان أفضل أداء.',
        },
        {
          question: 'لا تعمل المنصة على هاتفي، ما الحل؟',
          answer:
            'المنصة متوافقة مع الهواتف الذكية. تأكد من تحديث متصفحك أو جرب متصفح آخر.',
        },
        {
          question: 'أواجه مشكلة في عرض المحتوى، ماذا أفعل؟',
          answer:
            'جرب تحديث الصفحة، مسح ذاكرة التخزين المؤقت، أو استخدام وضع التصفح الخاص.',
        },
      ],
    },
  ];

  const quickHelp = [
    {
      title: 'دليل البداية السريع',
      description: 'تعلم كيفية استخدام المنصة في 5 دقائق',
      icon: <School color="primary" />,
      action: () => navigate('/quick-start'),
    },
    {
      title: 'تواصل مع الدعم',
      description: 'احصل على مساعدة مباشرة من فريق الدعم',
      icon: <ContactSupport color="success" />,
      action: () => navigate('/contact'),
    },
    {
      title: 'الأسئلة الشائعة',
      description: 'إجابات سريعة للأسئلة الأكثر شيوعاً',
      icon: <QuestionAnswer color="info" />,
      action: () => setExpandedPanel('faq-0'),
    },
  ];

  const filteredCategories = faqCategories
    .map(category => ({
      ...category,
      questions: category.questions.filter(
        q =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(category => category.questions.length > 0);

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
          <HelpIcon fontSize="small" />
          المساعدة
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper
        elevation={3}
        sx={{ p: 4, mb: 4, borderRadius: 3, textAlign: 'center' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <HelpIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        </Box>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
        >
          مركز المساعدة
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          نحن هنا لمساعدتك في الحصول على أفضل تجربة تعليمية
        </Typography>

        {/* شريط البحث */}
        <TextField
          fullWidth
          placeholder="ابحث في الأسئلة الشائعة..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500, mx: 'auto' }}
        />
      </Paper>

      {/* المساعدة السريعة */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        مساعدة سريعة
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickHelp.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4,
                },
              }}
              onClick={item.action}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>{item.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* الأسئلة الشائعة */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        الأسئلة الشائعة
      </Typography>

      {searchTerm && filteredCategories.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          لم يتم العثور على نتائج للبحث "{searchTerm}". جرب كلمات مختلفة أو تصفح
          الأقسام أدناه.
        </Alert>
      )}

      {(searchTerm ? filteredCategories : faqCategories).map(
        (category, categoryIndex) => (
          <Paper
            key={categoryIndex}
            elevation={2}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: '8px 8px 0 0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {category.icon}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {category.title}
                </Typography>
                <Chip
                  label={`${category.questions.length} سؤال`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>

            {category.questions.map((faq, faqIndex) => (
              <Accordion
                key={faqIndex}
                expanded={expandedPanel === `faq-${categoryIndex}-${faqIndex}`}
                onChange={handleAccordionChange(
                  `faq-${categoryIndex}-${faqIndex}`
                )}
                elevation={0}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1.7, color: 'text.secondary' }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        )
      )}

      {/* تواصل معنا */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 3,
          textAlign: 'center',
          bgcolor: 'primary.50',
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
        >
          لم تجد ما تبحث عنه؟
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          فريق الدعم متاح لمساعدتك في أي وقت
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/contact"
            onClick={e => {
              e.preventDefault();
              navigate('/contact');
            }}
            sx={{ textDecoration: 'none' }}
          >
            <Chip
              label="تواصل معنا"
              color="primary"
              variant="filled"
              clickable
              sx={{ px: 2, py: 1, fontSize: '1rem' }}
            />
          </Link>
          <Chip
            label="واتساب: +966 50 123 4567"
            color="success"
            variant="outlined"
            clickable
            onClick={() => window.open('https://wa.me/966501234567', '_blank')}
            sx={{ px: 2, py: 1, fontSize: '1rem' }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Help;
