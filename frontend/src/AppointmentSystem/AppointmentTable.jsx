import {
  Autocomplete,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CenterCircularProgress from "../common/centerLoader";
import AppointmentModal from "./AppointmentModal";

const addDays = (prevDate, noOfDays) => {
  return new Date(prevDate.getTime() + noOfDays * 24 * 60 * 60 * 1000);
};

const addMinutes = (prevTime, noOfMins) => {
  return new Date(prevTime.getTime() + noOfMins * 60 * 1000);
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

  finalDate += `\n${days[fullDate.getDay()]}`;

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

const start_time = new Date(0, 0, 0, 9, 0, 0, 0);
const end_time = new Date(0, 0, 0, 11, 0, 0, 0);

const days = [];
for (let i = 0; i < 7; i++) {
  const date = new Date();
  days.push(addDays(date, i - date.getDay()));
}

const slots = [],
  duration = 10;
for (let i = start_time; i <= end_time; i = addMinutes(i, duration)) {
  slots.push(i);
}

const doctorList = [
  "Dr. M.J. Memon",
  "Dr. Anshu Gupta",
  "Psychological Counsellor",
];

const cellStyles = {
  activated: {
    borderLeft: "1px solid #e9e9e9",
    cursor: "pointer",
    "&:hover": { bgcolor: "#686868cc" },
  },
  deactivated: {
    // cursor: "none",
    borderLeft: "1px solid #e9e9e9",
    backgroundColor: "#d5d5d5",
  },
};

const AppointmentTable = () => {
  const [openModal, setOpenModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentSlot, setAppointmentSlot] = useState(null);
  const [doctor, setDoctor] = useState(null);

  const handleOpenModal = (date, slot) => {
    setAppointmentDate(date);
    setAppointmentSlot(slot);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setAppointmentDate(null);
    setAppointmentSlot(null);
    setOpenModal(false);
  };

  return (
    <>
      <Autocomplete
        disablePortal
        // id="combo-box-demo"
        options={doctorList}
        onChange={(_, value) => setDoctor(value)}
        // sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Select a Doctor" />
        )}
      />
      {doctor !== null ? (
        <TableContainer component={Paper} sx={{ my: 5 }}>
          <Table sx={{ minWidth: 850 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ borderRight: "1px solid #e9e9e9", width: "130px" }}
                >
                  Time
                </TableCell>
                {days.map((day, ind) => (
                  <TableCell key={ind} align="center">
                    {printableDate(day)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {slots.map((slot, ind) => (
                <TableRow key={ind}>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    sx={{ border: 0 }}
                  >
                    {printableTime(slot)}
                  </TableCell>
                  {days.map((day, ind) => (
                    <TableCell
                      key={ind}
                      align="center"
                      // sx={{
                      //   borderLeft: "1px solid #e9e9e9",
                      // }}
                      sx={
                        cellStyles[
                          day >= new Date() ? "activated" : "deactivated"
                        ]
                      }
                      onClick={() => handleOpenModal(day, slot)}
                    >
                      {" "}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="h3"
          textAlign="center"
          sx={{ pt: 4, color: "gray" }}
        >
          Kindly select any Doctor
        </Typography>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <AppointmentModal
          appointmentDate={appointmentDate}
          appointmentSlot={appointmentSlot}
          doctor={doctor}
        />
      </Modal>
    </>
  );
};

export default AppointmentTable;
