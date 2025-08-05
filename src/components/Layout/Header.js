// Header Component
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  InputBase,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  right: 0,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Header = () => {
  const { currentUser, userData, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = event => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    await logoutUser();
    handleMenuClose();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        {/* Logo */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            mr: 2,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.3)',
              transform: 'scale(1.05)',
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: '1.2rem',
              letterSpacing: '1px',
            }}
          >
            AI
          </Typography>
        </Box>

        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer', mr: 3 }}
          onClick={() => navigate('/')}
        >
          أكرم إبراهيم
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" onClick={() => navigate('/courses')}>
            الدورات
          </Button>
          <Button color="inherit" onClick={() => navigate('/categories')}>
            التصنيفات
          </Button>
          <Button color="inherit" onClick={() => navigate('/instructors')}>
            المدربين
          </Button>
          <Button color="inherit" onClick={() => navigate('/about')}>
            من نحن
          </Button>
        </Box>

        {/* Search */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="ابحث عن الدورات..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        {/* User Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Enhanced Theme Toggle */}
          <Box sx={{ ml: 1 }}>
            <ThemeToggle size="medium" />
          </Box>

          {isAuthenticated ? (
            <>
              {/* Shopping Cart */}
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <Badge badgeContent={0} color="error">
                  <CartIcon />
                </Badge>
              </IconButton>

              {/* Notifications */}
              <IconButton
                color="inherit"
                onClick={handleNotificationOpen}
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Profile Menu */}
              <IconButton
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ ml: 1 }}
              >
                {userData?.profile?.avatar ? (
                  <Avatar
                    src={userData.profile.avatar}
                    alt={userData.fullName}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle sx={{ fontSize: 32 }} />
                )}
              </IconButton>

              {/* Profile Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate('/profile');
                    handleMenuClose();
                  }}
                >
                  الملف الشخصي
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/my-courses');
                    handleMenuClose();
                  }}
                >
                  دوراتي
                </MenuItem>
                {userData?.role === 'instructor' && (
                  <MenuItem
                    onClick={() => {
                      navigate('/instructor/dashboard');
                      handleMenuClose();
                    }}
                  >
                    لوحة المدرب
                  </MenuItem>
                )}
                {userData?.role === 'admin' && (
                  <MenuItem
                    onClick={() => {
                      navigate('/admin/dashboard');
                      handleMenuClose();
                    }}
                  >
                    لوحة الإدارة
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    navigate('/settings');
                    handleMenuClose();
                  }}
                >
                  الإعدادات
                </MenuItem>
                <MenuItem onClick={handleLogout}>تسجيل الخروج</MenuItem>
              </Menu>

              {/* Notifications Menu */}
              <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={handleNotificationClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleNotificationClose}>
                  إشعار جديد 1
                </MenuItem>
                <MenuItem onClick={handleNotificationClose}>
                  إشعار جديد 2
                </MenuItem>
                <MenuItem onClick={handleNotificationClose}>
                  إشعار جديد 3
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleLogin} sx={{ ml: 1 }}>
                تسجيل الدخول
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleRegister}
                sx={{ ml: 1 }}
              >
                إنشاء حساب
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
