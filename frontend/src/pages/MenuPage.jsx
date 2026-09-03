import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import {
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} from "../services/menuService";

import {
    getCurrentRole
} from "../utils/authUtils";

function MenuPage() {

    // =========================
    // 使用者權限
    // =========================
    const role = getCurrentRole();
    const isAdmin = role === "ADMIN";


    // =========================
    // 菜單資料
    // =========================
    const [menuItems, setMenuItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");


    // =========================
    // 表單資料
    // =========================
    const [name, setName] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [price, setPrice] =
        useState("");

    const [available, setAvailable] =
        useState(true);


    // =========================
    // 修改模式
    // =========================
    const [editingId, setEditingId] =
        useState(null);


    // =========================
    // 取得所有菜單
    // =========================
    const loadMenuItems = async () => {

        try {

            setLoading(true);
            setError("");

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

            console.log(
                "後端回傳：",
                error.response?.data
            );

            setError(
                error.response?.data?.message
                || "取得菜單失敗"
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // 第一次進入頁面
    // =========================
    useEffect(() => {

        loadMenuItems();

    }, []);


    // =========================
    // 清空表單
    // =========================
    const resetForm = () => {

        setEditingId(null);
        setName("");
        setCategory("");
        setPrice("");
        setAvailable(true);
    };


    // =========================
    // 新增 / 修改
    // ADMIN ONLY
    // =========================
    const handleSubmit = async (e) => {

        e.preventDefault();

        // 前端再次保護
        if (!isAdmin) {

            setMessage(
                "只有管理員可以新增或修改菜單"
            );

            return;
        }

        setMessage("");
        setError("");

        try {

            const menuItemData = {
                name: name,
                category: category,
                price: Number(price),
                available: available
            };


            // =========================
            // 修改模式
            // =========================
            if (editingId !== null) {

                await updateMenuItem(
                    editingId,
                    menuItemData
                );

                setMessage(
                    "菜單修改成功"
                );

            } else {

                // =========================
                // 新增模式
                // =========================
                await createMenuItem(
                    menuItemData
                );

                setMessage(
                    "菜單新增成功"
                );
            }


            resetForm();

            await loadMenuItems();

        } catch (error) {

            console.log(
                "儲存菜單失敗：",
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


            if (
                error.response?.status === 403
            ) {

                setMessage(
                    "權限不足，只有管理員可以修改菜單"
                );

            } else if (
                error.response?.data
                &&
                typeof error.response.data
                    === "object"
            ) {

                const errorMessages =
                    Object.values(
                        error.response.data
                    )
                    .filter(
                        (value) =>
                            typeof value
                            === "string"
                    )
                    .join("、");

                setMessage(
                    errorMessages
                    || "菜單儲存失敗"
                );

            } else {

                setMessage(
                    "菜單儲存失敗"
                );
            }
        }
    };


    // =========================
    // 點擊修改
    // ADMIN ONLY
    // =========================
    const handleEdit = (item) => {

        if (!isAdmin) {

            setMessage(
                "只有管理員可以修改菜單"
            );

            return;
        }

        setEditingId(
            item.id
        );

        setName(
            item.name
        );

        setCategory(
            item.category
        );

        setPrice(
            item.price
        );

        setAvailable(
            item.available
        );

        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =========================
    // 取消修改
    // =========================
    const handleCancelEdit = () => {

        resetForm();
        setMessage("");
    };


    // =========================
    // 刪除菜單
    // ADMIN ONLY
    // =========================
    const handleDelete = async (item) => {

        if (!isAdmin) {

            setMessage(
                "只有管理員可以刪除菜單"
            );

            return;
        }

        const confirmed =
            window.confirm(
                `確定要刪除「${item.name}」嗎？`
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteMenuItem(
                item.id
            );

            setMessage(
                "菜單刪除成功"
            );


            if (
                editingId === item.id
            ) {

                resetForm();
            }


            await loadMenuItems();

        } catch (error) {

            console.log(
                "刪除菜單失敗：",
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


            if (
                error.response?.status === 403
            ) {

                setMessage(
                    "權限不足，只有管理員可以刪除菜單"
                );

            } else if (
                error.response?.data?.message
            ) {

                setMessage(
                    error.response.data.message
                );

            } else {

                setMessage(
                    "菜單刪除失敗"
                );
            }
        }
    };


    // =========================
    // 分類中文
    // =========================
    const getCategoryText = (
        category
    ) => {

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


    // =========================
    // 金額格式
    // =========================
    const formatMoney = (
        amount
    ) => {

        return Number(
            amount ?? 0
        ).toLocaleString(
            "zh-TW",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );
    };


    // =========================
    // 畫面
    // =========================
    return (
        <>
            <Navbar />

            <div className="container-fluid px-4 mt-3 mb-5">

                {/* =========================
                    頁面標題
                ========================= */}

                <div className="pos-page-header">

                    <div>

                        <h2>
                            {isAdmin
                                ? "菜單管理"
                                : "菜單"
                            }
                        </h2>

                        <div className="pos-page-subtitle">

                            {isAdmin
                                ? "餐點、飲料、甜點與販售狀態管理"
                                : "查看目前餐點、飲料與甜點"
                            }

                        </div>

                    </div>


                    <div className="d-flex gap-2 align-items-center">

                        <span
                            className={
                                isAdmin
                                    ? "badge bg-danger"
                                    : "badge bg-primary"
                            }
                        >
                            {isAdmin
                                ? "管理員模式"
                                : "查看模式"
                            }
                        </span>

                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={
                                loadMenuItems
                            }
                            disabled={
                                loading
                            }
                        >
                            {loading
                                ? "整理中..."
                                : "重新整理"
                            }
                        </button>

                    </div>

                </div>


                {/* =========================
                    STAFF 提示
                ========================= */}

                {!isAdmin && (

                    <div className="alert alert-info py-2">

                        目前為員工查看模式。
                        菜單新增、修改與刪除功能僅限管理員使用。

                    </div>

                )}


                {/* =========================
                    ADMIN 新增 / 修改表單
                ========================= */}

                {isAdmin && (

                    <div className="card mb-3 shadow-sm">

                        <div className="card-header bg-dark text-white py-2">

                            <strong>

                                {editingId !== null
                                    ? "修改菜單"
                                    : "新增菜單"
                                }

                            </strong>

                        </div>


                        <div className="card-body">

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <div className="row g-2">


                                    {/* 名稱 */}

                                    <div className="col-md-3">

                                        <label className="form-label">
                                            名稱
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                name
                                            }
                                            onChange={(e) =>
                                                setName(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="請輸入餐點名稱"
                                            required
                                        />

                                    </div>


                                    {/* 分類 */}

                                    <div className="col-md-3">

                                        <label className="form-label">
                                            分類
                                        </label>

                                        <select
                                            className="form-select"
                                            value={
                                                category
                                            }
                                            onChange={(e) =>
                                                setCategory(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >

                                            <option value="">
                                                請選擇
                                            </option>

                                            <option value="FOOD">
                                                餐點
                                            </option>

                                            <option value="DRINK">
                                                飲料
                                            </option>

                                            <option value="DESSERT">
                                                甜點
                                            </option>

                                        </select>

                                    </div>


                                    {/* 價格 */}

                                    <div className="col-md-2">

                                        <label className="form-label">
                                            價格
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control"
                                            value={
                                                price
                                            }
                                            onChange={(e) =>
                                                setPrice(
                                                    e.target.value
                                                )
                                            }
                                            min="0"
                                            step="1"
                                            placeholder="價格"
                                            required
                                        />

                                    </div>


                                    {/* 狀態 */}

                                    <div className="col-md-2">

                                        <label className="form-label">
                                            狀態
                                        </label>

                                        <select
                                            className="form-select"
                                            value={
                                                available.toString()
                                            }
                                            onChange={(e) =>
                                                setAvailable(
                                                    e.target.value
                                                    === "true"
                                                )
                                            }
                                        >

                                            <option value="true">
                                                販售中
                                            </option>

                                            <option value="false">
                                                停售
                                            </option>

                                        </select>

                                    </div>


                                    {/* 操作 */}

                                    <div className="col-md-2">

                                        <label className="form-label">
                                            操作
                                        </label>

                                        <button
                                            type="submit"
                                            className={
                                                editingId !== null
                                                    ? "btn btn-warning w-100"
                                                    : "btn btn-success w-100"
                                            }
                                        >

                                            {editingId !== null
                                                ? "確認修改"
                                                : "新增"
                                            }

                                        </button>


                                        {editingId !== null && (

                                            <button
                                                type="button"
                                                className="btn btn-secondary w-100 mt-2"
                                                onClick={
                                                    handleCancelEdit
                                                }
                                            >
                                                取消修改
                                            </button>

                                        )}

                                    </div>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


                {/* =========================
                    訊息
                ========================= */}

                {message && (

                    <div className="alert alert-success py-2">

                        {message}

                    </div>

                )}


                {/* =========================
                    Loading
                ========================= */}

                {loading && (

                    <div className="alert alert-info py-2">

                        菜單載入中...

                    </div>

                )}


                {/* =========================
                    Error
                ========================= */}

                {error && (

                    <div className="alert alert-danger py-2">

                        {error}

                    </div>

                )}


                {/* =========================
                    菜單表格
                ========================= */}

                {!loading && !error && (

                    <div className="card shadow-sm">

                        <div className="card-header bg-info py-2 d-flex justify-content-between align-items-center">

                            <strong>
                                菜單列表
                            </strong>

                            <span className="badge bg-dark">
                                {menuItems.length} 項
                            </span>

                        </div>


                        <div className="table-responsive">

                            <table className="table table-bordered table-striped table-hover table-sm align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            名稱
                                        </th>

                                        <th>
                                            分類
                                        </th>

                                        <th>
                                            價格
                                        </th>

                                        <th>
                                            狀態
                                        </th>

                                        {isAdmin && (

                                            <th>
                                                操作
                                            </th>

                                        )}

                                    </tr>

                                </thead>


                                <tbody>


                                    {/* 沒有資料 */}

                                    {menuItems.length === 0 && (

                                        <tr>

                                            <td
                                                colSpan={
                                                    isAdmin
                                                        ? "6"
                                                        : "5"
                                                }
                                                className="text-center text-muted py-4"
                                            >

                                                目前沒有菜單資料

                                            </td>

                                        </tr>

                                    )}


                                    {/* 菜單資料 */}

                                    {menuItems.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >

                                                <td>
                                                    {item.id}
                                                </td>

                                                <td className="fw-bold">
                                                    {item.name}
                                                </td>

                                                <td>

                                                    <span className="badge bg-secondary">

                                                        {getCategoryText(
                                                            item.category
                                                        )}

                                                    </span>

                                                </td>

                                                <td className="fw-bold">

                                                    ${formatMoney(
                                                        item.price
                                                    )}

                                                </td>

                                                <td>

                                                    {item.available
                                                        ? (
                                                            <span className="badge bg-success">
                                                                販售中
                                                            </span>
                                                        )
                                                        : (
                                                            <span className="badge bg-secondary">
                                                                停售
                                                            </span>
                                                        )
                                                    }

                                                </td>


                                                {/* ADMIN 操作 */}

                                                {isAdmin && (

                                                    <td>

                                                        <div className="d-flex gap-2">

                                                            <button
                                                                type="button"
                                                                className="btn btn-warning btn-sm"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                修改
                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                刪除
                                                            </button>

                                                        </div>

                                                    </td>

                                                )}

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </div>
        </>
    );
}

export default MenuPage;