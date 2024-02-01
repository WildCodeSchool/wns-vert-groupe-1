import { Poi } from "../entities/poi";
import { PoiInput } from "../inputs/Poi";
import { Query, Resolver, Mutation, Arg} from "type-graphql";

@Resolver()
export class PoiResolver {
  @Query(() => [Poi])
  async getAllPoi() {
    const result = await Poi.find();
    return result;
  }

  @Mutation(() => Poi)
  async createNewPoi(@Arg("poiData") poiData: PoiInput) {
  const poi = await Poi.save({...poiData});
    return poi; 
  }
}