/**
 * @class Image
 */
class Image {
	constructor({ filename, id }) {
		this.filename = filename;
		this.id = id;
	}

	static fromModel(model) {
		return new Image({
			filename: model.filename,
			id: model.id
		});
	}

	toPlain() {
		return {
			id: this.id,
			filename: this.filename,
		};
	}
}

export default Image;
