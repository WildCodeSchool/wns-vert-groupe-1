import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722181920538 implements MigrationInterface {
    name = 'Migration1722181920538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'CITYADMIN', 'SUPERUSER', 'USER')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(100) NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "hashedPassword" character varying(150) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER', "cityId" integer NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "lat" double precision NOT NULL, "lon" double precision NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_f8c0858628830a35f19efdc0ecf" UNIQUE ("name"), CONSTRAINT "UQ_f8c0858628830a35f19efdc0ecf" UNIQUE ("name"), CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rating" ("id" SERIAL NOT NULL, "user" character varying, "text" character varying, "rating" double precision NOT NULL, "poiId" integer, CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "poi" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "postalCode" character varying NOT NULL DEFAULT '', "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "description" character varying NOT NULL, "images" text array NOT NULL DEFAULT '{}', "cityId" integer, "categoryId" integer, CONSTRAINT "PK_cd39f8194203a7955bbb92161b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_beb5846554bec348f6baf449e83" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_e0920fb37e19016f532e99382f7" FOREIGN KEY ("poiId") REFERENCES "poi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "poi" ADD CONSTRAINT "FK_79a09fa2dff83a793532d846064" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "poi" ADD CONSTRAINT "FK_82bd1212faf531840ae6c0bc3b2" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "poi" DROP CONSTRAINT "FK_82bd1212faf531840ae6c0bc3b2"`);
        await queryRunner.query(`ALTER TABLE "poi" DROP CONSTRAINT "FK_79a09fa2dff83a793532d846064"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_e0920fb37e19016f532e99382f7"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_beb5846554bec348f6baf449e83"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "poi"`);
        await queryRunner.query(`DROP TABLE "rating"`);
        await queryRunner.query(`DROP TABLE "city"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
