import Command from "./Command.js";

class AddFavouriteCommand extends Command {
	constructor(favouriteService, userId, accommodationId) {
		super();
		this.favouriteService = favouriteService;
		this.userId = userId;
		this.accommodationId = accommodationId;
	}

	async execute() {
		return await this.favouriteService.add(this.userId, this.accommodationId);
	}

	async undo() {
		// Hoàn tác bằng cách xóa cơ sở lưu trú khỏi danh sách yêu thích
		return await this.favouriteService.remove(this.userId, this.accommodationId);
	}
}

export default AddFavouriteCommand;
