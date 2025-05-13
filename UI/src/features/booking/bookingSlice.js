import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "../auth/authSlice";

const initialState = {
	selectedRooms: {},
	totalAmount: 0,
};

const bookingSlice = createSlice({
	name: "booking",
	initialState,
	reducers: {
		updateRoomQuantity: (state, action) => {
			const room = action.payload;

			// Get the current quantity for this room (default to 0 if not set)
			const currentQuantity = state.selectedRooms[room.id]?.quantity || 0;

			// Calculate price difference for this update
			const priceDifference = (room.quantity - currentQuantity) * +room.price;

			if (room.quantity > 0) {
				// Update or add the room with the new quantity
				state.selectedRooms[room.id] = {
					...state.selectedRooms[room.id],
					...room,
					quantity: room.quantity,
					price: +room.price,
					subtotal: room.quantity * +room.price,
				};
			} else {
				// Remove room if quantity is 0
				if (state.selectedRooms[room.id]) {
					delete state.selectedRooms[room.id];
				}
			}

			// Update the total amount
			state.totalAmount += priceDifference;
		},

		resetBooking: (state) => {
			state.selectedRooms = {};
			state.totalAmount = 0;
		},

		updateTotalAmount: (state, action) => {
			state.totalAmount = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(logoutUser.fulfilled, (state) => {
			state.selectedRooms = {};
			state.totalAmount = 0;
		});
	},
});

export const { updateRoomQuantity, resetBooking, updateTotalAmount } = bookingSlice.actions;

export const selectSelectedRooms = (state) => state.booking.selectedRooms;
export const selectTotalAmount = (state) => state.booking.totalAmount;

export default bookingSlice.reducer;
