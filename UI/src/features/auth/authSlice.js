import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi } from "./authApi";

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
	try {
		const data = await loginApi(credentials);
		console.log(data);
		localStorage.setItem("jwt", data.jwt);
		return data;
	} catch (error) {
		console.error(error);
		return rejectWithValue(error.response?.data?.message);
	}
});

const initialState = {
	user: null,
	jwt: "",
	loading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.jwt = action.payload.jwt;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default authSlice.reducer;
