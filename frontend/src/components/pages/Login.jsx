import React, { useState } from "react";
import "./Login.css";
import { AuthData } from "../../auth/AuthWrapper";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login } = AuthData();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const isLoggedIn = await login(username, password);
		if (isLoggedIn) {
			navigate("/");
		} else {
			setError("Server failed to login, please try again later");
		}
	};

	return (
		<div
			className={
				"login-container d-flex flex-column justify-content-center"
			}
		>
			<div className="row justify-content-md-center">
				<div className="login-form col-md-4">
					<h2 className="text-center" style={{ color: "white" }}>
						Login
					</h2>
					<form onSubmit={handleSubmit}>
						{error && (
							<div className="alert alert-danger">{error}</div>
						)}
						<div className="mb-3">
							<label
								htmlFor="username"
								className="form-label"
								style={{ color: "white" }}
							>
								Username
							</label>
							<input
								className="form-control"
								id="username"
								placeholder="Enter username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="password"
								className="form-label"
								style={{ color: "white" }}
							>
								Password
							</label>
							<input
								type="password"
								className="form-control"
								id="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<button type="submit" className="btn btn-primary w-100">
							Login
						</button>
					</form>
					<p className="text-center mt-3" style={{ color: "white" }}>
						Don't have an account?{" "}
						<Link
							to="/register"
							style={{
								textDecoration: "none",
							}}
						>
							<span className="text-primary">Register here</span>
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
