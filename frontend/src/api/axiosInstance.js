import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});


// =========================
// Request
// 自動加入 JWT
// =========================
axiosInstance.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;

    },
    (error) => {

        return Promise.reject(error);
    }
);


// =========================
// Response
// 處理登入失效
// =========================
axiosInstance.interceptors.response.use(
    (response) => {

        return response;

    },
    (error) => {

        // JWT 過期 / 未登入
        if (
            error.response?.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

            if (
                window.location.pathname
                !== "/login"
            ) {

                window.location.href =
                    "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;