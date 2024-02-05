import React, { useState } from "react";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon, ArrowDropDownOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from storage
    handleMenuClose(); // Close the dropdown menu
    navigate('/login'); // Navigate to login page
  };
  
  const userLoggedIn = Boolean(localStorage.getItem('token')); // Check if the user is logged in
  const userName = userLoggedIn ? "CCIS ADMIN" : ""; // Replace with logic to get the actual user name

  return (
    <AppBar sx={{ position: "static", background: "none", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left side - Menu Icon */}
        <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <MenuIcon />
        </IconButton>

        {/* Right side - User account and Logout */}
        {userLoggedIn && (
          <Box>
            <Button onClick={handleMenuClick}>
              <Box alt="profile"  height="32px" width="32px" borderRadius="50%" />
              <Typography fontWeight="bold" fontSize="1rem" sx={{ color: theme.palette.secondary[100] }}>
                {userName}
              </Typography>
              <ArrowDropDownOutlined sx={{ color: theme.palette.secondary[300], fontSize: "25px" }} />
            </Button>
            <Menu anchorEl={anchorEl} open={isOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
