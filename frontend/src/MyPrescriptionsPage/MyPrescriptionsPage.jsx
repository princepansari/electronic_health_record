import { Grid } from '@mui/material';
import React from 'react';
import PrescriptionItem from './PrescriptionItem';

const prescriptions = [
  {case: 1, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
  {case: 2, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
  {case: 3, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
  {case: 4, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
  {case: 5, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
  {case: 6, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
];

const MyPrescriptionsPage = () => {
  return (
    <div>
      <Grid 
        container
        spacing={2}
        sx={{
          mt: {xs: 8, md: 10},
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {
          prescriptions.map(prescription => (
            <Grid item 
            key={prescription.case}
            sx={{ 
              width: {xs: '90%', md: '65%'},
              height: '130px',
              borderRadius: '10px',
              backgroundColor: '#d9dad7',
              my: 1
            }}>
              <PrescriptionItem prescription={prescription}/>
            </Grid>
          ))
        }
      </Grid>
    </div>
  )
}

export default MyPrescriptionsPage;