import axios from 'axios'
const baseURL = 'http://13.53.133.27/api/v1'
export const Axios= axios.create({
    baseURL: baseURL,
    });

export const privateAxios = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
         
    },
    withCredentials: true
    });