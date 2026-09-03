import axiosInstance from "../api/axiosInstance";

export const closeDay = async (date) => {
    const response = await axiosInstance.post(`/daily-closing/${date}`);
    return response.data;
};

export const getDailyClosing = async (date) => {
    const response = await axiosInstance.get(`/daily-closing/${date}`);
    return response.data;
};