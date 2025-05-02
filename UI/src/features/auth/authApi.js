import axiosInstance from "../../app/axios";

export const loginApi = async (credentials) => {
	try {
		console.log("Attempting login"); // Removed credentials from log

		// Check if credentials are valid
		if (!credentials || !credentials.email || !credentials.password) {
			console.error("Missing credentials"); // Removed specific missing fields
			throw new Error("Email and password are required");
		}

		// Explicitly format the payload
		const payload = {
			email: credentials.email,
			password: credentials.password,
		};

		const response = await axiosInstance.post("/auth/login", payload);
		console.log("Login request completed"); // Removed response data from log

		// Now only return user, JWT is in cookie
		if (response.data && response.data.success) {
			return {
				user: response.data.payload.user,
			};
		}

		throw new Error(response.data?.error?.message || "Login failed");
	} catch (error) {
		console.error("Login API error occurred"); // Removed error details
		throw error;
	}
};
