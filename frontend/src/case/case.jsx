import { useEffect, useState, useContext } from "react"
import Prescription from "./prescription";
import Typography from '@mui/material/Typography'
import { Grid, Skeleton, Button, CircularProgress, Paper, Stack, TableContainer, Table, TableBody, TableCell, TableRow } from "@mui/material";
import PrescriptionForm from "./prescriptionForm";
import AuthContext from "../auth/AuthContext";
import { useParams } from "react-router-dom";
import { getCase } from "./apis";
import CenterCircularProgress from "../common/centerLoader";
import { styled } from '@mui/material/styles';

const dateTimeOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric'
}

const briefInfoFields = [
    'id',
    'created_by',
    'created_at',
    'updated_at',
    'patient_name',
    'patient_age',
    'patient_allergy',
    'problem',
]

const displayName = {
    id: "Case Id: ",
    created_by: "Created By: ",
    created_at: "Created On: ",
    updated_at: "Last Modified: ",
    patient_name: "Patient: ",
    patient_age: "Patient Age: ",
    patient_allergy: "Allergy: ",
    problem: "Problem: "
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.action.hover
}));


export default function Case(props) {
    const [caseObj, setCaseObj] = useState(null);
    const [isDisplayForm, setIsDisplayForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(AuthContext);
    let params = useParams();
    const caseId = params.caseId;

    const reFetchCase = () => {
        setIsDisplayForm(false);
        getCase(user.token, caseId).then((data) => {
            setCaseObj(data);
            setIsLoading(false);
        })
        setIsLoading(true);
    }

    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        getCase(user.token, caseId)
            .then((data) => {
                setCaseObj(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setErrorMsg(err?.response?.data?.message);
                setIsLoading(false);
            })
        setIsLoading(true);
    }, [])


    return (
        <>
            {
                isLoading ?
                    <CenterCircularProgress />
                    :
                    caseObj ?
                        <>
                            <Paper elevation={2} sx={{ padding: 5, marginBottom: 5, marginTop: 15 }} >
                                <Typography variant="h6">
                                    Case Details
                                </Typography>
                                <TableContainer component={Paper} elevation={0}>
                                    <Table sx={{ minWidth: 700 }} >
                                        <TableBody>
                                            <StyledTableRow >
                                                <TableCell component="th" scope="row">
                                                    Case Id: {caseObj.id}
                                                </TableCell>
                                                <TableCell >Case Opened On: {new Date(caseObj.created_at).toLocaleDateString('en-US', dateTimeOptions)}</TableCell>
                                            </StyledTableRow>

                                            <StyledTableRow >
                                                <TableCell component="th" scope="row">
                                                    Last Modified On: {new Date(caseObj.updated_at).toLocaleDateString('en-US', dateTimeOptions)}
                                                </TableCell>
                                                <TableCell >Created By: {caseObj.created_by}</TableCell>
                                            </StyledTableRow>

                                            <StyledTableRow >
                                                <TableCell component="th" scope="row">
                                                    Problem: {caseObj.problem}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                </TableCell>
                                            </StyledTableRow>

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>


                            <Paper elevation={2} sx={{ padding: 5, marginBottom: 5 }} >
                                <Typography variant="h6">
                                    Patient Details
                                </Typography>
                                <TableContainer component={Paper} elevation={0}>
                                    <Table sx={{ minWidth: 700 }} >
                                        <TableBody>
                                            <StyledTableRow >
                                                <TableCell component="th" scope="row">
                                                    Name: {caseObj.patient_name}
                                                </TableCell>
                                                <TableCell >Age: {caseObj.patient_age}</TableCell>
                                            </StyledTableRow>
                                            <StyledTableRow >
                                                <TableCell component="th" scope="row">
                                                    Allergy: {caseObj.patient_allergy}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                </TableCell>
                                            </StyledTableRow>

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>



                            <Typography variant="h5" sx={{ marginTop: 5, marginBottom: 4 }}>Prescriptions</Typography>
                            {
                                !isDisplayForm
                                    ?
                                    (['doctor', 'nurse'].includes(user.user_type) &&
                                        <Button variant="contained" sx={{ marginBottom: 5 }} onClick={() => { setIsDisplayForm(true); }}>
                                            Add a prescription
                                        </Button>)
                                    : <PrescriptionForm caseId={caseObj.id} reFetchCase={reFetchCase} cancel={() => { setIsDisplayForm(false); }} />
                            }
                            <div style={{ marginTop: 20, marginBottom: 20 }}>
                                {
                                    caseObj.prescriptions !== undefined && caseObj.prescriptions.map((prescription) => (
                                        <Prescription key={prescription.id} caseId={caseObj.id} reFetchCase={reFetchCase} prescription={prescription} />
                                    ))
                                }
                            </div>
                        </>
                        :
                        <Typography variant="h4"
                            color="error"
                            component='div'
                            sx={{
                                marginTop: '50%',
                                marginLeft: '50%'
                            }}>
                            {errorMsg}
                        </Typography>
            }

        </>
    )

}