import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class Image extends Model {}

Image.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		filename: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "Image",
		timestamps: true,
	}
);

export default Image;
