/* eslint-disable no-unused-vars */
import "./App.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthContext from "./auth/AuthContext";
import { useState } from "react";
import Layout from "./layout";
import Prescription from "./case/prescription";
import Case from "./case/case";
import PrescriptionForm from "./case/prescriptionForm";
const theme = createTheme({ palette: { mode: "light" } });

function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({ usertype: "doctor" }); //TODO: should be replaced with {}

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{ "auth": auth, "setAuth": setAuth, "user": user, "setUser": setUser }}>

        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<h1>hello</h1>} />
              <Route path="/login" element={"bye"} />
              <Route path="/case" element={<Case />} />
            </Routes>
          </Layout>
        </BrowserRouter>

      </AuthContext.Provider>

    </ThemeProvider>
  );
}

export default App;
