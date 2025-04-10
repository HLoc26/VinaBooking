import { Sequelize } from "sequelize";
import "dotenv/config";

const DATABASE = process.env.MYSQL_DATABASE;
const USERNAME = process.env.MYSQL_USER;
const PASSWORD = process.env.MYSQL_PASSWORD;

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
	host: "db", // For docker, change to localhost if not using docker
	dialect: "mysql",
	define: {
		charset: "utf8mb4",
		collate: "utf8mb4_unicode_ci",
		underscored: true,
		freezeTableName: true,
	},
});

export default sequelize;
