import axiosInstance from "../api/axiosInstance";

export const login = async (username, password) =>{
    const response = await axiosInstance.post("/auth/login", 
        { username, password });
        return response.data;
};
export const logout = async () => {
    localStorage.removeItem("token");
};
export const getToken=()=>{
    return localStorage.getItem("token");
};
export const isLoggedIn=()=>{
    return !!localStorage.getItem("token");
};