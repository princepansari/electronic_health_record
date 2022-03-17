import { Button, Typography, Modal } from '@mui/material';
import { Box } from '@mui/system';
import { React, useState } from 'react';

const boxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const PrescriptionItem = ({ prescription }) => {

    return (
        <div>
            <Box sx={boxStyle} >
                <Typography variant='h6' component='div'
                    sx={{
                        ml: 2,
                        fontWeight: 'bold'
                    }}
                >
                    Case : {prescription.case}
                </Typography>

                <Typography variant='p' component='div'
                    sx={{
                        mr: 4,
                        color: '#757a79'
                    }}
                >
                    {new Date(prescription.date).toLocaleDateString()}
                </Typography>
            </Box>

            <Box sx={{mt: 1,...boxStyle, justifyContent: 'start'}} >
                <Typography variant='p' component='div' sx={{ ml: 5, fontSize: '1.1em' }} >
                    <strong> Created by : </strong>
                    {prescription.doctorName}
                </Typography>

                <Typography variant='p' component='div' sx={{ ml: 5, fontSize: '1.1em' }} >
                    <strong> Patient Name : </strong>
                    {prescription.patientName}
                </Typography>
            </Box>

            <Box sx={boxStyle} >
                <Typography variant='p' component='p'
                    sx={{
                        ml: 3,
                        fontSize: '1.1em'
                    }}
                >
                    <strong>Issue : </strong>
                    {prescription.problem}
                </Typography>

                <Button
                    variant='contained'
                    color='success'
                    sx={{ mr: 4, fontSize: {xs: '0.6em', md: '1em' }, textTransform: 'none' }}
                    href='/case'
                >
                    See Details
                </Button>
            </Box>

            
        </div>
    )
}

export default PrescriptionItem