import { Booking, Room, User, BookingItem } from "../classes/index.js";
import { BookingRepository } from "../database/repositories/booking.repository.js";
import { EBookingStatus } from "../classes/index.js";
import sequelize from "../config/sequelize.js";

export default {
	async bookRoom({ rooms, guestId, startDate, endDate, guestCount }) {
		// Validate input
		if (!rooms || typeof rooms !== "object" || Object.keys(rooms).length === 0) {
			throw new Error("InvalidRoomData");
		}

		// Start a transaction
		const transaction = await sequelize.transaction();

		try {
			// Load user information
			const user = new User({ id: guestId });
			await user.loadInfo();

			// Create a new Booking record
			const booking = new Booking({
				guest: user,
				startDate,
				endDate,
				guestCount,
				status: "BOOKED",
			});

			// Save the booking to the database within the transaction
			const bookingRecord = await BookingRepository.createNew(booking.toPlain(), { transaction });

			// Iterate over the rooms dictionary to create BookingItem records
			for (const [roomId, count] of Object.entries(rooms)) {
				// Validate room count
				if (count <= 0) {
					throw new Error(`InvalidRoomCount`);
				}

				// Load room information
				const room = new Room({ id: roomId });
				await room.loadInfo();

				if (!room) {
					throw new Error(`RoomNotFound`);
				}

				// Check if the required number of rooms are available
				if (!(await room.isAvailableForCount(startDate, endDate, count))) {
					throw new Error(`NotEnoughRoom`);
				}

				// Create a BookingItem for the room type
				const bookingItem = new BookingItem({
					room: room,
					count: count,
				});

				// Save the BookingItem to the database within the transaction
				await bookingItem.save(bookingRecord.id, transaction);
			}

			// Return the booking record with associated booking items
			const returnObject = await Booking.fromModel(bookingRecord);

			// Commit the transaction if everything succeeds
			await transaction.commit();

			return returnObject;
		} catch (error) {
			// Rollback the transaction if any error occurs
			await transaction.rollback();
			throw error;
		}
	},

	// Get all bookings for a user
	async getBookingList(userId) {
		const bookingModels = await BookingRepository.findAllByUserId(userId);
		const bookings = await Promise.all(bookingModels.map(async (model) => await Booking.fromModel(model)));
		return bookings;
	},

	async cancelBooking(bookingId, userId) {
		const booking = await BookingRepository.findOneById(bookingId);
		if (!booking) return "NOT_FOUND";

		if (booking.userId !== userId) return "FORBIDDEN";
		if (booking.status === EBookingStatus.CANCELED) return "ALREADY_CANCELED";

		const affectedRows = await BookingRepository.cancelBooking(bookingId);
		return affectedRows === 1;
	},
};
