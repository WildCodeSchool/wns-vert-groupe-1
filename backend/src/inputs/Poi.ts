import { Field, Float, InputType } from "type-graphql";

@InputType()
export class PoiInput {
	@Field()
	name: string;

	@Field()
	address: string;

	@Field()
	postalCode: string;

	@Field()
	description: string;

	@Field()
	city: number;

	@Field(() => Float, { nullable: true })
	latitude?: number;

	@Field(() => Float, { nullable: true })
	longitude?: number;

	//TODO: delete nullable true
	@Field(() => [String], { nullable: true })
	images?: string[];

	@Field()
	category: number;

	@Field(() => [Number], { nullable: true })
	ratings?: number[];
}
