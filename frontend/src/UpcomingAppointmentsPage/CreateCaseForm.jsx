import { Button, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
  };

export const CreateCaseForm = React.forwardRef((props, ref) => {

    const [issue, setIssue] = useState('');
    const [patientName, setPatientName] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('details :', props.details);
        
        const caseData = {
            issue,
            patientName
        };

        console.log('caseData :' , caseData);
        
        setIssue('');
        setPatientName('');
        
        props.setopen(false);
    };


  return (
    <div >
        <Box sx={style}>
            
            <Typography variant='h5' component='div' sx={{fontWeight: 'bold', textAlign: 'center'}}>
                Create Case Form
            </Typography>
            
            <form noValidate onSubmit={(e) => handleSubmit(e)}>
                

                <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id="issue"
                    label="Issue"
                    value={issue}
                    onChange={(e) => setIssue(e.currentTarget.value)}
                />

                
                <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id="patientEmail"
                    label="Email of Patient"
                    value={patientName}
                    onChange={(e) => setPatientName(e.currentTarget.value)}
                    autoComplete="off"
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
        </Box>
    </div>
  )
})
