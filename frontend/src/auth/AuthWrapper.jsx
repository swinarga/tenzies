import { createContext, useContext, useEffect, useState } from "react";
import { RenderRoutes } from "../components/structure/RenderNavigation";
import axios from "axios";

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
	const [user, setUser] = useState(null);

	const checkAuth = async () => {
		try {
			const res = await axios.get(
				import.meta.env.VITE_BACKEND_URL + "/api/users/me",
				{
					withCredentials: true,
				}
			);

			if (res.status !== 200) {
				throw Error("not authenticated");
			}
			setUser(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	const login = async (username, password) => {
		try {
			const res = await axios.post(
				import.meta.env.VITE_BACKEND_URL + "/api/users/login",
				{
					username: username,
					password: password,
				},
				{
					withCredentials: true,
				}
			);

			if (res.status !== 200) {
				throw new Error("not authenticated");
			}
			setUser(res.data.user);
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	};
	const logout = async () => {
		try {
			const res = await axios.post(
				import.meta.env.VITE_BACKEND_URL + "/api/users/logout",
				{},
				{
					withCredentials: true,
				}
			);
			if (res.status !== 200) {
				throw new Error("failed to logout");
			}
			setUser(null);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, checkAuth }}>
			<>
				<RenderRoutes />
			</>
		</AuthContext.Provider>
	);
};
