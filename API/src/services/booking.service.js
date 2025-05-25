import { Booking, Room, User, BookingItem } from "../classes/index.js";
import { BookingRepository } from "../database/repositories/booking.repository.js";
import sequelize from "../config/sequelize.js";
import { BookingEvent, TravellerNotifier, OwnerNotifier } from "../observers/index.js";
import { UserRepository } from "../database/repositories/user.repository.js";
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
				// Fetch owner email for the first room (assuming all rooms belong to the same accommodation/owner)
			}

			const owner = await UserRepository.findAccommodationOwnerByRoomId(rooms[Object.keys(rooms)[0]]);
			console.log("Owner:", owner);
			let ownerEmail = undefined;
			if (owner && owner.email) {
				ownerEmail = owner.email;
			}
			// Return the booking record with associated booking items
			const returnObject = await Booking.fromModel(bookingRecord);

			// Commit the transaction if everything succeeds
			await transaction.commit();

			// --- Observer Pattern: Notify traveller and owner ---
			const bookingEvent = new BookingEvent();
			bookingEvent.add(new TravellerNotifier());
			bookingEvent.add(new OwnerNotifier());

			// You may need to load owner info depending on your data model
			//const owner = booking.guest && booking.guest.owner ? booking.guest.owner : null;

			await bookingEvent.notify({
				travellerEmail: user.email,
				ownerEmail: owner ? owner.email : undefined,
				bookingInfo: returnObject,
			});
			// ---------------------------------------------------

			return returnObject;
		} catch (error) {
			// Rollback the transaction if any error occurs
			await transaction.rollback();
			throw error;
		}
	},
};
