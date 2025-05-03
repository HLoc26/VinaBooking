import { User as UserModel } from "../models/index.js";

export const UserRepository = {
	async findById(userId) {
		return await UserModel.findOne({ where: { id: userId } });
	},
};
