import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

class Invoice extends Model {}

Invoice.init(
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
		tableName: "Invoice",
		timestamps: true,
	}
);

export default Invoice;
