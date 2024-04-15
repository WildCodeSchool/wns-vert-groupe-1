import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
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
  @Column({ nullable: true })
  user: string;

  @Field()
  @Column({ nullable: true })
  text: string;

  @Field()
  @Column({ type: "float" })
  rating: number;

  @Field(() => Poi)
  @ManyToOne(() => Poi, (poi) => poi.ratings, {})
  poi: Poi;
}
