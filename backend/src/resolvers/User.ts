import { User } from "../entities/user";
import { UserInput } from "../inputs/User";
import { Query, Resolver, Mutation, Arg } from "type-graphql";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getAllUsers() {
    const result = await User.find();
    return result;
  }

  @Mutation(() => User)
  async createNewUser(@Arg("userData") userData: UserInput) {
    const user = await User.save({ ...userData });
    return user;
  }

  @Mutation(() => String)
  async deleteUserById(@Arg("id") id: number) {
      const userToDelete = await User.findOneByOrFail({
          id: id,
      });
      userToDelete.remove();
      return "L'utilisateur à été supprimé";
  }

  @Mutation(() => String)
  async updateUserById (
    @Arg("id") id: number,
    @Arg("newUserInput") newUserInput: UserInput
    ) {
    try {
      const oldUser = await User.findOne({ where: { id: id } });
  
      if (!oldUser) {
        throw new Error(`L'utilisateur avec l'ID : ${id} n'a pas été trouvé`);
      }
  
      Object.assign(oldUser, newUserInput);
  
      await oldUser.save();
      return "L'utilisateur a été mis à jour";
    } catch (error) {
      throw new Error(`Il y a eu une erreur avec la mise à jour de l'utilisateur: ${error.message}`);
    }
  } 
}

