import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Field } from "type-graphql";
import { City } from "./city";

@Entity()
export class Poi extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  description: string;

  @Field(() => [String])
  @Column("text", { array: true, default: [] })
  images: string[];

  @ManyToOne(() => City, (city) => city.pois, { nullable: true })
  city: City;
}
