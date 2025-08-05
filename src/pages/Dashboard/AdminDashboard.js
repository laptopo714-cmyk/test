// Admin Dashboard
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
  Tabs,
  Tab,
} from "@mui/material";
import {
  People,
  School,
  AttachMoney,
  TrendingUp,
  Visibility,
  Edit,
  Delete,
  Check,
  Close,
  MoreVert,
  PersonAdd,
  Add,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({});
  const [pendingCourses, setPendingCourses] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  // بيانات وهمية للإحصائيات
  const mockStats = {
    totalUsers: 15420,
    totalCourses: 1250,
    totalRevenue: 2450000,
    monthlyGrowth: 12.5,
    activeUsers: 8930,
    pendingCourses: 23,
    totalInstructors: 156,
    completionRate: 78,
  };

  // دورات في انتظار الموافقة
  const mockPendingCourses = [
    {
      id: 1,
      title: "تطوير تطبيقات Flutter",
      instructor: "أحمد محمد",
      category: "البرمجة",
      submittedDate: "2024-01-15",
      lessons: 20,
      duration: "15 ساعة",
    },
    {
      id: 2,
      title: "التسويق عبر Instagram",
      instructor: "سارة أحمد",
      category: "التسويق",
      submittedDate: "2024-01-14",
      lessons: 12,
      duration: "8 ساعات",
    },
    {
      id: 3,
      title: "تصميم الجرافيك المتقدم",
      instructor: "محمد علي",
      category: "التصميم",
      submittedDate: "2024-01-13",
      lessons: 18,
      duration: "12 ساعة",
    },
  ];

  // المستخدمون الجدد
  const mockRecentUsers = [
    {
      id: 1,
      name: "فاطمة أحمد",
      email: "fatima@example.com",
      role: "student",
      joinDate: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "محمد حسن",
      email: "mohamed@example.com",
      role: "instructor",
      joinDate: "2024-01-14",
      status: "pending",
    },
    {
      id: 3,
      name: "نور الدين",
      email: "nour@example.com",
      role: "student",
      joinDate: "2024-01-13",
      status: "active",
    },
  ];

  useEffect(() => {
    // هنا سيتم جلب البيانات الفعلية من Firebase
    setStats(mockStats);
    setPendingCourses(mockPendingCourses);
    setRecentUsers(mockRecentUsers);
  }, []);

  const StatCard = ({
    title,
    value,
    icon,
    color = "primary",
    subtitle,
    trend,
  }) => (
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
            {trend && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingUp
                  sx={{ fontSize: 16, color: "success.main", mr: 0.5 }}
                />
                <Typography variant="body2" color="success.main">
                  +{trend}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ color: `${color}.main` }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleApproveCourse = (courseId) => {
    // منطق الموافقة على الدورة
    console.log("Approve course:", courseId);
  };

  const handleRejectCourse = (courseId) => {
    // منطق رفض الدورة
    console.log("Reject course:", courseId);
  };

  const getRoleText = (role) => {
    switch (role) {
      case "student":
        return "طالب";
      case "instructor":
        return "مدرب";
      case "admin":
        return "مدير";
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return "primary";
      case "instructor":
        return "secondary";
      case "admin":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "suspended":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "نشط";
      case "pending":
        return "في الانتظار";
      case "suspended":
        return "معلق";
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ترحيب */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          لوحة تحكم الإدارة 👨‍💼
        </Typography>
        <Typography variant="body1" color="text.secondary">
          إدارة شاملة للمنصة التعليمية
        </Typography>
      </Box>

      {/* إحصائيات سريعة */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المستخدمين"
            value={stats.totalUsers?.toLocaleString()}
            icon={<People sx={{ fontSize: 40 }} />}
            color="primary"
            trend={stats.monthlyGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الدورات"
            value={stats.totalCourses?.toLocaleString()}
            icon={<School sx={{ fontSize: 40 }} />}
            color="secondary"
            subtitle={`${stats.pendingCourses} في الانتظار`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الإيرادات"
            value={`${(stats.totalRevenue / 1000).toFixed(0)}K ر.س`}
            icon={<AttachMoney sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="المستخدمون النشطون"
            value={stats.activeUsers?.toLocaleString()}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color="warning"
            subtitle={`${stats.completionRate}% معدل الإكمال`}
          />
        </Grid>
      </Grid>

      {/* التبويبات */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="الدورات المعلقة" />
          <Tab label="المستخدمون الجدد" />
          <Tab label="التقارير" />
          <Tab label="الإعدادات" />
        </Tabs>
      </Paper>

      {/* محتوى التبويبات */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5">
              الدورات في انتظار الموافقة ({pendingCourses.length})
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/admin/courses")}
            >
              إدارة جميع الدورات
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>الدورة</TableCell>
                  <TableCell>المدرب</TableCell>
                  <TableCell>التصنيف</TableCell>
                  <TableCell align="center">الدروس</TableCell>
                  <TableCell align="center">المدة</TableCell>
                  <TableCell align="center">تاريخ التقديم</TableCell>
                  <TableCell align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingCourses.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {course.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>
                      <Chip
                        label={course.category}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">{course.lessons}</TableCell>
                    <TableCell align="center">{course.duration}</TableCell>
                    <TableCell align="center">{course.submittedDate}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          navigate(`/admin/course/${course.id}/review`)
                        }
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleApproveCourse(course.id)}
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRejectCourse(course.id)}
                      >
                        <Close />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5">المستخدمون الجدد</Typography>
            <Button
              variant="outlined"
              startIcon={<PersonAdd />}
              onClick={() => navigate("/admin/users")}
            >
              إدارة جميع المستخدمين
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>المستخدم</TableCell>
                  <TableCell>البريد الإلكتروني</TableCell>
                  <TableCell align="center">النوع</TableCell>
                  <TableCell align="center">تاريخ التسجيل</TableCell>
                  <TableCell align="center">الحالة</TableCell>
                  <TableCell align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar sx={{ width: 32, height: 32 }} />
                        <Typography variant="subtitle2" fontWeight="medium">
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getRoleText(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{user.joinDate}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusText(user.status)}
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/user/${user.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/user/${user.id}/edit`)}
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
      )}

      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            التقارير والإحصائيات
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    نمو المستخدمين
                  </Typography>
                  <Box
                    sx={{
                      height: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      [مخطط بياني للنمو]
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    الإيرادات الشهرية
                  </Typography>
                  <Box
                    sx={{
                      height: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      [مخطط بياني للإيرادات]
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {tabValue === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            إعدادات النظام
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    إعدادات عامة
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Button variant="outlined" fullWidth>
                      إعدادات الموقع
                    </Button>
                    <Button variant="outlined" fullWidth>
                      إعدادات البريد الإلكتروني
                    </Button>
                    <Button variant="outlined" fullWidth>
                      إعدادات الدفع
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    إدارة المحتوى
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Button variant="outlined" fullWidth>
                      إدارة التصنيفات
                    </Button>
                    <Button variant="outlined" fullWidth>
                      إدارة الصفحات
                    </Button>
                    <Button variant="outlined" fullWidth>
                      إعدادات الأمان
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default AdminDashboard;
