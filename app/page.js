"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Paper,
} from '@mui/material';
import { Menu as MenuIcon } from 'lucide-react';

// Custom theme colors
const themeColors = {
  primary: '#2C3E50',
  secondary: '#34495E',
  background: '#F5F6F7',
  text: '#2C3E50',
  accent: '#3498DB',
};

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{
      flexGrow: 1,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: themeColors.background
    }}>
      {/* Header/AppBar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)'
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 500,
              color: themeColors.primary
            }}
          >
            MedTranslate
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="menu"
                onClick={handleMenu}
                sx={{ color: themeColors.primary }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>About</MenuItem>
                <MenuItem onClick={handleClose}>Contact</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button sx={{ color: themeColors.primary }}>About</Button>
              <Button sx={{ color: themeColors.primary }}>Contact</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 8
        }}
      >
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h1"
          sx={{
            fontWeight: 500,
            color: themeColors.primary,
            mb: 3,
            maxWidth: '800px'
          }}
        >
          Real-Time Medical Translation & Speech Recognition
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 6,
            maxWidth: '600px',
            mx: 'auto',
            px: 2,
            color: themeColors.secondary,
            fontWeight: 400
          }}
        >
          Breaking language barriers in healthcare communication. Instant translation and speech recognition for better patient care.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 1,
            fontSize: '1.1rem',
            textTransform: 'none',
            bgcolor: themeColors.accent,
            '&:hover': {
              bgcolor: '#2980B9'
            },
            mb: 8
          }}
          onClick={() => router.push('/webspeechapi')}
        >
          Start Now
        </Button>;
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            width: '100%',
            maxWidth: '1200px'
          }}
        >
          {[
            {
              title: 'Real-Time Translation',
              description: 'Instant translation between multiple languages for seamless communication.'
            },
            {
              title: 'Speech Recognition',
              description: 'Advanced voice recognition technology optimized for medical terminology.'
            },
            {
              title: 'Secure & Private',
              description: 'Your conversations are protected with industry-standard security measures.'
            }
          ].map((feature, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.06)',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  mb: 2,
                  fontWeight: 500,
                  color: themeColors.primary
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: themeColors.secondary }}
              >
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: 'white',
          borderTop: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)'
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" align="center" sx={{ color: themeColors.secondary }}>
            <Button sx={{ color: themeColors.secondary }} size="small">Privacy Policy</Button>
            {' | '}
            <Button sx={{ color: themeColors.secondary }} size="small">Terms of Use</Button>
            {' | '}
            <Button sx={{ color: themeColors.secondary }} size="small">Contact</Button>
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: 1,
              color: themeColors.secondary
            }}
          >
            © {new Date().getFullYear()} MedTranslate. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;