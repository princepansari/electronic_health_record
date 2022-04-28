import {
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography,
} from "@mui/material";
import { addDays, addMinutes, printableDate, printableTime } from "./utils";
import { useContext, useEffect, useState } from "react";
import AppointmentModal from "./AppointmentModal";
import CancelAppointmentModal from "./cancelAppnmtModel";
import moment from "moment";
import AuthContext from "../auth/AuthContext";
import { getBookedSlotsList } from "./apis";
import CenterCircularProgress from "../common/centerLoader";


var DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];


export default function AppointmentTable(props) {
    const [openModal, setOpenModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [cancelAppointmentId, setCancelAppointmentId] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState(null);
    const [appointmentSlot, setAppointmentSlot] = useState(null);
    const [bookedSlots, setBookedSlots] = useState(null);
    const [bookedSlotsInfo, setBookedSlotsInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const handleOpenModal = (date, slot, setOpenModal) => {
        setAppointmentDate(date);
        setAppointmentSlot(slot);
        setOpenModal(true);
    };

    const handleCloseModal = (setOpenModal) => {
        setAppointmentDate(null);
        setAppointmentSlot(null);
        setOpenModal(false);
    };

    // constructing table
    const start_time = new Date(moment.utc(props.doctor.schedule.start_time, ["hh:mm A"]).format());
    const end_time = new Date(moment.utc(props.doctor.schedule.end_time, ["hh:mm A"]).format());

    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        days.push(addDays(date, i));
    }

    const slots = [];
    for (let i = start_time; i <= end_time; i = addMinutes(i, props.doctor.slot_duration)) {
        slots.push(i);
    }


    const getBookedSlots = (bookedSlotsList) => {
        const bookedSlots = {};
        bookedSlotsList.forEach((bookedSlot) => {
            const date = new Date(bookedSlot.date).toDateString();
            const slot = bookedSlot.slot;
            if (bookedSlots[date]) {
                bookedSlots[date].push(slot);
            } else {
                bookedSlots[date] = [slot];
            }
        });
        return bookedSlots;
    }

    const getBookedSlotsInfo = (bookedSlotsList) => {
        const bookedSlotsInfo = {};
        bookedSlotsList.forEach((bookedSlot) => {
            const date = new Date(bookedSlot.date).toDateString();
            const slot = bookedSlot.slot;
            if (bookedSlotsInfo[date]) {
                bookedSlotsInfo[date][bookedSlot.slot] = { bookedById: bookedSlot.booked_by_id, bookedByName: bookedSlot.booked_by_name, appointmentId: bookedSlot.appointment_id };
            } else {
                bookedSlotsInfo[date] = { [slot]: { bookedById: bookedSlot.booked_by_id, bookedByName: bookedSlot.booked_by_name, appointmentId: bookedSlot.appointment_id } };
            }
        });
        return bookedSlotsInfo;
    }


    const getSlotBgColor = (isSlotBooked, isSlotBookedByMe, isDoctorAvailable, isSlotTimeExpired) => {
        let bgColor = "";
        if (!isDoctorAvailable) {
            bgColor = "#ef5350";
        }
        else if (isSlotTimeExpired) {
            bgColor = "#757575";
        }
        else if (isSlotBookedByMe) {
            bgColor = "#00bfa5";
        }
        else if (isSlotBooked) {
            bgColor = "#ffa726"
        }
        else {
            bgColor = "#ffffff";
        }
        return bgColor;
    };

    const getSlotDescription = (isSlotBooked, isSlotBookedByMe, bookedSlotsInfo, day, slotIndex, user) => {
        const dateString = day.toDateString();
        let description = "";
        if (isSlotBookedByMe) {
            description = "Booked By You";
        }
        else if (isSlotBooked) {
            if (user.user_type == "doctor" || user.user_type == "nurse") {
                description = "This slot is booked by " + bookedSlotsInfo[dateString]?.[slotIndex]?.bookedByName;
            }
            else {
                description = "Booked"
            }
        }
        return description;
    };

    const getCombinedDateTime = (day, slot) => {
        const combinedDateTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(),
            slot.getHours(), slot.getMinutes(), slot.getSeconds());
        return combinedDateTime;
    };


    function fetchBookedSlotsList() {
        const todayDateObj = new Date();
        todayDateObj.setHours(0, 0, 0, 0);
        const todayDateStr = todayDateObj.toISOString();
        getBookedSlotsList(user.token, props.doctor.id, todayDateStr).then((bookedSlotsList) => {
            setBookedSlotsInfo(getBookedSlotsInfo(bookedSlotsList));
            setBookedSlots(getBookedSlots(bookedSlotsList));
            setIsLoading(false);
        });
        setIsLoading(true);
    }

    useEffect(() => {
        fetchBookedSlotsList();
    }, [user, props.doctor]);


    console.log("booked= ", bookedSlotsInfo, bookedSlots, user);

    return (
        <>
            {
                isLoading ?
                    <CenterCircularProgress />
                    :
                    <TableContainer component={Paper} sx={{ my: 5 }}>
                        <Table sx={{ minWidth: 850 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        align="center"
                                        sx={{ borderRight: "1px solid #e9e9e9", width: "130px" }}
                                    >
                                        Time
                                    </TableCell>
                                    {days.map((day, ind) => (
                                        <TableCell key={ind} align="center">
                                            {printableDate(day)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {slots.map((slot, slotIndex) => (
                                    <TableRow key={slotIndex}>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            align="center"
                                            sx={{ border: 0 }}
                                        >
                                            {printableTime(slot)}
                                        </TableCell>
                                        {days.map((day, ind) => {
                                            const dateString = day.toDateString();
                                            // console.log("day= ", day, "slot= ", slot, "bookedSlots= ", bookedSlots?.[dateString], "bookedSlotsInfo= ", bookedSlotsInfo?.[dateString]);
                                            const isSlotTimeExpired = getCombinedDateTime(day, slot) < new Date().getTime();
                                            const doctorIsAvailable = props.doctor.schedule.days[DAYS_OF_WEEK[day.getDay()]];
                                            const isSlotBooked = (bookedSlots && bookedSlots[dateString] && bookedSlots[dateString].includes(slotIndex)) || false;
                                            const isSlotBookedByMe = (bookedSlotsInfo && bookedSlotsInfo[dateString] && bookedSlotsInfo[dateString]?.[slotIndex]?.bookedById === user.userId) || false;
                                            const slotBgColor = getSlotBgColor(isSlotBooked, isSlotBookedByMe, doctorIsAvailable, isSlotTimeExpired);
                                            const slotDescription = getSlotDescription(isSlotBooked, isSlotBookedByMe, bookedSlotsInfo, day, slotIndex, user);

                                            return (<TableCell
                                                key={ind}
                                                align="center"
                                                sx={{
                                                    borderLeft: "1px solid #e9e9e9",
                                                    cursor: "pointer",
                                                    "&:hover": { bgcolor: "#d3d1d1" },
                                                    bgcolor: slotBgColor
                                                }}
                                                onClick={() => {
                                                    if (doctorIsAvailable && bookedSlots &&
                                                        !bookedSlots[dateString]?.includes(slotIndex) && !isSlotTimeExpired && !(user.user_type == "doctor") && !(user.user_type == "nurse")) {
                                                        handleOpenModal(day, slot, setOpenModal)
                                                    }
                                                    else if (isSlotBookedByMe && !isSlotTimeExpired) {
                                                        setCancelAppointmentId(bookedSlotsInfo[dateString]?.[slotIndex]?.appointmentId);
                                                        handleOpenModal(day, slot, setOpenCancelModal)
                                                    }
                                                }}
                                            >
                                                <Typography variant="body1" color="white">{slotDescription}</Typography>
                                            </TableCell>)
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
            }

            <Modal open={openModal} onClose={() => { handleCloseModal(setOpenModal) }}>
                <>
                    <AppointmentModal
                        appointmentDate={appointmentDate}
                        appointmentSlot={appointmentSlot}
                        doctor={props.doctor}
                        handleCloseModal={() => { handleCloseModal(setOpenModal) }}
                        refetchBookedSlotsList={fetchBookedSlotsList}
                    />
                </>
            </Modal>

            <Modal
                open={openCancelModal}
                onClose={() => {
                    setCancelAppointmentId(null);
                    handleCloseModal(setOpenCancelModal);
                }}
            >
                <>
                    <CancelAppointmentModal
                        handleCloseModal={() => {
                            setCancelAppointmentId(null);
                            handleCloseModal(setOpenCancelModal);
                        }}
                        appointmentDate={appointmentDate}
                        appointmentSlot={appointmentSlot}
                        doctor={props.doctor}
                        refetchBookedSlotsList={fetchBookedSlotsList}
                        appointmentId={cancelAppointmentId}
                    />
                </>
            </Modal>

        </>
    );
}