import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import { Navigate } from "react-router-dom";

export const nav = [
	{ path: "/", name: "Home", element: <Home /> },
	{ path: "/login", name: "Login", element: <Login /> },
	{
		path: "*",
		element: <Navigate to="/" />,
	},
];
