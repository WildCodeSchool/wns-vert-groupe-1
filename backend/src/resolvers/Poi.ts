import { GeoCodingService } from "../services";
import { City, Poi, Category } from "../entities";
import { PoiInput } from "../inputs";
import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { validate } from "class-validator";
@Resolver()
export class PoiResolver {
  @Query(() => [Poi])
  async getAllPois() {
    const result = await Poi.find({ relations: ["category", "city"] });
    return result;
  }

  @Query(() => Poi)
  async getPoiById(@Arg("id") id: number) {
    try {
      const result = await Poi.findOne({
        where: {
          id: id,
        },
        relations: { city: true, category: true, ratings: true },
      });

      if (!result) {
        throw new Error(`POI with ID ${id} not found`);
      }

      return result;
    } catch (err) {
      console.error("Error", err);
      throw new Error("An error occurred while reading one POI");
    }
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

    const fullAddress = `${poiData.address}, ${city.name} ${poiData.postalCode}`;

    const coordinates = await GeoCodingService.getCoordinatesByAddress(
      fullAddress
    );

    const poi = Poi.create({
      ...poiData,
      city,
      category,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
    });

    const errors = await validate(poi);
    if (errors.length > 0) {
      throw new Error(`Validation failed! Errors: ${errors}`);
    }

    await poi.save();

    return poi;
  }

  @Mutation(() => String)
  async deletePoiById(@Arg("id") id: number) {
    const poiToDelete = await Poi.findOneByOrFail({
      id: id,
    });
    poiToDelete.remove();
    return `POI with id ${id} was successefully deleted`;
  }

  @Mutation(() => String)
  async updatePoiById(
    @Arg("id") id: number,
    @Arg("newPoiInput") newPoiInput: PoiInput
  ) {
    try {
      const oldPoi = await Poi.findOne({
        where: { id: id },
        relations: ["city"],
      });

      if (!oldPoi) {
        throw new Error(`POI with id ${id} haven't been found`);
      }

      const city = newPoiInput.city
        ? await City.findOneByOrFail({ id: newPoiInput.city })
        : oldPoi.city;
      if (!city) {
        throw new Error(`City with ID ${newPoiInput.city} not found`);
      }

      const fullAddress = `${newPoiInput.address}, ${city.name} ${newPoiInput.postalCode}`;

      if (
        newPoiInput.address &&
        (oldPoi.address !== newPoiInput.address ||
          oldPoi.city.id !== newPoiInput.city)
      ) {
        const coordinates = await GeoCodingService.getCoordinatesByAddress(
          fullAddress
        );
        if (coordinates) {
          oldPoi.latitude = coordinates.latitude;
          oldPoi.longitude = coordinates.longitude;
        } else {
          throw new Error("Failed to obtain geocoding results.");
        }
      }

      Object.assign(oldPoi, newPoiInput, {
        city,
      });

      await oldPoi.save();
      return `POI with id ${id} have been updated`;
    } catch (error) {
      throw new Error(
        `En error occured while updateing a POI: ${error.message}`
      );
    }
  }
}
