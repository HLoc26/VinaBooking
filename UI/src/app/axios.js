import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_PATH,
	timeout: 500000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
