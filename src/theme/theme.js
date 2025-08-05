// Material-UI Theme Configuration for Arabic RTL - Enhanced Modern Design
import { createTheme } from '@mui/material/styles';
import { arSA } from '@mui/material/locale';

const theme = createTheme(
  {
    direction: 'rtl',
    palette: {
      primary: {
        main: '#667eea', // Modern gradient blue
        light: '#a8b5ff', // Lighter gradient
        dark: '#3b4cb8', // Darker gradient
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#f093fb', // Soft pink gradient
        light: '#ffc3fd', // Lighter pink
        dark: '#bd61c8', // Darker pink
        contrastText: '#ffffff',
      },
      tertiary: {
        main: '#4facfe', // Cyan gradient
        light: '#7dd3fc', // Light cyan
        dark: '#0284c7', // Dark cyan
        contrastText: '#ffffff',
      },
      background: {
        default: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        paper: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardGradient: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      },
      text: {
        primary: '#1a202c',
        secondary: '#4a5568',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      success: {
        main: '#48bb78',
        light: '#68d391',
        dark: '#38a169',
      },
      warning: {
        main: '#ed8936',
        light: '#f6ad55',
        dark: '#dd6b20',
      },
      error: {
        main: '#f56565',
        light: '#fc8181',
        dark: '#e53e3e',
      },
      info: {
        main: '#4299e1',
        light: '#63b3ed',
        dark: '#3182ce',
      },
    },
    typography: {
      fontFamily: '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.6,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    spacing: 8,
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            direction: 'rtl',
            fontFamily: '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
          },
          '*': {
            boxSizing: 'border-box',
          },
          html: {
            direction: 'rtl',
          },
          // Custom scrollbar with gradient
          '::-webkit-scrollbar': {
            width: '12px',
          },
          '::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '10px',
          },
          '::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '25px',
            padding: '12px 32px',
            fontSize: '0.95rem',
            fontWeight: 600,
            textTransform: 'none',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              transition: 'left 0.6s',
            },
            '&:hover::before': {
              left: '100%',
            },
            '&:hover': {
              transform: 'translateY(-2px) scale(1.02)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            },
            '&:active': {
              transform: 'translateY(0) scale(0.98)',
            },
          },
          contained: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)',
            },
          },
          outlined: {
            border: '2px solid transparent',
            background:
              'linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea, #764ba2) border-box',
            color: '#667eea',
            '&:hover': {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover': {
              transform: 'translateY(-8px) rotateX(5deg)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              '&::before': {
                opacity: 1,
              },
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '15px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
              },
              '&.Mui-focused': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 20px rgba(102, 126, 234, 0.3)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                  borderWidth: '2px',
                },
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: '50%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
            },
          },
        },
      },
    },
  },
  arSA
);

export default theme;
