import { Field, Float, InputType } from "type-graphql";

@InputType()
export class PoiUpdateInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  city?: number;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  //TODO: delete nullable true
  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field({ nullable: true })
  category?: number;
}
