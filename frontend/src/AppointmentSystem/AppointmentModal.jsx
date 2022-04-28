import {
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import CenterCircularProgress from "../common/centerLoader";
import { printableDate, printableTime } from "./utils";
import AuthContext from "../auth/AuthContext";
import { createAppointment } from "./apis";
import { useNavigate } from "react-router-dom";

const modalBodyStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    height: { xs: "50%", md: "48%" },
    width: { xs: "96%", md: "55%" },
    p: 5,
};

const slotStyle = { color: "gray", fontSize: "1.2em" };
const detailsDivStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};


const AppointmentModal = React.forwardRef(function appointmentModal(props, ref) {
    const { appointmentDate, appointmentSlot, doctor } = props;
    const [radioValue, setRadioValue] = useState("newCase");
    const [followUpCaseId, setFollowUpCaseId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    // console.log("appointmentModal props: ", props);

    function handleSubmit(e) {
        e.preventDefault();
        const finalAppointmentTime = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(),
            appointmentSlot.getHours(), appointmentSlot.getMinutes(), appointmentSlot.getSeconds());
        console.log("finalAppointmentTime: ", finalAppointmentTime);
        createAppointment(user.token, doctor.id, finalAppointmentTime.toISOString(), followUpCaseId).then(() => {
            setIsLoading(false);
            props.handleCloseModal();
            props.refetchBookedSlotsList();
        })
            .catch((err) => {
                console.log(err);
            });
        setIsLoading(true);
    }

    return (
        <div ref={ref}>
            <Paper sx={modalBodyStyle}>
                {appointmentDate === null || appointmentSlot === null ? (
                    <CenterCircularProgress />
                ) : (
                    <>
                        <Typography variant="h4" component="div" textAlign="center">
                            Booking Appointment
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

                        <form onSubmit={handleSubmit}>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    py: 3,
                                }}
                            >
                                <FormControl>
                                    <FormLabel>Type of Case</FormLabel>
                                    <RadioGroup
                                        row
                                        name="caseRadioButtons"
                                        value={radioValue}
                                        onChange={(e) => setRadioValue(e.currentTarget.value)}
                                    >
                                        <FormControlLabel
                                            value="newCase"
                                            control={<Radio />}
                                            label="New Case"
                                        />
                                        <FormControlLabel
                                            value="followUp"
                                            control={<Radio />}
                                            label="Follow-up"
                                        />
                                    </RadioGroup>
                                </FormControl>
                                {radioValue === "followUp" && (
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        required
                                        label="Case ID of original case"
                                        onChange={(e) => setFollowUpCaseId(parseInt(e.target.value))}
                                    />
                                )}
                            </Box>
                            {
                                isLoading ?
                                    <CircularProgress />
                                    :
                                    <Button type="submit" variant="contained" fullWidth>
                                        Submit
                                    </Button>
                            }
                        </form>
                    </>
                )}
            </Paper>
        </div>
    );
});
AppointmentModal.displayName = "AppointmentModal";

export default AppointmentModal;
