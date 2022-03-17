/* eslint-disable no-unused-vars */
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import { Button } from "@mui/material";
import { Box } from "@mui/system";

const links = [
  { children: 'Home', to: '/' },
  { children: 'Case', to: '/case' },
]

const navLinkStyle = { my: 2, color: 'white', display: 'block' }

export default function NavBar() {
  const { auth, setAuth } = React.useContext(AuthContext);
  return (
    <AppBar
      position="static"
      elevation={0}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ marginRight: 4 }} >
          Photos
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex' }}>
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
                sx={navLinkStyle}>
                Login
              </Button>
          }
        </Box>
      </Toolbar>
    </AppBar >
  );
}
