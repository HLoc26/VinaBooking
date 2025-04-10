import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";
import { EAccommodationAmenityType } from "../../classes/index.js";

class AccommodationAmenity extends Model {}

AccommodationAmenity.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		type: {
			type: DataTypes.ENUM(Object.values(EAccommodationAmenityType)),
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "AccommodationAmenity",
		timestamps: true,
	}
);

export default AccommodationAmenity;
