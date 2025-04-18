import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";
import { EBookingStatus } from "../../classes/Booking.js";

class Booking extends Model {}

Booking.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
			  model: 'User',
			  key: 'id'
			}
		},
		startDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		endDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		guestCount: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			defaultValue: 1,
		},
		status: {
			type: DataTypes.ENUM(Object.values(EBookingStatus)),
			defaultValue: EBookingStatus.BOOKED,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "Booking",
		timestamps: true,
	}
);

Booking.associate = function(models) {
	models.Booking.belongsTo(models.User, {
	  foreignKey: 'userId',
	  as: 'user'
	});
};

export default Booking;
