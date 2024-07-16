import "./Header.css";
import logo from "/tenzies_logo.png";
import { AuthData } from "../auth/AuthWrapper";
import { Link } from "react-router-dom";

export default function Header({ user }) {
	const { logout } = AuthData();

	return (
		<div className="d-flex flex-row outpost-header align-items-center">
			<div className="outpost-logo-container">
				<img src={logo} className="outpost-logo" alt="" />
			</div>
			<input
				className="me-auto flex-grow-1 border-0 search-container shadow-none"
				type="text"
				placeholder="Search..."
			/>
			<div className="d-flex flex-row">
				{user ? (
					<>
						<div className="p-2">
							{/* <a href={user.profileUrl}>
								<img
									src={user.avatar}
									alt=""
									className="avatar"
								/>
							</a> */}
						</div>
						<div className="p-2">{user.username}</div>
						<div className="p-2">
							<button onClick={logout}>Logout</button>
						</div>
						<Link to={`/profiles/${user.profileId}`}>
							<span>Profile</span>
						</Link>
					</>
				) : (
					<a href={"/login"}>
						<span>Login</span>
					</a>
				)}
			</div>
		</div>
	);
}
