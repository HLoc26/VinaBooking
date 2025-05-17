import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import { useDispatch } from "react-redux";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Landing from "./pages/Landing/Landing";
import FavoritesPage from "./pages/Favorites/FavoritesPage";
import AccommodationDetail from "./pages/AccommodationDetail/AccommodationDetail";
import Search from "./pages/Search/Search";
import ProtectedRoute from "./components/auth/ProtectedRoute/ProtectedRoute";
import { restoreSession } from "./features/auth/authSlice";
import BookRoom from "./pages/BookRoom/BookRoom";
import Payment from "./pages/Payment/Payment";
import BookingHistory from "./pages/BookingHistory";

// Create these empty "under construction" pages
const Profile = () => (
	<div style={{ marginTop: "100px", textAlign: "center", padding: "20px" }}>
		<h1>User Profile</h1>
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
		<Provider store={store}>
			<Router>
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<Landing />} />
					<Route path="/login" element={<Login />} />
					<Route path="/search" element={<Search />} />
					<Route path="/register" element={<Register />} />
					<Route path="accommodation">
						<Route path="detail/:aid" element={<AccommodationDetail />} /> {/* aid: Accommodation id */}
					</Route>

					{/* Protected routes */}
					<Route element={<ProtectedRoute />}>
						<Route path="/saved" element={<FavoritesPage />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/bookings" element={<BookingHistory />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/book" element={<BookRoom />} />
						<Route path="/payment" element={<Payment />} />
					</Route>
				</Routes>
			</Router>
		</Provider>
	);
}

export default App;
