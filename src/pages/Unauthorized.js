// Unauthorized Page
import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { Security, Home, Warning } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffebee, #ffcdd2)",
          border: "2px solid #f44336",
        }}
      >
        <Security
          sx={{
            fontSize: 100,
            color: "error.main",
            mb: 2,
            animation: "pulse 2s infinite",
          }}
        />

        <Typography variant="h3" gutterBottom color="error" fontWeight="bold">
          🚫 وصول غير مصرح
        </Typography>

        <Typography variant="h6" color="text.primary" paragraph sx={{ mb: 3 }}>
          تم رصد محاولة وصول غير مصرح بها
        </Typography>

        <Alert severity="error" sx={{ mb: 3, textAlign: "right" }}>
          <Typography variant="body1" fontWeight="medium">
            الأسباب المحتملة:
          </Typography>
          <Box component="ul" sx={{ mt: 1, textAlign: "right" }}>
            <Typography component="li" variant="body2">
              محاولة الدخول من جهاز غير مصرح به
            </Typography>
            <Typography component="li" variant="body2">
              انتهاء صلاحية رمز الوصول
            </Typography>
            <Typography component="li" variant="body2">
              عدم وجود صلاحيات كافية
            </Typography>
            <Typography component="li" variant="body2">
              تم إلغاء تفعيل الحساب
            </Typography>
          </Box>
        </Alert>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Warning />
            <Typography variant="body2">
              جميع محاولات الوصول غير المصرح بها يتم تسجيلها ومراقبتها
            </Typography>
          </Box>
        </Alert>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate("/")}
            size="large"
            sx={{ px: 4 }}
          >
            العودة للصفحة الرئيسية
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/login")}
            size="large"
            sx={{ px: 4 }}
          >
            تسجيل الدخول
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 3, display: "block" }}
        >
          إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الإدارة
        </Typography>
      </Paper>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Container>
  );
};

export default Unauthorized;
