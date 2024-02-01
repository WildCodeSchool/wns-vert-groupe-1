import { Poi } from "../entities/poi";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class PoiResolver {
  @Query(() => [Poi])
  async getAllPoi() {
    const result = await Poi.find();
    return result;
  }
}