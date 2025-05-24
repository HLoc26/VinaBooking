import accommodationService from "../services/accommodation.service.js";
import { HotelBookingFacade, SearchDiscoveryFacade } from "../facades/index.js";

export default {
	async getAccommodationDetail(req, res) {
		try {
			const id = parseInt(req.params.id, 10);
			const { startDate, endDate } = req.query;
			const userId = req.user?.id; // Get user ID from auth middleware if available

			if (isNaN(id)) {
				return res.status(400).json({
					success: false,
					error: {
						code: 400,
						message: "Invalid accommodation ID",
					},
				});
			}

			// Use facade for comprehensive accommodation details
			const result = await HotelBookingFacade.getAccommodationDetails({
				accommodationId: id,
				startDate,
				endDate,
				userId,
			});

			return res.status(200).json({
				success: true,
				message: "Successfully retrieved accommodation detail",
				payload: result,
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
			const { city, state, postalCode, country, startDate, endDate, roomCount, adultCount, priceMin, priceMax, amenities, minRating, sortBy, page, limit } = req.query;

			const userId = req.user?.id; // Get user ID from auth middleware if available

			// Use facade for intelligent search with personalization
			const result = await SearchDiscoveryFacade.intelligentSearch({
				city,
				state,
				postalCode,
				country,
				startDate,
				endDate,
				roomCount: parseInt(roomCount) || 1,
				adultCount: parseInt(adultCount) || 1,
				priceMin: priceMin ? parseFloat(priceMin) : undefined,
				priceMax: priceMax ? parseFloat(priceMax) : undefined,
				amenities: amenities ? amenities.split(",") : [],
				minRating: minRating ? parseFloat(minRating) : undefined,
				sortBy: sortBy || "relevance",
				page: parseInt(page) || 1,
				limit: parseInt(limit) || 20,
				userId,
			});

			res.status(200).json({
				success: true,
				message: `Successfully found ${result.filteredResultCount} results.`,
				payload: result,
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
