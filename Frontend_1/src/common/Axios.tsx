import axios from 'axios'
console.log("VITE_API_URL: ", import.meta.env.VITE_API_URL);
console.log("VITE_MODE: ", import.meta.env.MODE);  // Check the current mode
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