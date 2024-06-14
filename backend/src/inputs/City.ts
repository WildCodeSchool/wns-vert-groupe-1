import { Field, InputType } from "type-graphql";

@InputType()
export class CityInput {
  @Field()
  name: string;

  @Field()
  description: string;

  // a supprimer
  @Field(() => [Number], { nullable: true })
  pois?: [number];
}
