/* eslint-disable no-unused-vars */
import "./App.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthContext from "./auth/AuthContext";
import { useEffect, useState } from "react";
import Layout from "./layout";
import MyCases from "./case/MyCasesPage";
import UpcomingAppointments from "./UpcomingAppointmentsPage/UpcomingAppointmentsPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import ProfilePage2 from "./ProfilePage/ProfilePage2";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/signUp";
import Case from "./case/case";
import RequireAuth from "./auth/requireAuth";
import OtpVerification from "./auth/otpVerification";
import { authCheckState } from "./auth/apis";
import AppointmentTable from "./AppointmentSystem/AppointmentTable";

const theme = createTheme({
  palette: {
    primary: {
      main: "#14bdad"
    }
  },
  typography: {
    "fontFamily": `"Hind Siliguri", "Helvetica", "Arial", sans-serif`,
    "fontSize": 15,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  }
});

function App() {
  const [user, setUser] = useState(null); //TODO: should be replaced with {}

  useEffect(() => {
    console.log("in app.jsx auth check");
    authCheckState(setUser);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{ "user": user, "setUser": setUser }}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<h1>Home Page</h1>} />
              <Route path="/otpVerification" element={<OtpVerification />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/myCases" element={<RequireAuth children={<MyCases />} />} />
              <Route path="/appointments" element={<RequireAuth children={<UpcomingAppointments />} />} />
              <Route path="/case/:caseId" element={<RequireAuth children={<Case />} />} />
              <Route path="/profile/" element={<ProfilePage />} />
              <Route path="/profile2/" element={<ProfilePage2 />} />
              <Route path="/makeappointment/" element={<AppointmentTable />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
