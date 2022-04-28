import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import { Paper, Stack, Typography, Button, Autocomplete, Chip } from '@mui/material';
import { useEffect, useState } from 'react';

export default function Filters(props) {
    const [updatedOn, setUpdatedOn] = useState([null, null]);
    const [openedOn, setOpenedOn] = useState([null, null]);
    const [patientName, setPatientName] = useState(null);
    const [createdBy, setCreatedBy] = useState("");
    const [problems, setProblems] = useState([]);
    const [caseId, setCaseId] = useState("");
    const [problemOptions, setProblemOptions] = useState([]);

    useEffect(() => {
        setProblemOptions([...new Set(props.cases.map((caseObj) => caseObj.problem))]);
    }, [props.cases])

    const resetFilters = () => {
        setUpdatedOn([null, null]);
        setOpenedOn([null, null]);
        setPatientName("");
        setCreatedBy("");
        setProblems([]);
        setCaseId("");
        props.setFilteredCases(props.cases);
    }

    const filterCases = () => {
        const filteredCases = props.cases.filter((caseItem) => {
            if (updatedOn[0] && updatedOn[1]) {
                if (new Date(caseItem.updated_at) < updatedOn[0] || new Date(caseItem.updated_at) > updatedOn[1]) {
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
            if (problems.length) {
                if (!problems.includes(caseItem.problem)) {
                    return false;
                }
            }
            if (caseId) {
                console.log(caseItem.case_id, caseId);
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
            <Paper elevation={3} sx={{ padding: 2, width: "50%" }}>
                <Typography variant="h6">Filters</Typography>
                <Stack spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Typography variant="body1" >Last Modified On</Typography>
                        <DateRangePicker
                            startText="start"
                            endText="end"
                            value={updatedOn}
                            onChange={(newValue) => {
                                if (newValue[1]) {
                                    newValue[1].setHours(23, 59, 59, 999);
                                }
                                setUpdatedOn(newValue);
                            }}
                            renderInput={(startProps, endProps) => (
                                <>
                                    <TextField {...startProps}
                                        size="small"
                                        variant='filled'
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                    />
                                    <Box sx={{ mx: 2 }}> to </Box>
                                    <TextField {...endProps}
                                        size="small"
                                        variant='filled'
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                    />
                                </>
                            )}
                        />
                        <Typography variant="body1" >Opened On</Typography>
                        <DateRangePicker
                            startText="start"
                            endText="end"
                            value={openedOn}
                            onChange={(newValue) => {
                                if (newValue[1]) {
                                    newValue[1].setHours(23, 59, 59, 999);
                                }
                                setOpenedOn(newValue);
                            }}
                            renderInput={(startProps, endProps) => (
                                <>
                                    <TextField {...startProps}
                                        size="small"
                                        variant='filled'
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                    />
                                    <Box sx={{ mx: 2 }}> to </Box>
                                    <TextField {...endProps}
                                        size="small"
                                        variant='filled'
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                    />
                                </>
                            )}
                        />
                        <Typography variant="body1" >Case Id</Typography>
                        <TextField
                            id="case_id"
                            label="case id"
                            value={caseId}
                            sx={{ width: 230 }}
                            onChange={(e) => {
                                if (e.target.value !== "")
                                    setCaseId(Number(e.target.value));
                                else
                                    setCaseId(e.target.value);

                            }}
                            size="small"
                            variant='filled'
                            InputProps={{
                                disableUnderline: true,
                            }}
                        />
                        <Typography variant="body1" >Patient Name</Typography>
                        <Autocomplete
                            size="small"
                            id="patient_name"
                            // value={patientName}
                            onChange={(event, newValue) => {
                                setPatientName(newValue);
                                console.log(newValue);
                            }}
                            options={[...new Set(props.cases.map((caseObj) => caseObj.patient_name))]}
                            sx={{ width: 230 }}
                            renderInput={(params) => <TextField
                                variant='filled'
                                {...params}
                                label="Patient Name"
                            />}
                        />
                        <Typography variant="body1" >Created By</Typography>
                        <Autocomplete
                            size="small"
                            id="created_by"
                            // value={createdBy}
                            onChange={(event, newValue) => {
                                setCreatedBy(newValue);
                                console.log(newValue);
                            }}
                            options={[...new Set(props.cases.map((caseObj) => caseObj.created_by))]}
                            sx={{ width: 230 }}
                            renderInput={(params) => <TextField
                                variant='filled'
                                {...params}
                                label="Created By"
                            />}
                        />

                        <Typography variant="body1" >Problem</Typography>
                        <Autocomplete
                            multiple
                            sx={{ width: 510 }}
                            // value={problems}
                            onChange={(event, newValue) => {
                                setProblems(newValue);
                            }}
                            id="problem"
                            options={problemOptions}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip key={option + index} variant="outlined" label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    label="problem"
                                    placeholder="Select Problems"
                                    size="small"
                                />
                            )}
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