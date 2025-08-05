// Instructor Dashboard
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  Add,
  Edit,
  Visibility,
  TrendingUp,
  People,
  School,
  AttachMoney,
  Star,
  MoreVert,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({});

  // بيانات وهمية لدورات المدرب
  const mockCourses = [
    {
      id: 1,
      title: "تطوير تطبيقات الويب بـ React",
      students: 1250,
      rating: 4.8,
      revenue: 15750,
      status: "published",
      lastUpdated: "2024-01-15",
      lessons: 24,
      reviews: 89,
    },
    {
      id: 2,
      title: "JavaScript المتقدم",
      students: 890,
      rating: 4.6,
      revenue: 8900,
      status: "published",
      lastUpdated: "2024-01-10",
      lessons: 18,
      reviews: 67,
    },
    {
      id: 3,
      title: "Node.js للمبتدئين",
      students: 0,
      rating: 0,
      revenue: 0,
      status: "draft",
      lastUpdated: "2024-01-12",
      lessons: 12,
      reviews: 0,
    },
  ];

  const mockStats = {
    totalStudents: 2140,
    totalRevenue: 24650,
    totalCourses: 3,
    averageRating: 4.7,
    monthlyEarnings: 5200,
    newStudentsThisMonth: 156,
  };

  useEffect(() => {
    // هنا سيتم جلب البيانات الفعلية من Firebase
    setCourses(mockCourses);
    setStats(mockStats);
  }, []);

  const StatCard = ({ title, value, icon, color = "primary", subtitle }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: `${color}.main` }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "pending":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "published":
        return "منشورة";
      case "draft":
        return "مسودة";
      case "pending":
        return "قيد المراجعة";
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ترحيب */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            مرحباً، {userData?.fullName || "المدرب"}! 👨‍🏫
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة دوراتك ومتابعة أداء طلابك
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/instructor/create-course")}
          size="large"
        >
          إنشاء دورة جديدة
        </Button>
      </Box>

      {/* إحصائيات سريعة */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الطلاب"
            value={stats.totalStudents?.toLocaleString()}
            icon={<People sx={{ fontSize: 40 }} />}
            color="primary"
            subtitle={`+${stats.newStudentsThisMonth} هذا الشهر`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الإيرادات"
            value={`${stats.totalRevenue?.toLocaleString()} ر.س`}
            icon={<AttachMoney sx={{ fontSize: 40 }} />}
            color="success"
            subtitle={`${stats.monthlyEarnings?.toLocaleString()} ر.س هذا الشهر`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="عدد الدورات"
            value={stats.totalCourses}
            icon={<School sx={{ fontSize: 40 }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="متوسط التقييم"
            value={stats.averageRating}
            icon={<Star sx={{ fontSize: 40 }} />}
            color="secondary"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* جدول الدورات */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5">دوراتي</Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/instructor/courses")}
              >
                إدارة جميع الدورات
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>الدورة</TableCell>
                    <TableCell align="center">الطلاب</TableCell>
                    <TableCell align="center">التقييم</TableCell>
                    <TableCell align="center">الإيرادات</TableCell>
                    <TableCell align="center">الحالة</TableCell>
                    <TableCell align="center">الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {course.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.lessons} درس • آخر تحديث:{" "}
                            {course.lastUpdated}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="medium">
                          {course.students.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                          }}
                        >
                          <Star sx={{ fontSize: 16, color: "warning.main" }} />
                          <Typography variant="body2">
                            {course.rating > 0 ? course.rating : "-"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({course.reviews})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="medium">
                          {course.revenue.toLocaleString()} ر.س
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getStatusText(course.status)}
                          color={getStatusColor(course.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/course/${course.id}`)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/instructor/course/${course.id}/edit`)
                          }
                        >
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* الشريط الجانبي */}
        <Grid item xs={12} lg={4}>
          {/* الأداء هذا الشهر */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              الأداء هذا الشهر
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">الطلاب الجدد</Typography>
                <Typography variant="body2" fontWeight="medium">
                  156
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">الإيرادات</Typography>
                <Typography variant="body2" fontWeight="medium">
                  5,200 ر.س
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={60}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>

            <Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">التقييمات</Typography>
                <Typography variant="body2" fontWeight="medium">
                  23 تقييم
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={85}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          </Paper>

          {/* التقييمات الأخيرة */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              التقييمات الأخيرة
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar sx={{ width: 32, height: 32 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      محمد أحمد
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          sx={{ fontSize: 12, color: "warning.main" }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    "دورة ممتازة ومفيدة جداً"
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar sx={{ width: 32, height: 32 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      فاطمة علي
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          sx={{ fontSize: 12, color: "warning.main" }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    "شرح واضح ومبسط"
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* روابط سريعة */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              روابط سريعة
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/instructor/analytics")}
              >
                تقارير مفصلة
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/instructor/students")}
              >
                إدارة الطلاب
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/instructor/earnings")}
              >
                الإيرادات
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/instructor/resources")}
              >
                موارد المدربين
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InstructorDashboard;
