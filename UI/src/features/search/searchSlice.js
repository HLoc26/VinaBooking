import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
	location: {},
	dateRange: {
		startDate: new Date().toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric" }),
		endDate: new Date().toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric" }),
	},
	occupancy: {
		adults: 1,
		rooms: 1,
		children: 0,
	},
};

const bookingSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		updateSearchFields: (state, action) => {
			const updates = action.payload;

			if (updates.dateRange) {
				state.dateRange = {
					startDate: new Date(updates.dateRange.startDate).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric" }),
					endDate: new Date(updates.dateRange.endDate).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric" }),
				};
			}

			if (updates.occupancy) state.occupancy = updates.occupancy;
			if (updates.location) state.location = updates.location;
		},
	},
});

export const { updateSearchFields } = bookingSlice.actions;

export const selectSearchState = (state) => state.search;

export const selectBookingDates = createSelector([selectSearchState], (search) => search.dateRange);

export const selectSearchLocation = createSelector([selectSearchState], (search) => search.location);

export const selectSearchOccupancy = createSelector([selectSearchState], (search) => search.occupancy);

export default bookingSlice.reducer;
