import { Poi, Rating, User } from "../entities";
import { RatingInput } from "../inputs";
import { Arg, Query, Resolver, Mutation } from "type-graphql";

@Resolver()
export class RatingResolver {
	@Query(() => [Rating])
	async getAllRatings() {
		try {
			const result = await Rating.find({
				relations: ["poi", "user"]
			});
			return result;
		}
		catch (error) {
			throw new Error(`Error can not get all rating`);
		}
	}

	@Query(() => [Rating])
	async getRatingsByPoi(@Arg("poiId") poiId: number) {
		try {
			console.log(poiId)
			const poi = await Poi.findOneByOrFail({ id: poiId })
			if (poi) {
				const result = await Rating.find({
					where: {
						poi,
					},
					relations: ["poi", "user"]
				});
				return result;
			}
			return [];
		}
		catch (error) {
			throw new Error(`Error can not get all rating`);
		}
	}

	@Mutation(() => Rating)
	async createRating(@Arg("ratingData") ratingData: RatingInput) {
		try {
			const poi = await Poi.findOneByOrFail({ id: ratingData.poi });
			const user = await User.findOneByOrFail({ id: ratingData.user })
			if (!poi) {
				throw new Error(`Poi with ID ${ratingData.poi} not found`);
			}
			if (!user) {
				throw new Error(`User with ID ${ratingData.user} not found`)
			}
			const rating = await Rating.create({
				...ratingData,
				poi,
				user,
			}).save();
			// Recalcular averageNote
			const ratings = await Rating.find({ where: { poi: { id: ratingData.poi } } });
			poi.averageNote = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
			await poi.save();

			return rating;
		} catch (error) {
			console.error("Error rating poi:", error);
			throw new Error("Failed to rate poi");
		}
	}

	@Mutation(() => String)
	async deleteRatingById(@Arg("id") id: number) {
		try {
			const ratingToDelete = await Rating.findOneByOrFail({ id });
			const poi = await Poi.findOne({ where: { id: ratingToDelete.poi.id }, relations: ["ratings"] });

			await ratingToDelete.remove();

			// Recalculate averageNote
			if (poi && poi.ratings.length > 0) {
				poi.averageNote = poi.ratings.reduce((acc, r) => acc + r.rating, 0) / poi.ratings.length;
				await poi.save();
			}

			return "Your rating has been deleted";
		} catch (error) {
			console.error("Error deleting rating:", error);
			throw new Error("Failed to delete rating");
		}
	}
}
