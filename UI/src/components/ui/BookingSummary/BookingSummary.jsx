import * as React from "react";
import { Paper, Typography, Box, Button, Divider } from "@mui/material";
import * as Icon from "@mui/icons-material";
import convertPrice from "../../../utils/convertPrice.js";
import { useSelector } from "react-redux";
import { selectSelectedRooms, selectTotalAmount } from "../../../features/booking/bookingSlice.js";
import { useNavigate } from "react-router-dom";

function BookingSummary() {
	const selectedRooms = useSelector(selectSelectedRooms);
	const totalAmount = useSelector(selectTotalAmount);
	const navigate = useNavigate();

	const selectedRoomsCount = Object.keys(selectedRooms).length;
	const totalQuantity = Object.values(selectedRooms).reduce((sum, room) => sum + room.quantity, 0);

	const handleProceedToCheckout = () => {
		// If no rooms are selected, don't navigate
		if (selectedRoomsCount === 0) return;

		// Prepare data to pass to booking page
		const bookingData = {
			rooms: selectedRooms,
			totalAmount,
		};

		// Navigate to booking page with selected rooms data
		// You would typically use React Router for this
		navigate("/booking", { state: { bookingData } });
	};

	return (
		<Paper
			elevation={3}
			sx={{
				padding: 3,
				borderRadius: 2,
				position: "sticky",
				top: 24,
				width: 360,
			}}
		>
			<Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
				Booking Summary
			</Typography>

			<Divider sx={{ my: 2 }} />

			{selectedRoomsCount > 0 ? (
				<>
					<Typography variant="body1" sx={{ mb: 1 }}>
						Selected rooms: <b>{selectedRoomsCount}</b>
					</Typography>
					<Typography variant="body1" sx={{ mb: 2 }}>
						Total quantity: <b>{totalQuantity}</b>
					</Typography>

					<Divider sx={{ my: 2 }} />

					<Typography variant="h6" sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
						<span>TOTAL:</span>
						<span style={{ fontWeight: "bold" }}>{convertPrice(totalAmount)} VND</span>
					</Typography>

					<Button variant="contained" color="primary" fullWidth size="large" startIcon={<Icon.ShoppingCart />} onClick={handleProceedToCheckout} sx={{ mt: 2 }}>
						Proceed to Book
					</Button>
				</>
			) : (
				<Box sx={{ textAlign: "center", py: 3 }}>
					<Icon.ShoppingCartOutlined fontSize="large" color="action" />
					<Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
						No rooms selected
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Use the quantity controls to add rooms to your booking
					</Typography>
				</Box>
			)}
		</Paper>
	);
}

export default BookingSummary;
