import { Box, Button, Typography } from '@mui/material';
import React from 'react';

const user = 'doctor';
const newCase = false;
const boxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const AppointmentItem = ({ appointment }) => {
  return (
    <div>
        <Box sx={boxStyle}>
            <Typography variant='h6' component='div' sx={{ ml: 2, fontSize: '1.1rem' }}>
                <strong>Patient Name : </strong>
                {appointment.patientName}
            </Typography>

            <Typography variant='h6' component='div' sx={{ mr: 3, fontSize: '1.1rem' }}>
                <strong>Doctor Name : </strong>
                {appointment.doctorName}
            </Typography>

            <Typography variant='h6' component='div' sx={{ mr: 4, fontWeight: 'bold' }}>
                Case : {appointment.case}
            </Typography>
        </Box>

        <Box
            sx={{ mt: 3, ...boxStyle }}
        >
            <Typography variant='p' component='p'
                sx={{
                    ml: 3,
                    fontSize: '1.1em'
                }}
            >
                {new Date(appointment.startTime).toLocaleTimeString()}
                {'-'}
                {new Date(appointment.endTime).toLocaleTimeString()}
            </Typography>

            <Typography variant='p' component='p'
                sx={{
                    mr: 5,
                    fontSize: '1.1em'
                }}
            >
                {new Date(appointment.date).toLocaleDateString()}
            </Typography>

            {
                user === 'doctor' && (
                <Button
                    variant='contained'
                    color='success'
                    sx={{ mr: 4, fontSize: {xs: '0.6em', md: '1em' }, textTransform: 'none' }}
                >
                    {newCase ? 'Create New Case' : 'View Case Study'}
                </Button>
                )
            }
            
        </Box>
    </div>
  )
}

export default AppointmentItem;