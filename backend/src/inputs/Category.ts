import { Field, InputType } from "type-graphql";

@InputType()
export class CategoryInput {
  @Field()
  name: string;

  @Field(() => [Number], { nullable: true })
  pois?: [number];
}
