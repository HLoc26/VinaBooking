import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
	const { user } = useSelector((state) => state.auth);

	// If user is not logged in, redirect to login page
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// If user is logged in, render the child routes
	return <Outlet />;
};

export default ProtectedRoute;
