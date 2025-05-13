import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addFavouriteApi, getFavouriteApi, removeFavouriteApi } from "./favouriteApi";
import { logoutUser } from "../auth/authSlice";

export const getFavourite = createAsyncThunk("/favourites", async (_, { rejectWithValue }) => {
	try {
		const accomms = await getFavouriteApi();
		return accomms;
	} catch (error) {
		console.log("Error getting favourite list", error.message);
		return rejectWithValue("Error retrieving favourite list");
	}
});

export const addFavourite = createAsyncThunk("/favourites/add", async (accomm, { rejectWithValue }) => {
	try {
		const success = await addFavouriteApi(accomm.id);

		if (success) {
			return accomm;
		}
		throw new Error(`Fail to add ${accomm.id} to favourite`);
	} catch (error) {
		console.error(`Fail to add ${accomm.id} to favourite`);
		return rejectWithValue(error.response?.data?.error?.message || error.message || "Fail to add accomm to favourite");
	}
});

export const removeFavourite = createAsyncThunk("/favourites/remove", async (accomm, { rejectWithValue }) => {
	try {
		console.log("HEHE REMOVEEEEE", accomm.id, typeof accomm.id);
		const success = await removeFavouriteApi(accomm.id);

		if (success) {
			return accomm.id;
		}

		throw new Error(`Fail to remove ${accomm.id} from favourite`);
	} catch (error) {
		console.error(`Fail to remove ${accomm.id} from favourite`);
		return rejectWithValue(error.response?.data?.error?.message || error.message || "Fail to remove accomm from favourite");
	}
});

const initialState = {
	accomms: [], // lưu danh sách các object accommodation được đánh dấu yêu thích
	loading: false,
	error: "",
};

const favoritesSlice = createSlice({
	name: "favourites",
	initialState,
	reducers: {
		clearFavorites: (state) => {
			state.accomms = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getFavourite.fulfilled, (state, action) => {
				state.accomms = action.payload;
				state.loading = false;
				state.error = "";
			})
			.addCase(getFavourite.pending, (state) => {
				state.loading = true;
				state.error = "";
			})
			.addCase(getFavourite.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error("Error load favourites:", action.payload);
			})
			.addCase(addFavourite.fulfilled, (state, action) => {
				const exists = state.accomms.some((a) => a.id === action.payload.id);
				if (!exists) state.accomms.push(action.payload);
				state.loading = false;
			})
			.addCase(addFavourite.pending, (state) => {
				state.loading = true;
				state.error = "";
			})
			.addCase(addFavourite.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error("Error add favourites:", action.payload);
			})
			.addCase(removeFavourite.fulfilled, (state, action) => {
				state.accomms = state.accomms.filter((a) => a.id !== action.payload);
				state.loading = false;
				state.error = "";
			})
			.addCase(removeFavourite.pending, (state) => {
				state.loading = true;
				state.error = "";
			})
			.addCase(removeFavourite.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error("Error remove favourites:", action.payload);
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.accomms = [];
				state.loading = false;
				state.error = "";
			});
	},
});

export const { clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
