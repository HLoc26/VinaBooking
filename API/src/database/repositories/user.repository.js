import { User as UserModel, Room as RoomModel, Accommodation as AccommodationModel } from "../models/index.js";
export const UserRepository = {
	async findById(userId) {
		return await UserModel.findOne({ where: { id: userId } });
	},
	async findByEmail(email) {
		return await UserModel.findOne({ where: { email } });
	},

	async create(userData, transaction = null) {
		return await UserModel.create(userData, { transaction });
	},

	async updateById(id, updateData, transaction = null) {
		return await UserModel.update(updateData, { where: { id }, transaction });
	},

	async deleteById(id, transaction = null) {
		return await UserModel.destroy({ where: { id }, transaction });
	},
	// Find the accommodation owner's email by roomId
	async findAccommodationOwnerByRoomId(roomId) {
		const room = await RoomModel.findOne({
			where: { id: roomId },
			include: {
				model: AccommodationModel,
				include: {
					model: UserModel,
					as: "owner",
					attributes: ["id", "name", "email"],
				},
			},
		});
		return room && room.Accommodation && room.Accommodation.owner ? room.Accommodation.owner : null;
	},
};
