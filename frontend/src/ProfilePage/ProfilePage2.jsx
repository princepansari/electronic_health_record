import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import TimePicker from "@mui/lab/TimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterMoment";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cloneDeep } from "lodash";
import { authSignup } from "../auth/apis";
import { useNavigate } from "react-router-dom";
import CenterCircularProgress from "../common/centerLoader";

const iitbhilaiEmailPattern = /@iitbhilai.ac.in$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
const phoneRegExp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const dobRegex =
  /^(?:0[1-9]|[12]\d|3[01])([\/.-])(?:0[1-9]|1[012])\1(?:19|20)\d\d$/;
const startTimeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm])$/;

const schema = yup.object({
  email: yup.string().email(),
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
      (schedule) =>
        schedule === undefined ||
        Object.values(schedule?.days).filter(Boolean).length > 0
    ),
  dob: yup
    .string()
    .matches(dobRegex, "Enter the date in the format of DD/MM/YYYY"),
  slot_duration: yup.number().min(1, "Duration should be atleast 1 minute"),
  //   password: yup
  //     .string()
  //     .matches(
  //       passwordRegex,
  //       "Password should contain Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
  //     ),
});

const buttonAreaStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  py: 2,
};

export default function ProfilePage2() {
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit: RHFhandleSubmit,
    watch,
    register,
    unregister,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_type: "patient",
      name: "",
      email: "",
      guardian_email: "",
      dob: "",
      phone: "",
      allergy: "",
    },
    resolver: yupResolver(schema),
  });

  const [userType, setUserType] = useState("doctor");
  //   const userType = watch("user_type");
  const watchPersonalEmail = watch("email");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    if (userType !== "patient") {
      console.log("in if registering");
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
      if (userType !== "patient") unregister("allergy");
    }
  }, [register, userType]);

  useEffect(() => {
    if (watchPersonalEmail.match(iitbhilaiEmailPattern) !== null) {
      unregister("guardian_email");
    }
  }, [watchPersonalEmail]);

  const preprocessData = (data) => {
    console.log(data);
    data = cloneDeep(data);
    if ("schedule" in data) {
      data.schedule.start_time = data.schedule.start_time
        .format("hh:mm a")
        .toString();
      data.schedule.end_time = data.schedule.end_time
        .format("hh:mm a")
        .toString();
    }
    for (let key in data) {
      if (data[key] === null || data[key] === undefined) data.key = "";
    }
    return data;
  };

  const [signupSuccessMsg, setSignupSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  //   const handleSubmit = (data) => {
  //     const userObj = preprocessData(data);
  //     console.log(userObj);
  //     authSignup(userObj)
  //       .then((message) => {
  //         setSignupSuccessMsg(message);
  //         navigate("/otpVerification", {
  //           state: { email: data.email, guardian_email: data.guardian_email },
  //         });
  //         return;
  //       })
  //       .catch((err) => {
  //         console.log(err?.response?.data?.message);
  //       });
  //     setIsLoading(true);
  //   };

  const initValues = () => {
    // TODO : fetch data

    const profileValues = JSON.parse(
      JSON.stringify({
        user_type: userType,
        name: "Lavish",
        email: "lavishgautam2206@gmail.com",
        guardian_email: "lavishg@iitbhilai.ac.in",
        dob: "01/01/2022",
        phone: "0123456789",
        allergy: "Nothing",
        schedule: {
          days: {
            sunday: true,
            monday: false,
            tuesday: true,
            wednesday: true,
            thursday: false,
            friday: true,
            saturday: false,
          },
          start_time: "9:00 AM",
          end_time: "11:00 AM",
          slot_duration: 10,
        },
      })
    );

    reset(profileValues);
  };

  const handleSubmit = (data) => {
    console.log("rnning");
    if (!isEditing) setIsEditing(true);
    else {
      console.log(data);
      // TODO : update data
      initValues();
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    initValues();
    setIsEditing(false);
  };

  useEffect(() => {
    initValues();

    return () => {};
  }, []);

  return (
    <>
      <Snackbar open={signupSuccessMsg !== ""} autoHideDuration={6000}>
        <Alert severity="success" sx={{ width: "100%" }}>
          {signupSuccessMsg}
        </Alert>
      </Snackbar>
      {isLoading ? (
        <CenterCircularProgress />
      ) : (
        <form onSubmit={RHFhandleSubmit(handleSubmit)}>
          <Stack spacing={2}>
            <Typography variant="h3" textAlign="center">
              Profile
            </Typography>
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
              render={({ field }) => (
                <>
                  <Typography variant="h6" component="div">
                    Name
                  </Typography>
                  <TextField {...field} required disabled={!isEditing} />
                </>
              )}
              name="name"
              control={control}
            />

            <Controller
              render={({ field }) => (
                <>
                  <Typography variant="h6" component="div">
                    Email Address
                  </Typography>
                  <TextField
                    {...field}
                    required
                    disabled={!isEditing}
                    error={errors?.email !== undefined}
                    helperText={errors?.email?.message}
                  />
                </>
              )}
              name="email"
              control={control}
            />
            {watchPersonalEmail.match(iitbhilaiEmailPattern) === null ? (
              <Controller
                required
                defaultValue=""
                render={({ field }) => (
                  <>
                    <Typography variant="h6" component="div">
                      Guardian Email Address
                    </Typography>
                    <TextField
                      {...field}
                      required
                      disabled={!isEditing}
                      error={errors?.guardian_email !== undefined}
                      helperText={errors?.guardian_email?.message}
                    />
                  </>
                )}
                name="guardian_email"
                control={control}
              />
            ) : null}

            <Controller
              render={({ field }) => (
                <>
                  <Typography variant="h6" component="div">
                    Date of Birth
                  </Typography>
                  <TextField
                    {...field}
                    required
                    disabled={!isEditing}
                    error={errors?.dob !== undefined}
                    helperText={errors?.dob?.message}
                  />
                </>
              )}
              name="dob"
              control={control}
            />

            <Controller
              render={({ field }) => (
                <>
                  <Typography variant="h6" component="div">
                    Contact Number
                  </Typography>
                  <TextField
                    {...field}
                    required
                    disabled={!isEditing}
                    error={errors?.phone !== undefined}
                    helperText={errors?.phone?.message}
                  />
                </>
              )}
              name="phone"
              control={control}
            />

            {userType === "patient" ? (
              <Controller
                render={({ field }) => (
                  <>
                    <Typography variant="h6" component="div">
                      Allergies
                    </Typography>
                    <TextField {...field} required disabled={!isEditing} />
                  </>
                )}
                name="allergy"
                control={control}
              />
            ) : (
              <>
                <FormLabel>Schedule</FormLabel>
                <Controller
                  // defaultValue={false}
                  name="schedule.days.sunday"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} disabled={!isEditing} />}
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
                      control={<Checkbox {...field} disabled={!isEditing} />}
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
                      control={<Checkbox {...field} disabled={!isEditing} />}
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
                      control={<Checkbox {...field} disabled={!isEditing} />}
                      label="Wednesday"
                    />
                  )}
                />
                <Controller
                  defaultValue={false}
                  name="schedule.days.thursday"
                  control={control}
                  StartTime
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} disabled={!isEditing} />}
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
                      control={<Checkbox {...field} disabled={!isEditing} />}
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
                      control={<Checkbox {...field} disabled={!isEditing} />}
                      label="Saturday"
                    />
                  )}
                />
                <Typography variant="body1" component="span" color="error">
                  {errors?.schedule?.message}
                </Typography>
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <TimePicker
                    value={startTime || ""}
                    disabled={!isEditing}
                    onChange={(startTime) => {
                      setValue("schedule.start_time", startTime || "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setStartTime(startTime);
                    }}
                    renderInput={(params) => (
                      <>
                        <Typography variant="h6" component="div">
                          Slot Starting Time
                        </Typography>
                        <TextField
                          required
                          {...params}
                          error={errors?.schedule?.start_time}
                          helperText={errors?.schedule?.start_time?.message}
                        />
                      </>
                    )}
                  />
                  <TimePicker
                    value={endTime || ""}
                    disabled={!isEditing}
                    onChange={(endTime) => {
                      setValue("schedule.end_time", endTime || "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setEndTime(endTime);
                    }}
                    renderInput={(params) => (
                      <>
                        <Typography variant="h6" component="div">
                          Slot Ending Time
                        </Typography>
                        <TextField
                          required
                          {...params}
                          error={errors?.schedule?.end_time}
                          helperText={errors?.schedule?.end_time?.message}
                        />
                      </>
                    )}
                  />
                </LocalizationProvider>

                <Controller
                  defaultValue={10}
                  render={({ field }) => (
                    <>
                      <Typography variant="h6" component="div">
                        Each Slot Duration(in minutes)
                      </Typography>
                      <TextField
                        {...field}
                        required
                        disabled={!isEditing}
                        type="number"
                        error={errors?.slot_duration !== undefined}
                        helperText={errors?.slot_duration?.message}
                      />
                    </>
                  )}
                  name="slot_duration"
                  control={control}
                />
              </>
            )}

            <Box sx={buttonAreaStyle}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
              {isEditing && (
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  onClick={handleCancel}
                  sx={{ ml: 5 }}
                >
                  Cancel
                </Button>
              )}
            </Box>
            {console.log(errors)}
          </Stack>
        </form>
      )}
    </>
  );
}
