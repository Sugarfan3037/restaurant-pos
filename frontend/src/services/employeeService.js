import axiosInstance from "../api/axiosInstance";

// 查全部員工
export const getEmployees = async () => {
    const response = await axiosInstance.get("/employees");
    return response.data;
};

// 查單一員工
export const getEmployeeById = async (id) => {
    const response = await axiosInstance.get(`/employees/${id}`);
    return response.data;
};

// 新增員工
export const createEmployee = async (employeeData) => {
    const response = await axiosInstance.post("/employees", employeeData);
    return response.data;
};

// 修改員工
export const updateEmployee = async (id, employeeData) => {
    const response = await axiosInstance.put(`/employees/${id}`, employeeData);
    return response.data;
};

// 修改密碼
export const updateEmployeePassword = async (id, password) => {
    const response = await axiosInstance.put(
        `/employees/${id}/password`,
        { password: password }
    );
    return response.data;
};

// 停用員工
export const deleteEmployee = async (id) => {
    await axiosInstance.delete(`/employees/${id}`);
};