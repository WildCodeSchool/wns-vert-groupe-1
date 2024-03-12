import { Rating } from "src/entities/rating";
import { RatingInput } from "src/inputs/Rating";
import { Arg, Query, Resolver, Mutation } from "type-graphql";

@Resolver()
export class RatingResolver {
    @Query(() => [Rating])
    async getAllRatings() {
        const result = await Rating.find({ relations: ["pois"] });
        return result;
    }
    @Mutation(() => Rating)
    async createNewRating(@Arg("ratingData") ratingData: RatingInput) {
        const rating = await Rating.save({ ...ratingData });
        return rating;
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