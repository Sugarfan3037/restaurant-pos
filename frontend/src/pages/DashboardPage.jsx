import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import { getOrders } from "../services/orderService";
import { getTables } from "../services/tableService";
import { getTodayRevenue } from "../services/revenueService";
import { getCurrentRole, getCurrentUser } from "../utils/authUtils";

function DashboardPage() {
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [todayRevenue, setTodayRevenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const role = getCurrentRole();
    const user = getCurrentUser();
    const isAdmin = role === "ADMIN";

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            // 所有人都能查
            const [orderData, tableData] = await Promise.all([
                getOrders(),
                getTables()
            ]);

            setOrders(Array.isArray(orderData) ? orderData : []);
            setTables(Array.isArray(tableData) ? tableData : []);

            // 營收只有 ADMIN 查
            if (isAdmin) {
                try {
                    const revenueData = await getTodayRevenue();
                    setTodayRevenue(revenueData);
                } catch (error) {
                    console.log("今日營收取得失敗：", error);
                    setTodayRevenue(null);
                }
            }

        } catch (error) {
            console.log("Dashboard載入失敗：", error);
            setError(
                error.response?.data?.message
                || "首頁資料載入失敗"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // 訂單統計
    // =========================
    const openOrders = orders.filter(
        (order) => order.status === "OPEN"
    );

    const paidOrders = orders.filter(
        (order) => order.status === "PAID"
    );

    const cancelledOrders = orders.filter(
        (order) => order.status === "CANCELLED"
    );

    // =========================
    // 桌位統計
    // =========================
    const occupiedTables = tables.filter(
        (table) => table.status === "OCCUPIED"
    );

    const availableTables = tables.filter(
        (table) => table.status === "AVAILABLE"
    );

    // =========================
    // 金額格式
    // =========================
    const formatMoney = (amount) => {
        return Number(amount ?? 0).toLocaleString("zh-TW", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    };

    // =========================
    // 今日時間
    // =========================
    const getTodayText = () => {
        return new Date().toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "short"
        });
    };

    // =========================
    // 角色文字
    // =========================
    const getRoleText = () => {
        if (role === "ADMIN") return "管理員";
        if (role === "STAFF") return "員工";
        return "使用者";
    };

    return (
        <>
            <Navbar />

            <div className="container-fluid px-4 mt-3 mb-5">

                {/* 標題 */}
                <div className="pos-page-header">
                    <div>
                        <h2 className="mb-0">
                            POS 系統首頁
                        </h2>

                        <div className="pos-page-subtitle">
                            {getTodayText()}　
                            {user?.sub ?? "使用者"}　
                            <span
                                className={
                                    role === "ADMIN"
                                    ? "badge bg-danger"
                                    : "badge bg-primary"
                                }
                            >
                                {getRoleText()}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={loadDashboard}
                        disabled={loading}
                    >
                        {loading ? "整理中..." : "重新整理"}
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 mb-3">
                        {error}
                    </div>
                )}

                {/* =========================
                    主要統計
                ========================= */}
                <div className="row g-2 mb-3">

                    {/* 用餐中 */}
                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm h-100 border-primary">
                            <div className="card-body py-2 px-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <small className="text-muted">
                                            用餐中訂單
                                        </small>

                                        <div className="fs-3 fw-bold text-primary">
                                            {openOrders.length}
                                        </div>
                                    </div>

                                    <span className="fs-2">
                                        🍽️
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 使用桌位 */}
                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm h-100 border-warning">
                            <div className="card-body py-2 px-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <small className="text-muted">
                                            使用中桌位
                                        </small>

                                        <div className="fs-3 fw-bold text-warning">
                                            {occupiedTables.length}
                                        </div>

                                        <small className="text-muted">
                                            / {tables.length || 20} 桌
                                        </small>
                                    </div>

                                    <span className="fs-2">
                                        🪑
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 已付款 */}
                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm h-100 border-success">
                            <div className="card-body py-2 px-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <small className="text-muted">
                                            已付款訂單
                                        </small>

                                        <div className="fs-3 fw-bold text-success">
                                            {paidOrders.length}
                                        </div>
                                    </div>

                                    <span className="fs-2">
                                        💰
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 今日營收 */}
                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm h-100 border-danger">
                            <div className="card-body py-2 px-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <small className="text-muted">
                                            {isAdmin
                                                ? "今日營收"
                                                : "可用桌位"}
                                        </small>

                                        <div className="fs-3 fw-bold text-danger">
                                            {isAdmin
                                                ? `$${formatMoney(
                                                    todayRevenue?.totalRevenue
                                                )}`
                                                : availableTables.length}
                                        </div>
                                    </div>

                                    <span className="fs-2">
                                        {isAdmin ? "📊" : "✅"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="row g-3">

                    {/* =========================
                        左：快速操作
                    ========================= */}
                    <div className="col-lg-7">

                        <div className="card shadow-sm mb-3">
                            <div className="card-header bg-dark text-white py-2">
                                <strong>快速操作</strong>
                            </div>

                            <div className="card-body py-3">

                                <div className="row g-2">

                                    <div className="col-6 col-md-4">
                                        <Link
                                            to="/orders"
                                            className="btn btn-primary w-100 py-3"
                                        >
                                            <div className="fs-4">
                                                🍽️
                                            </div>
                                            <strong>建立 / 查看訂單</strong>
                                        </Link>
                                    </div>

                                    <div className="col-6 col-md-4">
                                        <Link
                                            to="/tables"
                                            className="btn btn-warning w-100 py-3"
                                        >
                                            <div className="fs-4">
                                                🪑
                                            </div>
                                            <strong>桌位管理</strong>
                                        </Link>
                                    </div>

                                    <div className="col-6 col-md-4">
                                        <Link
                                            to="/menu"
                                            className="btn btn-info w-100 py-3"
                                        >
                                            <div className="fs-4">
                                                📋
                                            </div>
                                            <strong>查看菜單</strong>
                                        </Link>
                                    </div>

                                    {isAdmin && (
                                        <>
                                            <div className="col-6 col-md-4">
                                                <Link
                                                    to="/employees"
                                                    className="btn btn-secondary w-100 py-3"
                                                >
                                                    <div className="fs-4">
                                                        👤
                                                    </div>
                                                    <strong>員工管理</strong>
                                                </Link>
                                            </div>

                                            <div className="col-6 col-md-4">
                                                <Link
                                                    to="/revenue"
                                                    className="btn btn-success w-100 py-3"
                                                >
                                                    <div className="fs-4">
                                                        📈
                                                    </div>
                                                    <strong>營收管理</strong>
                                                </Link>
                                            </div>

                                            <div className="col-6 col-md-4">
                                                <Link
                                                    to="/revenue"
                                                    className="btn btn-outline-dark w-100 py-3"
                                                >
                                                    <div className="fs-4">
                                                        🧾
                                                    </div>
                                                    <strong>日結管理</strong>
                                                </Link>
                                            </div>
                                        </>
                                    )}

                                </div>

                            </div>
                        </div>

                        {/* =========================
                            目前用餐中
                        ========================= */}
                        <div className="card shadow-sm">

                            <div className="card-header bg-primary text-white py-2 d-flex justify-content-between">
                                <strong>目前用餐中訂單</strong>

                                <span>
                                    {openOrders.length} 筆
                                </span>
                            </div>

                            <div className="card-body p-0">

                                {loading ? (
                                    <div className="text-center py-4">
                                        載入中...
                                    </div>
                                ) : openOrders.length === 0 ? (
                                    <div className="text-center text-muted py-4">
                                        目前沒有用餐中訂單
                                    </div>
                                ) : (
                                    <div className="table-responsive">

                                        <table className="table table-hover table-sm mb-0 align-middle">

                                            <thead className="table-light">
                                                <tr>
                                                    <th>訂單</th>
                                                    <th>桌號</th>
                                                    <th>員工</th>
                                                    <th className="text-end">
                                                        金額
                                                    </th>
                                                    <th className="text-center">
                                                        操作
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {openOrders
                                                    .slice(0, 8)
                                                    .map((order) => (

                                                        <tr key={order.id}>

                                                            <td>
                                                                #{order.id}
                                                            </td>

                                                            <td>
                                                                <span className="badge bg-warning text-dark">
                                                                    {order.tableNumber}桌
                                                                </span>
                                                            </td>

                                                            <td>
                                                                {order.employeeName ?? "-"}
                                                            </td>

                                                            <td className="text-end fw-bold">
                                                                ${formatMoney(
                                                                    order.totalAmount
                                                                )}
                                                            </td>

                                                            <td className="text-center">
                                                                <Link
                                                                    to={`/orders?orderId=${order.id}`}
                                                                    className="btn btn-outline-primary btn-sm"
                                                                >
                                                                    查看
                                                                </Link>
                                                            </td>

                                                        </tr>
                                                    ))}

                                            </tbody>

                                        </table>

                                    </div>
                                )}

                            </div>

                            {openOrders.length > 8 && (
                                <div className="card-footer py-2 text-end">
                                    <Link
                                        to="/orders"
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        查看全部
                                    </Link>
                                </div>
                            )}

                        </div>

                    </div>

                    {/* =========================
                        右：桌位 + 今日狀況
                    ========================= */}
                    <div className="col-lg-5">

                        {/* 桌位狀況 */}
                        <div className="card shadow-sm mb-3">

                            <div className="card-header bg-warning py-2 d-flex justify-content-between">
                                <strong>桌位使用狀況</strong>

                                <span>
                                    {occupiedTables.length}/{tables.length || 20}
                                </span>
                            </div>

                            <div className="card-body py-3">

                                <div className="row g-1">

                                    {tables.length === 0 ? (
                                        <div className="text-center text-muted py-3">
                                            尚無桌位資料
                                        </div>
                                    ) : (
                                        tables
                                            .slice()
                                            .sort(
                                                (a, b) =>
                                                    Number(a.tableNumber)
                                                    - Number(b.tableNumber)
                                            )
                                            .map((table) => (

                                                <div
                                                    className="col-3"
                                                    key={table.id ?? table.tableNumber}
                                                >
                                                    <Link
                                                        to="/tables"
                                                        className={
                                                            table.status === "OCCUPIED"
                                                                ? "btn btn-danger btn-sm w-100"
                                                                : "btn btn-outline-success btn-sm w-100"
                                                        }
                                                    >
                                                        {table.tableNumber}桌
                                                    </Link>
                                                </div>

                                            ))
                                    )}

                                </div>

                                <div className="d-flex gap-3 mt-2 small">
                                    <span>
                                        <span className="badge bg-danger">
                                            使用中
                                        </span>
                                        {" "}
                                        {occupiedTables.length}
                                    </span>

                                    <span>
                                        <span className="badge bg-success">
                                            空桌
                                        </span>
                                        {" "}
                                        {availableTables.length}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* 今日訂單 */}
                        <div className="card shadow-sm mb-3">

                            <div className="card-header bg-secondary text-white py-2">
                                <strong>訂單狀況</strong>
                            </div>

                            <div className="card-body py-2">

                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span>全部訂單</span>
                                    <strong>
                                        {orders.length}
                                    </strong>
                                </div>

                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span>用餐中</span>
                                    <strong className="text-primary">
                                        {openOrders.length}
                                    </strong>
                                </div>

                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span>已付款</span>
                                    <strong className="text-success">
                                        {paidOrders.length}
                                    </strong>
                                </div>

                                <div className="d-flex justify-content-between py-2">
                                    <span>已取消</span>
                                    <strong className="text-danger">
                                        {cancelledOrders.length}
                                    </strong>
                                </div>

                            </div>
                        </div>

                        {/* ADMIN 營收 */}
                        {isAdmin && (
                            <div className="card shadow-sm">

                                <div className="card-header bg-success text-white py-2">
                                    <strong>今日營收摘要</strong>
                                </div>

                                <div className="card-body py-2">

                                    <div className="d-flex justify-content-between border-bottom py-2">
                                        <span>今日營收</span>

                                        <strong className="text-success">
                                            ${formatMoney(
                                                todayRevenue?.totalRevenue
                                            )}
                                        </strong>
                                    </div>

                                    <div className="d-flex justify-content-between border-bottom py-2">
                                        <span>付款訂單</span>

                                        <strong>
                                            {todayRevenue?.totalOrders ?? 0} 筆
                                        </strong>
                                    </div>

                                    <div className="d-flex justify-content-between py-2">
                                        <span>平均客單</span>

                                        <strong>
                                            ${formatMoney(
                                                todayRevenue?.totalOrders > 0
                                                    ? Number(
                                                        todayRevenue.totalRevenue
                                                        ?? 0
                                                    )
                                                    / Number(
                                                        todayRevenue.totalOrders
                                                    )
                                                    : 0
                                            )}
                                        </strong>
                                    </div>

                                    <Link
                                        to="/revenue"
                                        className="btn btn-success btn-sm w-100 mt-1"
                                    >
                                        進入營收管理
                                    </Link>

                                </div>
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </>
    );
}

export default DashboardPage;