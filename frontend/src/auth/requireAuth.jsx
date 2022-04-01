import React from 'react';
import {
    useLocation,
    Navigate
} from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import { authCheckState } from './apis';


export default function RequireAuth(props) {
    let location = useLocation();
    const { auth } = React.useContext(AuthContext);

    console.log("in require auth");

    if (!auth) {
        console.log("in require auth ifffff");
        return <Navigate to="/login" from={location} />;
    }

    console.log("after if in require auth")
    return props.children;
}