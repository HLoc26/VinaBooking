import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";
import { EGender, ERole } from "../../classes/User.js";

class User extends Model {}

User.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			unique: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		phone: {
			type: DataTypes.STRING(10),
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(60),
		},
		role: {
			type: DataTypes.ENUM([ERole.ACCOMMODATION_OWNER, ERole.REGISTERED]),
			allowNull: false,
			defaultValue: ERole.REGISTERED,
		},
		gender: {
			type: DataTypes.ENUM([EGender.MALE, EGender.FEMALE]),
			allowNull: false,
		},
		dob: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		sequelize, // This associates the model with the sequelize instance
		freezeTableName: true,
		tableName: "User",
		timestamps: true, // Adds createdAt and updatedAt
	}
);

export default User;
