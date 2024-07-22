import { CategoryInput } from "../inputs";
import { Category } from "../entities";
import { Arg, Query, Resolver, Mutation } from "type-graphql";
import { validate } from "class-validator";

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  async getAllCategories() {
    const result = await Category.find({ relations: ["pois"] });
    return result;
  }

  @Mutation(() => Category)
  async createNewCategory(@Arg("categoryData") categoryData: CategoryInput) {
    const pois = categoryData.pois
      ? categoryData.pois.map((poi) => ({ id: poi }))
      : [];

    const category = await Category.create({
      ...categoryData,
      pois: pois,
    });

    const errors = await validate(category);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors}`);
    }

    category.save();

    return category;
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
