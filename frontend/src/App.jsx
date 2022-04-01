/* eslint-disable no-unused-vars */
import "./App.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthContext from "./auth/AuthContext";
import { useEffect, useState } from "react";
import Layout from "./layout";
import MyCases from "./case/MyCasesPage";
import UpcomingAppointments from "./UpcomingAppointmentsPage/UpcomingAppointmentsPage";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/signUp";
import Case from "./case/case";
import RequireAuth from "./auth/requireAuth";
import OtpVerification from "./auth/otpVerification";
import { authCheckState } from "./auth/apis";
const theme = createTheme({ palette: { mode: "light" } });

function App() {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState({ user_type: 'doctor' }); //TODO: should be replaced with {}

    useEffect(() => {
        authCheckState(auth, setAuth, setUser);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthContext.Provider value={{ "auth": auth, "setAuth": setAuth, "user": user, "setUser": setUser }}>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<h1>Hello</h1>} />
                            <Route path="/otpVerification" element={<OtpVerification />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/login" element={<SignIn />} />
                            <Route path="/myCases" element={<RequireAuth children={<MyCases />} />} />
                            <Route path="/appointments" element={<RequireAuth children={<UpcomingAppointments />} />} />
                            <Route path="/case" element={<RequireAuth children={<Case />} />} />
                            <Route path="/case/:caseId" element={<RequireAuth children={<Case />} />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>

            </AuthContext.Provider>

        </ThemeProvider>
    );
}

export default App;
