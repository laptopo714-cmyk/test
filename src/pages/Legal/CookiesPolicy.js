// Cookies Policy Page
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import {
  Cookie,
  Home,
  Info,
  Settings,
  Security,
  Analytics,
  Update,
  ContactMail,
  Storage,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CookiesPolicy = () => {
  const navigate = useNavigate();

  const cookieTypes = [
    {
      type: 'الكوكيز الأساسية',
      purpose: 'ضرورية لتشغيل المنصة بشكل صحيح',
      examples: 'معلومات تسجيل الدخول، تفضيلات اللغة',
      duration: 'جلسة المتصفح أو حتى تسجيل الخروج',
      canDisable: 'لا',
    },
    {
      type: 'كوكيز الأداء',
      purpose: 'تحسين أداء المنصة وسرعة التحميل',
      examples: 'إعدادات العرض، تفضيلات المستخدم',
      duration: '30 يوم',
      canDisable: 'نعم',
    },
    {
      type: 'كوكيز التحليل',
      purpose: 'فهم كيفية استخدام المنصة وتحسينها',
      examples: 'إحصائيات الزيارة، تتبع التقدم',
      duration: '1 سنة',
      canDisable: 'نعم',
    },
    {
      type: 'كوكيز الأمان',
      purpose: 'حماية المنصة من الاستخدام غير المصرح به',
      examples: 'معرف الجهاز، معلومات الأمان',
      duration: '6 أشهر',
      canDisable: 'لا',
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
          <Cookie fontSize="small" />
          سياسة الكوكيز
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Cookie sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            سياسة الكوكيز
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          كيف نستخدم الكوكيز لتحسين تجربتك على أكرم ابراهيم
        </Typography>
        <Typography variant="body2" color="text.secondary">
          آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
        </Typography>
      </Paper>

      {/* تنبيه */}
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>ملاحظة:</strong> باستخدام منصتنا، فإنك توافق على استخدام
          الكوكيز وفقاً لهذه السياسة. يمكنك إدارة إعدادات الكوكيز من خلال
          متصفحك.
        </Typography>
      </Alert>

      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* ما هي الكوكيز */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Info sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                ما هي الكوكيز؟
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              الكوكيز هي ملفات نصية صغيرة يتم حفظها على جهازك عند زيارة مواقع
              الويب. تساعد هذه الملفات المواقع على تذكر معلومات عن زيارتك، مما
              يجعل زيارتك التالية أسهل والموقع أكثر فائدة لك.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              نحن نستخدم الكوكيز لتحسين تجربتك على أكرم ابراهيم، وضمان عمل
              المنصة بشكل صحيح، وتوفير ميزات مخصصة لك.
            </Typography>
          </CardContent>
        </Card>

        {/* لماذا نستخدم الكوكيز */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Settings sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                لماذا نستخدم الكوكيز؟
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Security color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="الأمان والحماية"
                  secondary="للتحقق من هويتك وحماية حسابك من الوصول غير المصرح به"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Storage color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="حفظ التفضيلات"
                  secondary="لتذكر إعداداتك مثل اللغة والوضع المظلم/الفاتح"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Analytics color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="تحليل الاستخدام"
                  secondary="لفهم كيفية استخدام المنصة وتحسين الخدمات المقدمة"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Visibility color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="تتبع التقدم"
                  secondary="لحفظ تقدمك في الدورات والفيديوهات التي شاهدتها"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* أنواع الكوكيز */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              أنواع الكوكيز التي نستخدمها
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      نوع الكوكيز
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>الغرض</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>أمثلة</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      مدة البقاء
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      يمكن تعطيلها
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cookieTypes.map((cookie, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontWeight: 'medium' }}>
                        {cookie.type}
                      </TableCell>
                      <TableCell>{cookie.purpose}</TableCell>
                      <TableCell>{cookie.examples}</TableCell>
                      <TableCell>{cookie.duration}</TableCell>
                      <TableCell>
                        <Typography
                          color={
                            cookie.canDisable === 'نعم'
                              ? 'success.main'
                              : 'error.main'
                          }
                          sx={{ fontWeight: 'medium' }}
                        >
                          {cookie.canDisable}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* الكوكيز الخاصة بالطرف الثالث */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              كوكيز الطرف الثالث
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              قد نستخدم خدمات من أطراف ثالثة موثوقة لتحسين تجربتك، وهذه الخدمات
              قد تضع كوكيز على جهازك:
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Google Analytics"
                  secondary="لتحليل استخدام المنصة وتحسين الأداء (يمكن تعطيلها)"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="خدمات الفيديو"
                  secondary="YouTube أو Google Drive لعرض المحتوى التعليمي"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="خدمات الأمان"
                  secondary="لحماية المنصة من الهجمات والاستخدام غير المصرح به"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* إدارة الكوكيز */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              كيفية إدارة الكوكيز
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              يمكنك التحكم في الكوكيز وإدارتها بعدة طرق:
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
              من خلال المتصفح:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="• يمكنك حذف الكوكيز الموجودة على جهازك" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• يمكنك منع وضع كوكيز جديدة" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• يمكنك تعيين المتصفح لإشعارك عند وضع كوكيز جديدة" />
              </ListItem>
            </List>

            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>تحذير:</strong> تعطيل الكوكيز الأساسية قد يؤثر على عمل
                المنصة بشكل صحيح وقد يمنعك من الوصول إلى بعض الميزات المهمة.
              </Typography>
            </Alert>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, mt: 3 }}>
              روابط إدارة الكوكيز في المتصفحات الشائعة:
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                🌐 Chrome: الإعدادات → الخصوصية والأمان → ملفات تعريف الارتباط
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                🦊 Firefox: الإعدادات → الخصوصية والأمان → ملفات تعريف الارتباط
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                🧭 Safari: التفضيلات → الخصوصية → إدارة بيانات الموقع
              </Typography>
              <Typography variant="body2">
                🌐 Edge: الإعدادات → ملفات تعريف الارتباط وأذونات الموقع
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* تحديثات السياسة */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Update sx={{ color: 'secondary.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                تحديثات سياسة الكوكيز
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              قد نقوم بتحديث سياسة الكوكيز هذه من وقت لآخر لتعكس التغييرات في
              ممارساتنا أو لأسباب تشغيلية أو قانونية أو تنظيمية أخرى. سنقوم
              بإشعارك بأي تغييرات جوهرية عن طريق نشر السياسة الجديدة على هذه
              الصفحة.
            </Typography>
          </CardContent>
        </Card>

        {/* التواصل */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ContactMail sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                التواصل معنا
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              إذا كان لديك أي أسئلة حول سياسة الكوكيز هذه أو ممارساتنا، يرجى
              التواصل معنا:
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                📧 البريد الإلكتروني: cookies@arabiclearning.com
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                📞 الهاتف: 01095288373
              </Typography>
              <Typography variant="body2">
                🏢 العنوان: المملكة العربية السعودية
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CookiesPolicy;
