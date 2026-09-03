import axiosInstance from "../api/axiosInstance";


// =========================
// 查詢所有訂單
// =========================
export const getOrders = async () => {

    const response =
        await axiosInstance.get("/orders");

    return response.data;
};


// =========================
// 查詢單一訂單
// =========================
export const getOrderById = async (id) => {

    const response =
        await axiosInstance.get(
            `/orders/${id}`
        );

    return response.data;
};


// =========================
// 建立訂單
// =========================
export const createOrder = async (orderData) => {

    const response =
        await axiosInstance.post(
            "/orders",
            orderData
        );

    return response.data;
};


// =========================
// 加入餐點
// =========================
export const addOrderItem = async (
    orderId,
    itemData
) => {

    const response =
        await axiosInstance.post(
            `/orders/${orderId}/items`,
            itemData
        );

    return response.data;
};


// =========================
// 修改餐點數量
// =========================
export const updateOrderItemQuantity = async (
    orderId,
    itemId,
    quantity
) => {

    const response =
        await axiosInstance.put(
            `/orders/${orderId}/items/${itemId}`,
            {
                quantity: quantity
            }
        );

    return response.data;
};


// =========================
// 刪除訂單餐點
// =========================
export const deleteOrderItem = async (
    orderId,
    itemId
) => {

    const response =
        await axiosInstance.delete(
            `/orders/${orderId}/items/${itemId}`
        );

    return response.data;
};
// =========================
// 取消訂單
// =========================

export const cancelOrder = async (
    orderId
) => {

    const response =
        await axiosInstance.put(
            `/orders/${orderId}/cancel`
        );

    return response.data;
};