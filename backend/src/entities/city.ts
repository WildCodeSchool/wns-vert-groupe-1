import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Length } from "class-validator";
import { User } from "./user";

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

  @Field()
  @Column()
  lat: number;

  @Field()
  @Column()
  lon: number;

  @Field()
  @Column()
  description: string;











// a city can contain multiple user
    @OneToMany(() => User, (user) => user.city)
    users: User[];
}
