import axiosInstance from '../api/axiosInstance';

export const getMenuItems=async () => {
    const response = await axiosInstance.get('/menu-items');
    return response.data;
};
export const createMenuItem = async (menuItem) => {

    const response =
        await axiosInstance.post(
            "/menu-items",
            menuItem
        );

    return response.data;
};
export const updateMenuItem = async (id, menuItem) => {

    const response =
        await axiosInstance.put(
            `/menu-items/${id}`,
            menuItem
        );

    return response.data;
};
export const deleteMenuItem = async (id) => {

    await axiosInstance.delete(
        `/menu-items/${id}`
    );
};