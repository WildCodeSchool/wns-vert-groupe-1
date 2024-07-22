import { Field, InputType, Float } from "type-graphql";

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
	@Field(() => [String])
	images?: string[];

	@Field()
	category: number;
}
