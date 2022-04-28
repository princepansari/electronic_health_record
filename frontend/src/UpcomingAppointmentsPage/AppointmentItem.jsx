import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreateCaseForm } from '../case/createCaseForm';

const user = 'doctor';
const newCase = false;
const boxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.action.hover
}));



const AppointmentItem = ({ appointment }) => {
    const [openModal, setOpenModal] = useState(false);
    const [patientEmail, setPatientEmail] = useState('');

    return (
        <div>
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <CreateCaseForm setopen={setOpenModal} patientEmail={patientEmail} />
            </Modal>

            <Paper elevation={2} sx={{ padding: 3, marginBottom: 1, marginTop: 1, backgroundColor: "#fafafa" }} >
                <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 700 }} >
                        <TableBody>
                            <StyledTableRow >
                                <TableCell component="th" scope="row">
                                    <b>Patient Name:</b>&nbsp; {appointment.patientName}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <b>Doctor Name:</b>&nbsp; {appointment.doctorName}
                                </TableCell>
                            </StyledTableRow>

                            <StyledTableRow >
                                <TableCell component="th" scope="row">
                                    <b>Type:</b>&nbsp; {appointment.type} + {appointment.type === 'new' ? '' : `  (Case Id: ${appointment.followUpCaseId})`}
                                </TableCell>
                                <TableCell ><b>Date:</b>&nbsp; {appointment.date}</TableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    appointment.type === 'new' ?
                        <Button
                            variant='text'
                            sx={{ mr: 4, fontSize: { xs: '0.6em', md: '1em' }, textTransform: 'none' }}
                            onClick={(e) => { setOpenModal(true); setPatientEmail(appointment.patientEmail) }}
                        >
                            Create New Case
                        </Button>
                        :
                        <Button
                            variant='text'
                            sx={{ mr: 4, fontSize: { xs: '0.6em', md: '1em' }, textTransform: 'none' }}
                            component={Link}
                            to={`/case/${appointment.followUpCaseId}`}>
                            See Case Study
                        </Button>
                }

            </Paper>



        </div>
    )
}

export default AppointmentItem;