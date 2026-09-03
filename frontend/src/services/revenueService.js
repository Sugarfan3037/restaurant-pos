import axiosInstance from "../api/axiosInstance";

// 今日營收
export const getTodayRevenue = async () => {
    const response = await axiosInstance.get("/revenue/today");
    return response.data;
};

// 指定日期營收
export const getDailyRevenue = async (date) => {
    const response = await axiosInstance.get(`/revenue/date/${date}`);
    return response.data;
};

// 指定月份營收
export const getMonthlyRevenue = async (yearMonth) => {
    const response = await axiosInstance.get(`/revenue/month/${yearMonth}`);
    return response.data;
};