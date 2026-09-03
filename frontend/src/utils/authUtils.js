export const getToken = () => {
    return localStorage.getItem("token");
};

export const parseJwt = (token) => {
    try {
        if (!token) return null;

        const base64Url = token.split(".")[1];
        if (!base64Url) return null;

        const base64 = base64Url
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) =>
                    "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join("")
        );

        return JSON.parse(jsonPayload);

    } catch (error) {
        console.error("JWT解析失敗：", error);
        return null;
    }
};

export const getCurrentUser = () => {
    const token = getToken();
    return parseJwt(token);
};

export const getCurrentRole = () => {
    const user = getCurrentUser();

    if (!user) return null;

    if (user.role) return user.role;

    if (user.authorities && Array.isArray(user.authorities)) {
        const admin = user.authorities.find(
            (authority) =>
                authority === "ROLE_ADMIN"
                || authority.authority === "ROLE_ADMIN"
        );

        if (admin) return "ADMIN";

        const staff = user.authorities.find(
            (authority) =>
                authority === "ROLE_STAFF"
                || authority.authority === "ROLE_STAFF"
        );

        if (staff) return "STAFF";
    }

    return null;
};

export const isAdmin = () => {
    return getCurrentRole() === "ADMIN";
};

export const isStaff = () => {
    return getCurrentRole() === "STAFF";
};