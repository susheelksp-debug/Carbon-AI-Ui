import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  styled,
  useMediaQuery,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ChevronRight } from "@mui/icons-material";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../instance";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export const drawerWidth = 260;
export const collapsedWidth = 72;

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: "100%",
  backgroundColor: theme.palette.background.navbar,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // Desktop styles when sidebar is open/collapsed
  [theme.breakpoints.up("md")]: {
    ...(open && {
      marginLeft: `${drawerWidth}px`,
      width: `calc(100% - ${drawerWidth}px)`,
    }),
    ...(!open && {
      marginLeft: `${collapsedWidth}px`,
      width: `calc(100% - ${collapsedWidth}px)`,
    }),
  },
  // Mobile styles
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginLeft: 0,
  },
}));

export default function Header({ onMenuClick, open = true, user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const showMenuButton = isMobile || !open;
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state?.auth);

  // notifications menu
  const [notifAnchor, setNotifAnchor] = React.useState(null);
  const notifOpen = Boolean(notifAnchor);
  const notifications = [
    { id: 1, title: "Sync complete", desc: "Claims DB finished syncing" },
    { id: 2, title: "Schema update", desc: "New column detected in policies" },
  ];

  const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  // profile menu
  const [profileAnchor, setProfileAnchor] = React.useState(null);
  const profileOpen = Boolean(profileAnchor);
  const displayName = user?.name || localStorage.getItem("userName") || "Rajarshi Das";
  const avatarUrl = user?.avatarUrl || "Rajarshi Das";

  const handleProfileOpen = (e) => setProfileAnchor(e.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleGotoProfile = () => {
    handleProfileClose();
    navigate("/app/profile");
  };

  const handleLogout = () => {
    handleProfileClose();
    // default logout behavior - customize as needed
    dispatch({ type: "RESET_APP" });
    axiosInstance.defaults.headers.common["Authorization"] = "";
    navigate("/", { replace: true });
  };

  // show hamburger when:
  // - mobile (always), OR
  // - desktop and sidebar is collapsed (so user can expand it)
  return (
    <StyledAppBar elevation={0} open={open}>
      <Toolbar sx={{ minHeight: 64, pr: { xs: 1, md: 3 } }}>
        {showMenuButton && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onMenuClick}
            edge="start"
            sx={{ mr: 2, display: "inline-flex" }}
            size="small"
          >
            {isMobile ? <MenuIcon /> : <ChevronRight />}
          </IconButton>
        )}

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          CARBON-AI (C-AI-X)
        </Typography>

        {/* Right-side actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Notifications */}
          {/* <IconButton
            color="inherit"
            aria-label="notifications"
            onClick={handleNotifOpen}
            size="large"
            sx={{ ml: 0.5 }}
          >
            <Badge badgeContent={notifications.length} color="error" overlap="circular">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}

          {/* <Menu
            anchorEl={notifAnchor}
            open={notifOpen}
            onClose={handleNotifClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { width: 320, maxWidth: "90vw" } }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
            </Box>
            <Divider />
            {notifications.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </MenuItem>
            ) : (
              notifications.map((n) => (
                <MenuItem key={n.id} onClick={handleNotifClose} sx={{ alignItems: "flex-start", py: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">{n.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                      {n.desc}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
            <Divider />
            <MenuItem onClick={handleNotifClose} sx={{ justifyContent: "center" }}>
              <Typography variant="body2" color="primary">
                View all
              </Typography>
            </MenuItem>
          </Menu> */}

          {/* Profile / Avatar */}
          <IconButton onClick={handleProfileOpen} size="small" sx={{ ml: 1 }}>
            <Avatar src={avatarUrl} sx={{ width: 36, height: 36, fontSize: 14 }}>
              {(!avatarUrl && isLoggedIn?.user?.username ? isLoggedIn?.user?.username?.charAt(0) : "")}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={profileAnchor}
            open={profileOpen}
            onClose={handleProfileClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { width: 220 } }}
          >
            <Box sx={{ px: 2, py: 1.25 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {isLoggedIn?.user?.username || "Rajarshi Das"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isLoggedIn?.user?.email || ""}
              </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={handleGotoProfile}>
              <ListItemIcon>
                <PersonOutline fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>

            <MenuItem onClick={() => { handleProfileClose(); navigate("/app/settings"); }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
