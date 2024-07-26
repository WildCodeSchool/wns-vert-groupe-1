import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	Unique,
	OneToMany,
	JoinColumn,
} from "typeorm";
import { City } from "./city";
import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";
import { Rating } from "./rating";

export enum UserRole {
	ADMIN = "ADMIN",
	CITYADMIN = "CITYADMIN",
	SUPERUSER = "SUPERUSER",
	USER = "USER",
}

registerEnumType(UserRole, {
	name: "UserRole",
	description: "Role utilisateur",
});

@ObjectType()
@Entity()
@Unique(["email"])
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ unique: true, length: 100 })
	@IsEmail({}, { message: "L'email doit être une adresse email valide." })
	@Length(5, 100, {
		message: "Email should have between 5 and 100 characters.",
	})
	email: string;

	@Field()
	@Column({ length: 100 })
	@Length(2, 100, {
		message: "First name should have between 2 and 100 characters.",
	})
	@Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
		message: "First name can't contain any number or special character.",
	})
	firstName: string;

	@Field()
	@Column({ length: 100 })
	@Length(2, 100, {
		message: "Last name should have between 2 and 100 characters.",
	})
	@Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
		message: "Last name can't contain any number or special character.",
	})
	lastName: string;

	@Column({ length: 150 })
	@IsNotEmpty({ message: "Password cannot be an empty value." })
	@Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
		message:
			"Password should have  minimum 8 characters, of which at least one is capital, one is a letter and one is a special character.",
	})
	hashedPassword: string;

	@Field(() => UserRole)
	@Column({
		type: "enum",
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole;

	@Field(() => [Rating], { nullable: true })
	@OneToMany(() => Rating, (rating: Rating) => rating.user, { nullable: true, onDelete: "CASCADE" })
	ratings?: Rating[];
	@Field(() => City)
	@JoinColumn({ name: "cityId" })
	@ManyToOne(() => City, (city) => city.users, {
		onDelete: "CASCADE",
		eager: true,
	})
	city: City;

	@Column()
	cityId: number;
}

@ObjectType()
export class UserInfo {
	@Field()
	isLoggedIn: boolean;
	@Field({ nullable: true })
	email: string;
	@Field({ nullable: true })
	role: UserRole;
}
