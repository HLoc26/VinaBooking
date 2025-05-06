import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Landing from "./pages/Landing/Landing";
import FavoritesPage from "./pages/Favorites/FavoritesPage";
import Search from "./pages/Search/Search";
import ProtectedRoute from "./components/auth/ProtectedRoute/ProtectedRoute";
import { restoreSession } from "./features/auth/authSlice";

// Create these empty "under construction" pages
const Profile = () => (
	<div style={{ marginTop: "100px", textAlign: "center", padding: "20px" }}>
		<h1>User Profile</h1>
		<p>This page is under construction</p>
	</div>
);

const Bookings = () => (
	<div style={{ marginTop: "100px", textAlign: "center", padding: "20px" }}>
		<h1>My Bookings</h1>
		<p>This page is under construction</p>
	</div>
);

const Settings = () => (
	<div style={{ marginTop: "100px", textAlign: "center", padding: "20px" }}>
		<h1>Settings</h1>
		<p>This page is under construction</p>
	</div>
);

function App() {
	const dispatch = useDispatch();
	
	useEffect(() => {
		// Try to restore the user session when the app loads
		dispatch(restoreSession());
	}, [dispatch]);

	return (
		<Router>
			<Routes>
				{/* Public routes */}
				<Route path="/" element={<Landing />} />
				<Route path="/search" element={<Search />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				{/* Protected routes */}
				<Route element={<ProtectedRoute />}>
					<Route path="/saved" element={<FavoritesPage />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/bookings" element={<Bookings />} />
					<Route path="/settings" element={<Settings />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
