import axios from "axios";
const customAxios = axios.create({
    //     baseURL: 'https://assignment-explorer.herokuapp.com/'
    baseURL: 'http://localhost:3000/'
});

export default customAxios;