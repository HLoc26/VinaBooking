import {
	Review as ReviewModel, 
	ReviewReply as ReviewReplyModel,
	User as UserModel,
	Image as ImageModel,
 } from "../models/index.js";

export const ReviewRepository = {
	async findByAccommodationId(accommId) {
		return await ReviewModel.findAll({
			where: { accommodationId: accommId },
			include: [
				{
					model: UserModel,
					as: "reviewer",
				},
				{
					model: ImageModel,
				},
				{
					model: ReviewReplyModel,
				},
			],
		});
	},
};
