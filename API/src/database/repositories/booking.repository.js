import { Booking } from "../models/index.js";
import { EBookingStatus } from "../../classes/index.js";
import { Op } from "sequelize";

export const BookingRepository = {
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
};
