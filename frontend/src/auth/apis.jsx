import axios from './../axios'

export const authLogin = (email, password) => {

    axios
        .post("auth/login/", {
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
            return user;
        })
        .catch(err => {
            console.log(err);
        });
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