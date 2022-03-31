import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';
import { createCase } from './apis';

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

    const [problem, setProblem] = useState('');
    const [email, setEmail] = useState('');

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const caseData = {
            problem,
            email
        };
        console.log('caseData :', caseData);

        createCase(user.token, email, problem).then((caseId) => {
            navigate(`/case/${caseId}`);
        }).catch((err) => {
            console.log(err?.response?.data?.message || err);
        });

        setProblem('');
        setEmail('');

        props.setopen(false);
        props.setIsLoading(true);
    };


    return (
        <div >
            <Box sx={style}>

                <Typography variant='h5' component='div' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Create Case Form
                </Typography>

                <form noValidate onSubmit={(e) => handleSubmit(e)}>


                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id="problem"
                        label="Problem"
                        value={problem}
                        onChange={(e) => setProblem(e.currentTarget.value)}
                    />


                    <TextField
                        variant='outlined'
                        required
                        fullWidth
                        id="patientEmail"
                        label="Email of Patient"
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
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