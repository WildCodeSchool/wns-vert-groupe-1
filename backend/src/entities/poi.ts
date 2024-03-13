import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { City } from "./city";
import { Category } from "./category";

@ObjectType()
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
  @Column({ nullable: true })
  postalCode: string;

  @Field()
  @Column({ type: "float", nullable: true })
  latitude: number;
  
  @Field()
  @Column({ type: "float", nullable: true })
  longitude: number;

  @Field()
  @Column()
  description: string;

  // @Field(() => [String])
  //@Column("text", { array: true, default: [] })
  //images: string[];

  @Field(() => City)
  @ManyToOne(() => City, (city) => city.pois, { nullable: true })
  city: City;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.pois)
  category: Category;
}

