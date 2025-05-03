import { Accommodation } from "../../classes/index.js";
import { Op, literal } from "sequelize";
import {
	Accommodation as AccommodationModel,
	AccommodationAmenity as AccommodationAmenityModel,
	Address as AddressModel,
	Image as ImageModel,
	Room as RoomModel,
	RoomAmenity as RoomAmenityModel,
	Amenity as AmenityModel,
	Review as ReviewModel,
} from "../models/index.js";

export const AccommodationRepository = {
	async findById(accommodationId) {
		const model = await AccommodationModel.findByPk(accommodationId);
		if (!model) {
			return null;
		}
		return new Accommodation({
			id: model.id,
			name: model.name,
			isActive: model.isActive,
		});
	},

	async findByAddress({ city, state, postalCode }) {
		const conditions = {};

		if (city) {
			conditions[`$${AddressModel.name}.city$`] = { [Op.like]: `%${city}%` };
		}
		if (state) {
			conditions[`$${AddressModel.name}.state$`] = { [Op.like]: `%${state}%` };
		}
		if (postalCode) {
			conditions[`$${AddressModel.name}.postal_code$`] = { [Op.like]: `%${postalCode}%` };
		}
		// Do not search by country, the data could be huge

		return await AccommodationModel.findAll({
			where: conditions,
			include: {
				model: AddressModel,
				attributes: [],
			},
		});
	},

	async getFullInfo(accommId) {
		const accommodation = await AccommodationModel.findOne({
			where: { id: accommId },
			include: [
				{
					model: AccommodationAmenityModel,
					include: [{ model: AmenityModel }],
				},
				{
					model: AddressModel,
				},
				{
					model: RoomModel,
					include: [
						{ model: ImageModel },
						{
							model: RoomAmenityModel,
							include: [{ model: AmenityModel }],
						},
					],
				},
				{
					model: ImageModel,
				},
			],
		});
		return accommodation;
	},

	// Find all with booking counts and min price
	async findPopular() {
		// Use a more efficient subquery approach
		return await AccommodationModel.findAll({
			attributes: [
				["id", "accommodationId"],
				"name",
				["is_active", "isActive"],
				// This could be changed to sequelize query
				[
					literal(`(
							SELECT MIN(price)
							FROM Room
							WHERE Room.accommodation_id = Accommodation.id
						)`),
					"minPrice",
				],
				// TODO: Remove the "--" for real product
				[
					literal(`(
							SELECT COUNT(DISTINCT Booking.id)
							FROM Booking
							JOIN BookingItem ON BookingItem.booking_id = Booking.id
							JOIN Room ON Room.id = BookingItem.room_id
							WHERE Room.accommodation_id = Accommodation.id
							-- AND Booking.status = 'COMPLETED'
						)`),
					"bookingCount",
				],
				[
					literal(`
					ROUND(
						COALESCE((
							SELECT AVG(star)
							FROM Review
							WHERE Review.accommodation_id = Accommodation.id),
						0),
					1)`),
					"averageStar",
				],
			],
			include: [
				{
					model: AddressModel,
					attributes: [["id", "addressId"], ["address_line", "addressLine"], "city", "state", ["postal_code", "postalCode"], "country"],
					required: true,
				},
				{
					model: ImageModel,
					attributes: [["id", "imageId"], "filename"],
					required: false,
				},
				{
					model: ReviewModel,
					attributes: [["id", "reviewId"], "star"],
					required: false,
				},
				{
					model: AccommodationAmenityModel,
					include: [{ model: AmenityModel }],
					required: false,
				},
			],
			where: {
				is_active: true, // Optional: only include active accommodations
			},
			order: [[literal("bookingCount"), "DESC"]],
			limit: 10,
			subQuery: true, // Important for performance with complex queries
		});
	},
};
