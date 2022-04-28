import { Button, Modal, Paper, Typography } from "@mui/material";
import React, { useContext } from "react";
import AuthContext from "../auth/AuthContext";
import CenterCircularProgress from "../common/centerLoader";
import { cancelAppointment } from "./apis";
import { printableDate, printableTime } from "./utils";


const modalBodyStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    height: { xs: "40%", md: "35%" },
    width: { xs: "96%", md: "55%" },
    p: 5,
};


const detailsDivStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};
const slotStyle = { color: "gray", fontSize: "1.2em" };


const CancelAppointmentModal = React.forwardRef(function CancelAppointmentModal(props, ref) {

    const { appointmentSlot, appointmentDate, handleCloseModal, doctor, appointmentId } = props;
    const { user } = useContext(AuthContext);

    return (
        <div ref={ref}>

            <Paper sx={modalBodyStyle}>
                {
                    appointmentDate === null || appointmentSlot === null ?
                        (<CenterCircularProgress />)
                        :
                        (<>
                            <Typography variant="h6">
                                Cancel Appointment
                            </Typography>
                            <div style={detailsDivStyle}>
                                <p style={slotStyle}>{"On " + printableDate(appointmentDate)}</p>
                                <p style={{ fontSize: "1.2em" }}>
                                    <strong>Doctor : </strong>
                                    {doctor.name}
                                </p>
                            </div>
                            <div style={detailsDivStyle}>
                                <p style={slotStyle}>{"At " + printableTime(appointmentSlot)}</p>
                                <p style={{ fontSize: "1.2em" }}>
                                    <strong>Patient : </strong>
                                    {user.name}
                                </p>
                            </div>
                            <Typography variant="body1">
                                Are you sure you want to cancel this appointment?
                            </Typography>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button onClick={handleCloseModal}>
                                    Cancel
                                </Button>
                                <Button variant="contained" color="error" onClick={() => {
                                    cancelAppointment(user.token, appointmentId)
                                        .then(message => {
                                            console.log(message);
                                            handleCloseModal();
                                            props.refetchBookedSlotsList();
                                        })
                                }}>
                                    Confirm
                                </Button>
                            </div>
                        </>)
                }
            </Paper>
        </div>
    );
})

CancelAppointmentModal.displayName = "CancelAppointmentModal";

export default CancelAppointmentModal;