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
    authChecker: ({ context }) => {
      if (context.email) {
        return true;
      } else {
        return false;
      }
    },
  });
  const server = new ApolloServer({
    schema,
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const token = req.headers.authorization?.split("Bearer ")[1];
      if (token) {
        const payload = jwt.verify(token, "mysupersecretkey");
        return payload;
      }
      return {};
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};
start();
