import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class Amenity extends Model {}

Amenity.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "Amenity",
		timestamps: true,
	}
);

export default Amenity;
