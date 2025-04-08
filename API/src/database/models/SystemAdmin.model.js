import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class SystemAdmin extends Model {}

SystemAdmin.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(60),
			allowNull: false,
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "SystemAdmin",
		timestamps: true,
	}
);

export default SystemAdmin;
