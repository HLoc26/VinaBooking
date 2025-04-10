import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class Address extends Model {}

Address.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		addressLine: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		state: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		postalCode: {
			type: DataTypes.STRING(10),
			allowNull: true,
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		latitude: {
			type: DataTypes.DECIMAL(10, 8),
			allowNull: true,
		},
		longitude: {
			type: DataTypes.DECIMAL(11, 8),
			allowNull: true,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "Address",
		timestamps: true,
	}
);

export default Address;
