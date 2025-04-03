import axios from 'axios'
const baseURL = import.meta.env.VITE_API_URL ;
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