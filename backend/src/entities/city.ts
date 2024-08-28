import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { ObjectType, Field, Float } from "type-graphql";
import {
	IsLatitude,
	IsLongitude,
	IsNotEmpty,
	Length,
	Matches,
} from "class-validator";
import { Poi } from "./poi";
import { User } from "./user";

@ObjectType()
@Entity()
@Unique(["name"])
export class City extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ unique: true })
	@Length(1, 50, {
		message: "City name should have between 1 and 50 characters.",
	})
	@Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ'’\-\s]+$/, {
		message:
			"City name may only contain letters, spaces, hyphens, apostrophes or accented characters.",
	})
	name: string;

	@Field(() => Float)
	@Column("float")
	@IsLatitude({ message: "Latitude should have a valid value." })
	lat: number;

	@Field(() => Float)
	@Column("float")
	@IsLongitude({ message: "Longitude should have a valid value." })
	lon: number;

	@Field()
	@Column()
	@IsNotEmpty()
	@Length(50, undefined, {
		message: "City description should have minimum 50 characters.",
	})
	description: string;

	@Field(() => [Poi])
	@OneToMany(() => Poi, (poi) => poi.city, { nullable: true })
	pois: Poi[];

	// a category can contain multiple ads
	@Field(() => [User])
	@OneToMany(() => User, (User) => User.city)
	users: User[];
}
