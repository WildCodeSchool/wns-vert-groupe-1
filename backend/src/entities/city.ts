import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Length } from "class-validator";

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
}
