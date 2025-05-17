import React, { useEffect, useState } from "react";
import axios from "../app/axios";

const BookingHistory = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [cancelId, setCancelId] = useState(null);
	const [cancelStatus, setCancelStatus] = useState("");

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get("/booking");
			setBookings(res.data.payload || []);
		} catch (err) {
			setError(err.response?.data?.error?.message || "Failed to fetch bookings");
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = (id) => setCancelId(id);

	const confirmCancel = async () => {
		try {
			setCancelStatus("loading");
			const res = await axios.put(`/booking/${cancelId}/cancel`);
			if (res.data.success) {
				setCancelStatus("success");
				fetchBookings();
			} else {
				setCancelStatus("fail");
			}
		} catch {
			setCancelStatus("fail");
		} finally {
			setCancelId(null);
			setTimeout(() => setCancelStatus(""), 2000);
		}
	};

	if (loading) return <div>Loading booking history...</div>;
	if (error) return <div style={{ color: "red" }}>{error}</div>;

	return (
		<div>
			<h2>Booking History</h2>
			{cancelStatus === "success" && <div style={{ color: "green" }}>Booking canceled successfully.</div>}
			{cancelStatus === "fail" && <div style={{ color: "red" }}>Failed to cancel booking.</div>}
			{bookings.length === 0 ? (
				<div>No bookings found.</div>
			) : (
				<ul>
					{bookings.map((booking) => (
						<li key={booking.id}>
							<div>Booking ID: {booking.id}</div>
							<div>Start: {new Date(booking.startDate).toLocaleDateString()}</div>
							<div>End: {new Date(booking.endDate).toLocaleDateString()}</div>
							<div>Status: {booking.status}</div>
							<div>Guests: {booking.guestCount}</div>
							<div>
								Rooms:
								<ul>
									{booking.bookingItems &&
										booking.bookingItems.map((item) => (
											<li key={item.id}>
												Room: {item.room?.id} x {item.count}
											</li>
										))}
								</ul>
							</div>
							{booking.status !== "CANCELED" && <button onClick={() => handleCancel(booking.id)}>Cancel Booking</button>}
						</li>
					))}
				</ul>
			)}
			{cancelId && (
				<div className="modal">
					<div>
						<p>Are you sure you want to cancel this booking?</p>
						<button onClick={confirmCancel}>Yes</button>
						<button onClick={() => setCancelId(null)}>No</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default BookingHistory;
