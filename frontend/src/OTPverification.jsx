import React, { useState } from 'react';
import LockClockIcon from '@mui/icons-material/LockClock';
import { Avatar, Button, Paper, TextField, Typography } from '@mui/material';

const cond = true;

const OTPverification = () => {
    
    const [guardianOTP, setGuardianOTP] = useState('');
    const [normalOTP, setNormalOTP] = useState('');

    function handleSubmit(event)
    {
        event.preventDefault();

        const otpData = {
            guardianOTP,
            normalOTP,
        };
        console.log(otpData);

        setGuardianOTP('');
        setNormalOTP('');
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
                mx: {xs: 2, md: 0},
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
            elevation={2}
        >
            <Avatar sx={{backgroundColor: 'secondary.main'}}>
                <LockClockIcon/>
            </Avatar>

            <Typography variant='h5' component='h1' sx={{ mt: 3 }}>
                Verify OTP
            </Typography>

            <form noValidate style={{ width: '95%' }} onSubmit={(e) => handleSubmit(e)}>
                

                <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    type="password"
                    id="normalOTP"
                    label="OTP sent on Normal email"
                    value={normalOTP}
                    onChange={(e) => setNormalOTP(e.currentTarget.value)}
                    autoComplete="current-password"
                />

                {
                    cond && (
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            type="password"
                            id="guardianOTP"
                            label="OTP sent on Guardian email"
                            value={guardianOTP}
                            onChange={(e) => setGuardianOTP(e.currentTarget.value)}
                            autoComplete="off"
                        />
                    )
                }

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

export default OTPverification;