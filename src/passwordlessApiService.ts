// src/services/apiService.ts
import axios from "axios";

const BASE_URL = "http://localhost/api/Login";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const passwordlessManageCheck = (id: string, pw: string) =>
    axiosInstance.post(`${BASE_URL}/passwordlessManageCheck`, null, {
        params: { 
            id : id, 
            pw : pw},
        withCredentials: true,
    });

export const joinPasswordless = (id: string, token: string) => {
    const params = { url: "joinApUrl", params: `userId=${id}&token=${token}` };
    return axiosInstance.get(`${BASE_URL}/passwordlessCallApi`, { params : params, withCredentials : true});
};

export const callApi = (url: string, paramsString: string) =>
    axiosInstance.post(
        `${BASE_URL}/passwordlessCallApi`,
        null,
        {
            params: { url, params: paramsString },
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            withCredentials: true
        }
    );

export const getOneTimeToken = (id: string) => {
    const params = { url: "getTokenForOneTimeUrl", params: `userId=${id}` };
    return axiosInstance.get(`${BASE_URL}/passwordlessCallApi`, { params });
};

export const getServicePassword = (id: string, token: string) => {
    const params = { url: "getSpUrl", params: `userId=${id}&token=${token}` };
    return axiosInstance.get(`${BASE_URL}/passwordlessCallApi`, { params });
};