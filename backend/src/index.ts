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

  const schema = await buildSchema({
    resolvers: [
      CityResolver,
      PoiResolver,
      UserResolver,
      CategoryResolver,
      RatingResolver,
    ],
    authChecker: ({ context }, roles) => {
      console.log("context role", context.role);
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
    throw new Error("SECRET_KEY environment variable is not defined");
  }
  const SECRET_KEY = process.env.SECRET_KEY;

  const server = new ApolloServer({
    schema,
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      // console.log("token", req.headers.authorization?.split("Bearer ")[1]);
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
