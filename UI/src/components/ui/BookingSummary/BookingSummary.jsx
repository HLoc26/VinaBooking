import * as React from "react";
import { Paper, Typography, Box, Button, Divider, Alert } from "@mui/material";
import * as Icon from "@mui/icons-material";
import convertPrice from "../../../utils/convertPrice.js";
import { useSelector, useDispatch } from "react-redux";
import { selectSelectedRooms, selectTotalAmount } from "../../../features/booking/bookingSlice.js";
import { useNavigate } from "react-router-dom";
import { DateTimePickerRange } from "../DateTimePickerRange";
import { selectBookingDates, updateSearchFields } from "../../../features/search/searchSlice.js";

function BookingSummary() {
	const selectedRooms = useSelector(selectSelectedRooms);
	const totalAmount = useSelector(selectTotalAmount);
	const bookingDates = useSelector(selectBookingDates);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const reduxDateRange = useSelector(selectBookingDates);
	const [dateRange, setDateRange] = React.useState(reduxDateRange);

	const [showDatePicker, setShowDatePicker] = React.useState(false);
	const [dateError, setDateError] = React.useState("");

	const selectedRoomsCount = Object.keys(selectedRooms).length;
	const totalQuantity = Object.values(selectedRooms).reduce((sum, room) => sum + room.quantity, 0);

	// Initialize date range from Redux if available
	React.useEffect(() => {
		if (bookingDates && bookingDates.startDate && bookingDates.endDate) {
			try {
				const startDate = new Date(bookingDates.startDate);
				const endDate = new Date(bookingDates.endDate);

				// Check if dates are valid
				if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
					setDateRange({
						startDate,
						endDate,
					});
				}
			} catch (error) {
				console.error("Error parsing dates from Redux:", error);
			}
		}
	}, [bookingDates]);

	// Handle date range change
	const handleDateRangeChange = (newRange) => {
		setDateRange(newRange);
		setDateError("");
	};

	// Validate date range
	const validateDateRange = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const startDate = new Date(dateRange.startDate);
		const endDate = new Date(dateRange.endDate);

		// Check if start date is today or in the future
		if (startDate < today) {
			setDateError("Check-in date cannot be in the past");
			return false;
		}

		// Check if end date is after start date
		if (endDate <= startDate) {
			setDateError("Check-out date must be after check-in date");
			return false;
		}

		return true;
	};

	const handleProceedToCheckout = () => {
		// If no rooms are selected, don't navigate
		if (selectedRoomsCount === 0) return;

		// Check if we have valid dates in Redux
		if (!bookingDates || !validateDateRange()) {
			setShowDatePicker(true);
			return;
		}

		// Save the date range to Redux
		dispatch(
			updateSearchFields({
				dateRange: {
					startDate: dateRange.startDate,
					endDate: dateRange.endDate,
				},
			})
		);

		navigate("/book");
	};

	return (
		<Paper
			elevation={3}
			sx={{
				padding: 3,
				borderRadius: 2,
				position: "sticky",
				top: 130,
				width: "380px",
				boxSizing: "border-box",
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

					{/* Date Range Section */}
					<Box sx={{ my: 3 }}>
						<Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
							Select your stay dates:
						</Typography>

						{dateError && (
							<Alert severity="error" sx={{ mb: 2 }}>
								{dateError}
							</Alert>
						)}

						<Typography variant="subtitle1" sx={{ display: "flex", justifyContent: "space-between" }}>
							<span>Check-in:</span>
							<span>{dateRange.startDate.toLocaleDateString()}</span>
						</Typography>
						<Typography variant="subtitle1" sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
							<span>Check-out:</span>
							<span>{dateRange.endDate.toLocaleDateString()}</span>
						</Typography>

						<DateTimePickerRange
							value={dateRange}
							minDate={new Date().setDate(new Date().getDate() - 1)}
							onChange={handleDateRangeChange}
							showTime={false}
							numMonths={1}
							direction="vertical"
						/>
					</Box>

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
