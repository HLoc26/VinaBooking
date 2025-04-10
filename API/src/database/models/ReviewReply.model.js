import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class ReviewReply extends Model {}

ReviewReply.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		replyDate: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		tableName: "ReviewReply",
		timestamps: true,
	}
);

export default ReviewReply;
