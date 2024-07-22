import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Length } from "class-validator";
import { Poi } from "./poi";

@ObjectType()
@Entity()
@Unique(["name"])
export class Category extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Length(1, 30, {
    message: "Category name should have between 1 and 30 characters.",
  })
  name: string;

  @Field(() => [Poi])
  @OneToMany(() => Poi, (poi) => poi.category, { nullable: true })
  pois: Poi[];
}
