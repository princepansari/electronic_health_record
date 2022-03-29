import React from 'react';
import { Button, Stack, Typography, Paper, Container } from '@mui/material';
import MedicineForm from './medicineForm'
import LabTestsForm from './labTestsForm'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const schema = yup.object({
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


export default function PrescriptionForm({ cancel, ...props }) {

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            medicines: [],
            labtests: []
        },
        resolver: yupResolver(schema)
    });



    return (
        <Paper elevation={10} sx={{ padding: 5 }} >
            <Container >

                <form onSubmit={handleSubmit(data => console.log(data))} >
                    <Typography variant="h5" >New Prescription</Typography>
                    <MedicineForm control={control} errors={errors} />
                    <div style={{ marginBottom: 20 }}></div>
                    <LabTestsForm control={control} errors={errors} />
                    <Stack direction='row' spacing={2} sx={{ marginTop: 5 }}>
                        <Button
                            type='submit'
                            variant="contained"
                            color="primary">
                            Submit
                        </Button>
                        <Button
                            onClick={cancel}
                            variant="outlined"
                            color="error">
                            Cancel
                        </Button>
                    </Stack>
                    {console.log("errors=", errors)}
                </form >
            </Container>
        </Paper>
    );
}