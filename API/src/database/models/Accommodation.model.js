import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class Accommodation extends Model {}

Accommodation.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		sequelize, // Add sequelize configuration object
		freezeTableName: true,
		tableName: "Accommodation",
		timestamps: true,
	}
);

export default Accommodation;
