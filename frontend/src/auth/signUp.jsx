import React, { useEffect, useState } from "react";
import {
    Checkbox,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import {
    Typography,
} from "@mui/material";
import TimePicker from "@mui/lab/TimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterMoment";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cloneDeep } from 'lodash';

const iitbhilaiEmailPattern = /@iitbhilai.ac.in$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phoneRegExp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const dobRegex = /^(?:0[1-9]|[12]\d|3[01])([\/.-])(?:0[1-9]|1[012])\1(?:19|20)\d\d$/
const startTimeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm])$/

const schema = yup.object({
    guardian_email: yup
        .string()
        .email()
        .matches(
            iitbhilaiEmailPattern,
            "Please enter email address within IIT Bhilai's domain"
        ),
    phone_number: yup.string().matches(phoneRegExp, "Phone number is not valid"),
    schedule: yup
        .object()
        .shape({
            days: yup.object(),
            // start_time: yup.string().matches(startTimeRegex, "Enter the time in the right format (hh:mm (a|p)m)")
        })
        .test(
            "test-atleast-one-selected",
            "Should select atleast one day",
            (schedule) => schedule === undefined ? true : Object.values(schedule?.days).filter(Boolean).length > 0
        ),
    dob: yup.string().matches(dobRegex, "Enter the date in the format of DD/MM/YYYY"),
    password: yup.string().matches(passwordRegex, "Password should contain Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"),
});

export default function Signup() {
    const {
        control,
        handleSubmit: RHFhandleSubmit,
        watch,
        register,
        unregister,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            user_type: "patient",
            name: "",
            personal_email: "",
            guardian_email: "",
            dob: "",
            phone_number: "",
            allergies: "",
            password: "",
        },
        resolver: yupResolver(schema),
    });

    const watchUserType = watch("user_type");
    const watchPersonalEmail = watch("personal_email");
    const [date, setDate] = useState(null);

    useEffect(() => {
        if (watchUserType === "doctor") {
            unregister("allergies");
            register("schedule.start_time");
        } else {
            console.log("in else");
            unregister("schedule.start_time");
            unregister("schedule");
            unregister("slot_duration");
            if (watchUserType !== "patient") unregister("allergies");
        }
    }, [register, watchUserType]);

    useEffect(() => {
        if (watchPersonalEmail.match(iitbhilaiEmailPattern) !== null) {
            unregister("guardian_email");
        }
    }, [watchPersonalEmail]);

    const preprocessData = (data) => {
        data = cloneDeep(data)
        if ("schedule" in data) {
            data.schedule.start_time = data.schedule.start_time.format("hh:mm a").toString();
        }
        for (let key in data) {
            if (data[key] === null || data[key] === undefined)
                data.key = ""
        }
        return data
    }

    const handleSubmit = (data) => {
        const userObj = preprocessData(data)
        console.log(userObj)
    }


    return (
        <form onSubmit={RHFhandleSubmit(handleSubmit)}>
            <Stack spacing={2}>
                <Typography variant="h3">Sign Up</Typography>
                <Controller
                    rules={{ required: true }}
                    control={control}
                    name="user_type"
                    render={({ field }) => (
                        <RadioGroup
                            style={{ display: "inline" }}
                            label="User Type"
                            {...field}
                        >
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
                    render={({ field }) => <TextField {...field} required label="Name" />}
                    name="name"
                    control={control}
                />

                <Controller
                    render={({ field }) => (
                        <TextField {...field} required label="Email Address" />
                    )}
                    name="personal_email"
                    control={control}
                />
                {watchPersonalEmail.match(iitbhilaiEmailPattern) === null ? (
                    <Controller
                        // required
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                label="Guardian Email Address"
                                error={errors?.guardian_email}
                                helperText={errors?.guardian_email?.message}
                            />
                        )}
                        name="guardian_email"
                        control={control}
                    />
                ) : null}

                <Controller
                    render={({ field }) => (
                        <TextField {...field} required label="Password"
                            error={errors?.password}
                            helperText={errors?.password?.message} />
                    )}
                    name="password"
                    control={control}
                />

                <Controller
                    render={({ field }) => (
                        <TextField {...field} required label="DOB: DD/MM/YYYY"
                            error={errors?.dob}
                            helperText={errors?.dob?.message} />
                    )}
                    name="dob"
                    control={control}
                />

                <Controller
                    render={({ field }) => (
                        <TextField
                            {...field}
                            required
                            label="Phone Number"
                            error={errors?.phone_number}
                            helperText={errors?.phone_number?.message}
                        />
                    )}
                    name="phone_number"
                    control={control}
                />

                {watchUserType === "patient" ? (
                    <Controller
                        render={({ field }) => <TextField {...field} label="Allergies" />}
                        name="allergies"
                        control={control}
                    />
                ) : watchUserType === "nurse" ? (
                    <></>
                ) : (
                    <>
                        <FormLabel>Schedule</FormLabel>
                        <Controller
                            defaultValue={false}
                            name="schedule.days.sunday"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} />}
                                    label="Sunday"
                                />
                            )}
                        />
                        <Controller
                            defaultValue={false}
                            name="schedule.days.monday"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} />}
                                    label="Monday"
                                />
                            )}
                        />
                        <Controller
                            defaultValue={false}
                            name="schedule.days.tuesday"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} />}
                                    label="Tuesday"
                                />
                            )}
                        />
                        <Controller
                            defaultValue={false}
                            name="schedule.days.wednesday"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} />}
                                    label="Wednesday"
                                />
                            )}
                        />
                        <Controller
                            defaultValue={false}
                            name="schedule.days.thursday"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} />}
                                    label="Thursday"
                                />
                            )}
                        />
                        <Controller
                            defaultValue={false}
                            name="schedule.days.friday"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} />}
                                    label="Friday"
                                />
                            )}
                        />
                        <Controller
                            defaultValue={false}
                            name="schedule.days.saturday"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} />}
                                    label="Saturday"
                                />
                            )}
                        />
                        <Typography variant="body1" component="span" color="error">
                            {errors?.schedule?.message}
                        </Typography>
                        <LocalizationProvider dateAdapter={DateAdapter}>
                            <TimePicker
                                label="Start Time"
                                value={date | ""}
                                onChange={(date) => {
                                    setValue("schedule.start_time", date | "", {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                    setDate(date);
                                }}
                                renderInput={(params) => <TextField required {...params}
                                    error={errors?.schedule?.start_time}
                                    helperText={errors?.schedule?.start_time?.message} />}
                            />
                        </LocalizationProvider>

                        <Controller
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    type='number'
                                    label="Each Slot Duration(mins)"
                                />
                            )}
                            name="slot_duration"
                            control={control}
                        />
                    </>
                )}

                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
                {console.log(errors)}
            </Stack>
        </form>
    );
}