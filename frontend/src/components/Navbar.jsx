import { NavLink, useNavigate } from "react-router-dom";

import {
    getCurrentUser,
    getCurrentRole
} from "../utils/authUtils";

function Navbar() {
    const navigate = useNavigate();

    const user = getCurrentUser();
    const role = getCurrentRole();

    const handleLogout = () => {
        const confirmed = window.confirm(
            "確定要登出系統嗎？"
        );

        if (!confirmed) return;

        localStorage.removeItem("token");

        navigate(
            "/login",
            { replace: true }
        );
    };

    const getLinkClass = ({ isActive }) => {
        return isActive
            ? "nav-link active fw-bold"
            : "nav-link";
    };

    const getRoleText = () => {
        if (role === "ADMIN") {
            return "管理員";
        }

        if (role === "STAFF") {
            return "員工";
        }

        return "使用者";
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">

            <div className="container-fluid px-4">

                <NavLink
                    className="navbar-brand fw-bold"
                    to="/dashboard"
                >
                    餐廳 POS
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="mainNavbar"
                >

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <NavLink
                                to="/dashboard"
                                className={getLinkClass}
                            >
                                首頁
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/menu"
                                className={getLinkClass}
                            >
                                菜單
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/orders"
                                className={getLinkClass}
                            >
                                點餐
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/tables"
                                className={getLinkClass}
                            >
                                桌位
                            </NavLink>
                        </li>

                        {role === "ADMIN" && (
                            <>
                                <li className="nav-item">
                                    <NavLink
                                        to="/employees"
                                        className={getLinkClass}
                                    >
                                        員工
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink
                                        to="/revenue"
                                        className={getLinkClass}
                                    >
                                        營收
                                    </NavLink>
                                </li>
                            </>
                        )}

                    </ul>

                    <div className="d-flex align-items-center gap-2">

                        <span className="text-light small">
                            {user?.sub ?? "使用者"}
                        </span>

                        <span
                            className={
                                role === "ADMIN"
                                    ? "badge bg-danger"
                                    : "badge bg-primary"
                            }
                        >
                            {getRoleText()}
                        </span>

                        <button
                            type="button"
                            className="btn btn-outline-light btn-sm"
                            onClick={handleLogout}
                        >
                            登出
                        </button>

                    </div>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;