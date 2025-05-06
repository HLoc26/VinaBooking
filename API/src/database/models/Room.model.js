import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class Room extends Model {}

Room.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			unique: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		maxCapacity: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			defaultValue: 1,
		},
		size: {
			type: DataTypes.FLOAT,
			allowNull: false,
			comment: "Room size in square meters",
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
			validate: {
				min: 0,
			},
		},
		count: {
			type: DataTypes.INTEGER.UNSIGNED,
			defaultValue: 1,
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "Room",
		timestamps: true,
	}
);

export default Room;
