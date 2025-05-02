import { Booking, Room, User, BookingItem } from "../classes/index.js";
import { BookingRepository } from "../database/repositories/booking.repository.js";
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
					throw new Error(`NotEnoughRoom${room.id}`);
				}

				// Create a BookingItem for the room type
				const bookingItem = new BookingItem({
					room: room,
					count: count,
				});

				// Save the BookingItem to the database within the transaction
				await bookingItem.save(bookingRecord.id, transaction);
			}

			// Commit the transaction if everything succeeds
			await transaction.commit();

			// Return the booking record with associated booking items
			return bookingRecord;
		} catch (error) {
			// Rollback the transaction if any error occurs
			await transaction.rollback();
			throw error;
		}
	},
};
