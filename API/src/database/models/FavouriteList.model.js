import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class FavouriteList extends Model {}

FavouriteList.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "FavouriteList",
		timestamps: true,
	}
);

export default FavouriteList;
