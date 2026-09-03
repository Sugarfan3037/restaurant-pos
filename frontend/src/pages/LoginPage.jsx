import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/authService";

function LoginPage() {

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const data = await login(
                username,
                password
            );

            console.log("登入成功");
            console.log(data);

            localStorage.setItem(
                "token",
                data.token
            );

            navigate("/dashboard");

        } catch (error) {

            console.log("登入失敗");

            console.log(
                error.response?.status
            );

            console.log(
                error.response?.data
            );

            setMessage(
                "帳號或密碼錯誤"
            );
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center px-3">

            <div className="row justify-content-center w-100">

                <div className="col-12 col-sm-9 col-md-6 col-lg-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-body p-4">

                            <h2 className="text-center mb-4">
                                餐廳 POS 系統
                            </h2>

                            <form onSubmit={handleLogin}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        帳號
                                    </label>

                                    <input
                                        type="text"
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

                                <div className="mb-3">

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

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    登入
                                </button>

                            </form>

                            {message && (
                                <div className="alert alert-danger py-2 mt-3 mb-0 text-center">
                                    {message}
                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default LoginPage;