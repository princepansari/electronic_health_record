import React, { useContext, useEffect, useState } from "react";
import {
    Alert,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Snackbar,
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
import { authSignup } from "../auth/apis";
import AuthContext from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import CenterCircularProgress from '../common/centerLoader'
import moment from "moment";
import { editUser, getUser } from "./apis";


const iitbhilaiEmailPattern = /@iitbhilai.ac.in$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
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
    phone: yup.string().matches(phoneRegExp, "Phone number is not valid"),
    schedule: yup
        .object()
        .test(
            "test-atleast-one-selected",
            "Should select atleast one day",
            (schedule) => schedule === undefined || Object.values(schedule?.days).filter(Boolean).length > 0
        ),
    dob: yup.string().matches(dobRegex, "Enter the date in the format of DD/MM/YYYY"),
    slot_duration: yup.number().min(1, "Duration should be atleast 1 minute"),
    password: yup.string().matches(passwordRegex, "Password should contain Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"),
});






export default function ProfilePage() {
    const {
        control,
        handleSubmit: RHFhandleSubmit,
        watch,
        register,
        unregister,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            user_type: "patient",
            name: "",
            email: "",
            guardian_email: "",
            dob: "",
            phone: "",
            allergy: "",
            password: "",
            schedule: {
                days: {
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false,
                }
            },
        },
        resolver: yupResolver(schema),
    });

    const watchUserType = watch("user_type");
    const watchPersonalEmail = watch("email");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [wantToEdit, setWantToEdit] = useState(false);
    const { user } = useContext(AuthContext);



    const populateForm = (user) => {
        return getUser(user.token).then(userProfileData => {
            if (userProfileData['guardian_email'] === null)
                delete userProfileData['guardian_email']
            reset(userProfileData);
            console.log(userProfileData);
            if (userProfileData.schedule?.start_time && userProfileData.schedule?.end_time) {
                const startTimeObj = moment(userProfileData.schedule?.start_time, ["hh:mm a"]);
                const endTimeObj = moment(userProfileData.schedule?.end_time, ["hh:mm a"]);
                setStartTime(moment(userProfileData.schedule?.start_time, ["hh:mm a"]));
                setEndTime(moment(userProfileData.schedule?.end_time, ["hh:mm a"]));
                setValue("schedule.start_time", startTimeObj, {
                    shouldValidate: true,
                    shouldDirty: true,
                });
                setValue("schedule.end_time", endTimeObj, {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            }
        });
    };


    useEffect(() => {
        setIsLoading(true);
        populateForm(user).then(() => {
            setIsLoading(false);
        });
    }, [user])


    useEffect(() => {
        if (watchUserType !== "patient") {
            unregister("allergy");
            register("schedule.start_time");
            register("schedule.end_time");
        } else {
            console.log("in else unregistering ");
            unregister("schedule.start_time");
            unregister("schedule.end_time");
            unregister("schedule.days");
            unregister("schedule");
            unregister("slot_duration");
            setStartTime(null);
            setEndTime(null);
            if (watchUserType !== "patient") unregister("allergy");
        }
    }, [register, watchUserType]);

    useEffect(() => {
        if (watchPersonalEmail.match(iitbhilaiEmailPattern) !== null) {
            unregister("guardian_email");
        }
    }, [watchPersonalEmail]);

    const preprocessData = (data) => {
        console.log("in process data= ", data)
        data = cloneDeep(data)

        //removing the uneditable fields 
        delete data['email']
        delete data['guardian_email']
        delete data['user_type']
        console.log("after removing= ", data);
        if ("schedule" in data) {
            data.schedule.start_time = data.schedule.start_time.format("hh:mm a").toString();
            data.schedule.end_time = data.schedule.end_time.format("hh:mm a").toString();
        }
        for (let key in data) {
            if (data[key] === null || data[key] === undefined)
                data.key = ""
        }
        return data
    }

    const [signupSuccessMsg, setSignupSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = (data) => {
        const userObj = preprocessData(data)
        console.log(userObj)
        editUser(user.token, userObj).then((message) => {
            setSignupSuccessMsg(message);
            populateForm(user).then(() => { setIsLoading(false) });
            return;
        }).catch((err) => {
            console.log(err?.response?.data?.message);
        })
        setIsLoading(true);
    }


    return (
        <>
            <Snackbar
                open={signupSuccessMsg !== ''}
                autoHideDuration={6000}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    {signupSuccessMsg}
                </Alert>
            </Snackbar>
            {isLoading ?
                <CenterCircularProgress />
                :
                <form onSubmit={RHFhandleSubmit(handleSubmit)}>
                    {console.log(errors)}
                    <Stack spacing={2} sx={{ marginBottom: 20 }}>
                        <Typography variant="h3">Sign Up</Typography>
                        <Controller
                            control={control}
                            name="user_type"
                            render={({ field }) => (
                                <RadioGroup
                                    style={{ display: "inline" }}
                                    label="User Type"
                                    {...field}
                                >
                                    <FormControlLabel
                                        disabled={true}
                                        value="patient"
                                        control={<Radio />}
                                        label="Patient"
                                    />
                                    <FormControlLabel
                                        disabled={true}
                                        value="doctor"
                                        control={<Radio />}
                                        label="Doctor"
                                    />
                                    <FormControlLabel
                                        disabled={true}
                                        value="nurse"
                                        control={<Radio />}
                                        label="Nurse"
                                    />
                                </RadioGroup>
                            )}
                        />

                        <Controller
                            render={({ field }) => <TextField {...field} variant='filled' required label="Name"
                                InputProps={{
                                    disableUnderline: true,
                                }}
                            />}
                            name="name"
                            control={control}
                        />

                        <Controller
                            render={({ field }) => (
                                <TextField {...field} disabled={true} variant='filled' label="Email Address"
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                />
                            )}
                            name="email"
                            control={control}
                        />
                        {watchPersonalEmail.match(iitbhilaiEmailPattern) === null ? (
                            <Controller
                                required
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant='filled'
                                        label="Guardian Email Address"
                                        disabled={true}
                                        error={errors?.guardian_email !== undefined}
                                        helperText={errors?.guardian_email?.message}
                                        InputProps={{
                                            disableUnderline: true,
                                        }} />
                                )}
                                name="guardian_email"
                                control={control}
                            />
                        ) : null}

                        <Controller
                            render={({ field }) => (
                                <TextField {...field} variant='filled' required label="DOB: DD/MM/YYYY"
                                    error={errors?.dob !== undefined}
                                    helperText={errors?.dob?.message}
                                    InputProps={{
                                        disableUnderline: true,
                                    }} />
                            )}
                            name="dob"
                            control={control}
                        />

                        <Controller
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant='filled'
                                    required
                                    label="Phone Number"
                                    error={errors?.phone !== undefined}
                                    helperText={errors?.phone?.message}
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                />
                            )}
                            name="phone"
                            control={control}
                        />

                        {watchUserType === "patient" ?
                            <Controller
                                render={({ field }) => <TextField {...field}
                                    variant='filled'
                                    label="Allergies"
                                    InputProps={{
                                        disableUnderline: true,
                                    }} />}
                                name="allergy"
                                control={control}
                            />

                            :
                            <>
                                <FormLabel>Schedule</FormLabel>
                                <Controller
                                    name="schedule.days.sunday"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Checkbox checked={field?.value || false} {...field} />}
                                            label="Sunday"
                                        />
                                    )}
                                />
                                <Controller
                                    name="schedule.days.monday"
                                    control={control}
                                    render={({ field }) => (<FormControlLabel
                                        control={<Checkbox checked={field?.value || false} {...field} />}
                                        label="Monday"
                                    />
                                    )}
                                />
                                <Controller
                                    name="schedule.days.tuesday"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Checkbox checked={field?.value || false} {...field} />}
                                            label="Tuesday"
                                        />
                                    )}
                                />
                                <Controller
                                    name="schedule.days.wednesday"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Checkbox checked={field?.value || false} {...field} />}
                                            label="Wednesday"
                                        />
                                    )}
                                />
                                <Controller
                                    name="schedule.days.thursday"
                                    control={control} StartTime
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Checkbox checked={field?.value || false} {...field} />}
                                            label="Thursday"
                                        />
                                    )}
                                />
                                <Controller
                                    name="schedule.days.friday"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Checkbox checked={field?.value || false} {...field} />}
                                            label="Friday"
                                        />
                                    )}
                                />
                                <Controller
                                    name="schedule.days.saturday"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Checkbox checked={field?.value || false} {...field} />}
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
                                        value={startTime || ""}
                                        onChange={(startTime) => {
                                            setValue("schedule.start_time", startTime || "", {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                            setStartTime(startTime);
                                        }}
                                        renderInput={(params) => <TextField variant='filled' required {...params}
                                            error={errors?.schedule?.start_time}
                                            helperText={errors?.schedule?.start_time?.message}
                                        />}
                                    />
                                    <TimePicker
                                        label="End Time"
                                        value={endTime || ""}
                                        onChange={(endTime) => {
                                            setValue("schedule.end_time", endTime || "", {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                            setEndTime(endTime);
                                        }}
                                        renderInput={(params) => <TextField variant='filled' required {...params}
                                            error={errors?.schedule?.end_time}
                                            helperText={errors?.schedule?.end_time?.message}
                                        />}
                                    />
                                </LocalizationProvider>

                                <Controller
                                    defaultValue={10}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            variant='filled'
                                            type='number'
                                            label="Each Slot Duration(mins)"
                                            error={errors?.slot_duration !== undefined}
                                            helperText={errors?.slot_duration?.message}
                                            InputProps={{
                                                disableUnderline: true,
                                            }} />
                                    )}
                                    name="slot_duration"
                                    control={control}
                                />
                            </>
                        }

                        {!wantToEdit ?
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => { setWantToEdit(true); }}
                                sx={{ marginBottom: 5 }}
                            >
                                Edit
                            </Button>
                            :
                            <Stack direction="row" spacing={2} sx={{ marginBottom: 5 }}>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        setWantToEdit(false);
                                        setIsLoading(true);
                                        populateForm(user).then(() => { setIsLoading(false); });
                                    }}>
                                    Cancel
                                </Button>
                            </Stack>
                        }

                        {/* {console.log(errors)} */}
                    </Stack>
                </form>
            }
        </>
    );
}
