import { Op } from "sequelize";
import { Booking, BookingItem, Room, User, Accommodation } from "../models/index.js";
import { EBookingStatus } from "../../classes/index.js";

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

    // Find bookings by owner ID
    async findBookingsByOwner(ownerId, status = null) {
        // First find all accommodations owned by this user
        const accommodations = await Accommodation.findAll({
            where: { ownerId },
            attributes: ['id']
        });

        // Get accommodation IDs
        const accommodationIds = accommodations.map(acc => acc.id);

        // Find all rooms for these accommodations
        const rooms = await Room.findAll({
            where: { accommodationId: { [Op.in]: accommodationIds } },
            attributes: ['id']
        });

        // Get room IDs
        const roomIds = rooms.map(room => room.id);

        // Find all booking items containing these rooms
        const bookingItems = await BookingItem.findAll({
            where: { roomId: { [Op.in]: roomIds } },
            attributes: ['bookingId']
        });

        // Get unique booking IDs
        const bookingIds = [...new Set(bookingItems.map(item => item.bookingId))];

        // Prepare where condition
        const whereCondition = {
            id: { [Op.in]: bookingIds }
        };

        // Add status filter if provided
        if (status) {
            whereCondition.status = status;
        }

        // Find all bookings with the given booking IDs
        const bookings = await Booking.findAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'phone'],
                },
                {
                    model: BookingItem,
                    include: [
                        {
                            model: Room,
                            attributes: ['id', 'name', 'price', 'accommodationId']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return bookings;
    },

    // Find booking by ID for a specific owner
    async findBookingByIdForOwner(bookingId, ownerId) {
        // First find all accommodations owned by this user
        const accommodations = await Accommodation.findAll({
            where: { ownerId },
            attributes: ['id']
        });

        // Get accommodation IDs
        const accommodationIds = accommodations.map(acc => acc.id);

        // Find all rooms for these accommodations
        const rooms = await Room.findAll({
            where: { accommodationId: { [Op.in]: accommodationIds } },
            attributes: ['id']
        });

        // Get room IDs
        const roomIds = rooms.map(room => room.id);

        // Find all booking items containing these rooms and the specific booking ID
        const bookingItems = await BookingItem.findAll({
            where: { 
                roomId: { [Op.in]: roomIds },
                bookingId
            }
        });

        // If no booking items found, this booking doesn't belong to this owner
        if (bookingItems.length === 0) {
            return null;
        }

        // Get the booking with all its details
        const booking = await Booking.findOne({
            where: { id: bookingId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'phone'],
                },
                {
                    model: BookingItem,
                    include: [
                        {
                            model: Room,
                            attributes: ['id', 'name', 'price', 'accommodationId']
                        }
                    ]
                }
            ]
        });

        return booking;
    },

    // Update booking status
    async updateBookingStatus(bookingId, status) {
        try {
            const result = await Booking.update(
                { status },
                { where: { id: bookingId } }
            );
            return result[0] > 0; // Returns true if at least one row was updated
        } catch (error) {
            console.error("Error updating booking status:", error);
            return false;
        }
    }
};
