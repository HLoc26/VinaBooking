import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedRooms: {},
	totalAmount: 0,
};

const bookingSlice = createSlice({
	name: "booking",
	initialState,
	reducers: {
		updateRoomQuantity: (state, action) => {
			const { roomId, quantity, price } = action.payload;

			// Get the current quantity for this room (default to 0 if not set)
			const currentQuantity = state.selectedRooms[roomId]?.quantity || 0;

			// Calculate price difference for this update
			const priceDifference = (quantity - currentQuantity) * price;

			if (quantity > 0) {
				// Update or add the room with the new quantity
				state.selectedRooms[roomId] = {
					...state.selectedRooms[roomId],
					quantity,
					price,
					subtotal: quantity * price,
				};
			} else {
				// Remove room if quantity is 0
				if (state.selectedRooms[roomId]) {
					delete state.selectedRooms[roomId];
				}
			}

			// Update the total amount
			state.totalAmount += priceDifference;
		},

		resetBooking: (state) => {
			state.selectedRooms = {};
			state.totalAmount = 0;
		},
	},
});

export const { updateRoomQuantity, resetBooking } = bookingSlice.actions;

export const selectSelectedRooms = (state) => state.booking.selectedRooms;
export const selectTotalAmount = (state) => state.booking.totalAmount;

export default bookingSlice.reducer;
