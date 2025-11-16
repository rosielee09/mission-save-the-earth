import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import IntroScene from "./scenes/Intro/IntroScene";

function BodyClassByRoute() {
	const location = useLocation();

	useEffect(() => {
		// Add intro background when on the root/intro route, remove otherwise
		const isIntro =
			location.pathname === "/" ||
			location.pathname.startsWith("/intro");
		document.body.classList.toggle("intro-bg", isIntro);
		// cleanup not strictly necessary because toggle will run on next location change
		return () => {};
	}, [location]);

	return null;
}

function App() {
	return (
		<BrowserRouter>
			<BodyClassByRoute />
			<Routes>
				<Route path='/' element={<IntroScene />} />
				{/* fallback: render IntroScene for unknown routes for now */}
				<Route path='*' element={<IntroScene />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
