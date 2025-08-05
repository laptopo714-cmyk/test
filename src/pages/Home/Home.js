// Home Page
import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import {
  PlayArrow,
  People,
  Star,
  TrendingUp,
  School,
  Computer,
  Business,
  Design,
  Language,
  Psychology,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // بيانات وهمية للدورات المميزة
  const featuredCourses = [
    {
      id: 1,
      title: "تطوير تطبيقات الويب بـ React",
      instructor: "أحمد محمد",
      rating: 4.8,
      studentsCount: 1250,
      price: 299,
      originalPrice: 499,
      image: "/api/placeholder/300/200",
      category: "البرمجة",
      level: "متوسط",
    },
    {
      id: 2,
      title: "أساسيات التسويق الرقمي",
      instructor: "فاطمة أحمد",
      rating: 4.9,
      studentsCount: 890,
      price: 199,
      originalPrice: 299,
      image: "/api/placeholder/300/200",
      category: "التسويق",
      level: "مبتدئ",
    },
    {
      id: 3,
      title: "تصميم واجهات المستخدم UX/UI",
      instructor: "سارة علي",
      rating: 4.7,
      studentsCount: 650,
      price: 399,
      originalPrice: 599,
      image: "/api/placeholder/300/200",
      category: "التصميم",
      level: "متقدم",
    },
    {
      id: 4,
      title: "إدارة المشاريع الاحترافية",
      instructor: "محمد حسن",
      rating: 4.6,
      studentsCount: 420,
      price: 249,
      originalPrice: 399,
      image: "/api/placeholder/300/200",
      category: "الإدارة",
      level: "متوسط",
    },
  ];

  // التصنيفات الرئيسية
  const categories = [
    { name: "البرمجة", icon: <Computer />, coursesCount: 150 },
    { name: "التصميم", icon: <Design />, coursesCount: 89 },
    { name: "الأعمال", icon: <Business />, coursesCount: 120 },
    { name: "اللغات", icon: <Language />, coursesCount: 75 },
    { name: "التطوير الشخصي", icon: <Psychology />, coursesCount: 95 },
    { name: "التسويق", icon: <TrendingUp />, coursesCount: 68 },
  ];

  const CourseCard = ({ course }) => (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
      onClick={() => navigate(`/course/${course.id}`)}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={course.image}
          alt={course.title}
          sx={{ backgroundColor: "grey.200" }}
        />
        <IconButton
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.8)",
            },
          }}
        >
          <PlayArrow />
        </IconButton>
        <Chip
          label={course.category}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "primary.main",
            color: "white",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          {course.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {course.instructor}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Rating value={course.rating} precision={0.1} size="small" readOnly />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {course.rating}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({course.studentsCount} طالب)
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              {course.price} ر.س
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              {course.originalPrice} ر.س
            </Typography>
          </Box>
          <Chip label={course.level} size="small" variant="outlined" />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                تعلم مهارات جديدة
                <br />
                مع أفضل المدربين
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                اكتشف آلاف الدورات التدريبية باللغة العربية في مختلف المجالات
                وطور مهاراتك مع خبراء متخصصين
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "white",
                    color: "primary.main",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                  onClick={() => navigate("/courses")}
                >
                  استكشف الدورات
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                  onClick={() => navigate("/become-instructor")}
                >
                  كن مدرباً
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 400,
                }}
              >
                <School sx={{ fontSize: 200, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                500+
              </Typography>
              <Typography variant="body1">دورة تدريبية</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                10K+
              </Typography>
              <Typography variant="body1">طالب نشط</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                100+
              </Typography>
              <Typography variant="body1">مدرب خبير</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                4.8
              </Typography>
              <Typography variant="body1">تقييم المنصة</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ backgroundColor: "grey.50", py: 6 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            التصنيفات الرئيسية
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            اختر من بين مجموعة واسعة من التصنيفات المتخصصة
          </Typography>

          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={6} md={4} lg={2} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => navigate(`/courses?category=${category.name}`)}
                >
                  <Box sx={{ color: "primary.main", mb: 1 }}>
                    {category.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.coursesCount} دورة
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Courses Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2">
            الدورات المميزة
          </Typography>
          <Button variant="outlined" onClick={() => navigate("/courses")}>
            عرض جميع الدورات
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={3} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          py: 6,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            ابدأ رحلتك التعليمية اليوم
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            انضم إلى آلاف الطلاب الذين يطورون مهاراتهم معنا
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "white",
              color: "primary.main",
              px: 4,
              py: 1.5,
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
            onClick={() => navigate("/register")}
          >
            ابدأ التعلم مجاناً
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
