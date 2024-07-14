import React, { useState } from "react";
import "./Login.css";
import { AuthData } from "../../auth/AuthWrapper";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { login } = AuthData();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const isLoggedIn = await login(username, password);
		if (isLoggedIn) {
			navigate("/");
		} else {
			console.error("not logged in");
		}
	};

	return (
		<div className="container mt-5">
			<div className="row justify-content-md-center">
				<div className="col-md-4">
					<h2 className="text-center" style={{ color: "white" }}>
						Login
					</h2>
					<form onSubmit={handleSubmit}>
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
				</div>
			</div>
		</div>
	);
};

export default Login;
