import React from 'react';
import {
    useLocation,
    Navigate
} from "react-router-dom";
import AuthContext from "../auth/AuthContext";


export default function RequireAuth(props) {
    let location = useLocation();
    const { user } = React.useContext(AuthContext);
    console.log("userin require auth= ", user);
    if (!user) {
        console.log("in navigate")
        console.log(location);
        return <Navigate to="/login" state={{ from: location.pathname }} />;
    }

    return props.children;
}