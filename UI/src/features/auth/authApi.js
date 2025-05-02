import axiosInstance from "../../app/axios";

export const loginApi = async (credentials) => {
	try {
		console.log("Sending login request with:", credentials); // Debug log

		// Check if credentials are valid
		if (!credentials || !credentials.email || !credentials.password) {
			console.error("Missing credentials:", credentials);
			throw new Error("Email and password are required");
		}

		// Explicitly format the payload
		const payload = {
			email: credentials.email,
			password: credentials.password,
		};

		const response = await axiosInstance.post("/auth/login", payload);
		console.log("Login response:", response.data); // Debug log

		// Now only return user, JWT is in cookie
		if (response.data && response.data.success) {
			return {
				user: response.data.payload.user,
			};
		}

		throw new Error(response.data?.error?.message || "Login failed");
	} catch (error) {
		console.error("Login API error:", error);
		throw error;
	}
};
