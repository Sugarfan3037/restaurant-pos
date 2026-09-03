import axiosInstance from "../api/axiosInstance";


// =========================
// 訂單結帳
// =========================

export const checkoutOrder = async (
    orderId,
    paymentMethod
) => {

    const response =
        await axiosInstance.post(
            `/payments/orders/${orderId}/checkout`,
            {
                paymentMethod:
                    paymentMethod
            }
        );

    return response.data;
};