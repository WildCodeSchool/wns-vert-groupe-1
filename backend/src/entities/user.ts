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
    message: "L'email doit contenir entre 5 et 100 caractères.",
  })
  email: string;

  @Field()
  @Column({ length: 100 })
  @Length(2, 100, {
    message: "Le prénom doit avoir entre 2 et 100 caractères.",
  })
  firstName: string;

  @Field()
  @Column({ length: 100 })
  @Length(2, 100, { message: "Le nom doit avoir entre 2 et 100 caractères." })
  lastName: string;

  @Column({ length: 150 })
  @IsNotEmpty({ message: "Le mot de passe ne peut pas être vide." })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, un chiffre et un caractère spécial.",
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
