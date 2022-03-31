import React from 'react';
import {
    useLocation,
    Navigate
} from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import { authCheckState } from './apis';


export default function RequireAuth(props) {
    let location = useLocation();
    const { auth, setAuth, setUser } = React.useContext(AuthContext);

    // authCheckState(auth, setAuth, setUser);
    // if (!auth) {
    //     return <Navigate to="/login" from={location} />;
    // }
    return props.children;
}