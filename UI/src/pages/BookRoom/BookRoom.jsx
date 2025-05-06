import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const BookRoom = () => {
	const navigate = useNavigate();
	const [openDialog, setOpenDialog] = React.useState(false);

	// Redux state
	const user = useSelector((state) => state.user.currentUser);
	const roomSelection = useSelector((state) => state.booking.roomSelection); // Example: [{ type: "Deluxe", count: 2, pricePerNight: 100 }]
	const numberOfDays = useSelector((state) => state.booking.numberOfDays); // Example: 3

	// Redirect to login if user is not logged in
	useEffect(() => {
		if (!user) {
			const confirmLogin = window.confirm("You are not logged in. Do you want to login?");
			if (confirmLogin) {
				navigate("/login");
			}
		}
	}, [user, navigate]);

	// Calculate total price
	const calculateSubTotal = (room) => room.count * room.pricePerNight * numberOfDays;
	const totalPrice = roomSelection.reduce((total, room) => total + calculateSubTotal(room), 0);

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
		<Box sx={{ padding: 4 }}>
			<Typography variant="h4" gutterBottom>
				Book Room
			</Typography>

			{user && (
				<Box sx={{ marginBottom: 4 }}>
					<Typography variant="h6">User Information</Typography>
					<Typography>Name: {user.name}</Typography>
					<Typography>Email: {user.email}</Typography>
				</Box>
			)}

			<TableContainer component={Paper} sx={{ marginBottom: 4 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Room Type</TableCell>
							<TableCell align="right">Number</TableCell>
							<TableCell align="right">Price per Night</TableCell>
							<TableCell align="right">Sub-total</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{roomSelection.map((room, index) => (
							<TableRow key={index}>
								<TableCell>{room.type}</TableCell>
								<TableCell align="right">{room.count}</TableCell>
								<TableCell align="right">${room.pricePerNight}</TableCell>
								<TableCell align="right">${calculateSubTotal(room)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Typography variant="h6" gutterBottom>
				Total Price: ${totalPrice}
			</Typography>

			<Button variant="contained" color="primary" onClick={handleProceedToPayment} disabled={!roomSelection.length}>
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
	);
};

export default BookRoom;
