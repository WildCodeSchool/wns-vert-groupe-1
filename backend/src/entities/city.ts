import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, Float } from "type-graphql";
import { Length } from "class-validator";
import { Poi } from "./poi";

@ObjectType()
@Entity()
export class City extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Length(1, 255)
  name: string;

  @Field(() => Float)
  @Column("float")
  lat: number;

  @Field(() => Float)
  @Column("float")
  lon: number;

  @Field()
  @Column()
  description: string;

  @OneToMany(() => Poi, (poi) => poi.city)
  pois: Poi[];
}
