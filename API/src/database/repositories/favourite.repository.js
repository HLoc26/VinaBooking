import FavouriteList from "../../classes/FavouriteList.js";
import { Accommodation as AccommodationModel, FavouriteList as FavouriteListModel } from "../models/index.js";

export const FavouriteRepository = {
	async findByUser(userId) {
		let favListModel = await FavouriteListModel.findOne({
			where: { userId: userId },
			include: {
				model: AccommodationModel,
			},
		});

		if (!favListModel) {
			favListModel = await this.create(userId);
			console.warn(`FavouriteList not found for user ${userId}, created new one.`);
		}

		const accommodations = favListModel.Accommodation.map((a) => a.toJSON());

		return new FavouriteList({
			id: favListModel.id,
			userId,
			accommodations: accommodations,
		});
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
