// Admin Protected Route Component
import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = () => {
    try {
      const adminSession = localStorage.getItem("adminSession");

      if (adminSession) {
        const session = JSON.parse(adminSession);

        // التحقق من انتهاء الجلسة (24 ساعة)
        const sessionAge = new Date().getTime() - session.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 ساعة

        if (sessionAge < maxAge && session.role === "admin") {
          setIsAuthenticated(true);
        } else {
          // انتهت الجلسة، حذفها
          localStorage.removeItem("adminSession");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("خطأ في التحقق من جلسة الإدارة:", error);
      localStorage.removeItem("adminSession");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
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
        <Typography variant="h6">جاري التحقق من الصلاحيات...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/secret-admin-login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
