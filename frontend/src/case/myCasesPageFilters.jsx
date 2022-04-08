import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import { Paper, Stack, Typography, Button } from '@mui/material';
import { useState } from 'react';

export default function Filters(props) {
    const [updatedOn, setUpdatedOn] = useState([null, null]);
    const [openedOn, setOpenedOn] = useState([null, null]);
    const [patientName, setPatientName] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [problem, setProblem] = useState("");
    const [caseId, setCaseId] = useState("");

    const resetFilters = () => {
        setUpdatedOn([null, null]);
        setOpenedOn([null, null]);
        setPatientName("");
        setCreatedBy("");
        setProblem("");
        setCaseId("");
    }

    const filterCases = () => {
        const filteredCases = props.cases.filter((caseItem) => {
            if (updatedOn[0] && updatedOn[1]) {
                if (new Date(caseItem.updated_on) < updatedOn[0] || new Date(caseItem.updated_on) > updatedOn[1]) {
                    return false;
                }
            }
            if (openedOn[0] && openedOn[1]) {
                if (new Date(caseItem.created_at) < openedOn[0] || new Date(caseItem.created_at) > openedOn[1]) {
                    return false;
                }
            }
            if (patientName) {
                if (caseItem.patient_name.toLowerCase().indexOf(patientName.toLowerCase()) === -1) {
                    return false;
                }
            }
            if (createdBy) {
                if (caseItem.created_by.toLowerCase().indexOf(createdBy.toLowerCase()) === -1) {
                    return false;
                }
            }
            if (problem) {
                if (caseItem.problem.toLowerCase().indexOf(problem.toLowerCase()) === -1) {
                    return false;
                }
            }
            if (caseId) {
                if (caseItem.case_id !== caseId) {
                    return false;
                }
            }
            return true;
        });
        props.setFilteredCases(filteredCases);
    }

    return (
        <>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">Filters</Typography>
                <Stack spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Typography variant="body1" >Last Modified On</Typography>
                        <DateRangePicker
                            startText="start"
                            endText="end"
                            value={updatedOn}
                            onChange={(newValue) => {
                                setUpdatedOn(newValue);
                            }}
                            renderInput={(startProps, endProps) => (
                                <>
                                    <TextField {...startProps} />
                                    <Box sx={{ mx: 2 }}> to </Box>
                                    <TextField {...endProps} />
                                </>
                            )}
                        />
                        <Typography variant="body1" >Opened On</Typography>
                        <DateRangePicker
                            startText="start"
                            endText="end"
                            value={openedOn}
                            onChange={(newValue) => {
                                setOpenedOn(newValue);
                            }}
                            renderInput={(startProps, endProps) => (
                                <>
                                    <TextField {...startProps} />
                                    <Box sx={{ mx: 2 }}> to </Box>
                                    <TextField {...endProps} />
                                </>
                            )}
                        />
                        <Typography variant="body1" >Patient Name</Typography>
                        <TextField
                            id="patient_name"
                            label="patient name"
                            value={patientName}
                            onChange={(newValue) => { setPatientName(newValue) }}

                        />
                        <Typography variant="body1" >Created By</Typography>
                        <TextField
                            id="created_by"
                            label="created by"
                            value={createdBy}
                            onChange={(newValue) => { setCreatedBy(newValue) }}

                        />
                        <Typography variant="body1" >Problem</Typography>
                        <TextField
                            id="problem"
                            label="problem"
                            value={problem}
                            onChange={(newValue) => { setProblem(newValue) }}

                        />
                        <Typography variant="body1" >Case Id</Typography>
                        <TextField
                            id="case_id"
                            label="case id"
                            type="number"
                            value={caseId}
                            onChange={(newValue) => { setCaseId(newValue) }}

                        />
                    </LocalizationProvider>
                    <Stack direction='row' spacing={2}>
                        <Button variant="contained" onClick={() => { filterCases(); }}>
                            Apply
                        </Button>
                        <Button variant="outlined" onClick={() => { resetFilters(); }}>
                            Reset
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => { props.setOpenFilters(false); }} >
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </>
    );
}