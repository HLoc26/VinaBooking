import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi } from "./authApi";

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
	try {
		console.log("Auth slice login thunk called"); // Removed credentials from log

		// Validate credentials
		if (!credentials || !credentials.email || !credentials.password) {
			return rejectWithValue("Email and password are required");
		}

		const data = await loginApi(credentials);
		console.log("Login succeeded"); // Removed data from log

		// No longer store JWT in localStorage

		return data;
	} catch (error) {
		console.error("Login failed"); // Removed error details
		return rejectWithValue(error.response?.data?.error?.message || error.message || "Login failed");
	}
});

const initialState = {
	user: null,
	jwt: "",
	rememberMe: false,
	loading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			state.jwt = "";
			state.error = null;
		},
		clearErrors: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.rememberMe = action.payload.rememberMe || false;
				state.jwt = action.payload.jwt || "";
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Authentication failed";
			});
	},
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
