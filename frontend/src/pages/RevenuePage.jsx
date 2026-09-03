import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import {
    getTodayRevenue,
    getDailyRevenue,
    getMonthlyRevenue
} from "../services/revenueService";

import {
    closeDay,
    getDailyClosing
} from "../services/dailyClosingService";

function RevenuePage() {
    const [todayRevenue, setTodayRevenue] = useState(null);
    const [dailyRevenue, setDailyRevenue] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState(null);
    const [closingResult, setClosingResult] = useState(null);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [closingDate, setClosingDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [dailyLoading, setDailyLoading] = useState(false);
    const [monthlyLoading, setMonthlyLoading] = useState(false);
    const [closingLoading, setClosingLoading] = useState(false);
    const [closingSearchLoading, setClosingSearchLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =========================
    // 日期工具
    // =========================
    const getTodayString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getCurrentMonthString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}`;
    };

    // =========================
    // 初始載入
    // =========================
    useEffect(() => {
        const today = getTodayString();
        const month = getCurrentMonthString();

        setSelectedDate(today);
        setSelectedMonth(month);
        setClosingDate(today);

        loadTodayRevenue();
    }, []);

    // =========================
    // 今日營收
    // =========================
    const loadTodayRevenue = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getTodayRevenue();

            setTodayRevenue(data);

        } catch (error) {
            console.log("取得今日營收失敗：", error);
            handleBackendError(error, "取得今日營收失敗");

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // 指定日期營收
    // =========================
    const handleSearchDaily = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setDailyRevenue(null);

        if (!selectedDate) {
            setError("請選擇查詢日期");
            return;
        }

        try {
            setDailyLoading(true);

            const data = await getDailyRevenue(selectedDate);

            setDailyRevenue(data);

        } catch (error) {
            console.log("日期營收查詢失敗：", error);
            handleBackendError(error, "日期營收查詢失敗");

        } finally {
            setDailyLoading(false);
        }
    };

    // =========================
    // 月營收
    // =========================
    const handleSearchMonthly = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setMonthlyRevenue(null);

        if (!selectedMonth) {
            setError("請選擇查詢月份");
            return;
        }

        try {
            setMonthlyLoading(true);

            const data = await getMonthlyRevenue(selectedMonth);

            setMonthlyRevenue(data);

        } catch (error) {
            console.log("月營收查詢失敗：", error);
            handleBackendError(error, "月營收查詢失敗");

        } finally {
            setMonthlyLoading(false);
        }
    };

    // =========================
    // 執行日結
    // =========================
    const handleCloseDay = async () => {
        setMessage("");
        setError("");

        if (!closingDate) {
            setError("請選擇日結日期");
            return;
        }

        const today = getTodayString();

        if (closingDate > today) {
            setError("不可對未來日期執行日結");
            return;
        }

        const confirmed = window.confirm(
            `確定執行日結？\n\n`
            + `日結日期：${closingDate}\n\n`
            + `日結完成後會建立當日正式營收紀錄。`
        );

        if (!confirmed) return;

        try {
            setClosingLoading(true);
            setClosingResult(null);

            const data = await closeDay(closingDate);

            setClosingResult(data);

            setMessage(`${closingDate} 日結完成`);

            // 如果是今天，順便重新整理今日營收
            if (closingDate === today) {
                await loadTodayRevenue();
            }

        } catch (error) {
            console.log("日結失敗：", error);
            console.log("Status：", error.response?.status);
            console.log("Data：", error.response?.data);

            handleBackendError(error, "日結失敗");

        } finally {
            setClosingLoading(false);
        }
    };

    // =========================
    // 查詢日結紀錄
    // =========================
    const handleSearchClosing = async () => {
        setMessage("");
        setError("");
        setClosingResult(null);

        if (!closingDate) {
            setError("請選擇日結日期");
            return;
        }

        try {
            setClosingSearchLoading(true);

            const data = await getDailyClosing(closingDate);

            setClosingResult(data);

        } catch (error) {
            console.log("查詢日結紀錄失敗：", error);

            handleBackendError(
                error,
                "找不到此日期的日結紀錄"
            );

        } finally {
            setClosingSearchLoading(false);
        }
    };

    // =========================
    // 後端錯誤處理
    // =========================
    const handleBackendError = (error, defaultMessage) => {
        const data = error.response?.data;

        if (data?.message) {
            setError(data.message);
            return;
        }

        if (data && typeof data === "object") {
            const messages = Object.values(data)
                .filter((value) => typeof value === "string")
                .join("、");

            if (messages) {
                setError(messages);
                return;
            }
        }

        if (typeof data === "string" && data.trim()) {
            setError(data);
            return;
        }

        if (error.response?.status === 403) {
            setError("權限不足，只有管理員可以查看營收或執行日結");
            return;
        }

        setError(defaultMessage);
    };

    // =========================
    // 格式化
    // =========================
    const formatMoney = (amount) => {
        const value = Number(amount ?? 0);

        return value.toLocaleString("zh-TW", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "-";

        return new Date(dateTime).toLocaleString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    const calculateAverage = (revenue) => {
        if (!revenue || !revenue.totalOrders || revenue.totalOrders <= 0) {
            return 0;
        }

        return Number(revenue.totalRevenue ?? 0)
            / Number(revenue.totalOrders);
    };

    // =========================
    // 是否有6-14-4付款統計
    // =========================
    const hasPaymentBreakdown = (revenue) => {
        if (!revenue) return false;

        return revenue.cashAmount !== undefined
            || revenue.cardAmount !== undefined
            || revenue.linePayAmount !== undefined;
    };

    return (
        <>
            <Navbar />

            <div className="container-fluid px-4 mt-3 mb-5">

                {/* 標題 */}
                <div className="pos-page-header">
                    <div>
                        <h2 className="mb-0">營收管理</h2>
                        <div className="pos-page-subtitle">
                            今日營收、日期/月營收、付款統計與日結管理
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={loadTodayRevenue}
                        disabled={loading}
                    >
                        {loading ? "整理中..." : "重新整理"}
                    </button>
                </div>

                {message && (
                    <div className="alert alert-success py-2 mb-2">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger py-2 mb-2">
                        {error}
                    </div>
                )}

                {/* =========================
                    今日營收
                ========================= */}
                <div className="card shadow-sm mb-3">
                    <div className="card-header bg-dark text-white py-2 d-flex justify-content-between">
                        <strong>今日營收</strong>
                        <span>{todayRevenue?.period ?? getTodayString()}</span>
                    </div>

                    <div className="card-body py-3">

                        {loading ? (
                            <div className="text-center py-3">
                                營收資料載入中...
                            </div>
                        ) : (
                            <>
                                <div className="row g-2">

                                    <div className="col-md-4">
                                        <div className="border rounded p-2 text-center">
                                            <small className="text-muted">
                                                今日總營收
                                            </small>

                                            <div className="fs-3 fw-bold text-success">
                                                ${formatMoney(
                                                    todayRevenue?.totalRevenue
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="border rounded p-2 text-center">
                                            <small className="text-muted">
                                                已付款訂單
                                            </small>

                                            <div className="fs-3 fw-bold text-primary">
                                                {todayRevenue?.totalOrders ?? 0}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="border rounded p-2 text-center">
                                            <small className="text-muted">
                                                平均客單
                                            </small>

                                            <div className="fs-3 fw-bold">
                                                ${formatMoney(
                                                    calculateAverage(
                                                        todayRevenue
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {hasPaymentBreakdown(todayRevenue) && (
                                    <div className="row g-2 mt-1">

                                        <div className="col-md-4">
                                            <div className="bg-light border rounded p-2 text-center">
                                                <small className="text-muted">
                                                    現金
                                                </small>

                                                <div className="fw-bold text-success">
                                                    ${formatMoney(
                                                        todayRevenue.cashAmount
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="bg-light border rounded p-2 text-center">
                                                <small className="text-muted">
                                                    信用卡
                                                </small>

                                                <div className="fw-bold text-primary">
                                                    ${formatMoney(
                                                        todayRevenue.cardAmount
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="bg-light border rounded p-2 text-center">
                                                <small className="text-muted">
                                                    LINE Pay
                                                </small>

                                                <div className="fw-bold">
                                                    ${formatMoney(
                                                        todayRevenue.linePayAmount
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </div>

                {/* =========================
                    日期 + 月營收
                ========================= */}
                <div className="row g-3 mb-3">

                    {/* 日期營收 */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm h-100">

                            <div className="card-header bg-primary text-white py-2">
                                <strong>日期營收</strong>
                            </div>

                            <div className="card-body py-3">

                                <form
                                    className="row g-2 mb-2"
                                    onSubmit={handleSearchDaily}
                                >
                                    <div className="col-8">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={selectedDate}
                                            onChange={(e) =>
                                                setSelectedDate(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="col-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={dailyLoading}
                                        >
                                            {dailyLoading
                                                ? "查詢中..."
                                                : "查詢"}
                                        </button>
                                    </div>
                                </form>

                                {!dailyRevenue ? (
                                    <div className="text-center text-muted py-3">
                                        選擇日期後查詢
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-between border-bottom py-2">
                                            <span>日期</span>
                                            <strong>
                                                {dailyRevenue.period}
                                            </strong>
                                        </div>

                                        <div className="d-flex justify-content-between border-bottom py-2">
                                            <span>總營收</span>
                                            <strong className="text-success">
                                                ${formatMoney(
                                                    dailyRevenue.totalRevenue
                                                )}
                                            </strong>
                                        </div>

                                        <div className="d-flex justify-content-between border-bottom py-2">
                                            <span>已付款訂單</span>
                                            <strong>
                                                {dailyRevenue.totalOrders ?? 0} 筆
                                            </strong>
                                        </div>

                                        <div className="d-flex justify-content-between py-2">
                                            <span>平均客單</span>
                                            <strong>
                                                ${formatMoney(
                                                    calculateAverage(
                                                        dailyRevenue
                                                    )
                                                )}
                                            </strong>
                                        </div>

                                        {hasPaymentBreakdown(dailyRevenue) && (
                                            <div className="row g-1 mt-1">

                                                <div className="col-4">
                                                    <div className="border rounded p-2 text-center">
                                                        <small>現金</small>
                                                        <div className="fw-bold">
                                                            ${formatMoney(
                                                                dailyRevenue.cashAmount
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-4">
                                                    <div className="border rounded p-2 text-center">
                                                        <small>信用卡</small>
                                                        <div className="fw-bold">
                                                            ${formatMoney(
                                                                dailyRevenue.cardAmount
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-4">
                                                    <div className="border rounded p-2 text-center">
                                                        <small>LINE Pay</small>
                                                        <div className="fw-bold">
                                                            ${formatMoney(
                                                                dailyRevenue.linePayAmount
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                    </>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* 月營收 */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm h-100">

                            <div className="card-header bg-success text-white py-2">
                                <strong>月營收</strong>
                            </div>

                            <div className="card-body py-3">

                                <form
                                    className="row g-2 mb-2"
                                    onSubmit={handleSearchMonthly}
                                >
                                    <div className="col-8">
                                        <input
                                            type="month"
                                            className="form-control"
                                            value={selectedMonth}
                                            onChange={(e) =>
                                                setSelectedMonth(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="col-4">
                                        <button
                                            type="submit"
                                            className="btn btn-success w-100"
                                            disabled={monthlyLoading}
                                        >
                                            {monthlyLoading
                                                ? "查詢中..."
                                                : "查詢"}
                                        </button>
                                    </div>
                                </form>

                                {!monthlyRevenue ? (
                                    <div className="text-center text-muted py-3">
                                        選擇月份後查詢
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-between border-bottom py-2">
                                            <span>月份</span>
                                            <strong>
                                                {monthlyRevenue.period}
                                            </strong>
                                        </div>

                                        <div className="d-flex justify-content-between border-bottom py-2">
                                            <span>月營收</span>
                                            <strong className="text-success">
                                                ${formatMoney(
                                                    monthlyRevenue.totalRevenue
                                                )}
                                            </strong>
                                        </div>

                                        <div className="d-flex justify-content-between border-bottom py-2">
                                            <span>已付款訂單</span>
                                            <strong>
                                                {monthlyRevenue.totalOrders ?? 0} 筆
                                            </strong>
                                        </div>

                                        <div className="d-flex justify-content-between py-2">
                                            <span>平均客單</span>
                                            <strong>
                                                ${formatMoney(
                                                    calculateAverage(
                                                        monthlyRevenue
                                                    )
                                                )}
                                            </strong>
                                        </div>

                                        {hasPaymentBreakdown(monthlyRevenue) && (
                                            <div className="row g-1 mt-1">

                                                <div className="col-4">
                                                    <div className="border rounded p-2 text-center">
                                                        <small>現金</small>
                                                        <div className="fw-bold">
                                                            ${formatMoney(
                                                                monthlyRevenue.cashAmount
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-4">
                                                    <div className="border rounded p-2 text-center">
                                                        <small>信用卡</small>
                                                        <div className="fw-bold">
                                                            ${formatMoney(
                                                                monthlyRevenue.cardAmount
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-4">
                                                    <div className="border rounded p-2 text-center">
                                                        <small>LINE Pay</small>
                                                        <div className="fw-bold">
                                                            ${formatMoney(
                                                                monthlyRevenue.linePayAmount
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                    </>
                                )}

                            </div>
                        </div>
                    </div>

                </div>

                {/* =========================
                    日結
                ========================= */}
                <div className="card shadow-sm border-warning">

                    <div className="card-header bg-warning py-2 d-flex justify-content-between align-items-center">
                        <strong>日結管理</strong>

                        <small>
                            僅管理員可操作
                        </small>
                    </div>

                    <div className="card-body py-3">
                        <div className="alert alert-info py-2 mb-3">
                            <strong>日結計算方式：</strong>
                            第一次日結從當日 00:00 開始計算；
                            之後每次日結會統計「上次日結完成後～本次日結時間」的所有已付款訂單，
                            因此日結後新增的營收不會遺漏，會自動列入下一次日結。
                        </div>
                        <div className="row g-2 align-items-end mb-3">

                            <div className="col-md-6">
                                <label className="form-label mb-1">
                                    日結日期
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={closingDate}
                                    max={getTodayString()}
                                    onChange={(e) => {
                                        setClosingDate(
                                            e.target.value
                                        );

                                        setClosingResult(null);
                                    }}
                                />
                            </div>

                            <div className="col-md-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark w-100"
                                    onClick={handleSearchClosing}
                                    disabled={
                                        closingSearchLoading
                                        || closingLoading
                                    }
                                >
                                    {closingSearchLoading
                                        ? "查詢中..."
                                        : "查日結紀錄"}
                                </button>
                            </div>

                            <div className="col-md-3">
                                <button
                                    type="button"
                                    className="btn btn-warning w-100 fw-bold"
                                    onClick={handleCloseDay}
                                    disabled={
                                        closingLoading
                                        || closingSearchLoading
                                    }
                                >
                                    {closingLoading
                                        ? "日結中..."
                                        : "執行日結"}
                                </button>
                            </div>

                        </div>

                        {!closingResult ? (
                            <div className="border rounded text-center text-muted py-3">
                                可查詢既有日結紀錄，或選擇日期執行日結
                            </div>
                        ) : (
                            <>
                                <div className="alert alert-light border py-2 mb-2">
                                    <div className="row g-2">

                                        <div className="col-md-3">
                                            <small className="text-muted">
                                                日結編號
                                            </small>

                                            <div className="fw-bold">
                                                #{closingResult.id}
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <small className="text-muted">
                                                日結日期
                                            </small>

                                            <div className="fw-bold">
                                                {closingResult.closingDate}
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <small className="text-muted">
                                                執行員工
                                            </small>

                                            <div className="fw-bold">
                                                {closingResult.employeeName}
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <small className="text-muted">
                                                日結時間
                                            </small>

                                            <div className="fw-bold">
                                                {formatDateTime(
                                                    closingResult.closedAt
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="row g-2">

                                    <div className="col-md-3">
                                        <div className="border rounded p-2 text-center h-100">
                                            <small className="text-muted">
                                                訂單數
                                            </small>

                                            <div className="fs-4 fw-bold text-primary">
                                                {closingResult.totalOrders ?? 0}
                                            </div>

                                            <small>筆</small>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="border rounded p-2 text-center h-100">
                                            <small className="text-muted">
                                                總營收
                                            </small>

                                            <div className="fs-4 fw-bold text-success">
                                                ${formatMoney(
                                                    closingResult.totalRevenue
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className="border rounded p-2 text-center h-100">
                                            <small className="text-muted">
                                                現金
                                            </small>

                                            <div className="fw-bold">
                                                ${formatMoney(
                                                    closingResult.cashAmount
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className="border rounded p-2 text-center h-100">
                                            <small className="text-muted">
                                                信用卡
                                            </small>

                                            <div className="fw-bold">
                                                ${formatMoney(
                                                    closingResult.cardAmount
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className="border rounded p-2 text-center h-100">
                                            <small className="text-muted">
                                                LINE Pay
                                            </small>

                                            <div className="fw-bold">
                                                ${formatMoney(
                                                    closingResult.otherAmount
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="alert alert-secondary py-2 mt-2 mb-0">
                                    付款方式合計：
                                    <strong className="ms-1">
                                        ${formatMoney(
                                            Number(closingResult.cashAmount ?? 0)
                                            + Number(closingResult.cardAmount ?? 0)
                                            + Number(closingResult.otherAmount ?? 0)
                                        )}
                                    </strong>

                                    <span className="mx-2">/</span>

                                    日結總營收：
                                    <strong>
                                        ${formatMoney(
                                            closingResult.totalRevenue
                                        )}
                                    </strong>
                                </div>
                            </>
                        )}

                    </div>
                </div>

            </div>
        </>
    );
}

export default RevenuePage;