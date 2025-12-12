import React, { useEffect } from "react";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
// import data_foundation from "../assets/data_foundation-2.svg";
import {
  Brain,
  Database,
  LayersIcon,
  ChartNoAxesColumnIncreasing,
  Users,
  CreditCard
} from "lucide-react";
import { FolderKanban, FolderPlus, FolderClosed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import BasicDialog from "../components/modal/BasicDialog";
import CreateProject from "../page/projects/CreateProject";
import { creatProject, getAllProject, getAllProjectForAuditor } from "../store/apiCall/projects";

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
  // { to: ['/app/projects', '/app/project-details', '/app/tokenize'], Icon: FolderKanban, label: 'Projects' },
  { to: ['/app/users'], Icon: Users, label: 'User Management' },
];

export default function SideNav({ mobileOpen, onClose, collapsed, toggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([])
  const [openModal, setOpenModal] = useState(false);
  const [projectLoading, setProjectLoading] = React.useState(false);

  const filteredMenuItems = user?.role === 'owner' ? menuItems.filter(item => item.label !== 'User Management') : menuItems;



  // ⭐ PLATFORM FIX — On mobile, force expanded drawer
  const finalCollapsed = isMobile ? false : collapsed;

  const userRole = "admin";

  useEffect(() => {
    if (user?.role !== 'verifier') {
      dispatch(getAllProject(setLoading, setProjects))
    } else {
      dispatch(getAllProjectForAuditor(setLoading, setProjects))
    }
  }, [])

  useEffect(() => {
    if (projects.length > 0) {
      navigate(`/app/tokenize/${projects[0].projectId}`);
    }
  }, [projects]);

  const handleUpload = (values) => {
    dispatch(creatProject(setProjectLoading, values, () => {
      setOpenModal(false);
      dispatch(getAllProject(setLoading, setProjects))
    }))
  }



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
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <Tooltip title={finalCollapsed ? "Add Project" : ""} placement="right">
            <ListItemButton
              onClick={() => {
                setOpenModal(true);
              }}
              sx={{
                borderRadius: 2,
                py: 1.25,
                px: 2,
              }}
            >
              <ListItemIcon
                sx={{ minWidth: finalCollapsed ? "auto" : 40, color: "inherit" }}
              >
                <FolderPlus />
              </ListItemIcon>
              {!finalCollapsed && (
                <ListItemText
                  primary="Add Project"
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: 400,
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {projects.map((project) => {
          const isActive = location.pathname.startsWith(`/app/tokenize/${project.projectId}`);
          return (
            <ListItem key={project.projectId} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={finalCollapsed ? project?.projectName : ""} placement="right">
                <ListItemButton
                  component={Link}
                  to={`/app/tokenize/${project.projectId}`}
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
                    <FolderClosed />
                  </ListItemIcon>

                  {!finalCollapsed && (
                    <ListItemText
                      primary={project?.projectName}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        // fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}


        {user?.role === 'admin' && filteredMenuItems.map(({ to, label, Icon }) => {
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
                    borderRadius: "50px",
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
  return (
    <>
      <StyledDrawer variant="permanent" open={!finalCollapsed}>
        {drawerContent}
      </StyledDrawer>
      <BasicDialog
        title={"Add Project"}
        open={openModal}
        onClose={() => setOpenModal(false)}
        content={<CreateProject loading={projectLoading} handleSubmit={handleUpload} />}
        closeIcon={true}
        maxWidth={"md"}
      />
    </>
  );
}
