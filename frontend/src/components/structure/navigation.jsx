import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Profile from "../pages/Profile.jsx";
import { Navigate } from "react-router-dom";

export const nav = [
	{ path: "/", name: "Home", element: <Home /> },
	{ path: "/login", name: "Login", element: <Login /> },
	{
		path: "/profiles/:id",
		name: "Profile",
		element: <Profile />,
	},
	{
		path: "*",
		element: <Navigate to="/" />,
	},
];
