import { BrowserRouter } from "react-router-dom";
import { AuthWrapper } from "./auth/AuthWrapper";

export default function App() {
	return (
		<BrowserRouter>
			<AuthWrapper></AuthWrapper>
		</BrowserRouter>
	);
}
