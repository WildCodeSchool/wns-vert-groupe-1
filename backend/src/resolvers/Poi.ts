import { GeoCodingService } from "../services";
import { Query, Resolver, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { validate } from "class-validator";
import { City, Poi, Category, User, UserRole } from "../entities";
import { PoiInput, PoiUpdateInput } from "../inputs";
import { GraphQLError } from "graphql";

@Resolver()
export class PoiResolver {
	@Query(() => [Poi])
	async getAllPois(@Arg("city", { nullable: true }) cityId: number) {
		const whereCondition = cityId ? { city: { id: cityId } } : {};
		const result = await Poi.find({
			relations: ["category", "city"],
			where: whereCondition,
		});
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

	@Authorized(["ADMIN", "CITYADMIN", "SUPERUSER"])
	@Mutation(() => Poi)
	async createNewPoi(
		@Arg("poiData") poiData: PoiInput,
		@Ctx() ctx: { role: UserRole; email: string }
	) {
		try {
			const loggedUser = await User.findOneByOrFail({ email: ctx.email });
			const city = await City.findOneByOrFail({ id: poiData.city });
			const category = await Category.findOneByOrFail({ id: poiData.category });

			if (!city) {
				throw new Error(`City with ID ${poiData.city} not found`);
			}

			if (!category) {
				throw new Error(`Category with ID ${poiData.category} not found`);
			}
			if (
				ctx.role === "ADMIN" ||
				(ctx.role === "CITYADMIN" && loggedUser.city.id === poiData.city) ||
				(ctx.role === "SUPERUSER" && loggedUser.city.id === poiData.city)
			) {
				const fullAddress = `${poiData.address}, ${city.name} ${poiData.postalCode}`;

				const coordinates = await GeoCodingService.getCoordinatesByAddress(
					fullAddress
				);

				if (coordinates) {
					poiData.latitude = coordinates.latitude;
					poiData.longitude = coordinates.longitude;
				}

				const poi = await Poi.create({
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
			} else {
				throw new GraphQLError("You are not authorized to create POI.", {
					extensions: {
						code: "UNAUTHORIZED",
						http: { status: 401 },
					},
				});
			}
		} catch (error) {
			throw new Error(`Error ${error}`);
		}
	}

	@Authorized(["ADMIN", "CITYADMIN"])
	@Mutation(() => String)
	async deletePoiById(
		@Arg("id") id: number,
		@Ctx() ctx: { role: UserRole; email: string }
	) {
		try {
			const loggedUser = await User.findOneByOrFail({ email: ctx.email });
			const poiToDelete = await Poi.findOne({
				where: { id: id },
				relations: { city: true },
			});
			if (!poiToDelete) {
				throw new GraphQLError(`POI with ID ${id} not found`, {
					extensions: {
						code: "NOT_FOUND",
						http: { status: 404 },
					},
				});
			}
			if (
				ctx.role === "ADMIN" ||
				(ctx.role === "CITYADMIN" && poiToDelete.city.id === loggedUser.city.id)
			) {
				poiToDelete.remove();
				return `POI with id ${id} was successefully deleted`;
			} else {
				throw new GraphQLError(`You are not authorized to delete this POI`, {
					extensions: {
						code: "UNAUTHORIZED",
						http: { status: 401 },
					},
				});
			}
		} catch (error) {
			throw new Error(`Error :  ${error}`);
		}
	}

	@Authorized(["ADMIN", "CITYADMIN"])
	@Mutation(() => String)
	async updatePoiById(
		@Arg("id") id: number,
		@Arg("newPoiInput") newPoiInput: PoiUpdateInput,
		@Ctx() ctx: { role: UserRole; email: string }
	) {
		try {
			const loggedUser = await User.findOneByOrFail({ email: ctx.email });
			const oldPoi = await Poi.findOne({
				where: { id: id },
				relations: { city: true },
			});

			if (!oldPoi) {
				throw new Error(`POI with id ${id} haven't been found`);
			}
			if (
				ctx.role === "ADMIN" ||
				(ctx.role === "CITYADMIN" && oldPoi.city.id === loggedUser.city.id)
			) {
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

				Object.assign(oldPoi, newPoiInput);
				await oldPoi.save();
				return `POI with id ${id} have been updated`;
			} else {
				throw new GraphQLError("You are not authorized to update POI.", {
					extensions: {
						code: "UNAUTHORIZED",
						http: { status: 401 },
					},
				});
			}
		} catch (error) {
			throw new Error(`Error: ${error.message}`);
		}
	}
}
