import React, { useEffect, useState } from "react";
import axios from "../app/axios";

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
        fetchBookings();
    }, []);

    if (loading) return <div>Loading booking history...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div>
            <h2>Booking History</h2>
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookingHistory;
