import { Grid } from '@mui/material';
import React from 'react';
import CaseItem from './CaseItem';

const cases = [
  {caseId: 1, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
  {caseId: 2, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
  {caseId: 3, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
  {caseId: 4, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
  {caseId: 5, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
  {caseId: 6, date: Date.now(), problem: 'Very Dangerous Problem', doctorName: 'Dr. Zeus', patientName: 'Parth Joshi'},
];

const MyCasesPage = () => {
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
          cases.map(caseObj => (
            <Grid item 
            key={caseObj.caseId}
            sx={{ 
              width: {xs: '90%', md: '65%'},
              height: '130px',
              borderRadius: '10px',
              backgroundColor: '#d9dad7',
              my: 1
            }}>
              <CaseItem caseObj={caseObj}/>
            </Grid>
          ))
        }
      </Grid>
    </div>
  )
}

export default MyCasesPage;