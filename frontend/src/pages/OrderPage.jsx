import {
    useEffect,
    useState
} from "react";

import {
    useSearchParams
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
    getOrders,
    getOrderById,
    createOrder,
    addOrderItem,
    updateOrderItemQuantity,
    deleteOrderItem,
    cancelOrder
} from "../services/orderService";

import {
    getMenuItems
} from "../services/menuService";

import {
    checkoutOrder
} from "../services/paymentService";


function OrderPage() {

    // ==================================================
    // URL Query String
    // 例如：
    // /orders?orderId=18
    // ==================================================
    const [
        searchParams
    ] = useSearchParams();


    // ==================================================
    // 訂單資料
    // ==================================================
    const [
        orders,
        setOrders
    ] = useState([]);


    // ==================================================
    // 菜單資料
    // ==================================================
    const [
        menuItems,
        setMenuItems
    ] = useState([]);


    // ==================================================
    // 建立訂單
    // ==================================================
    const [
        tableNo,
        setTableNo
    ] = useState("");


    // ==================================================
    // 目前選擇的訂單
    // ==================================================
    const [
        selectedOrderId,
        setSelectedOrderId
    ] = useState("");

    const [
        selectedOrder,
        setSelectedOrder
    ] = useState(null);


    // ==================================================
    // 點餐表單
    // ==================================================
    const [
        menuItemId,
        setMenuItemId
    ] = useState("");

    const [
        quantity,
        setQuantity
    ] = useState(1);

    const [
        sugarLevel,
        setSugarLevel
    ] = useState("");

    const [
        iceLevel,
        setIceLevel
    ] = useState("");

    const [
        note,
        setNote
    ] = useState("");


    // ==================================================
    // 付款
    // ==================================================
    const [
        paymentMethod,
        setPaymentMethod
    ] = useState("");

    const [
        checkingOut,
        setCheckingOut
    ] = useState(false);

    const [
        paymentResult,
        setPaymentResult
    ] = useState(null);


    // ==================================================
    // 歷史訂單篩選
    // ==================================================
    const [
        historyFilter,
        setHistoryFilter
    ] = useState("ALL");


    // ==================================================
    // Loading
    // ==================================================
    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        detailLoading,
        setDetailLoading
    ] = useState(false);

    const [
        creating,
        setCreating
    ] = useState(false);

    const [
        addingItem,
        setAddingItem
    ] = useState(false);

    const [
        updatingItemId,
        setUpdatingItemId
    ] = useState(null);

    const [
        deletingItemId,
        setDeletingItemId
    ] = useState(null);

    const [
        cancellingOrderId,
        setCancellingOrderId
    ] = useState(null);


    // ==================================================
    // 數量修改暫存
    // ==================================================
    const [
        editingQuantities,
        setEditingQuantities
    ] = useState({});


    // ==================================================
    // 訊息
    // ==================================================
    const [
        message,
        setMessage
    ] = useState("");

    const [
        error,
        setError
    ] = useState("");


    // ==================================================
    // 查詢全部訂單
    // ==================================================
    const loadOrders = async () => {

        try {

            const data =
                await getOrders();


            setOrders(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.log(
                "取得訂單失敗：",
                error
            );


            setError(
                "取得訂單資料失敗"
            );
        }
    };


    // ==================================================
    // 查詢菜單
    // ==================================================
    const loadMenuItems = async () => {

        try {

            const data =
                await getMenuItems();


            setMenuItems(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.log(
                "取得菜單失敗：",
                error
            );


            setError(
                "取得菜單資料失敗"
            );
        }
    };


    // ==================================================
    // 查詢單一訂單
    // ==================================================
    const loadOrderDetail = async (
        orderId
    ) => {

        if (!orderId) {

            setSelectedOrder(
                null
            );

            return;
        }


        try {

            setDetailLoading(
                true
            );


            const data =
                await getOrderById(
                    Number(
                        orderId
                    )
                );


            setSelectedOrder(
                data
            );


        } catch (error) {

            console.log(
                "取得訂單明細失敗：",
                error
            );


            handleBackendError(
                error,
                "取得訂單明細失敗"
            );


        } finally {

            setDetailLoading(
                false
            );
        }
    };


    // ==================================================
    // 載入資料
    // ==================================================
    const loadData = async () => {

        try {

            setLoading(
                true
            );

            setError("");


            await Promise.all([
                loadOrders(),
                loadMenuItems()
            ]);


        } finally {

            setLoading(
                false
            );
        }
    };


    // ==================================================
    // 第一次進入頁面
    //
    // 支援：
    // /orders
    //
    // 以及：
    // /orders?orderId=18
    // ==================================================
    useEffect(() => {

        const initializePage =
            async () => {

                await loadData();


                const orderId =
                    searchParams.get(
                        "orderId"
                    );


                // 從桌位管理前往點餐時
                // 自動開啟指定訂單
                if (orderId) {

                    setSelectedOrderId(
                        orderId
                    );


                    await loadOrderDetail(
                        orderId
                    );
                }
            };


        initializePage();

    }, []);


    // ==================================================
    // 建立訂單
    // ==================================================
    const handleCreateOrder =
        async (e) => {

            e.preventDefault();

            setMessage("");
            setError("");
            setPaymentResult(null);


            if (!tableNo) {

                setError(
                    "請先選擇桌號"
                );

                return;
            }


            try {

                setCreating(
                    true
                );


                const result =
                    await createOrder(
                        {
                            tableNo:
                                Number(
                                    tableNo
                                )
                        }
                    );


                setMessage(
                    `${tableNo} 號桌建立訂單成功`
                );


                if (
                    result?.id
                ) {

                    const newOrderId =
                        result.id
                            .toString();


                    setSelectedOrderId(
                        newOrderId
                    );


                    await loadOrderDetail(
                        newOrderId
                    );
                }


                setTableNo("");

                await loadOrders();


            } catch (error) {

                console.log(
                    "建立訂單失敗：",
                    error
                );


                handleBackendError(
                    error,
                    "建立訂單失敗"
                );


            } finally {

                setCreating(
                    false
                );
            }
        };


    // ==================================================
    // 選擇訂單
    // ==================================================
    const handleSelectOrder =
        async (orderId) => {

            setMessage("");
            setError("");

            setPaymentMethod("");

            setPaymentResult(null);

            setEditingQuantities({});


            setSelectedOrderId(
                orderId.toString()
            );


            await loadOrderDetail(
                orderId
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };


    // ==================================================
    // 選擇菜單
    // ==================================================
    const handleMenuItemChange =
        (e) => {

            const id =
                e.target.value;


            setMenuItemId(
                id
            );


            const item =
                menuItems.find(
                    (menu) =>
                        menu.id ===
                        Number(id)
                );


            // 非飲料時
            // 清除糖度、冰量
            if (
                !item ||
                item.category
                !== "DRINK"
            ) {

                setSugarLevel("");

                setIceLevel("");
            }
        };


    // ==================================================
    // 加入餐點
    // ==================================================
    const handleAddItem =
        async (e) => {

            e.preventDefault();

            setMessage("");
            setError("");


            if (!selectedOrder) {

                setError(
                    "請先選擇訂單"
                );

                return;
            }


            if (
                selectedOrder.status
                !== "OPEN"
            ) {

                setError(
                    "此訂單已無法點餐"
                );

                return;
            }


            if (!menuItemId) {

                setError(
                    "請先選擇餐點"
                );

                return;
            }


            if (
                Number(quantity) < 1
            ) {

                setError(
                    "數量至少必須為1"
                );

                return;
            }


            const currentMenuItem =
                menuItems.find(
                    (item) =>
                        item.id ===
                        Number(
                            menuItemId
                        )
                );


            try {

                setAddingItem(
                    true
                );


                const isDrink =
                    currentMenuItem
                        ?.category
                    === "DRINK";


                const itemData = {

                    menuItemId:
                        Number(
                            menuItemId
                        ),

                    quantity:
                        Number(
                            quantity
                        ),

                    sugarLevel:
                        isDrink
                            ? sugarLevel || null
                            : null,

                    iceLevel:
                        isDrink
                            ? iceLevel || null
                            : null,

                    note:
                        note || null
                };


                await addOrderItem(

                    Number(
                        selectedOrderId
                    ),

                    itemData
                );


                setMessage(
                    "餐點加入成功"
                );


                resetItemForm();


                await loadOrders();

                await loadOrderDetail(
                    selectedOrderId
                );


            } catch (error) {

                console.log(
                    "加入餐點失敗：",
                    error
                );


                handleBackendError(
                    error,
                    "加入餐點失敗"
                );


            } finally {

                setAddingItem(
                    false
                );
            }
        };


    // ==================================================
    // 修改餐點數量
    // ==================================================
    const handleUpdateQuantity =
        async (
            itemId,
            newQuantity
        ) => {

            setMessage("");
            setError("");


            if (
                Number(
                    newQuantity
                ) < 1
            ) {

                setError(
                    "餐點數量至少必須為1"
                );

                return;
            }


            try {

                setUpdatingItemId(
                    itemId
                );


                await updateOrderItemQuantity(

                    Number(
                        selectedOrderId
                    ),

                    itemId,

                    Number(
                        newQuantity
                    )
                );


                setMessage(
                    "餐點數量修改成功"
                );


                await loadOrders();

                await loadOrderDetail(
                    selectedOrderId
                );


            } catch (error) {

                console.log(
                    "修改數量失敗：",
                    error
                );


                handleBackendError(
                    error,
                    "修改餐點數量失敗"
                );


            } finally {

                setUpdatingItemId(
                    null
                );
            }
        };


    // ==================================================
    // 刪除餐點
    // ==================================================
    const handleDeleteItem =
        async (item) => {

            setMessage("");
            setError("");


            const confirmed =
                window.confirm(
                    `確定要刪除「${item.menuItemName}」嗎？`
                );


            if (!confirmed) {

                return;
            }


            try {

                setDeletingItemId(
                    item.id
                );


                await deleteOrderItem(

                    Number(
                        selectedOrderId
                    ),

                    item.id
                );


                setMessage(
                    `「${item.menuItemName}」刪除成功`
                );


                setEditingQuantities(
                    (previous) => {

                        const copy = {
                            ...previous
                        };


                        delete copy[
                            item.id
                        ];


                        return copy;
                    }
                );


                await loadOrders();

                await loadOrderDetail(
                    selectedOrderId
                );


            } catch (error) {

                console.log(
                    "刪除餐點失敗：",
                    error
                );


                handleBackendError(
                    error,
                    "刪除訂單餐點失敗"
                );


            } finally {

                setDeletingItemId(
                    null
                );
            }
        };


    // ==================================================
    // 取消訂單
    // ==================================================
    const handleCancelOrder =
        async (order) => {

            setMessage("");
            setError("");


            if (
                order.status
                !== "OPEN"
            ) {

                setError(
                    "只有進行中的訂單可以取消"
                );

                return;
            }


            const confirmed =
                window.confirm(
                    `確定取消訂單 #${order.id}，${order.tableNumber} 號桌嗎？`
                );


            if (!confirmed) {

                return;
            }


            try {

                setCancellingOrderId(
                    order.id
                );


                await cancelOrder(
                    order.id
                );


                setMessage(
                    `訂單 #${order.id} 已取消`
                );


                await loadOrders();


                if (
                    Number(
                        selectedOrderId
                    )
                    === order.id
                ) {

                    await loadOrderDetail(
                        order.id
                    );
                }


            } catch (error) {

                console.log(
                    "取消訂單失敗：",
                    error
                );


                handleBackendError(
                    error,
                    "取消訂單失敗"
                );


            } finally {

                setCancellingOrderId(
                    null
                );
            }
        };


    // ==================================================
    // 結帳
    // ==================================================
    const handleCheckout =
        async () => {

            setMessage("");
            setError("");
            setPaymentResult(null);


            if (!selectedOrder) {

                setError(
                    "請先選擇訂單"
                );

                return;
            }


            if (
                selectedOrder.status
                !== "OPEN"
            ) {

                setError(
                    "只有進行中的訂單可以結帳"
                );

                return;
            }


            if (
                !selectedOrder.items ||
                selectedOrder.items.length
                === 0
            ) {

                setError(
                    "訂單沒有餐點，無法結帳"
                );

                return;
            }


            if (!paymentMethod) {

                setError(
                    "請選擇付款方式"
                );

                return;
            }


            const confirmed =
                window.confirm(

                    `確認結帳？\n\n`
                    +
                    `訂單：#${selectedOrder.id}\n`
                    +
                    `桌號：${selectedOrder.tableNumber} 號桌\n`
                    +
                    `金額：$${selectedOrder.totalAmount}\n`
                    +
                    `付款方式：${getPaymentMethodText(paymentMethod)}`
                );


            if (!confirmed) {

                return;
            }


            try {

                setCheckingOut(
                    true
                );


                const result =
                    await checkoutOrder(

                        selectedOrder.id,

                        paymentMethod
                    );


                setPaymentResult(
                    result
                );


                setMessage(
                    `訂單 #${selectedOrder.id} 結帳成功`
                );


                setPaymentMethod("");


                await loadOrders();

                await loadOrderDetail(
                    selectedOrder.id
                );


            } catch (error) {

                console.log(
                    "結帳失敗：",
                    error
                );


                console.log(
                    "HTTP Status：",
                    error.response?.status
                );


                console.log(
                    "後端 Response：",
                    error.response?.data
                );


                handleBackendError(
                    error,
                    "結帳失敗"
                );


            } finally {

                setCheckingOut(
                    false
                );
            }
        };


    // ==================================================
    // 清除點餐表單
    // ==================================================
    const resetItemForm = () => {

        setMenuItemId("");

        setQuantity(1);

        setSugarLevel("");

        setIceLevel("");

        setNote("");
    };


    // ==================================================
    // 關閉訂單
    // ==================================================
    const handleCloseDetail = () => {

        setSelectedOrder(
            null
        );

        setSelectedOrderId("");

        setPaymentMethod("");

        setPaymentResult(null);

        setEditingQuantities({});

        resetItemForm();
    };


    // ==================================================
    // 後端錯誤
    // ==================================================
    const handleBackendError = (
        error,
        defaultMessage
    ) => {

        const responseData =
            error.response?.data;


        if (
            responseData?.message
        ) {

            setError(
                responseData.message
            );

            return;
        }


        if (
            responseData &&
            typeof responseData
            === "object"
        ) {

            const messages =
                Object.values(
                    responseData
                )
                .filter(
                    (value) =>
                        typeof value
                        === "string"
                )
                .join("、");


            if (messages) {

                setError(
                    messages
                );

                return;
            }
        }


        setError(
            defaultMessage
        );
    };


    // ==================================================
    // 選中的餐點
    // ==================================================
    const selectedMenuItem =
        menuItems.find(
            (item) =>
                item.id ===
                Number(
                    menuItemId
                )
        );


    // ==================================================
    // 是否飲料
    // ==================================================
    const isDrink =
        selectedMenuItem
            ?.category
        === "DRINK";


    // ==================================================
    // 訂單分類
    // ==================================================
    const openOrders =
        orders
            .filter(
                (order) =>
                    order.status
                    === "OPEN"
            )
            .sort(
                (a, b) =>
                    b.id - a.id
            );


    const paidOrders =
        orders.filter(
            (order) =>
                order.status
                === "PAID"
        );


    const cancelledOrders =
        orders.filter(
            (order) =>
                order.status
                === "CANCELLED"
        );


    const historyOrders =
        orders
            .filter(
                (order) =>
                    order.status
                    !== "OPEN"
            )
            .filter(
                (order) => {

                    if (
                        historyFilter
                        === "ALL"
                    ) {

                        return true;
                    }


                    return (
                        order.status
                        === historyFilter
                    );
                }
            )
            .sort(
                (a, b) =>
                    b.id - a.id
            );


    // ==================================================
    // 訂單狀態中文
    // ==================================================
    const getStatusText =
        (status) => {

            switch (status) {

                case "OPEN":
                    return "用餐中";

                case "PAID":
                    return "已付款";

                case "CANCELLED":
                    return "已取消";

                default:
                    return status || "-";
            }
        };


    // ==================================================
    // 訂單狀態 CSS
    // ==================================================
    const getStatusClass =
        (status) => {

            switch (status) {

                case "OPEN":
                    return "bg-danger";

                case "PAID":
                    return "bg-primary";

                case "CANCELLED":
                    return "bg-secondary";

                default:
                    return "bg-secondary";
            }
        };


    // ==================================================
    // 菜單分類中文
    // ==================================================
    const getCategoryText =
        (category) => {

            switch (category) {

                case "FOOD":
                    return "餐點";

                case "DRINK":
                    return "飲料";

                case "DESSERT":
                    return "甜點";

                default:
                    return category;
            }
        };


    // ==================================================
    // 付款方式中文
    // ==================================================
    const getPaymentMethodText =
        (method) => {

            switch (method) {

                case "CASH":
                    return "現金";

                case "CREDIT_CARD":
                    return "信用卡";

                case "LINE_PAY":
                    return "LINE Pay";

                default:
                    return method || "-";
            }
        };


    // ==================================================
    // 日期
    // ==================================================
    const formatDateTime =
        (dateTime) => {

            if (!dateTime) {

                return "-";
            }


            return new Date(
                dateTime
            ).toLocaleString();
        };


    return (
        <>
            <Navbar />


            <div
                className="container-fluid px-4 mt-3 mb-5"
            >

                {/* ==================================================
                    標題
                ================================================== */}
                <div className="pos-page-header">

                    <div>

                        <h2 className="mb-0">
                            訂單管理
                        </h2>


                        <div className="pos-page-subtitle">
                            餐廳 POS 點餐與結帳
                        </div>

                    </div>


                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={
                            loadData
                        }
                    >
                        重新整理
                    </button>

                </div>


                {/* ==================================================
                    訊息
                ================================================== */}
                {message && (

                    <div
                        className="
                            alert
                            alert-success
                            py-2
                        "
                    >
                        {message}
                    </div>

                )}


                {error && (

                    <div
                        className="
                            alert
                            alert-danger
                            py-2
                        "
                    >
                        {error}
                    </div>

                )}


                {/* ==================================================
                    統計
                ================================================== */}
                <div
                    className="
                        row
                        g-3
                        mb-3
                    "
                >

                    <div className="col-md-4">

                        <div
                            className="
                                card
                                border-danger
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    card-body
                                    text-center
                                "
                            >

                                <div className="text-muted">
                                    用餐中訂單
                                </div>

                                <div
                                    className="
                                        fs-2
                                        fw-bold
                                        text-danger
                                    "
                                >
                                    {openOrders.length}
                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4">

                        <div
                            className="
                                card
                                border-primary
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    card-body
                                    text-center
                                "
                            >

                                <div className="text-muted">
                                    已付款訂單
                                </div>

                                <div
                                    className="
                                        fs-2
                                        fw-bold
                                        text-primary
                                    "
                                >
                                    {paidOrders.length}
                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4">

                        <div
                            className="
                                card
                                border-secondary
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    card-body
                                    text-center
                                "
                            >

                                <div className="text-muted">
                                    已取消訂單
                                </div>

                                <div
                                    className="
                                        fs-2
                                        fw-bold
                                        text-secondary
                                    "
                                >
                                    {
                                        cancelledOrders.length
                                    }
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    建立訂單
                ================================================== */}
                <div
                    className="
                        card
                        shadow-sm
                        mb-3
                    "
                >

                    <div className="card-body">

                        <h5>
                            建立新訂單
                        </h5>


                        <form
                            onSubmit={
                                handleCreateOrder
                            }
                        >

                            <div
                                className="
                                    row
                                    g-2
                                    align-items-end
                                "
                            >

                                <div className="col-md-4">

                                    <label className="form-label">
                                        桌號
                                    </label>


                                    <select
                                        className="form-select"
                                        value={
                                            tableNo
                                        }
                                        onChange={(e) =>
                                            setTableNo(
                                                e.target.value
                                            )
                                        }
                                        required
                                    >

                                        <option value="">
                                            請選擇桌號
                                        </option>


                                        {Array.from(
                                            {
                                                length: 20
                                            },
                                            (_, index) =>
                                                index + 1
                                        ).map(
                                            (number) => (

                                                <option
                                                    key={
                                                        number
                                                    }
                                                    value={
                                                        number
                                                    }
                                                >
                                                    {
                                                        number
                                                    }
                                                    號桌
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="col-md-2">

                                    <button
                                        type="submit"
                                        className="
                                            btn
                                            btn-success
                                            w-100
                                        "
                                        disabled={
                                            creating
                                        }
                                    >

                                        {
                                            creating
                                                ? "建立中..."
                                                : "建立訂單"
                                        }

                                    </button>

                                </div>

                            </div>

                        </form>

                    </div>

                </div>


                {/* ==================================================
                    用餐中訂單
                ================================================== */}
                <div
                    className="
                        card
                        shadow-sm
                        mb-3
                    "
                >

                    <div
                        className="
                            card-header
                            bg-danger
                            text-white
                        "
                    >
                        <strong>
                            用餐中訂單
                        </strong>
                    </div>


                    <div className="card-body">

                        {openOrders.length
                        === 0
                            ? (

                            <div
                                className="
                                    text-muted
                                    text-center
                                    py-3
                                "
                            >
                                目前沒有用餐中的訂單
                            </div>

                        ) : (

                            <div
                                className="
                                    row
                                    g-3
                                "
                            >

                                {openOrders.map(
                                    (order) => (

                                        <div
                                            key={
                                                order.id
                                            }
                                            className="
                                                col-md-6
                                                col-xl-3
                                            "
                                        >

                                            <div
                                                className={
                                                    selectedOrderId
                                                    === order.id
                                                        .toString()

                                                        ? "card border-primary border-3 h-100"

                                                        : "card border-danger h-100"
                                                }
                                            >

                                                <div className="card-body">

                                                    <div
                                                        className="
                                                            d-flex
                                                            justify-content-between
                                                            mb-2
                                                        "
                                                    >

                                                        <strong>
                                                            訂單 #
                                                            {
                                                                order.id
                                                            }
                                                        </strong>


                                                        <span
                                                            className="
                                                                badge
                                                                bg-danger
                                                            "
                                                        >
                                                            用餐中
                                                        </span>

                                                    </div>


                                                    <div
                                                        className="
                                                            fs-4
                                                            fw-bold
                                                            mb-2
                                                        "
                                                    >
                                                        {
                                                            order.tableNumber
                                                        }
                                                        號桌
                                                    </div>


                                                    <div>
                                                        金額：

                                                        <strong
                                                            className="
                                                                text-danger
                                                            "
                                                        >
                                                            $
                                                            {
                                                                order.totalAmount
                                                                ?? 0
                                                            }
                                                        </strong>
                                                    </div>


                                                    <div
                                                        className="
                                                            small
                                                            text-muted
                                                            mb-3
                                                        "
                                                    >
                                                        {
                                                            formatDateTime(
                                                                order.createdAt
                                                            )
                                                        }
                                                    </div>


                                                    <button
                                                        type="button"
                                                        className="
                                                            btn
                                                            btn-primary
                                                            w-100
                                                        "
                                                        onClick={() =>
                                                            handleSelectOrder(
                                                                order.id
                                                            )
                                                        }
                                                    >
                                                        點餐 / 查看
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* ==================================================
                    訂單明細 Loading
                ================================================== */}
                {detailLoading && (

                    <div
                        className="
                            alert
                            alert-info
                        "
                    >
                        訂單明細載入中...
                    </div>

                )}


                {/* ==================================================
                    選中的訂單
                ================================================== */}
                {!detailLoading &&
                selectedOrder && (

                    <div
                        className="
                            card
                            shadow
                            mb-4
                            border-primary
                        "
                    >

                        <div
                            className="
                                card-header
                                bg-primary
                                text-white
                                d-flex
                                justify-content-between
                                align-items-center
                            "
                        >

                            <strong>

                                訂單 #
                                {
                                    selectedOrder.id
                                }

                                {"　"}

                                {
                                    selectedOrder.tableNumber
                                }
                                號桌

                            </strong>


                            <button
                                type="button"
                                className="
                                    btn
                                    btn-light
                                    btn-sm
                                "
                                onClick={
                                    handleCloseDetail
                                }
                            >
                                關閉
                            </button>

                        </div>


                        <div className="card-body">

                            {/* ==================================================
                                基本資料
                            ================================================== */}
                            <div
                                className="
                                    row
                                    g-2
                                    mb-3
                                "
                            >

                                <div className="col-md-3">

                                    <strong>
                                        員工：
                                    </strong>

                                    {
                                        selectedOrder.employeeName
                                        ?? "-"
                                    }

                                </div>


                                <div className="col-md-3">

                                    <strong>
                                        狀態：
                                    </strong>

                                    <span
                                        className={
                                            `badge ${
                                                getStatusClass(
                                                    selectedOrder.status
                                                )
                                            }`
                                        }
                                    >
                                        {
                                            getStatusText(
                                                selectedOrder.status
                                            )
                                        }
                                    </span>

                                </div>


                                <div className="col-md-3">

                                    <strong>
                                        建立：
                                    </strong>

                                    {
                                        formatDateTime(
                                            selectedOrder.createdAt
                                        )
                                    }

                                </div>


                                <div
                                    className="
                                        col-md-3
                                        text-md-end
                                    "
                                >

                                    <strong>
                                        金額：
                                    </strong>

                                    <span
                                        className="
                                            fs-4
                                            fw-bold
                                            text-danger
                                        "
                                    >
                                        $
                                        {
                                            selectedOrder.totalAmount
                                            ?? 0
                                        }
                                    </span>

                                </div>

                            </div>


                            {/* ==================================================
                                OPEN 才能點餐
                            ================================================== */}
                            {selectedOrder.status
                            === "OPEN" && (

                                <div
                                    className="
                                        border
                                        rounded
                                        p-3
                                        mb-3
                                        bg-light
                                    "
                                >

                                    <h5>
                                        加入餐點
                                    </h5>


                                    <form
                                        onSubmit={
                                            handleAddItem
                                        }
                                    >

                                        <div
                                            className="
                                                row
                                                g-2
                                            "
                                        >

                                            {/* 餐點 */}
                                            <div className="col-md-5">

                                                <label className="form-label">
                                                    餐點
                                                </label>


                                                <select
                                                    className="form-select"
                                                    value={
                                                        menuItemId
                                                    }
                                                    onChange={
                                                        handleMenuItemChange
                                                    }
                                                    required
                                                >

                                                    <option value="">
                                                        請選擇餐點
                                                    </option>


                                                    {menuItems
                                                        .filter(
                                                            (item) =>
                                                                item.available
                                                                === true
                                                        )
                                                        .map(
                                                            (item) => (

                                                                <option
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    value={
                                                                        item.id
                                                                    }
                                                                >

                                                                    {
                                                                        getCategoryText(
                                                                            item.category
                                                                        )
                                                                    }

                                                                    {"｜"}

                                                                    {
                                                                        item.name
                                                                    }

                                                                    {"｜$"}

                                                                    {
                                                                        item.price
                                                                    }

                                                                </option>

                                                            )
                                                        )}

                                                </select>

                                            </div>


                                            {/* 數量 */}
                                            <div className="col-md-2">

                                                <label className="form-label">
                                                    數量
                                                </label>


                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="form-control"
                                                    value={
                                                        quantity
                                                    }
                                                    onChange={(e) =>
                                                        setQuantity(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>


                                            {/* 單價 */}
                                            <div className="col-md-2">

                                                <label className="form-label">
                                                    單價
                                                </label>


                                                <input
                                                    className="form-control"
                                                    value={
                                                        selectedMenuItem
                                                            ? `$${selectedMenuItem.price}`
                                                            : ""
                                                    }
                                                    readOnly
                                                />

                                            </div>


                                            {/* 小計 */}
                                            <div className="col-md-3">

                                                <label className="form-label">
                                                    小計預估
                                                </label>


                                                <input
                                                    className="form-control"
                                                    value={
                                                        selectedMenuItem
                                                            ? `${
                                                                "$"
                                                            }${
                                                                Number(
                                                                    selectedMenuItem.price
                                                                )
                                                                *
                                                                Number(
                                                                    quantity || 0
                                                                )
                                                            }`
                                                            : ""
                                                    }
                                                    readOnly
                                                />

                                            </div>


                                            {/* ==================================================
                                                飲料糖度
                                            ================================================== */}
                                            {isDrink && (

                                                <div
                                                    className="
                                                        col-md-6
                                                        mt-3
                                                    "
                                                >

                                                    <label
                                                        className="
                                                            form-label
                                                            fw-bold
                                                        "
                                                    >
                                                        糖度
                                                    </label>


                                                    <div
                                                        className="
                                                            d-flex
                                                            gap-2
                                                            flex-wrap
                                                        "
                                                    >

                                                        {[
                                                            "正常糖",
                                                            "少糖",
                                                            "半糖",
                                                            "微糖",
                                                            "無糖"
                                                        ].map(
                                                            (level) => (

                                                                <button
                                                                    key={
                                                                        level
                                                                    }
                                                                    type="button"
                                                                    className={
                                                                        sugarLevel
                                                                        === level
                                                                            ? "btn btn-primary btn-sm"
                                                                            : "btn btn-outline-primary btn-sm"
                                                                    }
                                                                    onClick={() =>
                                                                        setSugarLevel(
                                                                            level
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        level
                                                                    }
                                                                </button>

                                                            )
                                                        )}


                                                        <button
                                                            type="button"
                                                            className={
                                                                sugarLevel
                                                                === ""
                                                                    ? "btn btn-secondary btn-sm"
                                                                    : "btn btn-outline-secondary btn-sm"
                                                            }
                                                            onClick={() =>
                                                                setSugarLevel("")
                                                            }
                                                        >
                                                            不指定
                                                        </button>

                                                    </div>

                                                </div>

                                            )}


                                            {/* ==================================================
                                                飲料冰量
                                            ================================================== */}
                                            {isDrink && (

                                                <div
                                                    className="
                                                        col-md-6
                                                        mt-3
                                                    "
                                                >

                                                    <label
                                                        className="
                                                            form-label
                                                            fw-bold
                                                        "
                                                    >
                                                        冰量
                                                    </label>


                                                    <div
                                                        className="
                                                            d-flex
                                                            gap-2
                                                            flex-wrap
                                                        "
                                                    >

                                                        {[
                                                            "正常冰",
                                                            "少冰",
                                                            "微冰",
                                                            "去冰",
                                                            "熱"
                                                        ].map(
                                                            (level) => (

                                                                <button
                                                                    key={
                                                                        level
                                                                    }
                                                                    type="button"
                                                                    className={
                                                                        iceLevel
                                                                        === level
                                                                            ? "btn btn-info btn-sm"
                                                                            : "btn btn-outline-info btn-sm"
                                                                    }
                                                                    onClick={() =>
                                                                        setIceLevel(
                                                                            level
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        level
                                                                    }
                                                                </button>

                                                            )
                                                        )}


                                                        <button
                                                            type="button"
                                                            className={
                                                                iceLevel
                                                                === ""
                                                                    ? "btn btn-secondary btn-sm"
                                                                    : "btn btn-outline-secondary btn-sm"
                                                            }
                                                            onClick={() =>
                                                                setIceLevel("")
                                                            }
                                                        >
                                                            不指定
                                                        </button>

                                                    </div>

                                                </div>

                                            )}


                                            {/* 備註 */}
                                            <div
                                                className="
                                                    col-md-9
                                                    mt-3
                                                "
                                            >

                                                <label className="form-label">
                                                    備註
                                                </label>


                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    maxLength="255"
                                                    placeholder="例如：不要辣、醬料分開、不要吸管"
                                                    value={
                                                        note
                                                    }
                                                    onChange={(e) =>
                                                        setNote(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>


                                            <div
                                                className="
                                                    col-md-3
                                                    mt-3
                                                    d-flex
                                                    align-items-end
                                                "
                                            >

                                                <button
                                                    type="submit"
                                                    className="
                                                        btn
                                                        btn-success
                                                        w-100
                                                    "
                                                    disabled={
                                                        addingItem
                                                    }
                                                >

                                                    {
                                                        addingItem
                                                            ? "加入中..."
                                                            : "加入餐點"
                                                    }

                                                </button>

                                            </div>

                                        </div>

                                    </form>

                                </div>

                            )}


                            {/* ==================================================
                                餐點明細
                            ================================================== */}
                            <div className="table-responsive">

                                <table
                                    className="
                                        table
                                        table-bordered
                                        table-hover
                                        align-middle
                                    "
                                >

                                    <thead className="table-dark">

                                        <tr>

                                            <th>
                                                餐點
                                            </th>

                                            <th
                                                style={{
                                                    width:
                                                        "190px"
                                                }}
                                            >
                                                數量
                                            </th>

                                            <th>
                                                單價
                                            </th>

                                            <th>
                                                小計
                                            </th>

                                            <th>
                                                糖度
                                            </th>

                                            <th>
                                                冰量
                                            </th>

                                            <th>
                                                備註
                                            </th>

                                            <th>
                                                操作
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {!selectedOrder.items ||
                                        selectedOrder.items.length
                                        === 0
                                            ? (

                                            <tr>

                                                <td
                                                    colSpan="8"
                                                    className="
                                                        text-center
                                                        text-muted
                                                    "
                                                >
                                                    尚未加入餐點
                                                </td>

                                            </tr>

                                        ) : (

                                            selectedOrder.items.map(
                                                (item) => (

                                                    <tr
                                                        key={
                                                            item.id
                                                        }
                                                    >

                                                        <td className="fw-bold">
                                                            {
                                                                item.menuItemName
                                                            }
                                                        </td>


                                                        <td>

                                                            {selectedOrder.status
                                                            === "OPEN"
                                                                ? (

                                                                <div
                                                                    className="
                                                                        d-flex
                                                                        gap-1
                                                                        align-items-center
                                                                    "
                                                                >

                                                                    <button
                                                                        type="button"
                                                                        className="
                                                                            btn
                                                                            btn-outline-danger
                                                                            btn-sm
                                                                        "
                                                                        disabled={
                                                                            item.quantity
                                                                            <= 1
                                                                            ||
                                                                            updatingItemId
                                                                            === item.id
                                                                            ||
                                                                            deletingItemId
                                                                            === item.id
                                                                        }
                                                                        onClick={() =>
                                                                            handleUpdateQuantity(
                                                                                item.id,
                                                                                item.quantity - 1
                                                                            )
                                                                        }
                                                                    >
                                                                        -
                                                                    </button>


                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        className="
                                                                            form-control
                                                                            form-control-sm
                                                                            text-center
                                                                        "
                                                                        style={{
                                                                            width:
                                                                                "65px"
                                                                        }}
                                                                        value={
                                                                            editingQuantities[
                                                                                item.id
                                                                            ]
                                                                            ??
                                                                            item.quantity
                                                                        }
                                                                        disabled={
                                                                            updatingItemId
                                                                            === item.id
                                                                            ||
                                                                            deletingItemId
                                                                            === item.id
                                                                        }
                                                                        onChange={(e) => {

                                                                            setEditingQuantities(
                                                                                {
                                                                                    ...editingQuantities,

                                                                                    [item.id]:
                                                                                        e.target.value
                                                                                }
                                                                            );

                                                                        }}
                                                                        onBlur={(e) => {

                                                                            const value =
                                                                                Number(
                                                                                    e.target.value
                                                                                );


                                                                            if (
                                                                                !value
                                                                                ||
                                                                                value < 1
                                                                            ) {

                                                                                setEditingQuantities(
                                                                                    (
                                                                                        previous
                                                                                    ) => {

                                                                                        const copy = {
                                                                                            ...previous
                                                                                        };


                                                                                        delete copy[
                                                                                            item.id
                                                                                        ];


                                                                                        return copy;
                                                                                    }
                                                                                );

                                                                                return;
                                                                            }


                                                                            if (
                                                                                value
                                                                                !== item.quantity
                                                                            ) {

                                                                                handleUpdateQuantity(
                                                                                    item.id,
                                                                                    value
                                                                                );
                                                                            }


                                                                            setEditingQuantities(
                                                                                (
                                                                                    previous
                                                                                ) => {

                                                                                    const copy = {
                                                                                        ...previous
                                                                                    };


                                                                                    delete copy[
                                                                                        item.id
                                                                                    ];


                                                                                    return copy;
                                                                                }
                                                                            );

                                                                        }}
                                                                    />


                                                                    <button
                                                                        type="button"
                                                                        className="
                                                                            btn
                                                                            btn-outline-success
                                                                            btn-sm
                                                                        "
                                                                        disabled={
                                                                            updatingItemId
                                                                            === item.id
                                                                            ||
                                                                            deletingItemId
                                                                            === item.id
                                                                        }
                                                                        onClick={() =>
                                                                            handleUpdateQuantity(
                                                                                item.id,
                                                                                item.quantity + 1
                                                                            )
                                                                        }
                                                                    >
                                                                        +
                                                                    </button>

                                                                </div>

                                                            ) : (

                                                                item.quantity

                                                            )}

                                                        </td>


                                                        <td>
                                                            $
                                                            {
                                                                item.unitPrice
                                                            }
                                                        </td>


                                                        <td className="fw-bold">
                                                            $
                                                            {
                                                                item.subtotal
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                item.sugarLevel
                                                                || "-"
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                item.iceLevel
                                                                || "-"
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                item.note
                                                                || "-"
                                                            }
                                                        </td>


                                                        <td>

                                                            {selectedOrder.status
                                                            === "OPEN"
                                                                ? (

                                                                <button
                                                                    type="button"
                                                                    className="
                                                                        btn
                                                                        btn-outline-danger
                                                                        btn-sm
                                                                    "
                                                                    disabled={
                                                                        deletingItemId
                                                                        === item.id
                                                                        ||
                                                                        updatingItemId
                                                                        === item.id
                                                                    }
                                                                    onClick={() =>
                                                                        handleDeleteItem(
                                                                            item
                                                                        )
                                                                    }
                                                                >

                                                                    {
                                                                        deletingItemId
                                                                        === item.id
                                                                            ? "刪除中..."
                                                                            : "刪除"
                                                                    }

                                                                </button>

                                                            ) : (

                                                                <span className="text-muted">
                                                                    已鎖定
                                                                </span>

                                                            )}

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        )}

                                    </tbody>


                                    <tfoot>

                                        <tr className="table-light">

                                            <td
                                                colSpan="3"
                                                className="
                                                    text-end
                                                    fw-bold
                                                "
                                            >
                                                訂單總額
                                            </td>


                                            <td colSpan="5">

                                                <span
                                                    className="
                                                        fs-3
                                                        fw-bold
                                                        text-danger
                                                    "
                                                >
                                                    $
                                                    {
                                                        selectedOrder.totalAmount
                                                        ?? 0
                                                    }
                                                </span>

                                            </td>

                                        </tr>

                                    </tfoot>

                                </table>

                            </div>


                            {/* ==================================================
                                結帳區
                            ================================================== */}
                            {selectedOrder.status
                            === "OPEN" && (

                                <div
                                    className="
                                        border
                                        rounded
                                        p-3
                                        mt-3
                                    "
                                >

                                    <div
                                        className="
                                            row
                                            g-3
                                            align-items-end
                                        "
                                    >

                                        <div className="col-lg-7">

                                            <label
                                                className="
                                                    form-label
                                                    fw-bold
                                                "
                                            >
                                                付款方式
                                            </label>


                                            <div
                                                className="
                                                    d-flex
                                                    gap-2
                                                    flex-wrap
                                                "
                                            >

                                                <button
                                                    type="button"
                                                    className={
                                                        paymentMethod
                                                        === "CASH"
                                                            ? "btn btn-success"
                                                            : "btn btn-outline-success"
                                                    }
                                                    onClick={() =>
                                                        setPaymentMethod(
                                                            "CASH"
                                                        )
                                                    }
                                                >
                                                    現金
                                                </button>


                                                <button
                                                    type="button"
                                                    className={
                                                        paymentMethod
                                                        === "CREDIT_CARD"
                                                            ? "btn btn-primary"
                                                            : "btn btn-outline-primary"
                                                    }
                                                    onClick={() =>
                                                        setPaymentMethod(
                                                            "CREDIT_CARD"
                                                        )
                                                    }
                                                >
                                                    信用卡
                                                </button>


                                                <button
                                                    type="button"
                                                    className={
                                                        paymentMethod
                                                        === "LINE_PAY"
                                                            ? "btn btn-info"
                                                            : "btn btn-outline-info"
                                                    }
                                                    onClick={() =>
                                                        setPaymentMethod(
                                                            "LINE_PAY"
                                                        )
                                                    }
                                                >
                                                    LINE Pay
                                                </button>

                                            </div>

                                        </div>


                                        <div
                                            className="
                                                col-lg-5
                                                text-lg-end
                                            "
                                        >

                                            <div className="mb-2">

                                                應付：

                                                <span
                                                    className="
                                                        fs-2
                                                        fw-bold
                                                        text-danger
                                                    "
                                                >
                                                    $
                                                    {
                                                        selectedOrder.totalAmount
                                                        ?? 0
                                                    }
                                                </span>

                                            </div>


                                            <div
                                                className="
                                                    d-flex
                                                    gap-2
                                                    justify-content-lg-end
                                                "
                                            >

                                                <button
                                                    type="button"
                                                    className="
                                                        btn
                                                        btn-outline-danger
                                                    "
                                                    disabled={
                                                        cancellingOrderId
                                                        === selectedOrder.id
                                                    }
                                                    onClick={() =>
                                                        handleCancelOrder(
                                                            selectedOrder
                                                        )
                                                    }
                                                >

                                                    {
                                                        cancellingOrderId
                                                        === selectedOrder.id
                                                            ? "取消中..."
                                                            : "取消訂單"
                                                    }

                                                </button>


                                                <button
                                                    type="button"
                                                    className="
                                                        btn
                                                        btn-danger
                                                        btn-lg
                                                    "
                                                    disabled={
                                                        checkingOut
                                                        ||
                                                        !paymentMethod
                                                        ||
                                                        !selectedOrder.items
                                                        ||
                                                        selectedOrder.items
                                                            .length === 0
                                                    }
                                                    onClick={
                                                        handleCheckout
                                                    }
                                                >

                                                    {
                                                        checkingOut
                                                            ? "結帳中..."
                                                            : "確認結帳"
                                                    }

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* ==================================================
                                付款完成資訊
                            ================================================== */}
                            {paymentResult && (

                                <div
                                    className="
                                        alert
                                        alert-success
                                        mt-3
                                    "
                                >

                                    <strong>
                                        結帳完成
                                    </strong>

                                    {"　"}

                                    付款方式：

                                    {
                                        getPaymentMethodText(
                                            paymentResult.paymentMethod
                                        )
                                    }

                                    {"　"}

                                    金額：

                                    ${
                                        paymentResult.amount
                                    }

                                    {"　"}

                                    結帳時間：

                                    {
                                        formatDateTime(
                                            paymentResult.paidAt
                                        )
                                    }

                                </div>

                            )}

                        </div>

                    </div>

                )}


                {/* ==================================================
                    歷史訂單
                ================================================== */}
                <div
                    className="
                        card
                        shadow-sm
                    "
                >

                    <div
                        className="
                            card-header
                            d-flex
                            justify-content-between
                            align-items-center
                            flex-wrap
                            gap-2
                        "
                    >

                        <strong>
                            歷史訂單
                        </strong>


                        <div
                            className="
                                btn-group
                                btn-group-sm
                            "
                        >

                            <button
                                type="button"
                                className={
                                    historyFilter
                                    === "ALL"
                                        ? "btn btn-dark"
                                        : "btn btn-outline-dark"
                                }
                                onClick={() =>
                                    setHistoryFilter(
                                        "ALL"
                                    )
                                }
                            >
                                全部
                            </button>


                            <button
                                type="button"
                                className={
                                    historyFilter
                                    === "PAID"
                                        ? "btn btn-primary"
                                        : "btn btn-outline-primary"
                                }
                                onClick={() =>
                                    setHistoryFilter(
                                        "PAID"
                                    )
                                }
                            >
                                已付款
                            </button>


                            <button
                                type="button"
                                className={
                                    historyFilter
                                    === "CANCELLED"
                                        ? "btn btn-secondary"
                                        : "btn btn-outline-secondary"
                                }
                                onClick={() =>
                                    setHistoryFilter(
                                        "CANCELLED"
                                    )
                                }
                            >
                                已取消
                            </button>

                        </div>

                    </div>


                    <div className="table-responsive">

                        <table
                            className="
                                table
                                table-striped
                                table-hover
                                align-middle
                                mb-0
                            "
                        >

                            <thead className="table-dark">

                                <tr>

                                    <th>
                                        訂單
                                    </th>

                                    <th>
                                        桌號
                                    </th>

                                    <th>
                                        員工
                                    </th>

                                    <th>
                                        狀態
                                    </th>

                                    <th>
                                        金額
                                    </th>

                                    <th>
                                        建立時間
                                    </th>

                                    <th>
                                        操作
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading
                                    ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center"
                                        >
                                            載入中...
                                        </td>

                                    </tr>

                                ) : historyOrders.length
                                === 0
                                    ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="
                                                text-center
                                                text-muted
                                            "
                                        >
                                            沒有符合條件的歷史訂單
                                        </td>

                                    </tr>

                                ) : (

                                    historyOrders.map(
                                        (order) => (

                                            <tr
                                                key={
                                                    order.id
                                                }
                                            >

                                                <td>
                                                    #
                                                    {
                                                        order.id
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        order.tableNumber
                                                    }
                                                    號桌
                                                </td>


                                                <td>
                                                    {
                                                        order.employeeName
                                                        ?? "-"
                                                    }
                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            `badge ${
                                                                getStatusClass(
                                                                    order.status
                                                                )
                                                            }`
                                                        }
                                                    >
                                                        {
                                                            getStatusText(
                                                                order.status
                                                            )
                                                        }
                                                    </span>

                                                </td>


                                                <td className="fw-bold">
                                                    $
                                                    {
                                                        order.totalAmount
                                                        ?? 0
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        formatDateTime(
                                                            order.createdAt
                                                        )
                                                    }
                                                </td>


                                                <td>

                                                    <button
                                                        type="button"
                                                        className="
                                                            btn
                                                            btn-info
                                                            btn-sm
                                                        "
                                                        onClick={() =>
                                                            handleSelectOrder(
                                                                order.id
                                                            )
                                                        }
                                                    >
                                                        查看明細
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        </>
    );
}


export default OrderPage;