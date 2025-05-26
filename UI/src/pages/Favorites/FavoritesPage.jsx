import { useState, useEffect } from "react";
import { Container, Typography, Box, Stack, CircularProgress, Alert, Divider, Snackbar, Alert as MuiAlert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import FavoriteCard from "../../components/ui/FavoriteCard/FavoriteCard";
import Navbar from "../../components/layout/NavBar/NavBar";
import { getFavourite, removeFavourite, undoFavourite } from "../../features/favourite/favoritesSlice";

const FavoritesPage = () => {
	const dispatch = useDispatch();

	const favorites = useSelector((state) => state.favourites.accomms);
	const loading = useSelector((state) => state.favourites.loading);
	const error = useSelector((state) => state.favourites.error);

	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const [initialLoad, setInitialLoad] = useState(true);
	const [canUndo, setCanUndo] = useState(false); // Quản lý trạng thái undo
	const [isUndoing, setIsUndoing] = useState(false); // Ngăn nhấn Ctrl + Z nhiều lần

	// Get auth state from Redux
	const { isLoggedIn, loading: authLoading, user } = useSelector((state) => state.auth);

	useEffect(() => {
		if (!isLoggedIn || !user) {
			// Don't fetch if not logged in
			return;
		}
		dispatch(getFavourite());
	}, [isLoggedIn, user, dispatch]);

	useEffect(() => {
		// This effect runs once after the first render to set initial load to false
		const timer = setTimeout(() => setInitialLoad(false), 500);
		return () => clearTimeout(timer);
	}, []);

	// Handle Ctrl + Z to Undo
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.ctrlKey && event.key === "z" && canUndo && !isUndoing) {
				event.preventDefault();
				setIsUndoing(true);
				console.log(
					"Attempting undo, current favourites:",
					favorites.map((item) => item.id)
				);
				dispatch(undoFavourite())
					.unwrap()
					.then(() => {
						setSnackbar({
							open: true,
							message: "Favorite accommodation restored",
							severity: "success",
						});
					})
					.catch((error) => {
						setSnackbar({
							open: true,
							message: error || "Action cannot be undone",
							severity: "error",
						});
					})
					.finally(() => {
						setIsUndoing(false);
						setCanUndo(false); // Tắt undo sau khi thực hiện
					});
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [dispatch, canUndo, isUndoing, favorites]);

	// Close snackbar
	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	// Handle removing an accommodation from favorites
	const handleRemove = async () => {
		try {
			await dispatch(removeFavourite(accommodation)).unwrap();
			setCanUndo(true);
			setSnackbar({
				open: true,
				message: "Accommodation removed from favorites",
				severity: "success",
			});
			// Tắt undo sau 10 giây
			setTimeout(() => setCanUndo(false), 10000);
		} catch (error) {
			setSnackbar({
				open: true,
				message: error || "Error removing accommodation from favorites. Please try again.",
				severity: "error",
			});
		}
	};

	// Show a loading state if either authentication is loading or favorites are loading
	const isPageLoading = authLoading || loading;

	// Check if we have an auth token in localStorage
	const hasAuthToken = () => {
		return !!localStorage.getItem("token");
	};

	// During initial load or when auth is still loading, show loading spinner instead of redirecting
	if (initialLoad || authLoading) {
		return (
			<>
				<Navbar />
				<Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
					<Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
						<CircularProgress />
					</Box>
				</Container>
			</>
		);
	}

	// Only redirect to login if the auth loading has completed AND user is not logged in
	// AND there's no token in storage (to handle page reloads before redux is ready)
	if (!isLoggedIn && !hasAuthToken()) {
		return <Navigate to="/login" state={{ from: "/favorites" }} replace />;
	}

	return (
		<>
			<Navbar />
			<Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
				<Box mb={4}>
					<Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
						Your Saved Accommodations
					</Typography>
					<Typography variant="body1" color="text.secondary">
						View and manage your favorite accommodations
					</Typography>
					<Divider sx={{ mt: 2 }} />
				</Box>

				{isPageLoading ? (
					<Box display="flex" justifyContent="center" py={8}>
						<CircularProgress />
					</Box>
				) : error ? (
					<Alert severity="error" sx={{ mb: 4 }}>
						{error}
					</Alert>
				) : favorites.length === 0 ? (
					<Box textAlign="center" py={8}>
						<Typography variant="h6" gutterBottom>
							You don't have any saved accommodations yet
						</Typography>
						<Typography variant="body1" color="text.secondary">
							When you find places you like, save them here for easy access
						</Typography>
					</Box>
				) : (
					<Stack spacing={3}>
						{favorites.map((accommodation) => (
							<FavoriteCard key={accommodation.id} accommodation={accommodation} onRemove={() => handleRemove(accommodation)} />
						))}
					</Stack>
				)}

				{/* Notification Snackbar */}
				<Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
					<MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
						{snackbar.message}
					</MuiAlert>
				</Snackbar>
			</Container>
		</>
	);
};

export default FavoritesPage;
