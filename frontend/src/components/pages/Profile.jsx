import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import "./Login.css";
import { AuthData } from "../../auth/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import axios from "axios";

const Profile = () => {
	const [profile, setProfile] = useState(null);
	const [isProfileFound, setIsProfileFound] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		const getProfile = async () => {
			try {
				const res = await axios.get(
					import.meta.env.VITE_BACKEND_URL + "/api/profiles/" + id,
					{
						withCredentials: true,
					}
				);
				if (res.status !== 200) {
					throw Error(res.data);
				}
				console.log(res);

				setProfile(res.data);
				setIsProfileFound(true);
			} catch (err) {
				console.error(err);
			}
		};
		getProfile();
	}, []);

	const profileNotFound = (
		<div>
			<h1>Profile not found!</h1>
		</div>
	);

	const profileFound = (
		<>
			{profile && (
				<div>
					<h3>{profile.username}</h3>
					<ul>
						{profile.games.map((game) => (
							<li key={game._id}>{JSON.stringify(game)}</li>
						))}
					</ul>
				</div>
			)}
		</>
	);

	// return (
	// 	<div className="container mt-5">
	// 		<div className="row justify-content-md-center">
	// 			<div className="col-md-4">
	// 				<h2 className="text-center" style={{ color: "white" }}>
	// 					Login
	// 				</h2>
	// 				<form onSubmit={handleSubmit}>
	// 					<div className="mb-3">
	// 						<label
	// 							htmlFor="username"
	// 							className="form-label"
	// 							style={{ color: "white" }}
	// 						>
	// 							Username
	// 						</label>
	// 						<input
	// 							className="form-control"
	// 							id="username"
	// 							placeholder="Enter username"
	// 							value={username}
	// 							onChange={(e) => setUsername(e.target.value)}
	// 							required
	// 						/>
	// 					</div>
	// 					<div className="mb-3">
	// 						<label
	// 							htmlFor="password"
	// 							className="form-label"
	// 							style={{ color: "white" }}
	// 						>
	// 							Password
	// 						</label>
	// 						<input
	// 							type="password"
	// 							className="form-control"
	// 							id="password"
	// 							placeholder="Password"
	// 							value={password}
	// 							onChange={(e) => setPassword(e.target.value)}
	// 							required
	// 						/>
	// 					</div>
	// 					<button type="submit" className="btn btn-primary w-100">
	// 						Login
	// 					</button>
	// 				</form>
	// 			</div>
	// 		</div>
	// 	</div>
	// );
	return (
		<>
			{profile ? (
				isProfileFound ? (
					profileFound
				) : (
					profileNotFound
				)
			) : (
				<ReactLoading type="spin" />
			)}
		</>
	);
};

export default Profile;
