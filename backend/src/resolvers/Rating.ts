import { Poi, Rating } from "../entities";
import { RatingInput } from "../inputs";
import { Arg, Query, Resolver, Mutation } from "type-graphql";

@Resolver()
export class RatingResolver {
	@Query(() => [Rating])
	async getAllRatings() {
		const result = await Rating.find({ relations: ["poi"] });
		return result;
	}

	@Mutation(() => Rating)
	async ratePoi(@Arg("ratingData") ratingData: RatingInput) {
		try {
			const poi = await Poi.findOneByOrFail({ id: ratingData.poi });

			if (!poi) {
				throw new Error(`Poi with ID ${ratingData.poi} not found`);
			}

			const rating = await Rating.create({
				...ratingData,
				poi,
			}).save();

			return rating;
		} catch (error) {
			console.error("Error rating poi:", error);
			throw new Error("Failed to rate poi");
		}
	}

	@Mutation(() => String)
	async deleteRatingById(@Arg("id") id: number) {
		const ratingToDelete = await Rating.findOneByOrFail({
			id: id,
		});
		ratingToDelete.remove();
		return "Your rating has been deleted";
	}
}
