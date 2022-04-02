import React, { useContext, useState } from 'react';
import { Button, Stack, Typography, Paper, Container, Snackbar, TextField } from '@mui/material';
import MedicineForm from './medicineForm'
import LabTestsForm from './labTestsForm'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import useRecorder from './useRecorder';
import Recorder from './audioRecorder'
import { createPrescription } from './apis'

import * as yup from "yup";
import AuthContext from '../auth/AuthContext';
import CenterCircularProgress from '../common/centerLoader';

const schema = yup.object({
    problem: yup.string().required("Problem description should not be empty"),
    medicines: yup.array()
        .of(
            yup.object().shape({
                medicine: yup.string().trim().min(1, "medicine should empty"),
                dosage: yup.string().trim().min(1, "dosage should not be empty"),
            })
        ),
    labtests: yup.array()
        .of(
            yup.object().shape({
                testname: yup.string().trim().min(1, "test name should not be empty")
            })
        )
});


export default function PrescriptionForm({ cancel, caseId, reFetchCase, ...props }) {

    const { control, handleSubmit: RHFhandleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            medicines: [],
            labtests: [],
            problem: ''
        },
        resolver: yupResolver(schema)
    });

    const { user } = useContext(AuthContext);
    const [audioURL, audioBlob, isRecording, startRecording, stopRecording, resetRecording] = useRecorder();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSubmit = (data) => {
        createPrescription(user.token, caseId, audioURL ? audioBlob : null, data)
            .then((res) => {
                setIsSuccess(true);
                setIsLoading(false);
                reFetchCase();
            })
            .catch((err) => {
                console.log(err?.response?.data?.message || err);
                setErrorMsg(err?.response?.data?.message || err);
                setIsLoading(false);
            })
        setIsLoading(true);
    }

    return (
        <>
            <Snackbar
                open={isSuccess}
                autoHideDuration={6000}
                message="Successfully created a prescription"
            />
            <Paper elevation={10} sx={{ padding: 5 }} >
                <Container >
                    <form onSubmit={RHFhandleSubmit(handleSubmit)} >
                        <Typography sx={{ marginBottom: 4 }} variant="h5" >New Prescription</Typography>
                        <Recorder
                            audioURL={audioURL}
                            isRecording={isRecording}
                            startRecording={startRecording}
                            stopRecording={stopRecording}
                            resetRecording={resetRecording} />
                        <Typography variant="h6" sx={{ marginBottom: 2 }} > Problem Description</Typography>
                        <Controller
                            render={({ field }) => <TextField
                                sx={{ marginBottom: 2 }}
                                fullWidth
                                minRows={3}
                                multiline
                                required
                                {...field}
                                label="Describe problem in detail"
                                error={errors?.problem}
                                helperText={errors?.problem?.message} />}
                            name={'problem'}
                            control={control}

                        />
                        <MedicineForm control={control} errors={errors} />
                        <div style={{ marginBottom: 20 }}></div>
                        <LabTestsForm control={control} errors={errors} />
                        <Stack direction='row' spacing={2} sx={{ marginTop: 5 }}>
                            <Button
                                type='submit'
                                variant="contained"
                                color="primary">
                                {isLoading ?
                                    <CenterCircularProgress />
                                    :
                                    "Submit"
                                }
                            </Button>
                            <Button
                                onClick={cancel}
                                variant="outlined"
                                color="error">
                                Cancel
                            </Button>
                            <Typography variant="body1"
                                color="error"
                                component='div'>
                                {errorMsg}
                            </Typography>
                        </Stack>
                        {console.log("errors=", errors)}
                    </form >
                </Container>
            </Paper >
        </>
    );
}