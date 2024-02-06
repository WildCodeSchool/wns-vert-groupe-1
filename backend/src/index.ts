import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import dataSource from "./config/db";
import { CityResolver } from "./resolvers/City";
import { PoiResolver } from "./resolvers/Poi";
import { UserResolver } from "./resolvers/User";
import { CategoryResolver } from "./resolvers/Category";
import { User, UserRole } from "./entities/user";

const start = async () => {
	await dataSource.initialize();

	const users = await User.find();
	if (users.length === 0) {
		// creating admin user
		const AdminUser = new User();
		AdminUser.firstName = "Admin";
		AdminUser.lastName = "Admin";
		AdminUser.email = "admin@example.com";
		AdminUser.password = "password";
		AdminUser.role = UserRole.ADMIN;
		await AdminUser.save();

		// creating city admin user
		const CityAdminUser = new User();
		CityAdminUser.firstName = "CityAdmin";
		CityAdminUser.lastName = "CityAdmin";
		CityAdminUser.email = "cityadmin@example.com";
		CityAdminUser.password = "password";
		CityAdminUser.role = UserRole.CITYADMIN;
		await CityAdminUser.save();

		// creating super user
		const SuperUser = new User();
		SuperUser.firstName = "SuperUser";
		SuperUser.lastName = "SuperUser";
		SuperUser.email = "superuser@example.com";
		SuperUser.password = "password";
		SuperUser.role = UserRole.SUPERUSER;
		await SuperUser.save();

		// creating user
		const newUser = new User();
		newUser.firstName = "User";
		newUser.lastName = "User";
		newUser.email = "user@example.com";
		newUser.password = "password";
		newUser.role = UserRole.USER;
		await newUser.save();
	}

	const schema = await buildSchema({
		resolvers: [CityResolver, PoiResolver, UserResolver, CategoryResolver],
	});
	const server = new ApolloServer({
		schema,
	});
	const { url } = await startStandaloneServer(server, {});
	console.log(`🚀  Server ready at: ${url}`);
};
start();
