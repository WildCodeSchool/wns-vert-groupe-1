import { DataSource } from "typeorm";

const dataSource = new DataSource({
	type: "postgres",
	host: "db",
	port: 5432,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: "postgres",
	entities: [`${__dirname}/../entities/*{.js,.ts}`],
	synchronize: false,
	migrations: [__dirname + "/migrations/*.{js,ts}"],
	migrationsRun: true,
	logging: ["error", "query"],
});

export default dataSource;
