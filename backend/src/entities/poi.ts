import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Field, Float, ObjectType } from "type-graphql";
import { City } from "./city";
import { Category } from "./category";
import { Rating } from "./rating";
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  Length,
  Matches,
} from "class-validator";

@ObjectType()
@Entity()
export class Poi extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Length(1, 100, {
    message: "Poi should have between 1 and 100 characters.",
  })
  name: string;

  @Field()
  @Column()
  @IsNotEmpty({ message: "Address cannot be empty." })
  @Length(5, undefined, {
    message: "Address should have minimum 5 characters.",
  })
  address: string;

  @Field()
  @Column({ type: "varchar", default: "" })
  @IsNotEmpty({ message: "Postal code cannot be empty." })
  @Matches(/^\d{5}$/, { message: "Invalid postal code format." })
  postalCode: string;

  @Field(() => Float)
  @Column({ type: "float" })
  @IsLatitude({ message: "Latitude should have a valid value." })
  latitude: number;

  @Field(() => Float)
  @Column({ type: "float" })
  @IsLongitude({ message: "Longitude should have a valid value." })
  longitude: number;

  @Field()
  @Column()
  @IsNotEmpty()
  @Length(50, undefined, {
    message: "POI description should have minimum 50 characters.",
  })
  description: string;

  @Field(() => [String])
  @Column("text", { array: true, default: [] })
  @ArrayNotEmpty({
    message: "Images cannot be empty. 5 images are required.",
  })
  @ArrayMinSize(5, { message: "At least five images are required." })
  @ArrayMaxSize(5, { message: "No more than five images are allowed." })
  @Matches(/\.(jpg|jpeg|png)$/i, {
    each: true,
    message: "Each image must be a valid image file (JPG, JPEG, or PNG).",
  })
  images: string[];

  @Field(() => City)
  @ManyToOne(() => City, (city) => city.pois)
  city: City;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.pois)
  category: Category;

  @Field(() => [Rating])
  @OneToMany(() => Rating, (rating) => rating.poi, { nullable: true })
  ratings: Rating[];
}
