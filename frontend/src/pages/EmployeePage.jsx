import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import {
    getEmployees,
    createEmployee,
    updateEmployee,
    updateEmployeePassword,
    deleteEmployee
} from "../services/employeeService";

function EmployeePage() {
    const [employees, setEmployees] = useState([]);

    // 新增
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("STAFF");

    // 修改
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [editName, setEditName] = useState("");
    const [editRole, setEditRole] = useState("STAFF");
    const [editActive, setEditActive] = useState(true);

    // 密碼
    const [passwordEmployee, setPasswordEmployee] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 搜尋 / 篩選
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [activeFilter, setActiveFilter] = useState("ALL");

    // Loading
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [changingActiveId, setChangingActiveId] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =========================
    // 查全部
    // =========================
    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getEmployees();

            setEmployees(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {
            console.log(
                "取得員工失敗：",
                error
            );

            handleBackendError(
                error,
                "取得員工資料失敗"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    // =========================
    // 新增
    // =========================
    const handleCreateEmployee = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!username.trim()) {
            setError("請輸入員工帳號");
            return;
        }

        if (!password.trim()) {
            setError("請輸入員工密碼");
            return;
        }

        if (!name.trim()) {
            setError("請輸入員工姓名");
            return;
        }

        const confirmed =
            window.confirm(
                `確定新增員工？\n\n`
                + `帳號：${username}\n`
                + `姓名：${name}\n`
                + `角色：${getRoleText(role)}`
            );

        if (!confirmed) return;

        try {
            setCreating(true);

            await createEmployee({
                username:
                    username.trim(),
                password:
                    password,
                name:
                    name.trim(),
                role:
                    role
            });

            setMessage(
                `員工「${name}」新增成功`
            );

            resetCreateForm();

            await loadEmployees();

        } catch (error) {
            console.log(
                "新增員工失敗：",
                error
            );

            handleBackendError(
                error,
                "新增員工失敗"
            );

        } finally {
            setCreating(false);
        }
    };

    // =========================
    // 開啟修改
    // =========================
    const handleEditEmployee = (employee) => {
        setMessage("");
        setError("");

        setPasswordEmployee(null);

        setEditingEmployee(
            employee
        );

        setEditName(
            employee.name ?? ""
        );

        setEditRole(
            employee.role ?? "STAFF"
        );

        setEditActive(
            employee.active === true
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // 儲存修改
    // =========================
    const handleUpdateEmployee = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!editingEmployee) {
            setError(
                "找不到要修改的員工"
            );
            return;
        }

        if (!editName.trim()) {
            setError(
                "員工姓名不可為空"
            );
            return;
        }

        const confirmed =
            window.confirm(
                `確定修改員工？\n\n`
                + `帳號：${editingEmployee.username}\n`
                + `姓名：${editName}\n`
                + `角色：${getRoleText(editRole)}\n`
                + `狀態：${editActive ? "啟用" : "停用"}`
            );

        if (!confirmed) return;

        try {
            setUpdating(true);

            await updateEmployee(
                editingEmployee.id,
                {
                    name:
                        editName.trim(),
                    role:
                        editRole,
                    active:
                        editActive
                }
            );

            setMessage(
                `員工「${editName}」修改成功`
            );

            handleCancelEdit();

            await loadEmployees();

        } catch (error) {
            console.log(
                "修改員工失敗：",
                error
            );

            handleBackendError(
                error,
                "修改員工失敗"
            );

        } finally {
            setUpdating(false);
        }
    };

    // =========================
    // 停用 / 啟用
    // =========================
    const handleToggleActive = async (employee) => {
        setMessage("");
        setError("");

        if (!employee) return;

        // 啟用 → 停用
        if (employee.active === true) {

            const confirmed =
                window.confirm(
                    `確定停用員工？\n\n`
                    + `${employee.name}（${employee.username}）\n\n`
                    + `停用後將無法登入。`
                );

            if (!confirmed) return;

            try {
                setChangingActiveId(
                    employee.id
                );

                await deleteEmployee(
                    employee.id
                );

                if (
                    editingEmployee?.id
                    === employee.id
                ) {
                    handleCancelEdit();
                }

                setMessage(
                    `員工「${employee.name}」已停用`
                );

                await loadEmployees();

            } catch (error) {
                console.log(
                    "停用員工失敗：",
                    error
                );

                handleBackendError(
                    error,
                    "停用員工失敗"
                );

            } finally {
                setChangingActiveId(
                    null
                );
            }

            return;
        }

        // 停用 → 啟用
        const confirmed =
            window.confirm(
                `確定重新啟用員工？\n\n`
                + `${employee.name}（${employee.username}）`
            );

        if (!confirmed) return;

        try {
            setChangingActiveId(
                employee.id
            );

            await updateEmployee(
                employee.id,
                {
                    name:
                        employee.name,
                    role:
                        employee.role,
                    active:
                        true
                }
            );

            setMessage(
                `員工「${employee.name}」已重新啟用`
            );

            await loadEmployees();

        } catch (error) {
            console.log(
                "重新啟用失敗：",
                error
            );

            handleBackendError(
                error,
                "重新啟用員工失敗"
            );

        } finally {
            setChangingActiveId(
                null
            );
        }
    };

    // =========================
    // 開啟密碼修改
    // =========================
    const handleOpenPassword = (employee) => {
        setMessage("");
        setError("");

        setEditingEmployee(null);

        setPasswordEmployee(
            employee
        );

        setNewPassword("");
        setConfirmPassword("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // 修改密碼
    // =========================
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!passwordEmployee) {
            setError(
                "找不到要修改密碼的員工"
            );
            return;
        }

        if (!newPassword.trim()) {
            setError(
                "請輸入新密碼"
            );
            return;
        }

        if (!confirmPassword.trim()) {
            setError(
                "請再次輸入新密碼"
            );
            return;
        }

        if (
            newPassword !==
            confirmPassword
        ) {
            setError(
                "兩次輸入的密碼不一致"
            );
            return;
        }

        const confirmed =
            window.confirm(
                `確定修改密碼？\n\n`
                + `${passwordEmployee.name}`
                + `（${passwordEmployee.username}）`
            );

        if (!confirmed) return;

        try {
            setChangingPassword(true);

            await updateEmployeePassword(
                passwordEmployee.id,
                newPassword
            );

            const employeeName =
                passwordEmployee.name;

            handleClosePassword();

            setMessage(
                `員工「${employeeName}」密碼修改成功`
            );

        } catch (error) {
            console.log(
                "修改密碼失敗：",
                error
            );

            handleBackendError(
                error,
                "修改密碼失敗"
            );

        } finally {
            setChangingPassword(
                false
            );
        }
    };

    // =========================
    // 清除
    // =========================
    const resetCreateForm = () => {
        setUsername("");
        setPassword("");
        setName("");
        setRole("STAFF");
    };

    const handleCancelEdit = () => {
        setEditingEmployee(null);
        setEditName("");
        setEditRole("STAFF");
        setEditActive(true);
    };

    const handleClosePassword = () => {
        setPasswordEmployee(null);
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleResetFilter = () => {
        setKeyword("");
        setRoleFilter("ALL");
        setActiveFilter("ALL");
    };

    // =========================
    // 錯誤處理
    // =========================
    const handleBackendError = (
        error,
        defaultMessage
    ) => {
        const data =
            error.response?.data;

        if (data?.message) {
            setError(
                data.message
            );
            return;
        }

        if (
            data &&
            typeof data === "object"
        ) {
            const messages =
                Object.values(data)
                    .filter(
                        (value) =>
                            typeof value
                            === "string"
                    )
                    .join("、");

            if (messages) {
                setError(messages);
                return;
            }
        }

        if (
            typeof data === "string"
            &&
            data.trim()
        ) {
            setError(data);
            return;
        }

        setError(defaultMessage);
    };

    // =========================
    // 中文
    // =========================
    const getRoleText = (role) => {
        switch (role) {
            case "ADMIN":
                return "管理員";
            case "STAFF":
                return "一般員工";
            default:
                return role || "-";
        }
    };

    const getRoleClass = (role) => {
        switch (role) {
            case "ADMIN":
                return "bg-danger";
            case "STAFF":
                return "bg-primary";
            default:
                return "bg-secondary";
        }
    };

    const getActiveText = (active) =>
        active ? "啟用" : "停用";

    const getActiveClass = (active) =>
        active
            ? "bg-success"
            : "bg-secondary";

    // =========================
    // 統計
    // =========================
    const activeEmployees =
        employees.filter(
            (employee) =>
                employee.active === true
        );

    const inactiveEmployees =
        employees.filter(
            (employee) =>
                employee.active === false
        );

    const adminEmployees =
        employees.filter(
            (employee) =>
                employee.role === "ADMIN"
        );

    const activeAdmins =
        employees.filter(
            (employee) =>
                employee.role === "ADMIN"
                &&
                employee.active === true
        );

    // =========================
    // 搜尋 + 篩選
    // =========================
    const filteredEmployees =
        employees
            .filter((employee) => {
                const searchText =
                    keyword
                        .trim()
                        .toLowerCase();

                if (!searchText) {
                    return true;
                }

                const employeeUsername =
                    employee.username
                        ?.toLowerCase()
                        ?? "";

                const employeeName =
                    employee.name
                        ?.toLowerCase()
                        ?? "";

                return (
                    employeeUsername.includes(
                        searchText
                    )
                    ||
                    employeeName.includes(
                        searchText
                    )
                );
            })
            .filter((employee) => {
                if (
                    roleFilter === "ALL"
                ) {
                    return true;
                }

                return (
                    employee.role
                    === roleFilter
                );
            })
            .filter((employee) => {
                if (
                    activeFilter === "ALL"
                ) {
                    return true;
                }

                if (
                    activeFilter === "ACTIVE"
                ) {
                    return (
                        employee.active
                        === true
                    );
                }

                return (
                    employee.active
                    === false
                );
            })
            .sort(
                (a, b) =>
                    a.id - b.id
            );

    return (
        <>
            <Navbar />

            <div className="container-fluid px-4 mt-3 mb-5">

                {/* 標題 */}
                <div className="pos-page-header">
                    <div>
                        <h2 className="mb-0">
                            員工管理
                        </h2>

                        <div className="pos-page-subtitle">
                            員工帳號、角色、登入狀態與密碼
                        </div>
                    </div>

                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={loadEmployees}
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
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body text-center py-2">
                                <small className="text-muted">
                                    員工總數
                                </small>

                                <div className="fs-3 fw-bold">
                                    {employees.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm border-success">
                            <div className="card-body text-center py-2">
                                <small className="text-muted">
                                    啟用
                                </small>

                                <div className="fs-3 fw-bold text-success">
                                    {activeEmployees.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm border-secondary">
                            <div className="card-body text-center py-2">
                                <small className="text-muted">
                                    停用
                                </small>

                                <div className="fs-3 fw-bold text-secondary">
                                    {inactiveEmployees.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm border-danger">
                            <div className="card-body text-center py-2">
                                <small className="text-muted">
                                    啟用中的管理員
                                </small>

                                <div className="fs-3 fw-bold text-danger">
                                    {activeAdmins.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 修改 */}
                {editingEmployee && (
                    <div className="card border-primary shadow-sm mb-3">
                        <div className="card-header bg-primary text-white py-2 d-flex justify-content-between">
                            <strong>
                                修改員工 #{editingEmployee.id}
                            </strong>

                            <button
                                className="btn btn-light btn-sm"
                                onClick={handleCancelEdit}
                            >
                                關閉
                            </button>
                        </div>

                        <div className="card-body py-3">
                            <form onSubmit={handleUpdateEmployee}>
                                <div className="row g-2 align-items-end">

                                    <div className="col-md-3">
                                        <label className="form-label">
                                            帳號
                                        </label>

                                        <input
                                            className="form-control"
                                            value={editingEmployee.username}
                                            disabled
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label">
                                            姓名
                                        </label>

                                        <input
                                            className="form-control"
                                            value={editName}
                                            onChange={(e) =>
                                                setEditName(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label">
                                            角色
                                        </label>

                                        <select
                                            className="form-select"
                                            value={editRole}
                                            onChange={(e) =>
                                                setEditRole(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="STAFF">
                                                一般員工
                                            </option>

                                            <option value="ADMIN">
                                                管理員
                                            </option>
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label">
                                            狀態
                                        </label>

                                        <select
                                            className="form-select"
                                            value={
                                                editActive
                                                    ? "true"
                                                    : "false"
                                            }
                                            onChange={(e) =>
                                                setEditActive(
                                                    e.target.value
                                                    === "true"
                                                )
                                            }
                                        >
                                            <option value="true">
                                                啟用
                                            </option>

                                            <option value="false">
                                                停用
                                            </option>
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <button
                                            className="btn btn-primary w-100"
                                            disabled={updating}
                                        >
                                            {updating
                                                ? "修改中..."
                                                : "儲存"}
                                        </button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 修改密碼 */}
                {passwordEmployee && (
                    <div className="card border-warning shadow-sm mb-3">
                        <div className="card-header bg-warning py-2 d-flex justify-content-between">
                            <strong>
                                修改密碼－{passwordEmployee.name}
                            </strong>

                            <button
                                className="btn btn-light btn-sm"
                                onClick={handleClosePassword}
                            >
                                關閉
                            </button>
                        </div>

                        <div className="card-body py-3">
                            <form onSubmit={handleUpdatePassword}>
                                <div className="row g-2 align-items-end">

                                    <div className="col-md-5">
                                        <label className="form-label">
                                            新密碼
                                        </label>

                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="col-md-5">
                                        <label className="form-label">
                                            確認新密碼
                                        </label>

                                        <input
                                            type="password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <button
                                            className="btn btn-warning w-100"
                                            disabled={changingPassword}
                                        >
                                            {changingPassword
                                                ? "修改中..."
                                                : "修改密碼"}
                                        </button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 新增 */}
                <div className="card shadow-sm mb-3">
                    <div className="card-header bg-dark text-white py-2">
                        <strong>
                            新增員工
                        </strong>
                    </div>

                    <div className="card-body py-3">
                        <form onSubmit={handleCreateEmployee}>
                            <div className="row g-2 align-items-end">

                                <div className="col-md-3">
                                    <label className="form-label">
                                        帳號
                                    </label>

                                    <input
                                        className="form-control"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">
                                        密碼
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">
                                        姓名
                                    </label>

                                    <input
                                        className="form-control"
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">
                                        角色
                                    </label>

                                    <select
                                        className="form-select"
                                        value={role}
                                        onChange={(e) =>
                                            setRole(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="STAFF">
                                            一般員工
                                        </option>

                                        <option value="ADMIN">
                                            管理員
                                        </option>
                                    </select>
                                </div>

                                <div className="col-md-1">
                                    <button
                                        className="btn btn-success w-100"
                                        disabled={creating}
                                    >
                                        {creating
                                            ? "..."
                                            : "新增"}
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>

                {/* 搜尋 */}
                <div className="card shadow-sm mb-3">
                    <div className="card-body py-2">
                        <div className="row g-2">

                            <div className="col-md-5">
                                <input
                                    className="form-control"
                                    placeholder="搜尋帳號或姓名..."
                                    value={keyword}
                                    onChange={(e) =>
                                        setKeyword(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="ALL">
                                        全部角色
                                    </option>

                                    <option value="ADMIN">
                                        管理員
                                    </option>

                                    <option value="STAFF">
                                        一般員工
                                    </option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={activeFilter}
                                    onChange={(e) =>
                                        setActiveFilter(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="ALL">
                                        全部狀態
                                    </option>

                                    <option value="ACTIVE">
                                        啟用
                                    </option>

                                    <option value="INACTIVE">
                                        停用
                                    </option>
                                </select>
                            </div>

                            <div className="col-md-1">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-100"
                                    onClick={handleResetFilter}
                                >
                                    清除
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* 列表 */}
                <div className="card shadow-sm">
                    <div className="card-header py-2 d-flex justify-content-between">
                        <strong>
                            員工列表
                        </strong>

                        <span className="badge bg-dark">
                            顯示 {filteredEmployees.length}
                            / {employees.length}
                        </span>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover table-sm align-middle mb-0">

                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>帳號</th>
                                    <th>姓名</th>
                                    <th>角色</th>
                                    <th>狀態</th>
                                    <th>操作</th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                        >
                                            載入中...
                                        </td>
                                    </tr>

                                ) : filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center text-muted py-4"
                                        >
                                            找不到符合條件的員工
                                        </td>
                                    </tr>

                                ) : (
                                    filteredEmployees.map(
                                        (employee) => (

                                            <tr
                                                key={employee.id}
                                                className={
                                                    !employee.active
                                                        ? "table-secondary"
                                                        : ""
                                                }
                                            >

                                                <td>
                                                    {employee.id}
                                                </td>

                                                <td className="fw-bold">
                                                    {employee.username}
                                                </td>

                                                <td>
                                                    {employee.name}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${getRoleClass(
                                                            employee.role
                                                        )}`}
                                                    >
                                                        {getRoleText(
                                                            employee.role
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${getActiveClass(
                                                            employee.active
                                                        )}`}
                                                    >
                                                        {getActiveText(
                                                            employee.active
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="d-flex gap-1 flex-wrap">

                                                        <button
                                                            className="btn btn-outline-primary btn-sm"
                                                            onClick={() =>
                                                                handleEditEmployee(
                                                                    employee
                                                                )
                                                            }
                                                        >
                                                            修改
                                                        </button>

                                                        <button
                                                            className="btn btn-outline-warning btn-sm"
                                                            onClick={() =>
                                                                handleOpenPassword(
                                                                    employee
                                                                )
                                                            }
                                                        >
                                                            修改密碼
                                                        </button>

                                                        <button
                                                            className={
                                                                employee.active
                                                                    ? "btn btn-outline-danger btn-sm"
                                                                    : "btn btn-outline-success btn-sm"
                                                            }
                                                            disabled={
                                                                changingActiveId
                                                                === employee.id
                                                            }
                                                            onClick={() =>
                                                                handleToggleActive(
                                                                    employee
                                                                )
                                                            }
                                                        >
                                                            {changingActiveId
                                                                === employee.id
                                                                ? "處理中..."
                                                                : employee.active
                                                                    ? "停用"
                                                                    : "重新啟用"}
                                                        </button>

                                                    </div>
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

export default EmployeePage;