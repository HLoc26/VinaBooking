import axiosInstance from "../../app/axios";

export const loginApi = async (credentials) => {
	const response = await axiosInstance.post("/auth/login", credentials);
	console.log(response);
	return response.data;
};
