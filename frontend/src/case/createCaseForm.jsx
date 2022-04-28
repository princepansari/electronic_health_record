import { Button, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';
import CenterCircularProgress from '../common/centerLoader';
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

export const CreateCaseForm = React.forwardRef(function CreateCaseForm(props, ref) {

    const [problem, setProblem] = useState('');
    const [email, setEmail] = useState(props.patientEmail || '');

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        const caseData = {
            problem,
            email
        };
        console.log('caseData :', caseData);

        createCase(user.token, email, problem)
            .then((caseId) => {
                navigate(`/case/${caseId}`);
            })
            .catch((err) => {
                console.log(err?.response?.data?.message);
                setErrorMsg(err?.response?.data?.message);
                setIsLoading(false);
            });

        setProblem('');
        setEmail('');

        setIsLoading(true);
    };


    return (
        <div >
            <Box sx={style}>

                <Typography variant='h5' component='div' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Create Case Form
                </Typography>

                <form noValidate onSubmit={(e) => handleSubmit(e)}>


                    <TextField
                        variant='filled'
                        margin='normal'
                        required
                        fullWidth
                        id="problem"
                        label="Problem"
                        value={problem}
                        onChange={(e) => setProblem(e.currentTarget.value)}
                        InputProps={{
                            disableUnderline: true,
                        }} />


                    <TextField
                        variant='filled'
                        required
                        fullWidth
                        id="patientEmail"
                        label="Email of Patient"
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        autoComplete="off"
                        InputProps={{
                            disableUnderline: true,
                        }} />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ my: 2 }}
                    >
                        {isLoading ?
                            <CenterCircularProgress />
                            :
                            "Submit"
                        }
                    </Button>
                    <Typography variant="body1"
                        color="error"
                        component='div'>
                        {errorMsg}
                    </Typography>
                </form>
            </Box>
        </div>
    )
})