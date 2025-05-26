import Command from "./Command.js";

class AddFavouriteCommand extends Command {
	constructor(favouriteService, userId, accommodationId) {
		super();
		this.favouriteService = favouriteService;
		this.userId = userId;
		this.accommodationId = accommodationId;
	}

	async execute() {
		await this.favouriteService.add(this.userId, this.accommodationId);
		const updatedList = await this.favouriteService.findByUserId(this.userId);
		return { favouriteList: updatedList.accommodations };
	}

	async undo() {
		await this.favouriteService.remove(this.userId, this.accommodationId);
		const updatedList = await this.favouriteService.findByUserId(this.userId);
		return { favouriteList: updatedList.accommodations };
	}
}

export default AddFavouriteCommand;
