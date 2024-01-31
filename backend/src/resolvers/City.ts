import { City } from "../entities/city";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class CityResolver {
  @Query(() => [City])
  async allCities() {
    const result = await City.find();
    return result;
  }
}
