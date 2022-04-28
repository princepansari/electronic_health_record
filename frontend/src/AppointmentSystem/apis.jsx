import axios from "./../axios";

export const getDoctors = (token) => {

    axios.defaults.headers = {
        'Content-Type': `application/json`,
        Authorization: `Bearer ${token}`
    };

    return axios
        .get(`/api/appointment/get_doctors`)
        .then(res => {
            console.log(res.data);
            return res.data;
        })
};


export const getBookedSlotsList = (token, doctor_id, today) => {

    axios.defaults.headers = {
        'Content-Type': `application/json`,
        Authorization: `Bearer ${token}`
    };

    return axios
        .get(`/api/appointment/get_booked_slots?doctor_id=${doctor_id}&from_date=${today}`)
        .then(res => {
            console.log(res.data);
            return res.data;
        })

}


export const createAppointment = (token, doctor_id, appointmentDateTime, followUpCaseId) => {

    axios.defaults.headers = {
        'Content-Type': `application/json`,
        Authorization: `Bearer ${token}`
    };

    const appointment = {
        doctor_id,
        "appointment_datetime": appointmentDateTime,
    }
    if (followUpCaseId) {
        appointment.followup_prescription_id = followUpCaseId;
    }
    console.log(appointment);
    return axios
        .post(`/api/appointment/create_appointment`, appointment)
        .then(res => {
            console.log(res.data.message);
            return res.data.message;
        })

}


export const cancelAppointment = (token, appointment_id) => {

    axios.defaults.headers = {
        'Content-Type': `application/json`,
        Authorization: `Bearer ${token}`
    };

    return axios
        .delete(`/api/appointment/delete_appointment/${appointment_id}`)
        .then(res => {
            console.log(res.data.message);
            return res.data.message;
        })

}