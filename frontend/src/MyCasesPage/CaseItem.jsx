import { Button, Typography, Modal } from '@mui/material';
import { Box } from '@mui/system';
import { React } from 'react';
import { Link } from 'react-router-dom';

const boxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const CaseItem = ({ caseObj }) => {

    return (
        <div>
            <Box sx={boxStyle} >
                <Typography variant='h6' component='div'
                    sx={{
                        ml: 2,
                        fontWeight: 'bold'
                    }}
                >
                    Case : {caseObj.caseId}
                </Typography>

                <Typography variant='p' component='div'
                    sx={{
                        mr: 4,
                        color: '#757a79'
                    }}
                >
                    {new Date(caseObj.date).toLocaleDateString()}
                </Typography>
            </Box>

            <Box sx={{mt: 1,...boxStyle, justifyContent: 'start'}} >
                <Typography variant='p' component='div' sx={{ ml: 5, fontSize: '1.1em' }} >
                    <strong> Created by : </strong>
                    {caseObj.doctorName}
                </Typography>

                <Typography variant='p' component='div' sx={{ ml: 5, fontSize: '1.1em' }} >
                    <strong> Patient Name : </strong>
                    {caseObj.patientName}
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
                    {caseObj.problem}
                </Typography>

                <Button
                    variant='contained'
                    color='success'
                    sx={{ mr: 4, fontSize: {xs: '0.6em', md: '1em' }, textTransform: 'none' }}
                    component={Link}
                    to={`/case/${caseObj.caseId}`}
                >
                    See Details
                </Button>
            </Box>

            
        </div>
    )
}

export default CaseItem