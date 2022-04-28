import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';
import { CreateCaseForm } from '../case/createCaseForm';

const boxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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

const AppointmentItem = ({ appointment }) => {
    console.log(appointment);
    const [openModal, setOpenModal] = useState(false);
    const [patientEmail, setPatientEmail] = useState('');
    const { user } = useContext(AuthContext);

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
                                    <b>Patient Name:</b>&nbsp; {appointment.patient_name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <b>Doctor Name:</b>&nbsp; {appointment.doctor_name}
                                </TableCell>
                            </StyledTableRow>

                            <StyledTableRow >
                                <TableCell component="th" scope="row">
                                    <b>Type:</b>&nbsp; {`${appointment.type}` + (appointment.type === 'New' ? '' : ` (Case Id: ${appointment.case_id})`)}
                                </TableCell>
                                <TableCell ><b>Date:</b>&nbsp;  {new Date(appointment.datetime).toLocaleDateString('en-US', dateTimeOptions)}</TableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    appointment.type === 'New' ?
                        (user.user_type === "patient" ?
                            null
                            :
                            <Button
                                variant='text'
                                sx={{ mr: 4, fontSize: { xs: '0.6em', md: '1em' }, textTransform: 'none' }}
                                onClick={(e) => { setOpenModal(true); setPatientEmail(appointment.patient_email) }}
                            >
                                Create New Case
                            </Button>)
                        :
                        <Button
                            variant='text'
                            sx={{ mr: 4, fontSize: { xs: '0.6em', md: '1em' }, textTransform: 'none' }}
                            component={Link}
                            to={`/case/${appointment.case_id}`}>
                            See Case Study
                        </Button>
                }

            </Paper>
        </div>
    )
}

export default AppointmentItem;