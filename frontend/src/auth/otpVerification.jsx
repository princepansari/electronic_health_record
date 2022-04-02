import { Alert, Avatar, Button, CircularProgress, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useContext, useEffect, useState } from 'react';
import { authLogin, authOTPVerification } from './apis';
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from './AuthContext';


export default function OtpVerification(props) {

    const [emailOTP, setEmailOTP] = useState(null);
    const [guardianEmailOTP, setGuardianEmailOTP] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const { user } = useContext(AuthContext);
    const { state: { email, guardian_email } } = useLocation();
    let navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
            return;
        }
    }, [user])

    const [isLoading, setIsLoading] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        authOTPVerification(email, emailOTP, guardianEmailOTP)
            .then((message) => {
                setSuccessMessage(message);
                navigate('/');
            })
            .catch((err) => { console.log("ERROR:", err?.response?.data?.message) }); // TODO: i want to navigate to other page only after i receive response
        setIsLoading(true);
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
            <Snackbar
                open={successMessage !== ''}
                autoHideDuration={6000}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
            {isLoading ?
                <CircularProgress />
                :
                <Paper
                    sx={{
                        mx: { xs: 2, md: 0 },
                        width: '40%',
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
                        OTP Verification
                    </Typography>

                    <form noValidate style={{ width: '100%' }} onSubmit={(e) => handleSubmit(e)}>
                        <Stack spacing={2}>
                            <TextField
                                variant='outlined'
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                value={email}
                                disabled
                            />

                            <TextField
                                variant='outlined'
                                required
                                fullWidth
                                id="email_otp"
                                label="Email OTP"
                                placeholder="Enter the OTP sent to your personal email"
                                value={emailOTP || ''}
                                onChange={(e) => setEmailOTP(e.currentTarget.value)}
                            />
                            {
                                guardian_email ?
                                    <>
                                        <TextField
                                            variant='outlined'
                                            required
                                            fullWidth
                                            label="Guardian Email"
                                            id="guardian_email"
                                            value={guardian_email}
                                            disabled
                                        />
                                        <TextField
                                            variant='outlined'
                                            required
                                            fullWidth
                                            id="guardian_email_otp"
                                            label="Guardian Email OTP"
                                            placeholder="Enter OTP sent to your guardian email"
                                            value={guardianEmailOTP || ""}
                                            onChange={(e) => setGuardianEmailOTP(e.currentTarget.value)}
                                        />
                                    </>
                                    : null
                            }
                        </Stack>

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
            }
        </div>
    )
}

