import { Field, InputType } from "type-graphql";

@InputType()
export class UserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;

  @Field()
  email: string;

  @Field()
  city: number;
}
