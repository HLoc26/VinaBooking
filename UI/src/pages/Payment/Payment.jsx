import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Divider, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { selectSelectedRooms, selectTotalAmount } from "../../features/booking/bookingSlice";
import { selectBookingDates, selectSearchOccupancy } from "../../features/search/searchSlice";
import * as Icon from "@mui/icons-material";
import axiosInstance from "../../app/axios";

const Payment = () => {
	const navigate = useNavigate();
	const totalAmount = useSelector(selectTotalAmount);
	const selectedRooms = useSelector(selectSelectedRooms);
	const dateRange = useSelector(selectBookingDates);
	const occupancy = useSelector(selectSearchOccupancy);

	const [paymentSuccess, setPaymentSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		// Reset khi vào trang
		setPaymentSuccess(false);
		setError("");
	}, []);

	const startDate = new Date(dateRange.startDate).toISOString().split("T")[0];
	const endDate = new Date(dateRange.endDate).toISOString().split("T")[0];

	const paymentInfo = {
		receiver: "VinaBooking",
		bank: "VCB - Vietcombank",
		accountNumber: "123456789",
		amount: totalAmount,
		content: `Booking_${Date.now()}`,
	};

	const qrData = "https://youtu.be/dQw4w9WgXcQ"; // Rick Roll link

	const handlePaymentConfirm = async () => {
		setLoading(true);
		setError("");
		try {
			const rooms = Object.fromEntries(Object.entries(selectedRooms).map(([key, value]) => [key, value.quantity]));

			const requestBody = {
				startDate,
				endDate,
				rooms,
				guestCount: occupancy.adults + Math.floor(occupancy.children / 2),
			};

			const response = await axiosInstance.post("/booking", requestBody);

			if (response.data.success) {
				setPaymentSuccess(true);
			} else {
				setError("Booking failed. Please try again.");
			}
		} catch (err) {
			console.error(err);
			setError("An unexpected error occurred. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	if (paymentSuccess) {
		return (
			<Box sx={{ textAlign: "center", mt: 4 }}>
				<Icon.CheckCircleOutline sx={{ fontSize: 80, color: "green" }} />
				<Typography variant="h5" sx={{ mt: 2 }}>
					Payment Successful
				</Typography>
				<Typography variant="body1" sx={{ mt: 1 }}>
					Thank you for your booking. We have received your payment.
				</Typography>
				<Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>
					Back to Home
				</Button>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 4 }}>
			<Typography variant="h4" gutterBottom>
				Payment
			</Typography>

			<Paper sx={{ p: 4, maxWidth: 480 }}>
				<Typography variant="h6" gutterBottom>
					Transfer Information
				</Typography>

				<Typography>
					<b>Receiver:</b> {paymentInfo.receiver}
				</Typography>
				<Typography>
					<b>Bank:</b> {paymentInfo.bank}
				</Typography>
				<Typography>
					<b>Account:</b> {paymentInfo.accountNumber}
				</Typography>
				<Typography>
					<b>Amount:</b> {paymentInfo.amount} VND
				</Typography>
				<Typography>
					<b>Content:</b> {paymentInfo.content}
				</Typography>

				<Divider sx={{ my: 3 }} />

				<Typography variant="body1" gutterBottom>
					Scan QR to pay:
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
					<QRCode value={qrData} size={200} />
				</Box>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Button variant="contained" color="primary" fullWidth onClick={handlePaymentConfirm} disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
					{loading ? "Processing..." : "Đã thanh toán"}
				</Button>
			</Paper>
		</Box>
	);
};

export default Payment;
