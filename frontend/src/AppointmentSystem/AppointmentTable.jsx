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
import moment from "moment";
import AuthContext from "../auth/AuthContext";


var DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];


export default function AppointmentTable(props) {
    const [openModal, setOpenModal] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState(null);
    const [appointmentSlot, setAppointmentSlot] = useState(null);
    const [bookedSlots, setBookedSlots] = useState(null);
    const [bookedSlotsInfo, setBookedSlotsInfo] = useState(null);
    const { user } = useContext(AuthContext);

    const handleOpenModal = (date, slot) => {
        setAppointmentDate(date);
        setAppointmentSlot(slot);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setAppointmentDate(null);
        setAppointmentSlot(null);
        setOpenModal(false);
    };

    // constructing table
    const start_time = new Date(moment(props.doctor.schedule.start_time, ["hh:mm A"]).format());
    const end_time = new Date(moment(props.doctor.schedule.end_time, ["hh:mm A"]).format());

    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        days.push(addDays(date, i));
    }

    const slots = [];
    for (let i = start_time; i <= end_time; i = addMinutes(i, props.doctor.slot_duration)) {
        slots.push(i);
    }

    // console.log(slots, start_time, end_time);

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
                bookedSlotsInfo[date][bookedSlot.slot] = { bookedById: bookedSlot.booked_by_id, bookedByName: bookedSlot.booked_by_name };
            } else {
                bookedSlotsInfo[date] = { [slot]: { bookedById: bookedSlot.booked_by_id, bookedByName: bookedSlot.booked_by_name } };
            }
        });
        return bookedSlotsInfo;
    }


    const getSlotBgColor = (isSlotBooked, isSlotBookedByMe, isDoctorAvailable) => {
        let bgColor = "";
        if (isSlotBookedByMe) {
            bgColor = "#00bfa5";
        }
        else if (isSlotBooked) {
            bgColor = "#6d4c41"
        }
        else if (!isDoctorAvailable) {
            bgColor = "#757575";
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

    useEffect(() => {

        const today = new Date().setHours(0, 0, 0, 0).toISOString();
        // getBookedSlots(user.token, props.doctor.id, today).then((bookedSlotsList) => {
        //     setBookedSlots(getBookedSlots(bookedSlotsList));
        //     if (user.user_type === "doctor" || user.user_type === "nurse") {
        //         setBookedSlotsInfo(getBookedSlotsInfo(bookedSlotsList));
        //     }
        // 
        // 
        // });

        const bookedSlotsList = [
            {
                date: "2022-04-17T10:00:00Z",
                slot: 0,
                booked_by_id: "1",
                booked_by_name: "John Doe"
            },
            {
                date: "2022-04-18T10:15:00Z",
                slot: 1,
                booked_by_id: "2",
                booked_by_name: "Alice Singh"
            },
            {
                date: "2022-04-17T10:30:00Z",
                slot: 2,
                booked_by_id: "b2dfb007-28db-492a-a63b-773499fbc205",
                booked_by_name: "Bob Smith"
            },
        ]
        setBookedSlots(getBookedSlots(bookedSlotsList));
        if (user.user_type === "doctor" || user.user_type === "nurse") {
            setBookedSlotsInfo(getBookedSlotsInfo(bookedSlotsList));
        }

    }, []);


    console.log("booked= ", bookedSlotsInfo, bookedSlots, user);

    return (
        <>
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
                                    const doctorIsAvailable = props.doctor.schedule.days[DAYS_OF_WEEK[day.getDay()]];
                                    const isSlotBooked = (bookedSlots && bookedSlots[dateString] && bookedSlots[dateString].includes(slotIndex)) || false;
                                    const isSlotBookedByMe = (bookedSlotsInfo && bookedSlotsInfo[dateString] && bookedSlotsInfo[dateString]?.[slotIndex]?.bookedById === user.userId) || false;
                                    const slotBgColor = getSlotBgColor(isSlotBooked, isSlotBookedByMe, doctorIsAvailable);
                                    const slotDescription = getSlotDescription(isSlotBooked, isSlotBookedByMe, bookedSlotsInfo, day, slotIndex, user);
                                    // console.log({ isSlotBooked, isSlotBookedByMe, doctorIsAvailable, slotIndex, dateString });
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
                                                !bookedSlots[dateString].includes(slotIndex)) {
                                                handleOpenModal(day, slot)
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

            <Modal open={openModal} onClose={handleCloseModal}>
                <AppointmentModal
                    appointmentDate={appointmentDate}
                    appointmentSlot={appointmentSlot}
                />
            </Modal>
        </>
    );
}