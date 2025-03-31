/**
 * User class, have 2 children: `RegisteredUser` and `AccommodationOwner`
 * @class User
 */
class User {
	constructor(name, phone, email, password, role, gender, dob) {
		this.name = name;
		this.phone = phone;
		this.email = email;
		this.password = password;
		this.role = role;
		this.gender = gender;
		this.dob = dob;
	}

	validateAccount(username, password) {
		// Validate using UserDAO (sequelize)
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
