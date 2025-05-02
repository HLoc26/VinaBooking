import accommodationService from "../services/accommodation.service.js";

export default {
	async getAccommodationDetail(req, res) {
		try {
			const id = parseInt(req.params.id, 10);

			if (isNaN(id)) {
				return res.status(400).json({
					success: false,
					error: {
						code: 400,
						message: "Invalid accommodation ID",
					},
				});
			}

			const accommodation = await accommodationService.findById(id);

			if (!accommodation) {
				return res.status(404).json({
					success: false,
					error: {
						code: 404,
						message: "Accommodation not found",
					},
				});
			}

			return res.status(200).json({
				success: true,
				message: "Successfully retrieved accommodation detail",
				payload: {
					accommodation,
				},
			});
		} catch (error) {
			console.error("Error getting accommodation detail:", error);
			return res.status(500).json({
				success: false,
				error: {
					code: 500,
					message: "Internal Server Error",
				},
			});
		}
	},

	async search(req, res) {
		try {
			// Assume that we use VND for price
			const { city, state, postalCode, country, startDate, endDate, roomCount, adultCount, priceMin, priceMax } = req.query;

			const ret = await accommodationService.search({
				city,
				state,
				postalCode,
				country,
				startDate,
				endDate,
				roomCount,
				adultCount,
				priceMin,
				priceMax,
			});

			res.status(200).json({
				success: true,
				message: `Successfully found ${ret.length} results.`,
				payload: ret,
			});
		} catch (error) {
			console.error("Search accommodation error", error);
			res.status(500).json({
				success: false,
				error: {
					code: 500,
					message: "Internal Server Error",
				},
			});
		}
	},
};
