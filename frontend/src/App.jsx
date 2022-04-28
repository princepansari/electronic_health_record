/* eslint-disable no-unused-vars */
import "./App.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthContext from "./auth/AuthContext";
import { useEffect, useState } from "react";
import Layout from "./layout";
import MyCases from "./case/MyCasesPage";
import UpcomingAppointments from "./UpcomingAppointmentsPage/UpcomingAppointmentsPage";
import ProfilePage from "./ProfilePage/profilePage";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/signUp";
import Case from "./case/case";
import RequireAuth from "./auth/requireAuth";
import OtpVerification from "./auth/otpVerification";
import { authCheckState } from "./auth/apis";
import AppointmentTable from "./AppointmentSystem/AppointmentTable";
import Appointment from "./AppointmentSystem/Appointment";
import UserVerification from "./userVerification/userVerification";
import NavBar from "./navbar/navbar";
import Home from "./Home/home";
import { ParallaxProvider } from 'react-scroll-parallax';

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
          <NavBar />
          <Routes>
            {/* <Route path="/" element={<h2>Home Page</h2>} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/otpVerification" element={<Layout><OtpVerification /></Layout>} />
            <Route path="/signup" element={<Layout><SignUp /></Layout>} />
            <Route path="/login" element={<Layout><SignIn /></Layout>} />
            <Route path="/myCases" element={<Layout><RequireAuth children={<MyCases />} /></Layout>} />
            <Route path="/appointments" element={<Layout><RequireAuth children={<UpcomingAppointments />} /></Layout>} />
            <Route path="/case/:caseId" element={<Layout><RequireAuth children={<Case />} /></Layout>} />
            <Route path="/profile" element={<Layout><RequireAuth children={<ProfilePage />} /> </Layout>} />
            <Route path="/makeappointment" element={<Layout><RequireAuth children={<Appointment />} /></Layout>} />
            <Route path="/userVerification" element={<Layout><RequireAuth children={<UserVerification />} /></Layout>} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
