import "reflect-metadata";
import "module-alias/register";
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
} from "@resolvers";
import { User, UserRole } from "@entities";
import * as jwt from "jsonwebtoken";
import * as argon2 from "argon2";


const start = async () => {
  await dataSource.initialize();

  const users = await User.find();
  if (users.length === 0) {
    // creating admin user
    const AdminUser = new User();
    AdminUser.firstName = "Admin";
    AdminUser.lastName = "Admin";
    AdminUser.email = "admin@example.com";
    AdminUser.hashedPassword = await argon2.hash("password");
    AdminUser.role = UserRole.ADMIN;
    await AdminUser.save();

    // creating city admin user
    const CityAdminUser = new User();
    CityAdminUser.firstName = "CityAdmin";
    CityAdminUser.lastName = "CityAdmin";
    CityAdminUser.email = "cityadmin@example.com";
    CityAdminUser.hashedPassword = await argon2.hash("password");
    CityAdminUser.role = UserRole.CITYADMIN;
    await CityAdminUser.save();

    // creating super user
    const SuperUser = new User();
    SuperUser.firstName = "SuperUser";
    SuperUser.lastName = "SuperUser";
    SuperUser.email = "superuser@example.com";
    SuperUser.hashedPassword = await argon2.hash("password");
    SuperUser.role = UserRole.SUPERUSER;
    await SuperUser.save();

    // creating user
    const newUser = new User();
    newUser.firstName = "User";
    newUser.lastName = "User";
    newUser.email = "user@example.com";
    newUser.hashedPassword = await argon2.hash("password");
    newUser.role = UserRole.USER;
    await newUser.save();
  }

  const schema = await buildSchema({
    resolvers: [CityResolver, PoiResolver, UserResolver, CategoryResolver, RatingResolver],
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