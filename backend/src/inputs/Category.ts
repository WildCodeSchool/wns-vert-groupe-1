import { Field, InputType } from "type-graphql";

@InputType()
export class CategoryInput {
  @Field()
  name: string;
}
