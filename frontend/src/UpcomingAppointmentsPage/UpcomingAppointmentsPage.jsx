import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';
import CenterCircularProgress from '../common/centerLoader';
import { getUpcomingAppointments } from './apis';
import AppointmentItem from './AppointmentItem';

// const appointments = [
//   { case: 1, patientName: 'Yo Yo Boy', doctorName: 'Dr. M.J. Memon', date: Date.now() },
//   { case: 2, patientName: 'Yo Yo Boy', doctorName: 'Dr. M.J. Memon', date: Date.now() + 1 },
//   { case: 3, patientName: 'Yo Yo Boy', doctorName: 'Dr. M.J. Memon', date: Date.now() + 2 },
//   { case: 4, patientName: 'Yo Yo Boy', doctorName: 'Dr. M.J. Memon', date: Date.now() + 3 },
//   { case: null, patientName: 'Yo Yo Boy', doctorName: 'Dr. M.J. Memon', date: Date.now() + 4, type: "new", patientEmail: "abc@gmail.com" },
// ];



const UpcomingAppointmentsPage = () => {
  const { user } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("user= ", user);
    getUpcomingAppointments(user.token).then((appointmentList) => {
      setIsLoading(false);
      setAppointments(appointmentList);
    })
      .catch((err) => { console.log(err); });
    setIsLoading(true);
  }, [])

  return (
    <div>
      {
        isLoading ? (<CenterCircularProgress />)
          :
          (
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
                  <AppointmentItem key={appointment.datetime + "" + appointment.doctor_name} appointment={appointment} />
                ))
              }
            </Grid>
          )
      }
    </div>
  )
}

export default UpcomingAppointmentsPage;