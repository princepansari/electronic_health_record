import { Button, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import CenterCircularProgress from "../common/centerLoader";

const modalBodyStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  height: "50%",
  width: { xs: "96%", md: "55%" },
  p: 5,
};

const slotStyle = { color: "gray", fontSize: "1.2em" };

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
  const { appointmentDate, appointmentSlot } = props;
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
            <p style={slotStyle}>{"On " + printableDate(appointmentDate)}</p>
            <p style={slotStyle}>{"At " + printableTime(appointmentSlot)}</p>

            <form>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                label="Issue"
              />

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
