import { Avatar, Button, Paper, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useContext, useState } from 'react';
import { authLogin } from './apis';
import { useNavigate } from "react-router-dom";


const SignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { auth, setAuth, setUser } = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(() => {
        if (auth)
            navigate('/');
    }, [auth])


    function handleSubmit(event) {
        event.preventDefault();

        const signinData = {
            email,
            password,
        };
        console.log(signinData);
        authUser = authLogin(email, password);
        setUser(authUser);
        setAuth(true);
        setEmail('');
        setPassword('');
        history.push('/');
    }


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
                    mx: { xs: 2, md: 0 },
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
                elevation={2}
            >
                <Avatar sx={{ backgroundColor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>

                <Typography variant='h5' component='h1' sx={{ mt: 3 }}>
                    Sign In
                </Typography>

                <form noValidate style={{ width: '95%' }} onSubmit={(e) => handleSubmit(e)}>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
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