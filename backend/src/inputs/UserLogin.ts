import { Field, InputType } from "type-graphql";

@InputType()
export class UserLoginInput {
  @Field()
  password: string;

  @Field()
  email: string;
}
