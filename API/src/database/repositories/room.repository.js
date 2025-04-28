import { Room as RoomModel, Booking as BookingModel } from "../models/index.js";
import { Op } from "sequelize";

export const RoomRepository = {
	async findByAccommodationId(accommId) {
		return await RoomModel.findAll({ where: { accommodationId: accommId } });
	},

	async findById(roomId) {
		return await RoomModel.findOne({ where: { id: roomId } });
	},

	async isEmptyBetween(roomId, startDate, endDate) {
		const bookings = await BookingModel.findOne({
			where: {
				roomId,
				status: { [Op.ne]: "CANCELED" }, // Exclude canceled bookings
				[Op.or]: [
					{
						startDate: { [Op.between]: [startDate, endDate] },
					},
					{
						endDate: { [Op.between]: [startDate, endDate] },
					},
					{
						startDate: { [Op.lte]: startDate },
						endDate: { [Op.gte]: endDate },
					},
				],
			},
		});

		// If no bookings are found, the room is empty
		return !bookings;
	},
};
