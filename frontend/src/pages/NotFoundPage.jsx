import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function NotFoundPage() {
    return (
        <>
            <Navbar />

            <div className="container-fluid px-4 mt-4">
                <div
                    className="card shadow-sm mx-auto"
                    style={{ maxWidth: "650px" }}
                >
                    <div className="card-header bg-dark text-white py-2">
                        <strong>找不到頁面</strong>
                    </div>

                    <div className="card-body text-center py-5">
                        <div
                            className="fw-bold text-secondary mb-2"
                            style={{ fontSize: "4rem" }}
                        >
                            404
                        </div>

                        <h4 className="mb-2">
                            此頁面不存在
                        </h4>

                        <div className="text-muted mb-3">
                            你輸入的網址可能錯誤，或此頁面已不存在。
                        </div>

                        <Link
                            to="/dashboard"
                            className="btn btn-primary btn-sm"
                        >
                            返回首頁
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotFoundPage;