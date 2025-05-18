import { Booking as BookingModel, BookingItem as BookingItemModel } from "../models/index.js";
import EBookingStatus from "../../classes/EBookingStatus.js";
import { Op } from "sequelize";

export const BookingRepository = {
	// Find bookings from startDate to endDate
	async findBetweenDate(startDate, endDate) {
		const bookings = await BookingModel.findAll({
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

	async findOneById(bookingId) {
		return await BookingModel.findOne({ where: { id: bookingId } });
	},

	// Find all bookings by userId
	async findAllByUserId(userId) {
		const bookings = await BookingModel.findAll({
			where: { userId, status: { [Op.ne]: EBookingStatus.CANCELED } },
			order: [["createdAt", "DESC"]],
		});
		return bookings;
	},

	async createNew(booking) {
		booking = { ...booking, userId: booking.guest.id };
		const bookingId = await BookingModel.create(booking);
		return bookingId;
	},

	async createBookingItem({ bookingId, roomId, count }) {
		return await BookingItemModel.create({
			bookingId,
			roomId,
			count,
		});
	},

	async findBookingItems(bookingId) {
		return await BookingItemModel.findAll({ where: { bookingId: bookingId } });
	},

	async cancelBooking(bookingId) {
		const [affectedRows] = await BookingModel.update(
			{ status: EBookingStatus.CANCELED },
			{
				where: {
					id: bookingId,
					status: { [Op.ne]: EBookingStatus.CANCELED },
				},
			}
		);
		return affectedRows;
	},
};
