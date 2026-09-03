import { Navigate } from "react-router-dom";
import { getCurrentRole } from "../utils/authUtils";

function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    const role = getCurrentRole();

    // 沒登入
    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // 已登入，但不是 ADMIN
    if (role !== "ADMIN") {
        return (
            <Navigate
                to="/forbidden"
                replace
            />
        );
    }

    return children;
}

export default AdminRoute;