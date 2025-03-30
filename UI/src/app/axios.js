import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:3000/api",
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("jwt"); // or "token"
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosInstance;
