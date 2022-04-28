import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,

} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import CenterCircularProgress from "../common/centerLoader";
import AppointmentTable from "./AppointmentTable";
import { getDoctors } from "./apis";
import AuthContext from "../auth/AuthContext";


const Appointment = () => {

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useContext(AuthContext);


  // get a list of doctors
  useEffect(() => {
    getDoctors(user.token).then((doctorsList) => {
      console.log(doctorsList);
      setDoctors(doctorsList);
      setIsLoading(false);
    });
    setIsLoading(true);
  }, []);


  return (
    <>
      {
        isLoading ? <CenterCircularProgress /> :

          <div>
            <FormControl sx={{ marginTop: 10, minWidth: 120 }} size="small">
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
                  <MenuItem key={doctor.id} value={doctor}>Dr. {doctor.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
      }

      {
        !isLoading && selectedDoctor !== "" ?
          <AppointmentTable doctor={selectedDoctor} />
          :
          <h3>Please select a Doctor</h3>
      }


    </>
  );
};

export default Appointment;
