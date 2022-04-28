import { useEffect, useState, useContext } from "react"
import Prescription from "./prescription";
import Typography from '@mui/material/Typography'
import { Button, Paper, Stack, TableContainer, Table, TableBody, TableCell, TableRow, IconButton } from "@mui/material";
import PrescriptionForm from "./prescriptionForm";
import AuthContext from "../auth/AuthContext";
import DownloadIcon from '@mui/icons-material/Download';
import { useParams } from "react-router-dom";
import { downloadCase, getCase } from "./apis";
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
                            <Stack direction="row" spacing={2} sx={{ marginTop: 12 }}>
                                <Typography variant="h3" > CASE </Typography>
                                <IconButton onClick={() => {
                                    downloadCase(user.token, caseObj.id).then((data) => {
                                        const file = new Blob([data], { type: "application/pdf" });
                                        const fileURL = URL.createObjectURL(file);
                                        const pdfWindow = window.open();
                                        pdfWindow.location.href = fileURL;
                                    });
                                }}>
                                    <DownloadIcon />
                                </IconButton>
                            </Stack>
                            <Paper elevation={2} sx={{ padding: 5, marginBottom: 5, marginTop: 5 }} >
                                <Typography variant="h6">
                                    Case Details
                                </Typography>
                                <TableContainer component={Paper} elevation={0}>
                                    <Table sx={{ minWidth: 700 }} >
                                        <TableBody>
                                            <StyledTableRow >
                                                <TableCell component="th" scope="row">
                                                    <b>Case Id:</b> &nbsp; {caseObj.id}
                                                </TableCell>
                                                <TableCell ><b>Opened On:</b>&nbsp; {new Date(caseObj.created_at).toLocaleDateString('en-US', dateTimeOptions)}</TableCell>
                                            </StyledTableRow>

                                            <StyledTableRow >
                                                <TableCell component="th" scope="row">
                                                    <b>Last Modified On:</b>&nbsp; {new Date(caseObj.updated_at).toLocaleDateString('en-US', dateTimeOptions)}
                                                </TableCell>
                                                <TableCell ><b>Created By:</b>&nbsp; {caseObj.created_by}</TableCell>
                                            </StyledTableRow>

                                            <StyledTableRow >
                                                <TableCell component="th" scope="row">
                                                    <b>Problem:</b>&nbsp; {caseObj.problem}
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
                                                    <b>Name:</b>&nbsp; {caseObj.patient_name}
                                                </TableCell>
                                                <TableCell ><b>Age:</b>&nbsp; {caseObj.patient_age}</TableCell>
                                            </StyledTableRow>
                                            <StyledTableRow >
                                                <TableCell component="th" scope="row">
                                                    <b>Allergy:</b>&nbsp; {caseObj.patient_allergy}
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