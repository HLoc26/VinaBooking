import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import favoritesReducer from "../features/accommodationDetail/favoritesSlice";
import bookingReducer from "../features/booking/bookingSlice";
import searchReducer from "../features/search/searchSlice";

export default configureStore({
	reducer: {
		auth: authReducer,
		favorites: favoritesReducer,
		booking: bookingReducer,
		search: searchReducer,
	},
});
