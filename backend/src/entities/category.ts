import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Length } from "class-validator";
import { Poi } from "./poi";

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Length(1, 255)
  name: string;

  @Field(() => [Poi])
  @OneToMany(() => Poi, (poi) => poi.category, { nullable: true })
  pois: Poi[];
}
