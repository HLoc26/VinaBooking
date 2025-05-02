import axiosInstance from "../../app/axios";

export const loginApi = async (credentials) => {
	try {
		console.log("Attempting login");

		// Check if credentials are valid
		if (!credentials || !credentials.email || !credentials.password) {
			console.error("Missing credentials");
			throw new Error("Email and password are required");
		}

		// Explicitly format the payload
		const payload = {
			email: credentials.email,
			password: credentials.password,
			rememberMe: credentials.rememberMe || false, // Include rememberMe flag
		};

		// Make sure credentials are sent with credentials option to include cookies
		const response = await axiosInstance.post("/auth/login", payload, { withCredentials: true });
		console.log("Login request completed");

		// Extract only the user data from the response
		if (response.data && response.data.success) {
			return {
				user: response.data.payload.user,
				rememberMe: response.data.payload.rememberMe,
			};
		}

		throw new Error(response.data?.error?.message || "Login failed");
	} catch (error) {
		console.error("Login API error occurred");
		throw error;
	}
};

export const logoutApi = async () => {
	try {
		const response = await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
		return response.data;
	} catch (error) {
		console.error("Logout API error occurred");
		throw error;
	}
};
