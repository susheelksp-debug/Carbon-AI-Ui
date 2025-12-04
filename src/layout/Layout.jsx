// src/components/layout/Layout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideNav from './SideNav';
import { Box, useTheme, useMediaQuery } from '@mui/material';

// Sidebar width constants
const drawerWidth = 260;
const collapsedWidth = 72;

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh',
     bgcolor: 'background.default' }}>
      <Header 
        onMenuClick={handleDrawerToggle} 
        open={!collapsed} 
      />
      <SideNav
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        toggleCollapse={() => setCollapsed(!collapsed)}
      />
      <Box 
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { 
            xs: '100%',
            md: `calc(100% - ${collapsed ?
               collapsedWidth : drawerWidth}px)` 
          },
          ml: { 
            xs: 0,
            // md: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`
          },
          mt: 8, // Space for the fixed header
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}