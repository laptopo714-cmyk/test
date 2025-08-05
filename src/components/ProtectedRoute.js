// Protected Route Component
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "50vh",
      gap: 2,
    }}
  >
    <CircularProgress size={60} />
    <Typography variant="h6">جاري التحميل...</Typography>
  </Box>
);

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    // إعادة توجيه إلى صفحة تسجيل الدخول مع حفظ الصفحة المطلوبة
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // التحقق من الدور المطلوب
  if (requiredRole && userData?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
