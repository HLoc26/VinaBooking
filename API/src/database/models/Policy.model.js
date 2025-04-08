import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";
import { ECancelPolicy, EPrepayPolicy } from "../../classes/Policy.js";

class Policy extends Model {}

Policy.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		checkIn: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		checkOut: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		cancellation: {
			type: DataTypes.ENUM(Object.values(ECancelPolicy)),
			allowNull: false,
		},
		prepay: {
			type: DataTypes.ENUM(Object.values(EPrepayPolicy)),
			allowNull: false,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "Policy",
		timestamps: true,
	}
);

export default Policy;
