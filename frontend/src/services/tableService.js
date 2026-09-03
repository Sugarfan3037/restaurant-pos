import axiosInstance from "../api/axiosInstance";

export const getTables = async () => {
    const response = await axiosInstance.get("/tables");
    return response.data;
};

export const openTable = async (tableNumber) => {
    const response = await axiosInstance.post(
        `/tables/${tableNumber}/open`
    );
    return response.data;
};

export const getTableOrder = async (tableNumber) => {
    const response = await axiosInstance.get(
        `/tables/${tableNumber}/order`
    );
    return response.data;
};

export const changeTable = async (
    sourceTableNumber,
    targetTableNumber
) => {
    const response = await axiosInstance.put(
        `/tables/${sourceTableNumber}/change/${targetTableNumber}`
    );
    return response.data;
};

export const mergeTable = async (
    sourceTableNumber,
    targetTableNumber
) => {
    const response = await axiosInstance.put(
        `/tables/${sourceTableNumber}/merge/${targetTableNumber}`
    );
    return response.data;
};