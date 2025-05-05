import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import favoritesReducer from "../features/accommodationDetail/favoritesSlice";
import bookingReducer from "../features/booking/bookingSlice";

export default configureStore({
	reducer: {
		auth: authReducer,
		favorites: favoritesReducer,
		booking: bookingReducer,
	},
});
