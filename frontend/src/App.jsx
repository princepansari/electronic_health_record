/* eslint-disable no-unused-vars */
import "./App.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthContext from "./auth/AuthContext";
import { useState } from "react";
import Layout from "./layout";
import MyCasesPage from "./MyCasesPage/MyCasesPage";
import UpcomingAppointmentsPage from "./UpcomingAppointmentsPage/UpcomingAppointmentsPage";
import SignIn from "./SignIn";
const theme = createTheme({ palette: { mode: "light" } });

function App() {
  const [auth, setAuth] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{ "auth": auth, "setAuth": setAuth }}>

        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<h1>hello</h1>} />
              <Route path="/login" element={"bye"} />
              <Route path="/expenses" element={"bye"} />
              <Route path="/expenses2" element={"bye"} />
              <Route path="/prescriptions" element={<MyCasesPage/>} />
              <Route path="/appointments" element={<UpcomingAppointmentsPage/>} />
              <Route path="/signin" element={<SignIn/>} />
            </Routes>
          </Layout>
        </BrowserRouter>

      </AuthContext.Provider>

    </ThemeProvider>
  );
}

export default App;
