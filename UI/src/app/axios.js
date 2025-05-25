import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:3000/api",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
