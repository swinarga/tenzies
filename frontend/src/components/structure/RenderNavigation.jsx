import { Routes, Route } from "react-router-dom";
import { nav } from "./navigation.jsx";
import { AuthData } from "../../auth/AuthWrapper.jsx";

export const RenderRoutes = () => {
	const { user } = AuthData();

	return (
		<Routes>
			{nav.map((r, i) => {
				if (r.isPrivate && user) {
					return <Route key={i} path={r.path} element={r.element} />;
				} else if (!r.isPrivate) {
					return <Route key={i} path={r.path} element={r.element} />;
				} else return false;
			})}
		</Routes>
	);
};
