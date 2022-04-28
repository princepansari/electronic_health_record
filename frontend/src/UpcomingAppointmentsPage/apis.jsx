import axios from "./../axios";

export const getUpcomingAppointments = (token) => {

    axios.defaults.headers = {
        'Content-Type': `application/json`,
        Authorization: `Bearer ${token}`
    };

    return axios
        .get(`/api/appointment/get_upcoming_appointment`)
        .then(res => {
            console.log(res.data);
            return res.data;
        })
};