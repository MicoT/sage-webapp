import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  Person,
  MenuBookOutlined,
  ArticleOutlined,
  GradingOutlined,
  Home,
  ChevronRightOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import brand from "assets/sage.png";

const navItems = [
  {
    text: "Dashboard",
    icon: <Home />,
    path: "dashboard"
  },
  {
    text: "Student Activities",
    icon: null,
    path: "student/activities"
  },
  {
    text: "Student Usage Activity",
    icon: <ArticleOutlined />,
    path: "overview"
  },
    // {
  //   text: "Course Contents",
  //   icon: <AssessmentOutlined />,
  //   path: "course content"
  // },
  {
    text: "Assessment Tracking",
    icon: null,
  },
  {
    text: "Grade Post Status",
    icon: <GradingOutlined />,
    path: "grades"
  },
  // {
  //   text: "Rates",
  //   icon: <GradingOutlined />,
  //   path: "rates"
  // },
  {
    text: "Monitoring Tools",
    icon: null,
    path: "monitoring"
  },
  {
    text: "Instructor Content",
    icon: <MenuBookOutlined />,
    path: "content"
  },
  // {
  //   text: "Course Contents",
  //   icon: <AssessmentOutlined />,
  //   path: "course content"
  // },
  // {
  //   text: "No Instructor Courses",
  //   icon: <SpeakerNotesOffIcon />,
  //   path: "no-instructor/courses"
  // },
  {
    text: "Instructor Usage",
    icon: <Person />,
    path: "instructor-usage"
  },
  
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const userLoggedIn = Boolean(localStorage.getItem('token')); // Check if the user is logged in

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);
  if (!userLoggedIn) {
    return null; // If the user is not logged in, don't render the sidebar
  }
  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1rem 3rem 1rem 1rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box
                  component="img"
                  src={brand}
                  height="100%"
                  width="100%"
                  sx={{ objectFit: "cover" }}
                ></Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, path }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = path;

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[700]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[800]
                            : theme.palette.secondary[900],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "0.5rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* <Box position="absolute" bottom="1rem">
            <Divider />
            <FlexBetween
              textTransform="none"
              gap="3rem"
              m="1.5rem 2 rem 0 3 rem"
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
                <Box textAlign="left">
                  <Typography
                    fontWeight="bold"
                    fontSize="1rem"
                    sx={{ color: theme.palette.secondary[100] }}
                  >
                    USER
                  </Typography>
                  <Typography
                    fontSize="0.8rem"
                    sx={{ color: theme.palette.secondary[100] }}
                  >
                    CCIS ADMIN
                  </Typography>
                </Box>
                <SettingsOutlined 
                  sx={{color: theme.palette.secondary[300], fontSize: "25px"}}
                />
            </FlexBetween>
          </Box> */}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
