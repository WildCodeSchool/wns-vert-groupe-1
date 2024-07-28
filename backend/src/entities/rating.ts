import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Poi } from "./poi";
import { User } from "./user";

@ObjectType()
@Entity()
export class Rating extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  // @Column({ nullable: true })
  @ManyToOne(() => User, (user: User) => user.ratings, {})
  user: User;

  @Field()
  @Column({ nullable: true })
  text: string;

  @Field()
  @Column({ type: "float" })
  rating: number;

  @Field(() => Poi)
  @ManyToOne(() => Poi, (poi: Poi) => poi.ratings, {})
  poi: Poi;
}
