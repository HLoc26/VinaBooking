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
	const [canUndo, setCanUndo] = useState(false); // Track undo availability
	const [isUndoing, setIsUndoing] = useState(false); // Prevent multiple Ctrl + Z
	const [undoTimeout, setUndoTimeout] = useState(null); // Track undo timeout

	// Get auth state from Redux
	const { isLoggedIn, loading: authLoading, user } = useSelector((state) => state.auth);

	// Fetch favourites when logged in
	useEffect(() => {
		if (!isLoggedIn || !user) {
			return;
		}
		dispatch(getFavourite());
	}, [isLoggedIn, user, dispatch]);

	// Disable initial load after first render
	useEffect(() => {
		const timer = setTimeout(() => setInitialLoad(false), 500);
		return () => clearTimeout(timer);
	}, []);

	// Handle Ctrl + Z for undo with debounce
	useEffect(() => {
		let debounceTimer;
		const handleKeyDown = (event) => {
			if (event.ctrlKey && event.key === "z" && canUndo && !isUndoing) {
				event.preventDefault();
				clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => {
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
								message: "Đã khôi phục cơ sở lưu trú yêu thích",
								severity: "success",
							});
						})
						.catch((error) => {
							setSnackbar({
								open: true,
								message: error || "Không thể hoàn tác hành động",
								severity: "error",
							});
						})
						.finally(() => {
							setIsUndoing(false);
							setCanUndo(false); // Disable undo after attempt
							clearTimeout(undoTimeout);
						});
				}, 100); // Debounce 100ms
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			clearTimeout(debounceTimer);
		};
	}, [dispatch, canUndo, isUndoing, favorites, undoTimeout]);

	// Close snackbar
	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	// Handle removing an accommodation from favorites
	const handleRemove = async (accommodation) => {
		try {
			await dispatch(removeFavourite(accommodation)).unwrap();
			setCanUndo(true);
			setSnackbar({
				open: true,
				message: "Đã xóa cơ sở lưu trú khỏi yêu thích",
				severity: "success",
			});
			// Disable undo after 10 seconds
			const timeout = setTimeout(() => setCanUndo(false), 10000);
			setUndoTimeout(timeout);
		} catch (error) {
			setSnackbar({
				open: true,
				message: error || "Không thể xóa cơ sở lưu trú",
				severity: "error",
			});
		}
	};

	// Show loading state if authenticating or fetching favourites
	const isPageLoading = authLoading || loading;

	// Check for auth token in localStorage
	const hasAuthToken = () => {
		return !!localStorage.getItem("token");
	};

	// Show loading spinner during initial load or auth
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

	// Redirect to login if not logged in and no token
	if (!isLoggedIn && !hasAuthToken()) {
		return <Navigate to="/login" state={{ from: "/favorites" }} replace />;
	}

	return (
		<>
			<Navbar />
			<Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
				<Box mb={4}>
					<Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
						Cơ sở lưu trú đã lưu
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Xem và quản lý các cơ sở lưu trú yêu thích của bạn
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
							Bạn chưa lưu cơ sở lưu trú nào
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Khi tìm thấy nơi bạn thích, lưu chúng tại đây để dễ truy cập
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
