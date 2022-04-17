import {
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import CenterCircularProgress from "../common/centerLoader";
import { addDays, addMinutes, printableDate, printableTime } from "./utils";
import AppointmentTable from "./AppointmentTable";



const Appointment = () => {

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([
    {
      name: "Molu",
      id: "id_of_doctor_molu",
      schedule: {
        days: {
          monday: true,
          tuesday: true,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: true,
        },
        start_time: "10:00 AM",
        end_time: "12:00 PM"
      },
      slot_duration: 15
    }
  ]);
  const { user } = useContext(AuthContext);




  // get a list of doctors
  useEffect(() => {
    // getDoctors(user.token).then((doctorsList) => {
    //   setDoctors(doctorsList);
    // });
  }, []);


  return (
    <>
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-simple-select-autowidth-label">Doctor</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            autoWidth
            label="Age"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {doctors.map((doctor) => (
              <MenuItem key={doctor} value={doctor}>Dr. {doctor.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {

        selectedDoctor !== "" ?
          <AppointmentTable doctor={selectedDoctor} />
          :
          <h3>Please select a Doctor</h3>
      }
    </>
  );
};

export default Appointment;
