import axios from 'axios'
const baseURL = 'http://localhost:8080/api/v1'
export const Axios= axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
    });

export const privateAxios = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
    });