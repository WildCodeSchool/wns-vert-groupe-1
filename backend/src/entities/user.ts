import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from "typeorm";
import { City } from "./city";
import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";

export enum UserRole {
  ADMIN = "Administrateur du site",
  CITYADMIN = "Administrateur de ville",
  SUPERUSER = "Super utilisateur",
  USER = "Utilisateur",
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
    message: "Name should have between 2 and 100 characters.",
  })
  firstName: string;

  @Field()
  @Column({ length: 100 })
  @Length(2, 100, {
    message: "Lastname should have between 2 and 100 characters.",
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

  // Many to One relationship (many users one city)
  @Field(() => City, { nullable: true })
  @ManyToOne(() => City, (city) => city.users, { onDelete: "CASCADE" })
  city?: City;
}
