import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "./authApi";

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
	try {
		const data = await loginApi(credentials);
		// console.log(data);
		localStorage.setItem("jwt", data.jwt);
		return data;
	} catch (error) {
		console.error(error);
		return rejectWithValue(error.response?.data?.message || "Registration failed");
	}
});

export const register = createAsyncThunk("auth/register", async (information, { rejectWithValue }) => {
	try {
		await registerApi(information);
		return "Registration successful";
	} catch (error) {
		return rejectWithValue(error.response?.data?.message || "Registration failed");
	}
});

const initialState = {
	user: null,
	jwt: "",
	loading: false,
	error: null,
	successMessage: null,
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
			})
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = false;
				state.successMessage = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.successMessage = action.payload;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default authSlice.reducer;
