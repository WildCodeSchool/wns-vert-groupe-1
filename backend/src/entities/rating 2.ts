import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Poi } from "./poi";

@ObjectType()
@Entity()
export class Rating extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    user: string;

    @Field()
    @Column()
    text: string;

    @Field()
    @Column()
    rating: number;

    @Field(() => Poi, { nullable: true })
    @ManyToOne(() => Poi, (poi) => poi.ratings, {})
    pois: Poi;
}