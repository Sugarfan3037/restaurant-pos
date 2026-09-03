import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MenuPage from "./pages/MenuPage";
import OrderPage from "./pages/OrderPage";
import TablePage from "./pages/TablePage";
import EmployeePage from "./pages/EmployeePage";
import RevenuePage from "./pages/RevenuePage";
import ForbiddenPage from "./pages/ForbiddenPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    return (
        <Routes>

            {/* 根網址 */}
            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            {/* 登入 */}
            <Route
                path="/login"
                element={
                    <LoginPage />
                }
            />

            {/* =========================
                一般登入使用者
            ========================= */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/menu"
                element={
                    <ProtectedRoute>
                        <MenuPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <OrderPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tables"
                element={
                    <ProtectedRoute>
                        <TablePage />
                    </ProtectedRoute>
                }
            />

            {/* =========================
                ADMIN 專用
            ========================= */}

            <Route
                path="/employees"
                element={
                    <AdminRoute>
                        <EmployeePage />
                    </AdminRoute>
                }
            />

            <Route
                path="/revenue"
                element={
                    <AdminRoute>
                        <RevenuePage />
                    </AdminRoute>
                }
            />

            {/* =========================
                權限不足
            ========================= */}

            <Route
                path="/forbidden"
                element={
                    <ProtectedRoute>
                        <ForbiddenPage />
                    </ProtectedRoute>
                }
            />

            {/* =========================
                404
            ========================= */}

            <Route
                path="*"
                element={
                    <ProtectedRoute>
                        <NotFoundPage />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default App;