/* eslint-disable no-unused-vars */
import "./App.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthContext from "./auth/AuthContext";
import { useEffect, useState } from "react";
import Layout from "./layout";
import MyCasesPage from "./MyCasesPage/MyCasesPage";
import UpcomingAppointmentsPage from "./UpcomingAppointmentsPage/UpcomingAppointmentsPage";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/signUp";
import Case from "./case/case";
import { authCheckState } from "./auth/apis";

const theme = createTheme({ palette: { mode: "light" } });

function App() {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState({ user_type: 'doctor' }); //TODO: should be replaced with {}

    // useEffect(() => {
    //     const authUser = authCheckState(auth, setAuth, setUser);
    // }, [])


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthContext.Provider value={{ "auth": auth, "setAuth": setAuth, "user": user, "setUser": setUser }}>

                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<h1>hello</h1>} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/login" element={<SignIn />} />
                            <Route path="/case" element={<Case />} />
                            <Route path="/case/{caseId}" element={<Case />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>

            </AuthContext.Provider>

        </ThemeProvider>
    );
}

export default App;
