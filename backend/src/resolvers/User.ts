import { City, User } from "@entities";
import { UserInput } from "@inputs";
import { Query, Resolver, Mutation, Arg } from "type-graphql";

@Resolver()
export class UserResolver {
	@Query(() => [User])
	async getAllUsers() {
		try {
			return await User.find({ relations: { city: true } });
		} catch (e) {
			return "Can't get all users";
		}
	}

	@Query(() => User)
	async getUserById(@Arg("id") id: number) {
		try {
			const result = await User.findOne({
				where: {
					id: id,
				},
				relations: { city: true },
			});

			if (!result) {
				throw new Error(`User with ID ${id} not found`);
			}
			return result;
		} catch (err) {
			console.error("Error", err);
			throw new Error(`An error occurred while reading User with ID ${id}`);
		}
	}

	@Mutation(() => User)
	async createNewUser(@Arg("userData") userData: UserInput) {
		const { city, ...data } = userData;
		const user = await User.save({ ...data });
		if (city) {
			const cityEntity = await City.findOneByOrFail({
				id: city,
			});
			if (cityEntity) {
				user.city = cityEntity;
			}
		}
		User.save(user);
		return user;
	}

	@Mutation(() => String)
	async deleteUserById(@Arg("id") id: number) {
		const userToDelete = await User.findOneByOrFail({
			id: id,
		});
		userToDelete.remove();
		return "User deleted";
	}

	@Mutation(() => String)
	async deleteAllUsers() {
		User.delete({});
		return "all users deleted";
	}

	@Mutation(() => String)
	async updateUserById(
		@Arg("id") id: number,
		@Arg("newUserInput") newUserInput: UserInput
		// @Arg("role") newUserRole?: UserRole,
	) {
		try {
			const oldUser = await User.findOne({ where: { id: id } });

			if (!oldUser) {
				throw new Error(`The user with ID : ${id} not found`);
			}

			Object.assign(oldUser, newUserInput);

			await oldUser.save();
			return "User updated";
		} catch (error) {
			throw new Error(`Error when updating the user : ${error.message}`);
		}
	}
}
