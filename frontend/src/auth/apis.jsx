import axios from './../axios'


export const authSignup = (user) => {
    return axios
        .post("api/auth/signup", user)
        .then(res => {
            return res.data.message;
        })
};



export const authLogin = (email, password, setUser, setAuth) => {

    return axios
        .post("/api/auth/login", {
            email: email,
            password: password
        })
        .then(res => {
            const user = {
                token: res.data.token,
                email,
                name: res.data.name,
                userId: res.data.user_id,
                user_type: res.data.user_type,
                expirationDate: new Date(new Date().getTime() + 24 * 60 * 60 * 60 * 1000)
            };
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
            setAuth(true);
        });

};

export const authOTPVerification = (email, emailOTP, guardianEmailOTP) => {
    const OTPdata = {
        email,
        "otp": emailOTP,
    }
    if (guardianEmailOTP)
        OTPdata["guardian_otp"] = guardianEmailOTP;
    console.log(OTPdata);
    return axios
        .post("/api/auth/verify", OTPdata)
        .then(res => {
            return res.data.message;
        })
};


export const authLogout = (setAuth, setUser) => {
    localStorage.removeItem("user");
    setAuth(false);
    setUser({});
};

export const authCheckState = (auth, setAuth, setUser) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (auth) {
        const expirationDate = new Date(user.expirationDate);
        if (expirationDate <= new Date()) {
            authLogout(setAuth, setUser);
        } else {
            setUser(user);
            setAuth(true);
            return true;
        }
    }
    return false;
};

