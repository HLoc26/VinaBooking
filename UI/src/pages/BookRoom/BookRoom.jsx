import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedRooms, selectTotalAmount } from "../../features/booking/bookingSlice";
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
	Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../features/auth/authSlice";
import MainLayout from "../../components/layout/MainLayout/MainLayout";

const BookRoom = () => {
	const navigate = useNavigate();
	const [openDialog, setOpenDialog] = useState(false);

	// Retrieve data passed via state
	const rooms = useSelector(selectSelectedRooms);
	const totalAmount = useSelector(selectTotalAmount);
	const currentUser = useSelector(selectCurrentUser);

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
					<Typography variant="h5" gutterBottom>
						Booking Information
					</Typography>
					<Paper sx={{ padding: 2 }}>
						<Typography variant="body1">
							<b>Name:</b> {currentUser?.username || "Guest"}
						</Typography>
						<Typography variant="body1">
							<b>Email:</b> {currentUser?.email || "Not provided"}
						</Typography>
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
								<TableCell align="right">Number</TableCell>
								<TableCell align="right">Price per Night</TableCell>
								<TableCell align="right">Sub-total</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Amenities</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{Object.entries(rooms).map(([roomId, room]) => (
								<TableRow key={roomId}>
									<TableCell>{room.name}</TableCell>
									<TableCell align="right">{room.quantity}</TableCell>
									<TableCell align="right">{room.price} VND</TableCell>
									<TableCell align="right">{room.subtotal} VND</TableCell>
									<TableCell>{room.description}</TableCell>
									<TableCell>
										{Object.entries(room.amenities || {}).map(([category, items]) => (
											<Box key={category} sx={{ mb: 1 }}>
												<Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
													{category.charAt(0).toUpperCase() + category.slice(1)}:
												</Typography>
												<Typography variant="body2">{items.join(", ")}</Typography>
											</Box>
										))}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				{/* Total Price */}
				<Box sx={{ marginBottom: 4 }}>
					<Typography variant="h6" gutterBottom>
						Total Price: {totalAmount} VND
					</Typography>
				</Box>

				{/* Proceed to Payment */}
				<Button variant="contained" color="primary" onClick={handleProceedToPayment} disabled={!rooms.length}>
					Proceed to Payment
				</Button>

				{/* Confirmation Dialog */}
				<Dialog open={openDialog} onClose={cancelPayment}>
					<DialogTitle>Confirm Payment</DialogTitle>
					<DialogContent>
						<DialogContentText>Are you sure you want to proceed to the payment page?</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={cancelPayment} color="secondary">
							Cancel
						</Button>
						<Button onClick={confirmPayment} color="primary">
							Confirm
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</MainLayout>
	);
};

export default BookRoom;
