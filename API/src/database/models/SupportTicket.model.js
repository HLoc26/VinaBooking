import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class SupportTicket extends Model {}

SupportTicket.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		subject: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		createdDate: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		resolveDate: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "SupportTicket",
		timestamps: true,
	}
);

export default SupportTicket;
