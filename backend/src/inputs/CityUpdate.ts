import { Field, InputType } from "type-graphql";

@InputType()
export class CityUpdateInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  lat?: number;

  @Field({ nullable: true })
  lon?: number;

  @Field({ nullable: true })
  description?: string;
}
