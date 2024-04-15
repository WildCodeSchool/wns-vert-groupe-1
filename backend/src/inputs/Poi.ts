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

  @Field(() => Float)
  latitude?: number;

  @Field(() => Float)
  longitude?: number;

  @Field(() => [String])
  images: string[];

  @Field()
  category: number;

  @Field(() => [Number], { nullable: true })
  ratings?: number[];
}
