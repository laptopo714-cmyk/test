// Student Dashboard
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import {
  PlayArrow,
  BookmarkBorder,
  TrendingUp,
  School,
  Certificate,
  Schedule,
  Star,
  MoreVert,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // بيانات وهمية للدورات المسجل بها الطالب
  const mockEnrolledCourses = [
    {
      id: 1,
      title: 'تطوير تطبيقات الويب بـ React',
      instructor: 'أحمد محمد',
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      lastAccessed: '2024-01-15',
      thumbnail: '/api/placeholder/300/200',
      nextLesson: 'إدارة الحالة مع Redux',
    },
    {
      id: 2,
      title: 'أساسيات التسويق الرقمي',
      instructor: 'فاطمة أحمد',
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      lastAccessed: '2024-01-14',
      thumbnail: '/api/placeholder/300/200',
      nextLesson: 'استراتيجيات وسائل التواصل الاجتماعي',
    },
    {
      id: 3,
      title: 'تصميم واجهات المستخدم UX/UI',
      instructor: 'سارة علي',
      progress: 90,
      totalLessons: 20,
      completedLessons: 18,
      lastAccessed: '2024-01-13',
      thumbnail: '/api/placeholder/300/200',
      nextLesson: 'مشروع التخرج',
    },
  ];

  useEffect(() => {
    // هنا سيتم جلب البيانات الفعلية من Firebase
    setEnrolledCourses(mockEnrolledCourses);
  }, []);

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card
      sx={{
        height: '100%',
        borderRadius: 2,
        boxShadow: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'center' },
            justifyContent: { xs: 'center', sm: 'space-between' },
            textAlign: { xs: 'center', sm: 'left' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Box sx={{ order: { xs: 2, sm: 1 } }}>
            <Typography
              color="text.secondary"
              gutterBottom
              variant="body2"
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                mb: { xs: 0.5, sm: 1 },
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              color={color}
              sx={{
                fontSize: { xs: '1.5rem', sm: '2.125rem' },
                fontWeight: 'bold',
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              color: `${color}.main`,
              order: { xs: 1, sm: 2 },
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const CourseCard = ({ course }) => (
    <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          {/* صورة الدورة */}
          <Box
            sx={{
              width: { xs: '100%', sm: 120 },
              height: { xs: 150, sm: 80 },
              backgroundColor: 'grey.200',
              borderRadius: 1,
              flexShrink: 0,
            }}
          />

          {/* محتوى الدورة */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                }}
              >
                {course.title}
              </Typography>
              <IconButton size="small" sx={{ flexShrink: 0 }}>
                <MoreVert />
              </IconButton>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              المدرب: {course.instructor}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {course.completedLessons} من {course.totalLessons} درس
              </Typography>
              <Chip
                label={`${course.progress}%`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            <LinearProgress
              variant="determinate"
              value={course.progress}
              sx={{
                mb: 2,
                height: { xs: 8, sm: 6 },
                borderRadius: 3,
              }}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: { xs: 2, sm: 1 },
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  order: { xs: 2, sm: 1 },
                }}
              >
                الدرس التالي: {course.nextLesson}
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<PlayArrow />}
                onClick={() => navigate(`/course/${course.id}/learn`)}
                sx={{
                  order: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  py: { xs: 1, sm: 0.5 },
                }}
              >
                متابعة التعلم
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ترحيب */}
      <Box
        sx={{
          mb: 4,
          textAlign: { xs: 'center', sm: 'left' },
          px: { xs: 1, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            fontWeight: 'bold',
          }}
        >
          مرحباً، {userData?.fullName || 'الطالب'}! 👋
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.9rem', sm: '1rem' },
            maxWidth: { xs: '100%', sm: '600px' },
            mx: { xs: 'auto', sm: 0 },
          }}
        >
          استمر في رحلتك التعليمية واكتشف مهارات جديدة
        </Typography>
      </Box>

      {/* إحصائيات سريعة */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="الدورات المسجل بها"
            value={enrolledCourses.length}
            icon={<School sx={{ fontSize: { xs: 32, sm: 40 } }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="الدورات المكتملة"
            value="2"
            icon={<Certificate sx={{ fontSize: { xs: 32, sm: 40 } }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="ساعات التعلم"
            value="45"
            icon={<Schedule sx={{ fontSize: { xs: 32, sm: 40 } }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="النقاط المكتسبة"
            value="1,250"
            icon={<Star sx={{ fontSize: { xs: 32, sm: 40 } }} />}
            color="secondary"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* الدورات الحالية */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                mb: 3,
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                دوراتي الحالية
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/my-courses')}
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  py: { xs: 1, sm: 0.5 },
                }}
              >
                عرض الكل
              </Button>
            </Box>

            {enrolledCourses.length > 0 ? (
              enrolledCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
                <School
                  sx={{
                    fontSize: { xs: 48, sm: 64 },
                    color: 'text.secondary',
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  لم تسجل في أي دورة بعد
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/courses')}
                  sx={{
                    mt: 2,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 0.75 },
                  }}
                >
                  استكشف الدورات
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* الشريط الجانبي */}
        <Grid item xs={12} lg={4}>
          {/* التقدم الأسبوعي */}
          <Paper
            sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2, boxShadow: 2 }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              التقدم هذا الأسبوع
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              <TrendingUp
                color="success"
                sx={{ fontSize: { xs: 32, sm: 24 } }}
              />
              <Box>
                <Typography
                  variant="h4"
                  color="success.main"
                  sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
                >
                  8.5
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  ساعات تعلم
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              زيادة 25% عن الأسبوع الماضي
            </Typography>
          </Paper>

          {/* الإنجازات الأخيرة */}
          <Paper
            sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2, boxShadow: 2 }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              الإنجازات الأخيرة
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                  }}
                >
                  <Certificate sx={{ fontSize: { xs: 14, sm: 16 } }} />
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    إكمال دورة JavaScript
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    منذ 3 أيام
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: 'success.main',
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                  }}
                >
                  <Star sx={{ fontSize: { xs: 14, sm: 16 } }} />
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    الوصول لـ 1000 نقطة
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    منذ أسبوع
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* دورات مقترحة */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              دورات مقترحة لك
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    تطوير تطبيقات الجوال
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    بناءً على اهتماماتك
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      fullWidth
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        py: { xs: 0.5, sm: 0.75 },
                      }}
                    >
                      عرض التفاصيل
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    إدارة قواعد البيانات
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    مكمل لدوراتك الحالية
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      fullWidth
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        py: { xs: 0.5, sm: 0.75 },
                      }}
                    >
                      عرض التفاصيل
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
