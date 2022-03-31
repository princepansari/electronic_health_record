import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import CaseItem from './CaseItem';
import { getMyCases } from './apis'
import AuthContext from '../auth/AuthContext';

const fakeCases = [
    { case_id: 1, created_at: Date.now(), updated_at: Date.now(), problem: 'Very Dangerous Problem', created_by: 'Dr. Zeus', patient_name: 'Parth Joshi' },
    { case_id: 2, created_at: Date.now(), updated_at: Date.now(), problem: 'Very Dangerous Problem', created_by: 'Dr. Zeus', patient_name: 'Parth Joshi' },
    { case_id: 3, created_at: Date.now(), updated_at: Date.now(), problem: 'Very Dangerous Problem', created_by: 'Dr. Zeus', patient_name: 'Parth Joshi' },
    { case_id: 4, created_at: Date.now(), updated_at: Date.now(), problem: 'Very Dangerous Problem', created_by: 'Dr. Zeus', patient_name: 'Parth Joshi' },
    { case_id: 5, created_at: Date.now(), updated_at: Date.now(), problem: 'Very Dangerous Problem', created_by: 'Dr. Zeus', patient_name: 'Parth Joshi' },
    { case_id: 6, created_at: Date.now(), updated_at: Date.now(), problem: 'Very Dangerous Problem', created_by: 'Dr. Zeus', patient_name: 'Parth Joshi' },
];


const MyCasesPage = () => {

    const { user } = useContext(AuthContext);
    const [cases, setCases] = useState([]);
    // useEffect(() => {
    //     getMyCases(user.token).then((data) => {
    //         setCases(data);
    //     });
    // }, [])


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
                    // cases.map(caseObj => (
                    fakeCases.map(caseObj => (
                        <Grid item
                            key={caseObj.case_id}
                            sx={{
                                width: { xs: '90%', md: '75%' },
                                borderRadius: '10px',
                                backgroundColor: '#d9dad7',
                                my: 1,
                                padding: 2,
                            }}>
                            <CaseItem caseObj={caseObj} />
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    )
}

export default MyCasesPage;