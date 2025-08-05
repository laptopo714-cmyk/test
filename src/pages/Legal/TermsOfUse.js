// Terms of Use Page
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
  Alert,
} from '@mui/material';
import {
  Gavel,
  Home,
  Description,
  Warning,
  CheckCircle,
  Cancel,
  Security,
  Update,
  ContactMail,
  School,
  Copyright,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TermsOfUse = () => {
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
          <Description fontSize="small" />
          شروط الاستخدام
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Gavel sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            شروط الاستخدام
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          الشروط والأحكام التي تحكم استخدام منصة مسيو أكرم إبراهيم
        </Typography>
        <Typography variant="body2" color="text.secondary">
          آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
        </Typography>
      </Paper>

      {/* تنبيه مهم */}
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>تنبيه مهم:</strong> باستخدام منصة مسيو أكرم إبراهيم، فإنك
          توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل
          استخدام المنصة.
        </Typography>
      </Alert>

      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* قبول الشروط */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                قبول الشروط
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              بالوصول إلى منصة مسيو أكرم إبراهيم واستخدامها، فإنك توافق على
              الالتزام بهذه الشروط والأحكام وجميع القوانين واللوائح المعمول بها،
              وتوافق على أنك مسؤول عن الامتثال لأي قوانين محلية معمول بها.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              إذا كنت لا توافق على أي من هذه الشروط، فأنت محظور من استخدام هذه
              المنصة أو الوصول إليها.
            </Typography>
          </CardContent>
        </Card>

        {/* استخدام المنصة */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <School sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                استخدام المنصة
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              منصة مسيو أكرم إبراهيم هي منصة تعليمية مخصصة لتوفير المحتوى
              التعليمي والدورات التدريبية. يُسمح لك باستخدام المنصة للأغراض
              التعليمية الشخصية فقط.
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              يُسمح لك بـ:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText primary="مشاهدة المحتوى التعليمي المخصص لك" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText primary="تحميل الملفات المرفقة للاستخدام الشخصي" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText primary="التفاعل مع المحتوى بطريقة مناسبة" />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* الاستخدام المحظور */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Cancel sx={{ color: 'error.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                الاستخدام المحظور
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              يُحظر عليك استخدام المنصة في الحالات التالية:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Cancel color="error" />
                </ListItemIcon>
                <ListItemText primary="تسجيل أو تحميل المحتوى التعليمي بأي شكل من الأشكال" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel color="error" />
                </ListItemIcon>
                <ListItemText primary="مشاركة رمز الوصول الخاص بك مع أشخاص آخرين" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel color="error" />
                </ListItemIcon>
                <ListItemText primary="محاولة الوصول إلى محتوى غير مخصص لك" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel color="error" />
                </ListItemIcon>
                <ListItemText primary="استخدام أدوات أو برامج لتجاوز أنظمة الحماية" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel color="error" />
                </ListItemIcon>
                <ListItemText primary="إعادة توزيع أو بيع المحتوى التعليمي" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel color="error" />
                </ListItemIcon>
                <ListItemText primary="استخدام المنصة لأغراض تجارية دون إذن" />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* الأمان وحماية الحساب */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                الأمان وحماية الحساب
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              نحن نتخذ إجراءات أمنية صارمة لحماية المحتوى والمستخدمين:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="• كل رمز وصول مرتبط بجهاز واحد فقط" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• مراقبة مستمرة للأنشطة المشبوهة" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• حماية من لقطات الشاشة والتسجيل" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• تشفير المحتوى أثناء النقل والعرض" />
              </ListItem>
            </List>
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>تحذير:</strong> أي محاولة لتجاوز أنظمة الحماية أو انتهاك
                شروط الاستخدام ستؤدي إلى إيقاف الحساب فوراً دون إنذار مسبق.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* حقوق الملكية الفكرية */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Copyright sx={{ color: 'secondary.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                حقوق الملكية الفكرية
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              جميع المحتويات الموجودة على المنصة، بما في ذلك النصوص والفيديوهات
              والصور والملفات، محمية بموجب قوانين حقوق الطبع والنشر والملكية
              الفكرية.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              لا يحق لك نسخ أو توزيع أو تعديل أو إعادة نشر أي محتوى من المنصة
              دون الحصول على إذن كتابي مسبق من إدارة المنصة.
            </Typography>
          </CardContent>
        </Card>

        {/* المسؤولية */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              إخلاء المسؤولية
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              نحن نسعى لتوفير أفضل خدمة تعليمية ممكنة، ولكن:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="• لا نضمن عدم انقطاع الخدمة أو خلوها من الأخطاء" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• لا نتحمل مسؤولية أي أضرار ناتجة عن استخدام المنصة" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• قد نقوم بتعديل أو إيقاف الخدمة دون إشعار مسبق" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• المحتوى التعليمي قابل للتغيير والتحديث" />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* إنهاء الخدمة */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              إنهاء الخدمة
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              يحق لنا إنهاء أو تعليق وصولك إلى المنصة فوراً، دون إشعار مسبق أو
              مسؤولية، لأي سبب كان، بما في ذلك دون حصر إذا كنت تنتهك الشروط.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              عند إنهاء الخدمة، ينتهي حقك في استخدام المنصة فوراً، ويجب عليك
              التوقف عن جميع استخدامات المنصة.
            </Typography>
          </CardContent>
        </Card>

        {/* تعديل الشروط */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Update sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                تعديل الشروط
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              نحتفظ بالحق في تعديل أو استبدال هذه الشروط في أي وقت وفقاً
              لتقديرنا الخاص. إذا كان التعديل جوهرياً، فسنحاول تقديم إشعار لمدة
              30 يوماً على الأقل قبل دخول أي شروط جديدة حيز التنفيذ.
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
              إذا كان لديك أي أسئلة حول شروط الاستخدام هذه، يرجى التواصل معنا:
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
      </Box>
    </Container>
  );
};

export default TermsOfUse;
