import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi, logoutApi, getCurrentUserApi } from "./authApi";

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
	try {
		console.log("Auth slice login thunk called");

		// Validate credentials
		if (!credentials || !credentials.email || !credentials.password) {
			return rejectWithValue("Email and password are required");
		}

		const data = await loginApi(credentials);
		console.log("Login succeeded");

		// JWT is now handled by HTTP-only cookies

		return data;
	} catch (error) {
		console.error("Login failed");
		return rejectWithValue(error.response?.data?.error?.message || error.message || "Login failed");
	}
});

// Add restoreSession thunk to check if user is already authenticated
export const restoreSession = createAsyncThunk("auth/restoreSession", async (_, { rejectWithValue }) => {
	try {
		console.log("Attempting to restore session");
		const userData = await getCurrentUserApi();

		console.log("Session restored successfully");
		return {
			user: userData,
			rememberMe: true, // Assume remembered if session exists
		};
	} catch (error) {
		console.log("Session restoration failed:", error.message);
		// Don't show errors to the user for session restoration attempts
		return rejectWithValue("No active session found");
	}
});

// Add logoutUser thunk that calls the API
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
	try {
		await logoutApi();
		console.log("Logout successful");
		return true;
	} catch (error) {
		console.error("Logout failed:", error.message);
		return rejectWithValue(error.message || "Logout failed");
	}
});

const initialState = {
	user: null,
	rememberMe: false,
	loading: false,
	error: null,
	isLoggedIn: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			state.isLoggedIn = false;
			state.error = null;
		},
		clearErrors: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Login cases
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.rememberMe = action.payload.rememberMe || false;
				state.isLoggedIn = true;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Authentication failed";
			})

			// Restore session cases
			.addCase(restoreSession.pending, (state) => {
				state.loading = true;
				// Don't clear error state here to avoid UI flashes during session check
			})
			.addCase(restoreSession.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.isLoggedIn = true;
				state.rememberMe = action.payload.rememberMe;
			})
			.addCase(restoreSession.rejected, (state) => {
				state.loading = false;
				// Don't set error for session restoration failure
				// This is an expected case when user isn't logged in
			})

			// Logout cases
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.isLoggedIn = false;
				state.rememberMe = false;
			});
	},
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
