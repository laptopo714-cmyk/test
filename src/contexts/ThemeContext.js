// Theme Context for Dark/Light Mode
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import RTLProvider from '../theme/RTLProvider';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const CustomThemeProvider = ({ children }) => {
  // تحميل الوضع المحفوظ فوراً من localStorage
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return JSON.parse(savedMode);
      }
      // استخدام تفضيل النظام كافتراضي
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.warn('خطأ في تحميل إعدادات الوضع المظلم:', error);
      return false; // افتراضي للوضع الفاتح
    }
  });

  // حفظ الوضع عند تغييره وتطبيق data-theme
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
      // تطبيق data-theme attribute للـ CSS المخصص
      document.documentElement.setAttribute(
        'data-theme',
        darkMode ? 'dark' : 'light'
      );

      // إضافة class للـ body أيضاً للتوافق
      if (darkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
      }
    } catch (error) {
      console.warn('خطأ في حفظ إعدادات الوضع المظلم:', error);
    }
  }, [darkMode]);

  // مراقبة تغييرات تفضيل النظام
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = e => {
      // تطبيق تفضيل النظام فقط إذا لم يكن هناك إعداد محفوظ
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // إنشاء الثيم حسب الوضع
  const theme = createTheme({
    direction: 'rtl',
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#6366f1' : '#4f46e5', // Indigo modern color
        light: darkMode ? '#8b5cf6' : '#7c3aed', // Purple accent
        dark: darkMode ? '#4338ca' : '#3730a3', // Darker indigo
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#dc004e',
        light: darkMode ? '#ffc1e3' : '#ff5983',
        dark: darkMode ? '#f06292' : '#9a0036',
      },
      background: {
        default: darkMode ? '#0f0f23' : '#fafafa', // Dark navy background
        paper: darkMode ? '#1a1a2e' : '#ffffff', // Slightly lighter navy for cards
      },
      text: {
        primary: darkMode ? '#e2e8f0' : '#1a202c', // Light gray for dark mode
        secondary: darkMode ? '#a0aec0' : '#4a5568', // Medium gray
      },
      success: {
        main: darkMode ? '#4caf50' : '#2e7d32',
      },
      warning: {
        main: darkMode ? '#ff9800' : '#ed6c02',
      },
      error: {
        main: darkMode ? '#f44336' : '#d32f2f',
      },
      info: {
        main: darkMode ? '#2196f3' : '#0288d1',
      },
    },
    typography: {
      fontFamily: [
        'Cairo',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: darkMode
              ? '0 8px 32px rgba(0,0,0,0.4)'
              : '0 4px 20px rgba(0,0,0,0.1)',
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
            backgroundImage: darkMode
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
              : 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
            color: darkMode ? '#e2e8f0' : '#1a202c',
            boxShadow: darkMode
              ? '0 4px 20px rgba(0,0,0,0.4)'
              : '0 2px 10px rgba(0,0,0,0.1)',
            borderBottom: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            borderRight: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#2a2a2a' : '#f5f5f5',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: darkMode ? '#2a2a2a' : '#f5f5f5',
            },
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  const value = {
    darkMode,
    toggleDarkMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <RTLProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </RTLProvider>
    </ThemeContext.Provider>
  );
};
