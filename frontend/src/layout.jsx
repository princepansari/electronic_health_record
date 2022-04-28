/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useTheme } from "@emotion/react";
import { Container } from "@mui/material";
import NavBar from "./navbar/navbar";



export default function Layout({ children }) {
    const theme = useTheme();
    const classes = {
        page: {
            background: '#f9f9f9',
            width: '100%',
            padding: theme.spacing(3),
        },
        root: {
            display: 'flex',
        },
        toolbar: theme.mixins.toolbar
    }

    return (
        <div sx={classes.root}>
            <div sx={classes.page}>
                <div sx={classes.toolbar}></div>
                <Container sx={{ marginTop: 10 }}>
                    {children}
                </Container>
            </div>
        </div>

    );
}