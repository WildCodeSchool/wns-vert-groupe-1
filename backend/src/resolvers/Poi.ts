import { City } from "../entities/city";
import { Poi } from "../entities/poi";

import { PoiInput } from "../inputs/Poi";
import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { Category } from "../entities/category";

@Resolver()
export class PoiResolver {
  @Query(() => [Poi])
  async getAllPoi() {
    const result = await Poi.find();
    return result;
  }

  @Mutation(() => Poi)
  async createNewPoi(@Arg("poiData") poiData: PoiInput) {
    const city = await City.findOneByOrFail({ id: poiData.city });
    const category = await Category.findOneByOrFail({ id: poiData.category });

    if (!city) {
      throw new Error(`City with ID ${poiData.city} not found`);
    }

    if (!category) {
      throw new Error(`Category with ID ${poiData.category} not found`);
    }

    const poi = await Poi.save({
      ...poiData,
      city,
      category,
    });

    return poi;
  }

  @Mutation(() => String)
  async deletePoiById(@Arg("id") id: number) {
    const poiToDelete = await Poi.findOneByOrFail({
      id: id,
    });
    poiToDelete.remove();
    return "Le point d'interet à été supprimé";
  }

  @Mutation(() => String)
  async updatePoiById(
    @Arg("id") id: number,
    @Arg("newPoiInput") newPoiInput: PoiInput
  ) {
    try {
      const oldPoi = await Poi.findOne({ where: { id: id } });

      if (!oldPoi) {
        throw new Error(
          `Le point d'interet avec l'ID : ${id} n'a pas été trouvé`
        );
      }

      Object.assign(oldPoi, newPoiInput);

      await oldPoi.save();
      return "Le point d'interet a été mis à jour";
    } catch (error) {
      throw new Error(
        `Il y a eu une erreur avec la mise à jour du point d'interet: ${error.message}`
      );
    }
  }
}
