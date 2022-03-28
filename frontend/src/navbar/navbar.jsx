/* eslint-disable no-unused-vars */
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from "@mui/system";

const links = [
  { children: 'Expenses', to: '/expenses' },
  { children: 'Expenses', to: '/login' },
  { children: 'Expenses', to: '/expenses2' },
  { children: 'My Cases', to: '/prescriptions' },
  { children: 'Upcoming Appointments', to: '/appointments' },
  { children: 'Sign In', to: '/signin' },
  { children: 'Home', to: '/' },
  { children: 'Case', to: '/case' },
]

const navLinkStyle = { m: 2, color: 'white', display: 'block', textTransform: 'none', fontSize: '1.01em', '&.active': { color: 'red' } }

export default function NavBar() {
  const { auth, setAuth } = React.useContext(AuthContext);

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (e) => {
    setAnchorElNav(e.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const menuItemClicked = (link) => {
    window.location.assign(link);
    handleCloseNavMenu();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{
          marginRight: 15,
          display: { xs: 'none', md: 'flex' },
          fontWeight: 'bold'
        }} >
          LOGO
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {links.map((link) => (
              <MenuItem key={link.to} onClick={() => menuItemClicked(link.to)}>
                <Typography textAlign="center">{link.children}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, fontWeight: 'bold' }}
        >
          LOGO
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {links.map((link) => (
            <Button
              key={link.to}
              component={Link}
              sx={navLinkStyle}
              {...link}
            />
          ))}
          {
            auth ?
              <Button
                onClick={() => { setAuth(prevState => !prevState); }}
                sx={navLinkStyle}>
                Logout
              </Button>
              :
              <Button
                component={Link}
                to='/login'
                sx={navLinkStyle}>
                Login
              </Button>
          }
        </Box>
      </Toolbar>
    </AppBar >
  );
}
