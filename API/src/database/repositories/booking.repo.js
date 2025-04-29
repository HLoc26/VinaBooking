import { Booking, Room, Accommodation, Address } from "../models/index.js";
import { EBookingStatus } from "../../classes/index.js";
import { Op } from "sequelize";

export default {
	// Find bookings from startDate to endDate
	async findBetweenDate(startDate, endDate) {
		const bookings = await Booking.findAll({
			where: {
				[Op.and]: {
					end_date: { [Op.gte]: startDate }, // room.end_date >= startDate
					start_date: { [Op.lte]: endDate }, // and room.start_date <= endDate
					status: { [Op.ne]: EBookingStatus.CANCELED }, // and status != "CANCELED"
				},
			},
		});
		return bookings;
	},

	// Find all bookings for a specific user
	async findAll(userId) {
		return await Booking.findAll({
			where: { userId }, // Filter bookings by user ID
			include: [
				{
					model: Room,
					include: [
						{
							model: Accommodation, // Include associated Accommodation model
							include: [Address], // Include associated Address model
						},
					],
				},
			],
			order: [["createdAt", "DESC"]], // Order the results by creation date in descending order
		});
	},
};
