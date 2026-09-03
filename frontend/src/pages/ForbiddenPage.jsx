import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function ForbiddenPage() {
    return (
        <>
            <Navbar />

            <div className="container-fluid px-4 mt-4">
                <div
                    className="card shadow-sm mx-auto"
                    style={{ maxWidth: "650px" }}
                >
                    <div className="card-header bg-danger text-white py-2">
                        <strong>權限不足</strong>
                    </div>

                    <div className="card-body text-center py-5">
                        <div
                            className="fw-bold text-danger mb-2"
                            style={{ fontSize: "4rem" }}
                        >
                            403
                        </div>

                        <h4 className="mb-2">
                            無法存取此頁面
                        </h4>

                        <div className="text-muted mb-3">
                            此功能僅限管理員使用。
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

export default ForbiddenPage;