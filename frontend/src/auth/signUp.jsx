import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { FormGroup, FormControl, InputLabel, Input, Typography } from '@mui/material';
import TimePicker from '@mui/lab/TimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterMoment';
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';


// const schema = yup.object({
//     medicines: yup.array()
//         .of(
//             yup.object().shape({
//                 medicine: yup.string().trim().min(1, "medicine should empty"),
//                 dosage: yup.string().trim().min(1, "dosage should not be empty"),
//             })
//         ),
//     labtests: yup.array()
//         .of(
//             yup.object().shape({
//                 testname: yup.string().trim().min(1, "test name should not be empty")
//             })
//         )
// });




export default function Signup() {





    const { control, handleSubmit, watch, register, unregister, setValue, formState: { errors } } = useForm({
        defaultValues: {
            user_type: 'patient',
            name: '',
            personal_email: '',
            guardian_email: '',
            dob: '',
            phone_number: '',
            allergies: '',
            password: ''
        },
        // resolver: yupResolver(schema)
    });

    const watchUserType = watch('user_type');
    const watchPersonalEmail = watch('personal_email');
    const [date, setDate] = useState(null);


    useEffect(() => {
        if (watchUserType === 'doctor') {
            unregister('allergies');
            register('schedule_timing');
        }
        else {
            console.log("in else");
            unregister('schedule_timing');
            unregister('schedule');
            unregister('slot_duration');
            if (watchUserType !== 'patient')
                unregister('allergies');
        }
    }, [register, watchUserType]);

    const iitbhilai_email_pattern = /@iitbhilai.ac.in$/;

    useEffect(() => {
        if (watchPersonalEmail.match(iitbhilai_email_pattern) !== null) {
            unregister('guardian_email');
        }
    }, [watchPersonalEmail])


    return (

        <form onSubmit={handleSubmit(data => console.log(data))} >
            <Stack spacing={2}>
                <Typography variant="h3">Sign Up</Typography>
                <Controller
                    rules={{ required: true }}
                    control={control}
                    name="user_type"
                    render={({ field }) => (
                        <RadioGroup style={{ display: 'inline' }} label="User Type" {...field}>
                            <FormControlLabel
                                value="patient"
                                control={<Radio />}
                                label="Patient"
                            />
                            <FormControlLabel
                                value="doctor"
                                control={<Radio />}
                                label="Doctor"
                            />
                            <FormControlLabel
                                value="nurse"
                                control={<Radio />}
                                label="Nurse"
                            />
                        </RadioGroup>
                    )}
                />


                <Controller
                    render={({ field }) => <TextField {...field} label="Name" />}
                    name='name'
                    control={control} />

                <Controller
                    render={({ field }) => <TextField {...field} label="Email Address" />}
                    name='personal_email'
                    control={control} />
                {
                    watchPersonalEmail.match(iitbhilai_email_pattern) === null ?
                        <Controller
                            render={({ field }) => <TextField {...field} label="Guardian Address" />}
                            name='guardian_email'
                            control={control} />
                        :
                        null
                }

                <Controller
                    render={({ field }) => <TextField {...field} label="Password" />}
                    name='password'
                    control={control} />


                <Controller
                    render={({ field }) => <TextField {...field} label="DOB: DD/MM/YYYY" />}
                    name='dob'
                    control={control} />

                <Controller
                    render={({ field }) => <TextField {...field} label="Phone Number" />}
                    name='phone_number'
                    control={control} />

                {watchUserType === "patient" ?

                    <Controller
                        render={({ field }) => <TextField {...field} label="Allergies" />}
                        name='allergies'
                        control={control} />

                    :
                    watchUserType === "nurse" ? <></> :
                        <>
                            <FormLabel>Schedule</FormLabel>
                            <Controller
                                defaultValue={false}
                                name="schedule.sunday"
                                control={control}
                                render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Sunday" />} />
                            <Controller
                                defaultValue={false}
                                name="schedule.monday"
                                control={control}

                                render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Monday" />} />
                            <Controller
                                defaultValue={false}
                                name="schedule.tuesday"
                                control={control}
                                render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Tuesday" />} />
                            <Controller
                                defaultValue={false}
                                name="schedule.wednesday"
                                control={control}
                                render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Wednesday" />} />
                            <Controller
                                defaultValue={false}
                                name="schedule.thursday"
                                control={control}
                                render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Thursday" />} />
                            <Controller
                                defaultValue={false}
                                name="schedule.friday"
                                control={control}
                                render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Friday" />} />
                            <Controller
                                defaultValue={false}
                                name="schedule.saturday"
                                control={control}
                                render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Saturday" />} />
                            <LocalizationProvider dateAdapter={DateAdapter}>
                                <TimePicker
                                    label="Start Time"
                                    value={date}
                                    onChange={(date) => {
                                        setValue('schedule_timing', date, { shouldValidate: true, shouldDirty: true })
                                        setDate(date);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>

                            <Controller
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Each Slot Duration(mins)" />}
                                name='slot_duration'
                                control={control} />
                        </>
                }

                <Button
                    type='submit'
                    variant="contained"
                    color="primary">
                    Submit
                </Button>
            </Stack>
        </form >
    );
}
