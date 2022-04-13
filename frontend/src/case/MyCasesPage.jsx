import { CircularProgress, Grid, Stack } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Modal, Typography, IconButton } from '@mui/material';
import { CreateCaseForm } from './createCaseForm';
import CaseItem from './CaseItem';
import { getMyCases } from './apis'
import AuthContext from '../auth/AuthContext';
import CenterCircularProgress from '../common/centerLoader';
import Filters from './myCasesPageFilters';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


const MyCasesPage = () => {

    const { user } = useContext(AuthContext);
    const [cases, setCases] = useState([]);
    const [filteredCases, setFilteredCases] = useState([]);
    const [openFilters, setOpenFilters] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    console.log("in my cases page");
    useEffect(() => {
        getMyCases(user.token)
            .then((data) => {
                setCases(data);
                setFilteredCases(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err?.response?.data?.message);
                setErrorMsg(err?.response?.data?.message);
                setIsLoading(false);
            });
        setIsLoading(true);
    }, [])


    return (
        <div>
            {isLoading ?
                <CenterCircularProgress />
                :
                <>
                    <Modal
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                    >
                        <CreateCaseForm setopen={setOpenModal} />
                    </Modal>
                    <Stack direction='row' spacing={1} sx={{ marginBottom: 5 }}>
                        <Typography variant="h4" color="initial">My Cases</Typography>
                        <IconButton onClick={() => { setOpenFilters((prevValue) => { return prevValue ? false : true; }) }}>
                            <FilterAltIcon />
                        </IconButton>
                    </Stack>
                    {
                        openFilters ?

                            <Filters setOpenFilters={setOpenFilters} cases={cases} setFilteredCases={setFilteredCases} />
                            :
                            null
                    }
                    {
                        user.user_type !== 'patient' ?
                            <Button variant="contained"
                                onClick={() => setOpenModal(true)}
                                sx={{ marginLeft: "1%", marginTop: "4%" }}>
                                Create Case
                            </Button>
                            :
                            null
                    }
                    <Typography variant="h4"
                        color="error"
                    >
                        {errorMsg}
                    </Typography>

                    {
                        filteredCases.map(caseObj => (
                            <CaseItem key={caseObj.case_id} caseObj={caseObj} />
                        ))
                    }
                </>
            }
        </div >
    )
}

export default MyCasesPage;