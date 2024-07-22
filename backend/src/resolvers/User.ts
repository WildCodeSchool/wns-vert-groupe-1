import { City, User, UserInfo, UserRole } from "../entities";
import { UserInput, UserLoginInput } from "../inputs";
import {
	Query,
	Resolver,
	Mutation,
	Arg,
	Ctx,
	ArgumentValidationError,
	Authorized,
} from "type-graphql";
import { validate } from "class-validator";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { UserUpdateInput } from "../inputs/UserUpdate";
import { GraphQLError } from "graphql";

if (!process.env.SECRET_KEY) {
	throw new Error("SECRET_KEY environment variable is not defined");
}
const SECRET_KEY = process.env.SECRET_KEY;

@Resolver()
export class UserResolver {
	@Authorized(["Administrateur du site", "Administrateur de ville"])
	@Query(() => [User])
	async getAllUsers(@Ctx() ctx: { role: string; email: string }) {
		try {
			const user = await User.findOne({ where: { email: ctx.email } });
			console.log("USER", user);
			if (user) {
				if (user.role === "Administrateur du site") {
					console.log("its admin");
					const users = await User.find({ relations: { city: true } });
					return users;
				} else if (user.role === "Administrateur de ville") {
					console.log("its city admin");
					const users = await User.find({
						where: { city: { id: user?.cityId } },
						relations: { city: true },
					});
					return users;
				} else {
					console.log("its not authorized");
					throw new GraphQLError("User is not authorized", {
						extensions: {
							code: "UNAUTHORIZED",
							http: { status: 401 },
						},
					});
				}
			} else {
				throw new GraphQLError("You need to be authentificated.", {
					extensions: {
						code: "UNAUTHENTICATED",
						http: { status: 401 },
					},
				});
			}
		} catch (e) {
			throw new Error("Can't get all users");
		}
	}

	@Authorized()
	@Query(() => User)
	async getUserById(
		@Arg("id") id: number,
		@Ctx() ctx: { email: string; role: string }
	) {
		try {
			const user = await User.findOne({
				where: { email: ctx.email },
				relations: { city: true },
			});
			console.log("user", user);
			if (ctx.role === "Administrateur du site") {
				console.log("its admin");
				const result = await User.findOne({
					where: {
						id: id,
					},
					relations: { city: true },
				});

				if (!result) {
					throw new Error(`User with ID ${id} not found`);
				} else {
					return result;
				}
			} else if (user?.id === id) {
				console.log("its me");
				return user;
			} else {
				console.log("its not autho");
				throw new GraphQLError("User is not authorized", {
					extensions: {
						code: "UNAUTHORIZED",
						http: { status: 401 },
					},
				});
			}
		} catch (err) {
			throw new Error(`An error occurred while reading User with ID ${id}`);
		}
	}

	@Authorized(["Administrateur du site"])
	@Mutation(() => String)
	async deleteUserById(@Arg("id") id: number, @Ctx() ctx: { role: string }) {
		try {
			if (ctx.role === "Administrateur du site") {
				console.log("its admin");
				const userToDelete = await User.findOneByOrFail({
					id: id,
				});
				userToDelete.remove();
				return "User deleted";
			} else {
				throw new GraphQLError("You are not authorized to delete this user", {
					extensions: {
						code: "UNAUTHORIZED",
						http: { status: 401 },
					},
				});
			}
		} catch (error) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	@Authorized(["Administrateur du site"])
	@Mutation(() => String)
	async deleteAllUsers(@Ctx() ctx: { role: string }) {
		try {
			if (ctx.role === "Administrateur du site") {
				User.delete({});
				return "All users deleted";
			} else {
				throw new GraphQLError("You are not authorized to delete all users", {
					extensions: {
						code: "UNAUTHORIZED",
						http: { status: 401 },
					},
				});
			}
		} catch (error) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	@Authorized()
	@Mutation(() => String)
	async updateUserById(
		@Arg("id") id: number,
		@Arg("newUserInput") newUserInput: UserUpdateInput,
		// @Arg("role") newUserRole?: UserRole,
		@Ctx() ctx: { email: string; role: string }
	) {
		try {
			const loggedUser = await User.findOne({ where: { email: ctx.email } });
			const oldUser = await User.findOne({ where: { id: id } });

			if (!oldUser) {
				throw new Error(`The user with ID : ${id} not found`);
			} else {
				if (
					ctx.role === "Administrateur du site" ||
					oldUser?.email === ctx.email ||
					(ctx.role === "Administrateur de ville" &&
						oldUser.cityId === loggedUser?.cityId)
				) {
					Object.assign(oldUser, newUserInput);
					await oldUser.save();
					return "User updated";
				} else {
					throw new GraphQLError("You are not authorized to update this user", {
						extensions: {
							code: "UNAUTHORIZED",
							http: { status: 401 },
						},
					});
				}
			}
		} catch (error) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	@Mutation(() => String)
	async register(@Arg("newUserData") newUserData: UserInput) {
		try {
			const { firstName, lastName, email, password, city } = newUserData;

			// Check if the user already exists
			const existingUser = await User.findOne({ where: { email } });
			if (existingUser) {
				throw new Error("A user with the given email already exists.");
			}

			const newUser = new User();
			newUser.firstName = firstName;
			newUser.lastName = lastName;
			newUser.email = email;
			newUser.hashedPassword = password;

			if (city) {
				const cityEntity = await City.findOneByOrFail({ id: city });
				if (cityEntity) {
					newUser.city = cityEntity;
				}
			}

			// Perform validation
			const errors = await validate(newUser);
			if (errors.length > 0) {
				console.error("Validation errors:", errors);
				throw new ArgumentValidationError(errors);
			}

			// Hash the password using Argon2
			const hashedPassword = await argon2.hash(password);
			newUser.hashedPassword = hashedPassword;

			// Save the user to the database
			await newUser.save();

			return "User has been successfully registered";
		} catch (err) {
			console.log("Error registering user:", err);
			return "Error creating user";
		}
	}

	@Query(() => String)
	async login(@Arg("userData") { email, password }: UserLoginInput) {
		let payload: { email: string; role: UserRole };
		// ; id: number; city_id: number
		try {
			const user = await User.findOneByOrFail({ email });
			if (!user) {
				throw new Error("Email not found");
			}

			if (await argon2.verify(user.hashedPassword, password)) {
				payload = {
					email: user.email,
					role: user.role,
					// id: user?.id,
					// city_id: user?.cityId,
				};
				const token: string = jwt.sign(payload, SECRET_KEY);
				return JSON.stringify({ token: token });
				// , id: user.id
			} else {
				throw new Error("Invalid password");
			}
		} catch (err) {
			console.log("Error authenticating user:", err);
			return "Invalid credentials";
		}
	}

	@Query(() => Boolean)
	async isEmailUnique(@Arg("email") email: string): Promise<boolean> {
		const user = await User.findOne({ where: { email } });
		return !user;
	}

	@Query(() => UserInfo)
	async checkSession(@Ctx() ctx: { email: string; role: string }) {
		if (ctx.email !== undefined) {
			return { ...ctx, isLoggedIn: true };
		} else {
			return { isLoggedIn: false };
		}
	}
}
