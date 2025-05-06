import { UserRepository } from "../database/repositories/user.repository.js";

/**
 * User class, has 2 children: `RegisteredUser` and `AccommodationOwner`
 * @class User
 */
class User {
	constructor({ id, name, phone, email, password, role, gender, dob, isActive = true }) {
		this.id = id;
		this.name = name;
		this.phone = phone;
		this.email = email;
		this.password = password;
		this.role = role;
		this.gender = gender;
		this.dob = dob;
		this.isActive = isActive;
	}

	async loadInfo() {
		const userInfo = await UserRepository.findById(this.id);
		const instance = User.fromModel(userInfo);
		Object.assign(this, instance);
	}

	static fromModel(model) {
		return new User({
			id: model.id,
			name: model.name,
			phone: model.phone,
			email: model.email,
			password: model.password,
			role: model.role,
			gender: model.gender,
			dob: model.dob,
			isActive: model.isActive,
		});
	}

	toPlain() {
		return {
			id: this.id,
			name: this.name,
			email: this.email,
			isActive: this.isActive,
		};
	}

	validateAccount(username, password) {
		// TODO: Implement account validation logic
	}

	static async findByEmail(email) {
		const model = await UserRepository.findByEmail(email);
		return model ? User.fromModel(model) : null;
	}

	static async findById(id) {
		const model = await UserRepository.findById(id);
		return model ? User.fromModel(model) : null;
	}
	async save() {
		const userData = {
			name: this.name,
			phone: this.phone,
			email: this.email,
			password: this.password,
			role: this.role,
			gender: this.gender,
			dob: this.dob,
			isActive: this.isActive,
		};

		const created = await UserRepository.create(userData);
		this.id = created.id; // update id after saving
	}
}

/**
 * Enum for gender values.
 * @readonly
 * @enum {string}
 */
export const EGender = Object.freeze({
	MALE: "male",
	FEMALE: "female",
});

/**
 * Enum for user roles.
 * @readonly
 * @enum {string}
 */
export const ERole = Object.freeze({
	REGISTERED: "registered user",
	ACCOMMODATION_OWNER: "accommodation owner",
});

export default User;
