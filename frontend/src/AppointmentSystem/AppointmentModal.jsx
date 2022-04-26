import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import CenterCircularProgress from "../common/centerLoader";

const modalBodyStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  height: { xs: "75%", md: "70%" },
  width: { xs: "96%", md: "55%" },
  p: 5,
};

const slotStyle = { color: "gray", fontSize: "1.2em" };
const detailsDivStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const printableDate = (fullDate) => {
  //   console.log(date.getDate());
  //   console.log(date.getMonth());
  //   console.log(date.getFullYear());
  let finalDate = "";
  const date = fullDate.getDate();
  if (date < 10) finalDate += "0" + date;
  else finalDate += date;

  finalDate += "/";

  const month = fullDate.getMonth();
  if (month < 10) finalDate += "0" + month;
  else finalDate += month;

  finalDate += "/";

  const year = fullDate.getFullYear();
  finalDate += year;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  finalDate += `, ${days[fullDate.getDay()]}`;

  //   console.log(finalDate);
  return finalDate;
};

const printableTime = (time) => {
  let finalTime = "";
  const hours = time.getHours();
  const minutes = time.getMinutes();
  let ampm = "am";

  if (hours < 10) finalTime += "0" + hours;
  else if (hours > 12) {
    finalTime += hours - 12;
    ampm = "pm";
  } else finalTime += hours;

  finalTime += ":";

  if (minutes < 10) finalTime += "0" + minutes;
  else finalTime += minutes;
  finalTime += " " + ampm;

  //   console.log(finalTime);
  return finalTime;
};

const AppointmentModal = React.forwardRef((props, ref) => {
  const { appointmentDate, appointmentSlot, doctor } = props;
  const userName = JSON.parse(localStorage.user).name;

  const [radioValue, setRadioValue] = useState("newCase");

  return (
    <div ref={ref}>
      <Paper sx={modalBodyStyle}>
        {appointmentDate === null || appointmentSlot === null ? (
          <CenterCircularProgress />
        ) : (
          <>
            <Typography variant="h4" component="div" textAlign="center">
              Booking Appointment
            </Typography>
            <div style={detailsDivStyle}>
              <p style={slotStyle}>{"On " + printableDate(appointmentDate)}</p>
              <p style={{ fontSize: "1.2em" }}>
                <strong>Doctor : </strong>
                {doctor}
              </p>
            </div>
            <div style={detailsDivStyle}>
              <p style={slotStyle}>{"At " + printableTime(appointmentSlot)}</p>
              <p style={{ fontSize: "1.2em" }}>
                <strong>Patient : </strong>
                {userName}
              </p>
            </div>

            <form>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                label="Issue"
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 3,
                }}
              >
                <FormControl>
                  <FormLabel>Type of Case</FormLabel>
                  <RadioGroup
                    row
                    name="caseRadioButtons"
                    value={radioValue}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                  >
                    <FormControlLabel
                      value="newCase"
                      control={<Radio />}
                      label="New Case"
                    />
                    <FormControlLabel
                      value="followUp"
                      control={<Radio />}
                      label="Follow-up"
                    />
                  </RadioGroup>
                </FormControl>

                {radioValue === "followUp" && (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    label="Case ID of original case"
                  />
                )}
              </Box>

              <Button type="submit" variant="contained" fullWidth>
                Submit
              </Button>
            </form>
          </>
        )}
      </Paper>
    </div>
  );
});

export default AppointmentModal;
