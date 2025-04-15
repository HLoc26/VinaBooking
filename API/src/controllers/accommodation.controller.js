import AccommodationService from "../services/accommodation.service.js";

export default {
	async getAccommodationDetail(req, res) {
		try {
			const id = req.query.id;
			const acc = await AccommodationService.findById(id);
			console.log("HELLO");
			res.json(acc);
		} catch (error) {
			console.error("Error getting accommodation detail:", error);
			res.status(500).json({ success: false, message: "Internal Server Error" });
		}
	},
};
