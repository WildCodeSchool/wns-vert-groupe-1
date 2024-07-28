import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import dataSource from "./config/db";
import {
	CityResolver,
	PoiResolver,
	UserResolver,
	CategoryResolver,
	RatingResolver,
} from "./resolvers";
import * as jwt from "jsonwebtoken";
import { createClient } from "redis";
import * as dotenv from "dotenv";
dotenv.config();
// import { City } from "./entities";
import {
	ApolloServerPluginLandingPageLocalDefault,
	ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { City } from "./entities";

console.log(
	"ENV VAR",
	process.env.DATABASE_USERNAME,
	process.env.DATABASE_PASSWORD
);
export const redisClient = createClient({ url: "redis://redis" });

redisClient.on("error", (err: any) => {
	console.log("Redis Client Error", err);
});
redisClient.on("connect", () => {
	console.log("redis connected");
});

const start = async () => {
	await redisClient.connect();
	await dataSource.initialize();
	console.log(
		"ENV VAR",
		process.env.DATABASE_USERNAME,
		process.env.DATABASE_PASSWORD
	);

	const schema = await buildSchema({
		resolvers: [
			CityResolver,
			PoiResolver,
			UserResolver,
			CategoryResolver,
			RatingResolver,
		],
		authChecker: ({ context }, roles) => {
			if (context.email && roles.length > 0) {
				if (roles.includes(context.role)) {
					return true;
				} else {
					return false;
				}
			}
			if (roles.length === 0 && context.email) {
				return true;
			}
			return false;
		},
	});

	if (!process.env.SECRET_KEY) {
		throw new Error("SECRET_KEY environment variable is not defined.");
	}
	const SECRET_KEY = process.env.SECRET_KEY;

	const cities = await City.find();
	if (cities.length === 0) {
		const city = new City();
		city.name = "Paris";
		city.lat = 48.866667;
		city.lon = 2.333333;
		city.description =
			"Paris, capitale de la France, est une grande ville européenne et un centre mondial de l'art, de la mode, de la gastronomie et de la culture. Son paysage urbain du XIXe siècle est traversé par de larges boulevards et la Seine. Outre les monuments comme la tour Eiffel et la cathédrale gothique Notre-Dame du XIIe siècle, la ville est réputée pour ses cafés et ses boutiques de luxe bordant la rue du Faubourg-Saint-Honoré.";
		city.save();

		const city2 = new City();
		city2.name = "Strasbourg";
		city2.lat = 48.5833;
		city2.lon = 7.75;
		city2.description =
			"Strasbourg est la capitale de la région Alsace-Champagne-Ardenne-Lorraine (Grand Est) au nord-est de la France. Il s'agit également du siège officiel du Parlement européen. Située près de la frontière avec l'Allemagne, la ville arbore une culture et une architecture aux influences allemandes et françaises. La cathédrale gothique Notre-Dame de Strasbourg propose des animations quotidiennes sur son horloge astronomique et une vue panoramique sur le Rhin à mi-hauteur de son clocher de 142 mètres de haut.";
		city2.save();
	}
	const server = new ApolloServer({
		schema,
		plugins: [
			process.env.NODE_ENV === "production"
				? ApolloServerPluginLandingPageProductionDefault({
						graphRef: "my-graph-id@my-graph-variant",
						footer: false,
				  })
				: ApolloServerPluginLandingPageLocalDefault({ footer: false }),
		],
	});
	const { url } = await startStandaloneServer(server, {
		listen: { port: 4000 },
		context: async ({ req }) => {
			const token = req.headers.authorization?.split("Bearer ")[1];
			if (token) {
				const payload = jwt.verify(token, SECRET_KEY);
				return payload;
			}
			return {};
		},
	});

	console.log(`🚀  Server ready at: ${url}`);
};
start();
