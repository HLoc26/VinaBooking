import { Sequelize } from "sequelize";
import "dotenv/config";

const HOST = process.env.MYSQL_HOST;
const PORT = process.env.MYSQL_PORT;
const DATABASE = process.env.MYSQL_DATABASE;
const USERNAME = process.env.MYSQL_USER;
const PASSWORD = process.env.MYSQL_PASSWORD;

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
	host: HOST, // For docker, change to localhost if not using docker
	port: PORT,
	dialect: "mysql",
	logging: false, // Change to true if want to check sql query
});

export default sequelize;
