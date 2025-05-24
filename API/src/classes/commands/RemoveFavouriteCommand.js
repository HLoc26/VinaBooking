import Command from "./Command.js";

class RemoveFavouriteCommand extends Command {
	constructor(favouriteService, userId, accommodationId) {
		super();
		this.favouriteService = favouriteService;
		this.userId = userId;
		this.accommodationId = accommodationId;
	}

	async execute() {
		return await this.favouriteService.remove(this.userId, this.accommodationId);
	}

	async undo() {
		// Hoàn tác bằng cách thêm lại cơ sở lưu trú vào danh sách yêu thích
		return await this.favouriteService.add(this.userId, this.accommodationId);
	}
}

export default RemoveFavouriteCommand;
