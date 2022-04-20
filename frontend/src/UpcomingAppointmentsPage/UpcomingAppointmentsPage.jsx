import { Grid } from '@mui/material';
import React from 'react';
import AppointmentItem from './AppointmentItem';

const appointments = [
  { case: 1, patientName: 'Yo Yo Boy', doctorName: 'Dr. M.J. Memon', startTime: Date.now(), endTime: Date.now(), date: Date.now() },
  { case: 2, patientName: 'Yo Yo Boy', doctorName: 'Dr. M.J. Memon', startTime: Date.now(), endTime: Date.now(), date: Date.now() },
  { case: 3, patientName: 'Yo Yo Boy', doctorName: 'Dr. M.J. Memon', startTime: Date.now(), endTime: Date.now(), date: Date.now() },
  { case: 4, patientName: 'Yo Yo Boy', doctorName: 'Dr. M.J. Memon', startTime: Date.now(), endTime: Date.now(), date: Date.now() },
  { case: 5, patientName: 'Yo Yo Boy', doctorName: 'Dr. M.J. Memon', startTime: Date.now(), endTime: Date.now(), date: Date.now(), type: "new", patientEmail: "abc@gmail.com" },
];

const UpcomingAppointmentsPage = () => {
  return (
    <div>
      <Grid
        container
        spacing={2}
        sx={{
          mt: { xs: 8, md: 10 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {
          appointments.map(appointment => (
            <AppointmentItem key={appointment} appointment={appointment} />
          ))
        }
      </Grid>
    </div>
  )
}

export default UpcomingAppointmentsPage;