import axiosInstance from "../../app/axios";

export const getFavouriteApi = async () => {
	try {
		const response = await axiosInstance.get("/favourite");

		if (response.data && response.data.success) {
			return response.data.payload.accommodations;
		}
		throw new Error(response.data?.error?.message);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// Returns true if success
export const addFavouriteApi = async (accommId) => {
	try {
		const response = await axiosInstance.post("/favourite/add", { accommodationId: accommId });

		if (response.data && response.data.success) {
			return response.data.success;
		}
		return false;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// Returns true if success
export const removeFavouriteApi = async (accommId) => {
	try {
		const response = await axiosInstance.delete(`/favourite/remove/${accommId}`);

		if (response.data && response.data.success) {
			return response.data.success;
		}
		return false;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// Returns accommodations list if success
export const undoFavouriteApi = async () => {
    try {
        const response = await axiosInstance.post("/favourite/undo");
        if (response.data && response.data.success) {
            return response.data.payload.accommodations;
        }
        throw new Error(response.data?.error?.message || "Failed to undo favourite action");
    } catch (error) {
        console.error("Error in undoFavouriteApi:", error);
        throw error;
    }
};