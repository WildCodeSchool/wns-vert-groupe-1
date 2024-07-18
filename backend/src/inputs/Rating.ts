import { Field, Float, InputType } from "type-graphql";

@InputType()
export class RatingInput {
  @Field({ nullable: true })
  text?: string;

  @Field(() => Float)
  rating: number;

  @Field()
  user: number;

  @Field()
  poi: number;
}
