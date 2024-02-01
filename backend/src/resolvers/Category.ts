import { Category } from "../entities/category";
import { Arg, Query, Resolver, Mutation } from "type-graphql";

@Resolver()
export class CategoryResolver {
    @Query(() => [Category])
    async getAllCategories() {
        const result = await Category.find();
        return result;
    }

    @Mutation(() => String)
    async deleteCategoryById(@Arg("id") id: number) {
        const categoryToDelete = await Category.findOneByOrFail({
            id: id,
        });
        categoryToDelete.remove();
        return "The Category has been deleted";
    }
}