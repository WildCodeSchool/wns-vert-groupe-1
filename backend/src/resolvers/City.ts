import { CityInput } from "../inputs/City";
import { City } from "../entities/city";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class CityResolver {
  @Query(() => [City])
  async getAllCities() {
    const result = await City.find({ relations: ["pois"] });
    return result;
  }

  @Query(() => City)
  async getCityById(@Arg("id") id: number): Promise<City> {
    try {
      const result = await City.findOne({
        where: {
          id: id,
        },
        relations: { pois: true },
      });

      if (!result) {
        throw new Error(`Poi with ID ${id} not found`);
      }

      console.log(result);

      return result;
    } catch (err) {
      console.error("Error", err);
      throw new Error("An error occurred while reading one poi");
    }
  }

  @Mutation(() => City)
  async createNewCity(@Arg("cityData") cityData: CityInput) {
    if (cityData.pois) {
      await City.save({
        ...cityData,
        pois: cityData.pois.map((poi) => ({ id: poi })),
      });
    } else {
      await City.save({
        ...cityData,
        pois: [],
      });
    }
  }
}
