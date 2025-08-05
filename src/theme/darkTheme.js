// Enhanced Dark Theme Configuration for Arabic RTL
import { createTheme } from '@mui/material/styles';
import { arSA } from '@mui/material/locale';

const darkTheme = createTheme(
  {
    direction: 'rtl',
    palette: {
      mode: 'dark',
      primary: {
        main: '#7c7ce8', // Enhanced primary blue
        light: '#9999ff', // Brighter light
        dark: '#5555a3', // Deeper dark
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6bb6a7', // Enhanced teal
        light: '#8dd4c7', // Lighter teal
        dark: '#4a8b7a', // Darker teal
        contrastText: '#ffffff',
      },
      tertiary: {
        main: '#b491d4', // Enhanced purple
        light: '#d4b3e8', // Light purple
        dark: '#8b6bb3', // Dark purple
        contrastText: '#ffffff',
      },
      background: {
        default: '#0d0d0f', // Deep dark background
        paper: 'rgba(26, 26, 31, 0.85)', // Semi-transparent paper
        gradient:
          'linear-gradient(135deg, #7c7ce8 0%, #b491d4 50%, #6bb6a7 100%)',
        cardGradient:
          'linear-gradient(145deg, rgba(26, 26, 31, 0.8) 0%, rgba(42, 42, 53, 0.6) 100%)',
      },
      text: {
        primary: '#f0f0f2', // Light text
        secondary: '#bababf', // Medium light text
        disabled: '#7a7a8a', // Disabled text
        gradient: 'linear-gradient(135deg, #7c7ce8 0%, #b491d4 100%)',
      },
      success: {
        main: '#22c55e',
        light: '#4ade80',
        dark: '#16a34a',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      info: {
        main: '#7c7ce8',
        light: '#9999ff',
        dark: '#5555a3',
      },
      divider: 'rgba(124, 124, 232, 0.15)',
    },
    typography: {
      fontFamily: '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        color: '#f0f0f2',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
        color: '#f0f0f2',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: '#f0f0f2',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: 1.4,
        color: '#f0f0f2',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.5,
        color: '#f0f0f2',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.6,
        color: '#f0f0f2',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
        color: '#bababf',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        color: '#bababf',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    spacing: 8,
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            direction: 'rtl',
            fontFamily: '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif',
            background: 'linear-gradient(135deg, #0d0d0f 0%, #1a1a1f 100%)',
            minHeight: '100vh',
            color: '#f0f0f2',
          },
          '*': {
            boxSizing: 'border-box',
          },
          html: {
            direction: 'rtl',
          },
          // Enhanced scrollbar for dark mode
          '::-webkit-scrollbar': {
            width: '12px',
          },
          '::-webkit-scrollbar-track': {
            background: 'rgba(42, 42, 53, 0.5)',
            borderRadius: '10px',
          },
          '::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #7c7ce8 0%, #b491d4 100%)',
            borderRadius: '10px',
            border: '2px solid rgba(42, 42, 53, 0.5)',
            backgroundClip: 'padding-box',
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(135deg, #9999ff 0%, #d4b3e8 100%)',
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
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'left 0.6s',
            },
            '&:hover::before': {
              left: '100%',
            },
            '&:hover': {
              transform: 'translateY(-2px) scale(1.02)',
              boxShadow: '0 10px 25px -5px rgba(124, 124, 232, 0.5)',
            },
            '&:active': {
              transform: 'translateY(0) scale(0.98)',
            },
          },
          contained: {
            background: 'linear-gradient(135deg, #7c7ce8 0%, #b491d4 100%)',
            boxShadow: '0 4px 15px rgba(124, 124, 232, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #9999ff 0%, #d4b3e8 100%)',
              boxShadow: '0 8px 25px rgba(124, 124, 232, 0.6)',
            },
          },
          outlined: {
            border: '2px solid transparent',
            background:
              'linear-gradient(rgba(26, 26, 31, 0.8), rgba(26, 26, 31, 0.8)) padding-box, linear-gradient(135deg, #7c7ce8, #b491d4) border-box',
            color: '#7c7ce8',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c7ce8 0%, #b491d4 100%)',
              color: 'white',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            background: 'rgba(26, 26, 31, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(124, 124, 232, 0.15)',
            boxShadow:
              '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(153, 153, 255, 0.05)',
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
              background: 'linear-gradient(90deg, #7c7ce8, #b491d4, #6bb6a7)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover': {
              transform: 'translateY(-8px) rotateX(5deg)',
              boxShadow:
                '0 20px 40px rgba(0, 0, 0, 0.6), 0 10px 25px -5px rgba(124, 124, 232, 0.4)',
              borderColor: 'rgba(124, 124, 232, 0.3)',
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
              background: 'rgba(26, 26, 31, 0.8)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              color: '#f0f0f2',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(124, 124, 232, 0.2)',
              },
              '&.Mui-focused': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 20px rgba(124, 124, 232, 0.4)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#7c7ce8',
                  borderWidth: '2px',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(124, 124, 232, 0.25)',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#bababf',
              '&.Mui-focused': {
                color: '#7c7ce8',
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'rgba(26, 26, 31, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            borderBottom: '1px solid rgba(124, 124, 232, 0.15)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: 'rgba(26, 26, 31, 0.85)',
            backdropFilter: 'blur(15px)',
            borderRadius: '15px',
            border: '1px solid rgba(124, 124, 232, 0.15)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #7c7ce8 0%, #b491d4 100%)',
            color: 'white',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 5px 15px rgba(124, 124, 232, 0.4)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: '50%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            color: '#bababf',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
              background: 'linear-gradient(135deg, #7c7ce8 0%, #b491d4 100%)',
              color: 'white',
              boxShadow: '0 5px 15px rgba(124, 124, 232, 0.4)',
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: 'rgba(26, 26, 31, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(124, 124, 232, 0.15)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            background: 'rgba(26, 26, 31, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(124, 124, 232, 0.15)',
          },
        },
      },
    },
  },
  arSA
);

export default darkTheme;
