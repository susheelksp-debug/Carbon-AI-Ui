// src/components/layout/SideNav.jsx
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  styled, Tooltip,
  Typography
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
// import data_foundation from "../assets/data_foundation-2.svg";
import {
  Brain,
  Database,
  LayersIcon,
  ChartNoAxesColumnIncreasing,
  Users,
  CreditCard
} from "lucide-react";
import { FolderKanban } from "lucide-react";
import { useSelector } from "react-redux";
// import icon from "../assets/logo.png"

const drawerWidth = 260;
const collapsedWidth = 72;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : collapsedWidth,
    borderRight: "none",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  backgroundColor: theme.palette.background.navbar,
  color: "#FFFFFF !important",
  ...theme.mixins.toolbar,
}));

const menuItems = [
  { to: ['/app/projects', '/app/project-details', '/app/tokenize'], Icon: FolderKanban, label: 'Projects' },
  { to: ['/app/users'], Icon: Users, label: 'User Management' },
];

export default function SideNav({ mobileOpen, onClose, collapsed, toggleCollapse }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useSelector((state) => state.auth);

  const filteredMenuItems = user?.role === 'owner' ? menuItems.filter(item => item.label !== 'User Management') : menuItems;



  // ⭐ PLATFORM FIX — On mobile, force expanded drawer
  const finalCollapsed = isMobile ? false : collapsed;

  const userRole = "admin";



  const drawerContent = (
    <>
      <DrawerHeader>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: finalCollapsed ? "center" : "space-between",
            px: finalCollapsed ? 0 : 1,
          }}
        >
          {!finalCollapsed && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CreditCard />
              <Typography ml={1} variant="body1"><b>CARBON-AI (C-AI-X)</b></Typography>
            </Box>
          )}

          {/* Collapse button hidden on mobile */}
          {!isMobile && (
            finalCollapsed ?
              <CreditCard /> :
              <IconButton onClick={toggleCollapse} size="small" sx={{ p: 0.5, color: "#FFFFFF" }}>
                {/* <ChevronRight /> */}
                <ChevronLeft />
              </IconButton>
          )}
        </Box>
      </DrawerHeader>

      <Divider />

      <List sx={{ px: 1, pt: 1 }}>
        {filteredMenuItems.map(({ to, label, Icon }) => {
          const isActive = to.some(path => location.pathname.startsWith(path));
          return (
            <ListItem key={to[0]} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={finalCollapsed ? label : ""} placement="right">
                <ListItemButton
                  component={Link}
                  to={to[0]}
                  selected={isActive}
                  onClick={onClose}
                  sx={{
                    borderRadius: 2,
                    py: 1.25,
                    px: 2,
                    ...(isActive && {
                      bgcolor: "primary.50",
                      color: "primary.main",
                      "&:hover": { bgcolor: "primary.50" },
                      "& .MuiListItemIcon-root": { color: "primary.main" },
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: finalCollapsed ? "auto" : 40, color: "inherit" }}
                  >
                    <Icon />
                  </ListItemIcon>

                  {!finalCollapsed && (
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}

        {/* Admin Menu */}

      </List>
    </>
  );

  // ⭐ MOBILE MODE — full drawer width, ignore collapse state
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // ⭐ DESKTOP MODE — collapsed sidebar OR expanded sidebar
  return <StyledDrawer variant="permanent" open={!finalCollapsed}>{drawerContent}</StyledDrawer>;
}
