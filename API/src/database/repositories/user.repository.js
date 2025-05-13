import { User as UserModel } from "../models/index.js";

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
};
