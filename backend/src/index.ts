import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import dataSource from "./config/db";
import { CityResolver } from "./resolvers/City";

const start = async () => {
  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [CityResolver],
  });
  const server = new ApolloServer({
    schema,
  });
  const { url } = await startStandaloneServer(server, {});
  console.log(`🚀  Server ready at: ${url}`);
};
start();
