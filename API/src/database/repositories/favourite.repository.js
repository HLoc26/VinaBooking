import FavouriteList from "../../classes/FavouriteList.js";
import {
	Accommodation as AccommodationModel,
	AccommodationAmenity as AccommodationAmenityModel,
	Address as AddressModel,
	Image as ImageModel,
	Room as RoomModel,
	RoomAmenity as RoomAmenityModel,
	Amenity as AmenityModel,
	Policy as PolicyModel,
	Review as ReviewModel,
	ReviewReply as ReviewReplyModel,
	User as UserModel,
	FavouriteList as FavouriteListModel,
} from "../models/index.js";

export const FavouriteRepository = {
	async findByUser(userId) {
		let favListModel = await FavouriteListModel.findOne({
			where: { userId: userId },
			include: {
				model: AccommodationModel,
				include: [
					{
						model: AccommodationAmenityModel,
						required: false,
						include: [
							{
								model: AmenityModel,
								attributes: ["id", "name"],
							},
						],
					},
					{ model: AddressModel },
					{
						model: RoomModel,
						include: [
							{
								model: RoomAmenityModel,
								include: [{ model: AmenityModel }],
							},
						],
					},
					{ model: ImageModel },
					{ model: PolicyModel },
					{
						model: ReviewModel,
						include: [
							{
								model: UserModel,
								as: "reviewer",
							},
							{ model: ImageModel },
							{
								model: ReviewReplyModel,
								include: [{ model: UserModel }],
							},
						],
					},
				],
			},
		});

		if (!favListModel) {
			favListModel = await this.create(userId);
			console.warn(`FavouriteList not found for user ${userId}, created new one.`);
		}

		return favListModel;
	},

	async create(userId) {
		const favList = await FavouriteListModel.create({ userId: userId }, { returning: true, plain: true });
		return new FavouriteList({
			id: favList.id,
			userId: userId,
		});
	},

	async save(favList) {
		try {
			const favListModel = await FavouriteListModel.findByPk(favList.id);
			if (!favListModel) throw new Error("FavouriteList not found");

			const accommodationIds = favList.accommodations.map((a) => a.id);

			await favListModel.setAccommodation(accommodationIds);
		} catch (error) {
			console.error(error);
			throw new Error(error.message);
		}
	},
};
