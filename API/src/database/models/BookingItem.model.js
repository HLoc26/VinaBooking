import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/sequelize.js";

class BookingItem extends Model {}

BookingItem.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		count: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			defaultValue: 1,
		},
		bookingId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "Booking",
				key: "id",
			},
		},
		roomId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "Room",
				key: "id",
			},
		},
	},
	{
		sequelize,
		tableName: "BookingItem",
		freezeTableName: true,
		timestamps: true,
	}
);

export default BookingItem;
