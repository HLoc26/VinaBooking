import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedRooms } from "../../features/booking/bookingSlice";
import {
	Box,
	Typography,
	Paper,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableBody,
	TableCell,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	DialogContentText,
	Icon,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../features/auth/authSlice";
import MainLayout from "../../components/layout/MainLayout/MainLayout";
import { selectBookingDates } from "../../features/search/searchSlice";

const BookRoom = () => {
	const navigate = useNavigate();
	const [openDialog, setOpenDialog] = useState(false);

	// Retrieve data passed via state
	const rooms = useSelector(selectSelectedRooms);
	const currentUser = useSelector(selectCurrentUser);
	const dateRange = useSelector(selectBookingDates);

	const startDate = new Date(dateRange.startDate);
	const endDate = new Date(dateRange.endDate);

	// Count nights
	const msPerNight = 1000 * 60 * 60 * 24;
	const nights = Math.max(1, Math.ceil((endDate - startDate) / msPerNight));

	// Recalculate total amount
	const totalAmount = Object.values(rooms).reduce((sum, room) => {
		return sum + room.quantity * room.price * nights;
	}, 0);

	// Redirect to the previous page if no data is passed
	useEffect(() => {
		if (!Object.entries(rooms).length) {
			alert("No booking data found. Redirecting to the previous page.");
			navigate(-1); // Go back to the previous page
		}
	}, [rooms, navigate]);

	// Handle navigation to payment page
	const handleProceedToPayment = () => {
		setOpenDialog(true);
	};

	const confirmPayment = () => {
		setOpenDialog(false);
		navigate("/payment"); // Navigate to the payment page
	};

	const cancelPayment = () => {
		setOpenDialog(false);
	};

	return (
		<MainLayout>
			<Box sx={{ padding: 4 }}>
				{/* User Information */}
				<Box sx={{ marginBottom: 4 }}>
					<Typography variant="h4" gutterBottom>
						Booking Information
					</Typography>
					<Paper sx={{ padding: 2 }}>
						<Typography variant="body1">
							<b>Name:</b> {currentUser?.username || "Guest"}
						</Typography>
						<Typography variant="body1">
							<b>Email:</b> {currentUser?.email || "Not provided"}
						</Typography>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 10 }}>
							<Typography variant="body1">
								<b>Check-in:</b> {startDate.toLocaleDateString()}
							</Typography>
							<Typography variant="body1">
								<b>Check-out:</b> {endDate.toLocaleDateString()}
							</Typography>
							<Typography variant="body1">
								<b>Nights:</b> {nights} night(s)
							</Typography>
						</Box>
					</Paper>
				</Box>

				{/* Room Details */}
				<Typography variant="h4" gutterBottom>
					Selected Rooms
				</Typography>

				<TableContainer component={Paper} sx={{ marginBottom: 4 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Room Type</TableCell>
								<TableCell align="right">Quantity</TableCell>
								<TableCell align="right">Price per Night</TableCell>
								<TableCell align="right">Sub-total</TableCell>
								<TableCell>Description</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{Object.entries(rooms).map(([roomId, room]) => (
								<TableRow key={roomId}>
									<TableCell>{room.name}</TableCell>
									<TableCell align="right">{room.quantity}</TableCell>
									<TableCell align="right">{room.price.toLocaleString()} VND</TableCell>
									<TableCell align="right">{(room.subtotal * nights).toLocaleString()} VND</TableCell>
									<TableCell>{room.description}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
					<Typography variant="h6">
						<b>Total Price:</b>{" "}
						<Typography component="span" variant="h6" color="success.main">
							{totalAmount.toLocaleString()} VND
						</Typography>
					</Typography>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={handleProceedToPayment}
						disabled={Object.keys(rooms).length === 0}
						sx={{ fontWeight: "bold", textTransform: "none", px: 4 }}
					>
						Proceed to Payment
					</Button>
				</Box>

				{/* Confirmation Dialog */}
				<Dialog open={openDialog} onClose={cancelPayment}>
					<DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Icon.WarningAmber color="warning" />
						Confirm Payment
					</DialogTitle>
					<DialogContent>
						<DialogContentText>Are you sure you want to proceed to the payment page? Once confirmed, you will be redirected.</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={cancelPayment} color="secondary">
							Cancel
						</Button>
						<Button onClick={confirmPayment} color="primary" variant="contained">
							Confirm
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</MainLayout>
	);
};

export default BookRoom;
