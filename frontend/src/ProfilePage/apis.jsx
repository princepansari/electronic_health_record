import axios from './../axios'


export const getUser = (token) => {

    axios.defaults.headers = {
        'Content-Type': `application/json`,
        Authorization: `Bearer ${token}`
    };

    return axios
        .get(`/api/profile/get_profile`)
        .then(res => {
            return res.data;
        })
};


export const editUser = (token, user) => {

    axios.defaults.headers = {
        'Content-Type': `application/json`,
        Authorization: `Bearer ${token}`
    };

    return axios
        .post(`/api/profile/update_profile`, user)
        .then(res => {
            return res.message;
        })
};