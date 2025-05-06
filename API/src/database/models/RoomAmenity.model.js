import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";
import { ERoomAmenityType } from "../../classes/RoomAmenity.js";

class RoomAmenity extends Model {}

RoomAmenity.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		type: {
			type: DataTypes.ENUM(Object.values(ERoomAmenityType)),
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "RoomAmenity",
		timestamps: true,
	}
);

export default RoomAmenity;
