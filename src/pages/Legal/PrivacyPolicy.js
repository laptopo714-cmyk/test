// Privacy Policy Page
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
} from '@mui/material';
import {
  Security,
  Info,
  ContactMail,
  Update,
  Home,
  Policy,
  Shield,
  Lock,
  Visibility,
  Storage,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

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
          <Policy fontSize="small" />
          سياسة الخصوصية
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Shield sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            سياسة الخصوصية
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية
        </Typography>
        <Typography variant="body2" color="text.secondary">
          آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
        </Typography>
      </Paper>

      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* مقدمة */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Info sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                مقدمة
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              مرحباً بك في منصة مسيو أكرم إبراهيم. نحن نقدر ثقتك بنا ونلتزم
              بحماية خصوصيتك وأمان بياناتك الشخصية. تشرح هذه السياسة كيفية جمعنا
              واستخدامنا وحمايتنا لمعلوماتك الشخصية عند استخدام منصتنا
              التعليمية.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              باستخدام منصتنا، فإنك توافق على جمع واستخدام المعلومات وفقاً لهذه
              السياسة.
            </Typography>
          </CardContent>
        </Card>

        {/* المعلومات التي نجمعها */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Storage sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                المعلومات التي نجمعها
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ContactMail color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="المعلومات الشخصية"
                  secondary="الاسم، رقم الهاتف، والمعلومات التي تقدمها عند التسجيل"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Visibility color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="معلومات الاستخدام"
                  secondary="كيفية تفاعلك مع المنصة، الفيديوهات التي تشاهدها، ووقت الاستخدام"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Security color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="معلومات الجهاز"
                  secondary="نوع الجهاز، نظام التشغيل، وعنوان IP لضمان الأمان"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* كيف نستخدم معلوماتك */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Lock sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                كيف نستخدم معلوماتك
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="• توفير وتحسين خدماتنا التعليمية"
                  sx={{ mb: 1 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="• التحقق من هويتك وضمان أمان الحساب"
                  sx={{ mb: 1 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="• إرسال الإشعارات المهمة والتحديثات"
                  sx={{ mb: 1 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="• تتبع التقدم الأكاديمي وتقديم التقارير"
                  sx={{ mb: 1 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="• منع الاستخدام غير المصرح به للمنصة"
                  sx={{ mb: 1 }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* حماية البيانات */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Shield sx={{ color: 'error.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                حماية البيانات
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              نتخذ إجراءات أمنية صارمة لحماية معلوماتك الشخصية من الوصول غير
              المصرح به أو التعديل أو الكشف أو التدمير:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="• تشفير البيانات أثناء النقل والتخزين" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• نظام مصادقة متقدم لحماية الحسابات" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• مراقبة مستمرة للأنشطة المشبوهة" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• تحديثات أمنية منتظمة للنظام" />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* مشاركة المعلومات */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              مشاركة المعلومات
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا
              في الحالات التالية:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="• بموافقتك الصريحة" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• لتوفير الخدمات التي طلبتها" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• للامتثال للقوانين واللوائح المعمول بها" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• لحماية حقوقنا وسلامة المستخدمين" />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* حقوقك */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              حقوقك
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              لديك الحق في:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="• الوصول إلى معلوماتك الشخصية وتحديثها" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• طلب حذف بياناتك الشخصية" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• الاعتراض على معالجة بياناتك" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• طلب نسخة من بياناتك" />
              </ListItem>
            </List>
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
              إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارساتنا، يرجى
              التواصل معنا:
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                👨‍🏫 المسيو: أكرم إبراهيم
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                📞 الهاتف: 01023232323
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                🏢 العنوان: المنصورة - الدقهلية
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 1 }}
              >
                💻 الدعم الفني: كريم عطية عطية - 01095288373
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
                تحديثات السياسة
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإشعارك بأي
              تغييرات جوهرية عن طريق نشر السياسة الجديدة على هذه الصفحة وتحديث
              تاريخ "آخر تحديث" في أعلى الصفحة.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
