import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
	location: {},
	dateRange: {
		startDate: new Date().toISOString(),
		endDate: new Date().toISOString(),
	},
	occupancy: {
		adults: 1,
		rooms: 1,
		children: 0,
	},
};

const searchSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		updateSearchFields: (state, action) => {
			const updates = action.payload;

			if (updates.dateRange) {
				// Store as ISO strings for serialization
				state.dateRange = {
					startDate: updates.dateRange.startDate,
					endDate: updates.dateRange.endDate,
				};
			}

			if (updates.occupancy) state.occupancy = updates.occupancy;
			if (updates.location) state.location = updates.location;
		},
	},
});

export const { updateSearchFields } = searchSlice.actions;

export const selectSearchState = (state) => state.search;

export const selectBookingDates = createSelector([selectSearchState], (search) => search.dateRange);

export const selectSearchLocation = createSelector([selectSearchState], (search) => search.location);

export const selectSearchOccupancy = createSelector([selectSearchState], (search) => search.occupancy);

export default searchSlice.reducer;
