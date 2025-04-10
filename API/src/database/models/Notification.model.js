import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class Notification extends Model {}

Notification.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		detail: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		notifiedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "Notification",
		timestamps: true,
	}
);

export default Notification;
