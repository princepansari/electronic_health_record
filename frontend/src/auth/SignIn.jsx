import { Alert, Avatar, Button, CircularProgress, Paper, Skeleton, Snackbar, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useContext, useEffect, useState } from 'react';
import { authLogin } from './apis';
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from './AuthContext';


const SignIn = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({});

    const { setUser, user } = useContext(AuthContext);

    let navigate = useNavigate();
    const { state } = useLocation();

    console.log("from= ", state?.from);

    useEffect(() => {
        if (user) {
            navigate(state?.from || '/');
            return;
        }
    }, [user])


    function handleSubmit(event) {
        event.preventDefault();

        const signinData = {
            email,
            password,
        };
        console.log(signinData);
        authLogin(email, password, setUser)
            .then(() => {
                console.log(user);
                navigate(state?.from || '/');
                console.log("SUCCESS");
                return;
            })
            .catch((err) => {
                setIsLoading(false);
                setError(err);
                console.log(err?.response?.data?.message)
            });
        setIsLoading(true);
    }


    return (
        <div
            style={{
                marginTop: "20%",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >

            {isLoading ?
                <CircularProgress />
                :
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
                    <Typography variant="body1" color="error"> {error?.response?.data?.message}</Typography>
                </Paper>
            }

        </div>
    )
}

export default SignIn;