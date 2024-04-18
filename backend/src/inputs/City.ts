import { Field, InputType } from "type-graphql";

@InputType()
export class CityInput {
	@Field()
	name: string;

	@Field()
	lat: number;

	@Field()
	lon: number;

	@Field()
	description: string;

	@Field(() => [String])
	images: string[];

	// a supprimer
	@Field(() => [Number], { nullable: true })
	pois?: [number];
}
