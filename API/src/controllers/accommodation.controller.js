import accommodationService from "../services/accommodation.service.js";
import SearchCriteriaBuilder from "../builders/conreteBuilders/SearchCriteriaBuilder.js";

export default {
	async getAccommodationDetail(req, res) {
		try {
			const id = parseInt(req.params.id, 10);
			const { startDate, endDate } = req.query;

			if (isNaN(id)) {
				return res.status(400).json({
					success: false,
					error: {
						code: 400,
						message: "Invalid accommodation ID",
					},
				});
			}

			const accommodation = await accommodationService.findById(id, startDate, endDate);

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

			const query = req.query;
			const builder = new SearchCriteriaBuilder()
				.withLocation(query)
				.withDateRange(query.startDate, query.endDate)
				.withOccupancy(query.roomCount, query.adultCount)
				.withPriceRange(query.priceMin, query.priceMax);

			const criteria = builder.build();

			const ret = await accommodationService.search(criteria);

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

	async getPopular(_, res) {
		try {
			const accommodations = await accommodationService.findPopular();
			res.status(200).json({
				success: true,
				message: `Found ${accommodations.length} result`,
				payload: accommodations,
			});
		} catch (error) {
			console.error(error);
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
