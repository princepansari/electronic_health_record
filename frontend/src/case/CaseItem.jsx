import { Button, Typography, Modal, Paper, TableContainer, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import { React } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const boxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.action.hover
}));

const dateTimeOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric'
}

const CaseItem = ({ caseObj }) => {

    return (
        <>
            <Paper elevation={2} sx={{ padding: 3, marginBottom: 5, marginTop: 5, backgroundColor: "#fafafa" }} >
                <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 700 }} >
                        <TableBody>
                            <StyledTableRow >
                                <TableCell component="th" scope="row">
                                    <b>Case Id:</b>&nbsp; {caseObj.case_id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <b>Problem:</b>&nbsp; {caseObj.problem}
                                </TableCell>
                            </StyledTableRow>

                            <StyledTableRow >
                                <TableCell component="th" scope="row">
                                    <b>Last Modified On:</b>&nbsp; {new Date(caseObj.updated_at).toLocaleDateString('en-US', dateTimeOptions)}
                                </TableCell>
                                <TableCell ><b>Opened On:</b>&nbsp; {new Date(caseObj.created_at).toLocaleDateString('en-US', dateTimeOptions)}</TableCell>

                            </StyledTableRow>

                            <StyledTableRow >
                                <TableCell component="th" scope="row">
                                    <b>Patient Name:</b>&nbsp; {caseObj.patient_name}
                                </TableCell>
                                <TableCell ><b>Created By:</b>  &nbsp; {caseObj.created_by}</TableCell>
                            </StyledTableRow>

                        </TableBody>
                    </Table>
                </TableContainer>
                <Button
                    variant='text'
                    sx={{ mr: 4, fontSize: { xs: '0.6em', md: '1em' }, textTransform: 'none' }}
                    component={Link}
                    to={`/case/${caseObj.case_id}`}>
                    SEE MORE
                </Button>
            </Paper>
        </>
    )
}

export default CaseItem