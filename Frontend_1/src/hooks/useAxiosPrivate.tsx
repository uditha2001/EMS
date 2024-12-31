import { privateAxios } from "../common/Axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
    const { auth } = useAuth();
    const refreshToken = useRefreshToken();

    useEffect(() => {
        // Add request interceptor
        const requestInterceptor = privateAxios.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Add response interceptor
        const responseInterceptor = privateAxios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error.config;
                if (error['code'] === 'ERR_NETWORK' && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    try {
                        console.log('Refreshing token...');
                        const newAccessToken = await refreshToken();
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return privateAxios(prevRequest);
                    } catch (err) {
                        return Promise.reject(err);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            // Clean up interceptors
            privateAxios.interceptors.request.eject(requestInterceptor);
            privateAxios.interceptors.response.eject(responseInterceptor);
        };
    },[auth,refreshToken]);

    return privateAxios;
};

export default useAxiosPrivate;
