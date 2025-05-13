import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
	const location = useLocation();
	const { user, isLoggedIn, loading } = useSelector((state) => state.auth);

	// If authentication is still being checked, render nothing (or a loading indicator)
	if (loading) {
		return <div style={{ marginTop: "100px", textAlign: "center" }}>Loading...</div>;
	}

	// If user is not logged in, redirect to login page
	if (!isLoggedIn || !user) {
		return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
	}

	// If user is logged in, render the child routes
	return <Outlet />;
};

export default ProtectedRoute;
