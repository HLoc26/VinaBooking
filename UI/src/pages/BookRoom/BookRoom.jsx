import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedRooms, selectTotalAmount } from "../../features/booking/bookingSlice";
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";

import { useNavigate } from "react-router-dom";

const BookRoom = () => {
	const navigate = useNavigate();
	const [openDialog, setOpenDialog] = useState(false);

	// Retrieve data passed via state

	const rooms = useSelector(selectSelectedRooms);
	const totalAmount = useSelector(selectTotalAmount);

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
		<Box sx={{ padding: 4 }}>
			<Typography variant="h4" gutterBottom>
				Book Room
			</Typography>

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
						{Object.entries(rooms).map(([roomId, room]) => (
							<TableRow key={roomId}>
								<TableCell>{room.name}</TableCell>
								<TableCell align="right">{room.quantity}</TableCell>
								<TableCell align="right">{room.price} VND</TableCell>
								<TableCell align="right">{room.subtotal} VND</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Typography variant="h6" gutterBottom>
				Total Price: ${totalAmount}
			</Typography>

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
	);
};

export default BookRoom;
