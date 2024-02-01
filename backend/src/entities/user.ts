import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { City } from "./city";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  name: string;

  @Column()
  hashedPassword: string;


// Many to One relationship (many users one city)
  @Field(() => City)
  @ManyToOne(() => City, (city) => city.users, {
    onDelete: "CASCADE",
  })
  city: City;
}