export const getOrderStatusText = (status) => {
    switch (status) {
        case "OPEN":
            return "用餐中";
        case "PAID":
            return "已付款";
        case "CANCELLED":
            return "已取消";
        default:
            return status ?? "-";
    }
};

export const getOrderStatusClass = (status) => {
    switch (status) {
        case "OPEN":
            return "badge bg-primary";
        case "PAID":
            return "badge bg-success";
        case "CANCELLED":
            return "badge bg-danger";
        default:
            return "badge bg-secondary";
    }
};

export const getTableStatusText = (status) => {
    switch (status) {
        case "AVAILABLE":
            return "空桌";
        case "OCCUPIED":
            return "使用中";
        default:
            return status ?? "-";
    }
};

export const getTableStatusClass = (status) => {
    switch (status) {
        case "AVAILABLE":
            return "badge bg-success";
        case "OCCUPIED":
            return "badge bg-danger";
        default:
            return "badge bg-secondary";
    }
};

export const getRoleText = (role) => {
    switch (role) {
        case "ADMIN":
            return "管理員";
        case "STAFF":
            return "員工";
        default:
            return role ?? "-";
    }
};

export const getCategoryText = (category) => {
    switch (category) {
        case "FOOD":
            return "餐點";
        case "DRINK":
            return "飲料";
        case "DESSERT":
            return "甜點";
        default:
            return category ?? "-";
    }
};

export const getPaymentMethodText = (method) => {
    switch (method) {
        case "CASH":
            return "現金";
        case "CREDIT_CARD":
            return "信用卡";
        case "LINE_PAY":
            return "LINE Pay";
        default:
            return method ?? "-";
    }
};