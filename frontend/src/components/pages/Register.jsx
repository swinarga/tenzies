import React, { useState } from "react";
import "./Register.css";
import { AuthData } from "../../auth/AuthWrapper";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const { login } = AuthData();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		// check if password matches confirmPassword
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters long");
			return;
		}

		// submit to backend
		try {
			const registerRes = await axios.post(
				import.meta.env.VITE_BACKEND_URL + "/api/users/register",
				{
					username,
					password,
				}
			);

			if (registerRes.status !== 201) {
				setError("Server failed to register, please try again later");
				return;
			}

			const loginRes = login(username, password);

			if (loginRes.status !== 200) {
				alert("Server failed to login, please try again later");
				navigate("/login");
				return;
			}

			navigate("/");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div
			className={
				"register-container d-flex flex-column justify-content-center"
			}
		>
			<div className="row justify-content-md-center">
				<div className="register-form col-md-4">
					<h2 className="text-center" style={{ color: "white" }}>
						Register
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
						<div className="mb-3">
							<label
								htmlFor="confirmPassword"
								className="form-label"
								style={{ color: "white" }}
							>
								Confirm password
							</label>
							<input
								type="password"
								className="form-control"
								id="confirmPassword"
								placeholder="Confirm password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								required
							/>
						</div>
						<button type="submit" className="btn btn-primary w-100">
							Create account
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
