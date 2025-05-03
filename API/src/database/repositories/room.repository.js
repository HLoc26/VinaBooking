import EBookingStatus from "../../classes/EBookingStatus.js";
import { Room as RoomModel, Booking as BookingModel, BookingItem as BookingItemModel } from "../models/index.js";
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
				status: { [Op.ne]: EBookingStatus.CANCELED }, // Exclude canceled bookings
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

	// calculate the number of rooms of a specific type
	// that are already booked for a given date range
	async getBookedCount(roomId, startDate, endDate) {
		const bookedItems = await BookingItemModel.findAll({
			include: [
				{
					model: BookingModel,
					as: "Booking",
					where: {
						status: { [Op.ne]: EBookingStatus.CANCELED }, // Exclude canceled bookings
						[Op.or]: [
							{ startDate: { [Op.between]: [startDate, endDate] } },
							{ endDate: { [Op.between]: [startDate, endDate] } },
							{ startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } },
						],
					},
				},
			],
			where: {
				roomId,
			},
		});

		// Sum up the booked counts from BookingItem records
		return bookedItems.reduce((total, item) => total + item.count, 0);
	},
};
