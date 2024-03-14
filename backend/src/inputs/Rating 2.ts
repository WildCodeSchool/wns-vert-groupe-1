import { Field, InputType } from "type-graphql";

@InputType()
export class RatingInput {
    @Field()
    id: number;

    @Field()
    user: string;

    @Field()
    text: string;

    @Field()
    rating: number;
}