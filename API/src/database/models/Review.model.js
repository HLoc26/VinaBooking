import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class Review extends Model {}

Review.init(
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
		accommodationId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'Accommodation',
				key: 'id'
			}
		},
		star: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				min: 0,
				max: 5,
			},
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		reviewDate: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "Review",
		timestamps: true,
	}
);

export default Review;
