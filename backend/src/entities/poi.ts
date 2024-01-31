
import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";
import { Field } from "type-graphql";

@Entity()
export class poi extends BaseEntity {
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
}