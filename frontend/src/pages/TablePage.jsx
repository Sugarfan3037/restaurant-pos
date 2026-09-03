import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
    getTables,
    openTable,
    getTableOrder,
    changeTable,
    mergeTable
} from "../services/tableService";

import { checkoutOrder } from "../services/paymentService";

function TablePage() {
    const navigate = useNavigate();

    const [tables, setTables] = useState([]);
    const [tableOrders, setTableOrders] = useState({});
    const [selectedTable, setSelectedTable] = useState(null);
    const [currentOrder, setCurrentOrder] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("");
    const [changeTargetTable, setChangeTargetTable] = useState("");
    const [mergeTargetTable, setMergeTargetTable] = useState("");

    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);
    const [openingTable, setOpeningTable] = useState(false);
    const [changingTable, setChangingTable] = useState(false);
    const [mergingTable, setMergingTable] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =========================
    // 後端錯誤處理
    // =========================
    const handleBackendError = (error, defaultMessage) => {
        const responseData = error.response?.data;

        if (responseData?.message) {
            setError(responseData.message);
            return;
        }

        if (responseData && typeof responseData === "object") {
            const messages = Object.values(responseData)
                .filter((value) => typeof value === "string")
                .join("、");

            if (messages) {
                setError(messages);
                return;
            }
        }

        setError(defaultMessage);
    };

    // =========================
    // 查全部桌位 + 用餐中訂單
    // =========================
    const loadTables = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getTables();
            const tableData = Array.isArray(data) ? data : [];

            setTables(tableData);

            const occupiedTables = tableData.filter(
                (table) => table.status === "OCCUPIED"
            );

            const orderMap = {};

            await Promise.all(
                occupiedTables.map(async (table) => {
                    try {
                        const order = await getTableOrder(table.tableNumber);
                        orderMap[table.tableNumber] = order;
                    } catch (error) {
                        console.log(
                            `${table.tableNumber}號桌訂單取得失敗：`,
                            error
                        );
                    }
                })
            );

            setTableOrders(orderMap);

        } catch (error) {
            console.log("取得桌位失敗：", error);
            console.log("HTTP Status：", error.response?.status);
            console.log("後端 Response：", error.response?.data);

            handleBackendError(
                error,
                "取得桌位資料失敗"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // 重新取得某桌訂單
    // =========================
    const loadCurrentOrder = async (tableNumber) => {
        try {
            setOrderLoading(true);

            const data = await getTableOrder(tableNumber);

            setCurrentOrder(data);

            setTableOrders((previous) => ({
                ...previous,
                [tableNumber]: data
            }));

            return data;

        } catch (error) {
            console.log("取得桌位訂單失敗：", error);

            handleBackendError(
                error,
                "取得桌位目前訂單失敗"
            );

            setCurrentOrder(null);

            return null;

        } finally {
            setOrderLoading(false);
        }
    };

    // =========================
    // 初始載入
    // =========================
    useEffect(() => {
        loadTables();
    }, []);

    // =========================
    // 點桌
    // =========================
    const handleTableClick = async (table) => {
        setSelectedTable(table);
        setCurrentOrder(null);
        setPaymentMethod("");
        setChangeTargetTable("");
        setMergeTargetTable("");
        setMessage("");
        setError("");

        if (table.status === "AVAILABLE") {
            return;
        }

        const cachedOrder =
            tableOrders[table.tableNumber];

        if (cachedOrder) {
            setCurrentOrder(cachedOrder);
            return;
        }

        await loadCurrentOrder(
            table.tableNumber
        );
    };

    // =========================
    // 開桌
    // =========================
    const handleOpenTable = async () => {
        if (!selectedTable) return;

        if (selectedTable.status !== "AVAILABLE") {
            setError("此桌目前不是空桌");
            return;
        }

        const confirmed = window.confirm(
            `確定開啟 ${selectedTable.tableNumber} 號桌嗎？`
        );

        if (!confirmed) return;

        try {
            setOpeningTable(true);
            setMessage("");
            setError("");

            const newOrder = await openTable(
                selectedTable.tableNumber
            );

            await loadTables();

            setCurrentOrder(newOrder);

            setTableOrders((previous) => ({
                ...previous,
                [selectedTable.tableNumber]: newOrder
            }));

            setSelectedTable((previous) => ({
                ...previous,
                status: "OCCUPIED"
            }));

            setMessage(
                `${selectedTable.tableNumber} 號桌開桌成功，可以開始點餐`
            );

        } catch (error) {
            console.log("開桌失敗：", error);

            handleBackendError(
                error,
                "開桌失敗"
            );

        } finally {
            setOpeningTable(false);
        }
    };

    // =========================
    // 前往點餐
    // =========================
    const handleGoToOrder = () => {
        if (!currentOrder) return;

        navigate(
            `/orders?orderId=${currentOrder.id}`
        );
    };

    // =========================
    // 換桌
    // =========================
    const handleChangeTable = async () => {
        if (!selectedTable || !currentOrder) {
            setError("請先選擇用餐中的桌位");
            return;
        }

        if (!changeTargetTable) {
            setError("請選擇換桌目的桌");
            return;
        }

        const source = selectedTable.tableNumber;
        const target = Number(changeTargetTable);

        if (source === target) {
            setError("來源桌與目的桌不可相同");
            return;
        }

        const targetTable = tables.find(
            (table) => table.tableNumber === target
        );

        if (!targetTable) {
            setError("找不到目的桌");
            return;
        }

        if (targetTable.status !== "AVAILABLE") {
            setError("換桌目的桌必須為空桌");
            return;
        }

        const confirmed = window.confirm(
            `確定將 ${source} 號桌換到 ${target} 號桌嗎？`
        );

        if (!confirmed) return;

        try {
            setChangingTable(true);
            setMessage("");
            setError("");

            await changeTable(
                source,
                target
            );

            await loadTables();

            const newOrder =
                await getTableOrder(target);

            setCurrentOrder(newOrder);

            setSelectedTable({
                ...targetTable,
                status: "OCCUPIED"
            });

            setChangeTargetTable("");
            setMergeTargetTable("");
            setPaymentMethod("");

            setMessage(
                `${source} 號桌已成功換到 ${target} 號桌`
            );

        } catch (error) {
            console.log("換桌失敗：", error);
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
                "換桌失敗"
            );

        } finally {
            setChangingTable(false);
        }
    };

    // =========================
    // 併桌
    // =========================
    const handleMergeTable = async () => {
        if (!selectedTable || !currentOrder) {
            setError("請先選擇來源桌");
            return;
        }

        if (!mergeTargetTable) {
            setError("請選擇併桌目的桌");
            return;
        }

        const source = selectedTable.tableNumber;
        const target = Number(mergeTargetTable);

        if (source === target) {
            setError("來源桌與目的桌不可相同");
            return;
        }

        const targetTable = tables.find(
            (table) => table.tableNumber === target
        );

        if (!targetTable) {
            setError("找不到目的桌");
            return;
        }

        let confirmText =
            `確定將 ${source} 號桌併入 ${target} 號桌嗎？`;

        if (targetTable.status === "OCCUPIED") {
            const targetOrder =
                tableOrders[target];

            confirmText +=
                `\n\n${target} 號桌目前正在用餐。`;

            if (targetOrder) {
                confirmText +=
                    `\n目的桌目前金額：$${targetOrder.totalAmount ?? 0}`;
            }

            confirmText +=
                "\n來源桌餐點與金額會合併進目的桌訂單。";
        } else {
            confirmText +=
                "\n\n目的桌目前為空桌，來源訂單會移至目的桌。";
        }

        const confirmed =
            window.confirm(confirmText);

        if (!confirmed) return;

        try {
            setMergingTable(true);
            setMessage("");
            setError("");

            await mergeTable(
                source,
                target
            );

            await loadTables();

            const mergedOrder =
                await getTableOrder(target);

            setCurrentOrder(
                mergedOrder
            );

            setSelectedTable({
                ...targetTable,
                status: "OCCUPIED"
            });

            setChangeTargetTable("");
            setMergeTargetTable("");
            setPaymentMethod("");

            setMessage(
                `${source} 號桌已成功併入 ${target} 號桌`
            );

        } catch (error) {
            console.log("併桌失敗：", error);
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
                "併桌失敗"
            );

        } finally {
            setMergingTable(false);
        }
    };

    // =========================
    // 結帳
    // =========================
    const handleCheckout = async () => {
        setMessage("");
        setError("");

        if (!currentOrder) {
            setError("找不到目前訂單");
            return;
        }

        if (currentOrder.status !== "OPEN") {
            setError("只有用餐中的訂單可以結帳");
            return;
        }

        if (
            !currentOrder.items ||
            currentOrder.items.length === 0
        ) {
            setError("此訂單沒有餐點，無法結帳");
            return;
        }

        if (!paymentMethod) {
            setError("請先選擇付款方式");
            return;
        }

        const confirmed = window.confirm(
            `確定結帳？\n\n`
            + `桌號：${selectedTable.tableNumber} 號桌\n`
            + `訂單：#${currentOrder.id}\n`
            + `金額：$${currentOrder.totalAmount}\n`
            + `付款方式：${getPaymentMethodText(paymentMethod)}`
        );

        if (!confirmed) return;

        try {
            setCheckingOut(true);

            const tableNumber =
                selectedTable.tableNumber;

            await checkoutOrder(
                currentOrder.id,
                paymentMethod
            );

            setCurrentOrder(null);
            setSelectedTable(null);
            setPaymentMethod("");
            setChangeTargetTable("");
            setMergeTargetTable("");

            await loadTables();

            setMessage(
                `${tableNumber} 號桌結帳成功，桌位已恢復空桌`
            );

        } catch (error) {
            console.log("結帳失敗：", error);

            handleBackendError(
                error,
                "結帳失敗"
            );

        } finally {
            setCheckingOut(false);
        }
    };

    // =========================
    // 關閉
    // =========================
    const handleCloseTable = () => {
        setSelectedTable(null);
        setCurrentOrder(null);
        setPaymentMethod("");
        setChangeTargetTable("");
        setMergeTargetTable("");
        setError("");
    };

    // =========================
    // 桌位分類
    // =========================
    const availableTables =
        tables.filter(
            (table) =>
                table.status === "AVAILABLE"
        );

    const occupiedTables =
        tables.filter(
            (table) =>
                table.status === "OCCUPIED"
        );

    const availableTargetTables =
        tables
            .filter(
                (table) =>
                    table.status === "AVAILABLE" &&
                    table.tableNumber !==
                    selectedTable?.tableNumber
            )
            .sort(
                (a, b) =>
                    a.tableNumber -
                    b.tableNumber
            );

    const mergeTargetTables =
        tables
            .filter(
                (table) =>
                    table.tableNumber !==
                    selectedTable?.tableNumber
            )
            .sort(
                (a, b) =>
                    a.tableNumber -
                    b.tableNumber
            );

    // =========================
    // 中文
    // =========================
    const getStatusText = (status) => {
        switch (status) {
            case "AVAILABLE":
                return "空桌";
            case "OCCUPIED":
                return "用餐中";
            default:
                return status || "-";
        }
    };

    const getBadgeClass = (status) => {
        switch (status) {
            case "AVAILABLE":
                return "bg-success";
            case "OCCUPIED":
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    };

    const getCardClass = (table) => {
        const selected =
            selectedTable?.id === table.id;

        if (selected) {
            return "card h-100 shadow border-primary border-3";
        }

        if (table.status === "AVAILABLE") {
            return "card h-100 shadow-sm border-success border-2";
        }

        if (table.status === "OCCUPIED") {
            return "card h-100 shadow-sm border-danger border-2";
        }

        return "card h-100 shadow-sm";
    };

    const getPaymentMethodText = (method) => {
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

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "-";

        return new Date(
            dateTime
        ).toLocaleString();
    };

    return (
        <>
            <Navbar />

            <div className="container-fluid px-4 mt-3 mb-5">

                {/* 標題 */}
                <div className="pos-page-header">
                    <div>
                        <h2 className="mb-0">
                            桌位管理
                        </h2>

                        <div className="pos-page-subtitle">
                            開桌、點餐、換桌、併桌與結帳
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={loadTables}
                        disabled={loading}
                    >
                        {loading
                            ? "整理中..."
                            : "重新整理"}
                    </button>
                </div>

                {message && (
                    <div className="alert alert-success py-2">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger py-2">
                        {error}
                    </div>
                )}

                {/* 統計 */}
                <div className="row g-2 mb-3">
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-body text-center py-3">
                                <div className="text-muted">
                                    總桌數
                                </div>

                                <div className="fs-2 fw-bold">
                                    {tables.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm border-success">
                            <div className="card-body text-center py-3">
                                <div className="text-muted">
                                    空桌
                                </div>

                                <div className="fs-2 fw-bold text-success">
                                    {availableTables.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm border-danger">
                            <div className="card-body text-center py-3">
                                <div className="text-muted">
                                    用餐中
                                </div>

                                <div className="fs-2 fw-bold text-danger">
                                    {occupiedTables.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 桌位列表 */}
                {loading ? (
                    <div className="alert alert-info">
                        桌位資料載入中...
                    </div>
                ) : tables.length === 0 ? (
                    <div className="alert alert-warning">
                        目前沒有桌位資料
                    </div>
                ) : (
                    <div className="row g-3 mb-4">
                        {[...tables]
                            .sort(
                                (a, b) =>
                                    a.tableNumber -
                                    b.tableNumber
                            )
                            .map((table) => {
                                const order =
                                    tableOrders[
                                        table.tableNumber
                                    ];

                                return (
                                    <div
                                        key={table.id}
                                        className="col-6 col-md-4 col-lg-3 col-xl-2"
                                    >
                                        <div
                                            className={
                                                getCardClass(table)
                                            }
                                            role="button"
                                            style={{
                                                cursor: "pointer"
                                            }}
                                            onClick={() =>
                                                handleTableClick(table)
                                            }
                                        >
                                            <div className="card-body text-center">
                                                <div className="fs-3 fw-bold mb-2">
                                                    {table.tableNumber}
                                                    號桌
                                                </div>

                                                <span
                                                    className={`badge ${getBadgeClass(
                                                        table.status
                                                    )}`}
                                                >
                                                    {getStatusText(
                                                        table.status
                                                    )}
                                                </span>

                                                <div className="text-muted mt-2">
                                                    容納：
                                                    <strong>
                                                        {table.capacity ?? "-"}
                                                        人
                                                    </strong>
                                                </div>

                                                {table.status === "OCCUPIED" && (
                                                    <div className="mt-2">
                                                        <div className="small text-muted">
                                                            目前消費
                                                        </div>

                                                        <div className="fs-4 fw-bold text-danger">
                                                            $
                                                            {order?.totalAmount ?? 0}
                                                        </div>
                                                    </div>
                                                )}

                                                <div
                                                    className={
                                                        table.status === "AVAILABLE"
                                                            ? "text-success fw-bold mt-2"
                                                            : "text-danger fw-bold mt-2"
                                                    }
                                                >
                                                    {table.status === "AVAILABLE"
                                                        ? "點擊開桌"
                                                        : "點擊查看 / 操作"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}

                {/* 選中桌位 */}
                {selectedTable && (
                    <div className="card shadow border-primary">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <strong>
                                {selectedTable.tableNumber}
                                號桌
                            </strong>

                            <button
                                type="button"
                                className="btn btn-light btn-sm"
                                onClick={handleCloseTable}
                            >
                                關閉
                            </button>
                        </div>

                        <div className="card-body">

                            <div className="row g-2 mb-3">
                                <div className="col-md-4">
                                    <strong>桌號：</strong>
                                    {selectedTable.tableNumber}
                                    號桌
                                </div>

                                <div className="col-md-4">
                                    <strong>容納：</strong>
                                    {selectedTable.capacity ?? "-"}
                                    人
                                </div>

                                <div className="col-md-4">
                                    <strong>狀態：</strong>{" "}
                                    <span
                                        className={`badge ${getBadgeClass(
                                            selectedTable.status
                                        )}`}
                                    >
                                        {getStatusText(
                                            selectedTable.status
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* 空桌 */}
                            {selectedTable.status === "AVAILABLE" && (
                                <div className="border rounded p-4 text-center">
                                    <div className="fs-4 fw-bold text-success mb-2">
                                        此桌目前為空桌
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-success btn-lg"
                                        disabled={openingTable}
                                        onClick={handleOpenTable}
                                    >
                                        {openingTable
                                            ? "開桌中..."
                                            : "直接開桌"}
                                    </button>
                                </div>
                            )}

                            {/* 用餐中 */}
                            {selectedTable.status === "OCCUPIED" && (
                                <>
                                    {orderLoading ? (
                                        <div className="alert alert-info">
                                            訂單資料載入中...
                                        </div>
                                    ) : currentOrder ? (
                                        <>
                                            <hr />

                                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                                                <div>
                                                    <h5 className="mb-0">
                                                        訂單 #{currentOrder.id}
                                                    </h5>

                                                    <small className="text-muted">
                                                        建立時間：
                                                        {formatDateTime(
                                                            currentOrder.createdAt
                                                        )}
                                                    </small>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={handleGoToOrder}
                                                >
                                                    點餐 / 加點
                                                </button>
                                            </div>

                                            {/* 明細 */}
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-hover table-sm align-middle mb-0">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th>餐點</th>
                                                            <th>數量</th>
                                                            <th>單價</th>
                                                            <th>小計</th>
                                                            <th>糖度</th>
                                                            <th>冰量</th>
                                                            <th>備註</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {!currentOrder.items ||
                                                        currentOrder.items.length === 0 ? (
                                                            <tr>
                                                                <td
                                                                    colSpan="7"
                                                                    className="text-center text-muted"
                                                                >
                                                                    尚未點餐
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            currentOrder.items.map(
                                                                (item) => (
                                                                    <tr key={item.id}>
                                                                        <td>
                                                                            {item.menuItemName}
                                                                        </td>
                                                                        <td>
                                                                            {item.quantity}
                                                                        </td>
                                                                        <td>
                                                                            ${item.unitPrice}
                                                                        </td>
                                                                        <td className="fw-bold">
                                                                            ${item.subtotal}
                                                                        </td>
                                                                        <td>
                                                                            {item.sugarLevel || "-"}
                                                                        </td>
                                                                        <td>
                                                                            {item.iceLevel || "-"}
                                                                        </td>
                                                                        <td>
                                                                            {item.note || "-"}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* 金額 */}
                                            <div className="text-end mb-3">
                                                <span className="me-2">
                                                    訂單總額：
                                                </span>

                                                <span className="fs-2 fw-bold text-danger">
                                                    $
                                                    {currentOrder.totalAmount ?? 0}
                                                </span>
                                            </div>

                                            {/* 換桌 + 併桌 */}
                                            <div className="row g-3 mb-3">
                                                <div className="col-lg-6">
                                                    <div className="border rounded p-3 h-100">
                                                        <h6 className="fw-bold">
                                                            換桌
                                                        </h6>

                                                        <div className="input-group">
                                                            <select
                                                                className="form-select"
                                                                value={
                                                                    changeTargetTable
                                                                }
                                                                onChange={(e) =>
                                                                    setChangeTargetTable(
                                                                        e.target.value
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    選擇空桌
                                                                </option>

                                                                {availableTargetTables.map(
                                                                    (table) => (
                                                                        <option
                                                                            key={table.id}
                                                                            value={table.tableNumber}
                                                                        >
                                                                            {table.tableNumber}
                                                                            號桌
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>

                                                            <button
                                                                type="button"
                                                                className="btn btn-warning"
                                                                disabled={
                                                                    changingTable ||
                                                                    !changeTargetTable
                                                                }
                                                                onClick={
                                                                    handleChangeTable
                                                                }
                                                            >
                                                                {changingTable
                                                                    ? "處理中..."
                                                                    : "換桌"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-6">
                                                    <div className="border rounded p-3 h-100">
                                                        <h6 className="fw-bold">
                                                            併桌
                                                        </h6>

                                                        <div className="input-group">
                                                            <select
                                                                className="form-select"
                                                                value={
                                                                    mergeTargetTable
                                                                }
                                                                onChange={(e) =>
                                                                    setMergeTargetTable(
                                                                        e.target.value
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    選擇目的桌
                                                                </option>

                                                                {mergeTargetTables.map(
                                                                    (table) => (
                                                                        <option
                                                                            key={table.id}
                                                                            value={table.tableNumber}
                                                                        >
                                                                            {table.tableNumber}
                                                                            號桌
                                                                            {"｜"}
                                                                            {getStatusText(
                                                                                table.status
                                                                            )}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>

                                                            <button
                                                                type="button"
                                                                className="btn btn-dark"
                                                                disabled={
                                                                    mergingTable ||
                                                                    !mergeTargetTable
                                                                }
                                                                onClick={
                                                                    handleMergeTable
                                                                }
                                                            >
                                                                {mergingTable
                                                                    ? "處理中..."
                                                                    : "併桌"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 結帳 */}
                                            <div className="border rounded p-3">
                                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                                                    <h5 className="mb-0">
                                                        結帳
                                                    </h5>

                                                    <div>
                                                        應付：
                                                        <span className="fs-2 fw-bold text-danger">
                                                            $
                                                            {currentOrder.totalAmount ?? 0}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-2 flex-wrap mb-3">
                                                    <button
                                                        type="button"
                                                        className={
                                                            paymentMethod === "CASH"
                                                                ? "btn btn-success"
                                                                : "btn btn-outline-success"
                                                        }
                                                        onClick={() =>
                                                            setPaymentMethod("CASH")
                                                        }
                                                    >
                                                        現金
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={
                                                            paymentMethod === "CREDIT_CARD"
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
                                                            paymentMethod === "LINE_PAY"
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

                                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                                    <div>
                                                        付款方式：
                                                        <strong>
                                                            {paymentMethod
                                                                ? getPaymentMethodText(
                                                                    paymentMethod
                                                                )
                                                                : "尚未選擇"}
                                                        </strong>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-lg"
                                                        disabled={
                                                            checkingOut ||
                                                            !paymentMethod ||
                                                            !currentOrder.items ||
                                                            currentOrder.items.length === 0
                                                        }
                                                        onClick={
                                                            handleCheckout
                                                        }
                                                    >
                                                        {checkingOut
                                                            ? "結帳中..."
                                                            : "確認結帳"}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="alert alert-warning">
                                            找不到目前訂單
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default TablePage;