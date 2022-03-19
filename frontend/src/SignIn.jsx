import { Avatar, Button, Paper, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React from 'react';

const SignIn = () => {
  return (
    <div
        style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        <Paper
            sx={{
                mx: {xs: 2, md: 0},
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
            elevation={2}
        >
            <Avatar sx={{backgroundColor: 'secondary.main'}}>
                <LockOutlinedIcon/>
            </Avatar>

            <Typography variant='h5' component='h1' sx={{ mt: 3 }}>
                Sign In
            </Typography>

            <form noValidate style={{ width: '95%' }}>
                <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                />

                <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    type="password"
                    id="password"
                    label="Password"
                    autoComplete="current-password"
                    autoFocus
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ my: 2 }}
                >
                    Submit
                </Button>
            </form>
        </Paper>
    </div>
  )
}

export default SignIn;