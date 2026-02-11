import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1770757429515 implements MigrationInterface {
    name = 'InitialSchema1770757429515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "country" character varying NOT NULL, "province" character varying, "city" character varying NOT NULL, "street" character varying NOT NULL, "postal_code" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."documents_type_enum" AS ENUM('image', 'document', 'video')`);
        await queryRunner.query(`CREATE TYPE "public"."documents_category_enum" AS ENUM('ownership', 'veterinary', 'competition', 'identification')`);
        await queryRunner.query(`CREATE TYPE "public"."documents_purpose_enum" AS ENUM('cover', 'title', 'passport', 'xray', 'vaccine_card', 'certificate')`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "horse_id" uuid NOT NULL, "type" "public"."documents_type_enum" NOT NULL, "category" "public"."documents_category_enum" NOT NULL, "purpose" "public"."documents_purpose_enum" NOT NULL, "url" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "reason" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sale_id" uuid NOT NULL, "seller_id" uuid NOT NULL, "buyer_id" uuid NOT NULL, "rating" integer NOT NULL, "comment" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "horse_id" uuid NOT NULL, "seller_id" uuid NOT NULL, "buyer_id" uuid NOT NULL, "price" integer NOT NULL, "completed_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."horses_sex_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TYPE "public"."horses_discipline_enum" AS ENUM('racing', 'jumping', 'dressage', 'recreational')`);
        await queryRunner.query(`CREATE TYPE "public"."horses_sale_status_enum" AS ENUM('for_sale', 'reserved', 'sold')`);
        await queryRunner.query(`CREATE TYPE "public"."horses_verification_status_enum" AS ENUM('pending', 'verified', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "horses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "owner_id" uuid NOT NULL, "name" character varying NOT NULL, "age" integer NOT NULL, "sex" "public"."horses_sex_enum" NOT NULL, "breed" character varying NOT NULL, "discipline" "public"."horses_discipline_enum" NOT NULL, "price" integer, "sale_status" "public"."horses_sale_status_enum" NOT NULL DEFAULT 'for_sale', "verification_status" "public"."horses_verification_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2f98809688092c22977eb638c30" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "chat_id" uuid NOT NULL, "sender_id" uuid NOT NULL, "content" text NOT NULL, "read_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "buyer_id" uuid NOT NULL, "seller_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TYPE "public"."users_seller_level_enum" AS ENUM('bronze', 'silver', 'gold')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar_url" character varying, "first_name" character varying, "last_name" character varying, "phone" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "seller_level" "public"."users_seller_level_enum" NOT NULL DEFAULT 'bronze', "total_sales" integer NOT NULL DEFAULT '0', "average_rating" double precision, "total_reviews" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_c7481daf5059307842edef74d73" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_cbfcd51c809f2ffb92eb2d285d2" FOREIGN KEY ("horse_id") REFERENCES "horses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_e49b8f6b8f74fb09c818078f198" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_b138f300626648e9107e5521d0b" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_fbde84e628534cdfba82c231c88" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_aec1472403b8ae5d5c4ca632e41" FOREIGN KEY ("horse_id") REFERENCES "horses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_fbcb737b3ecc7c968b0dc167122" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_fb465726b1745ecff7eea073e0e" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "horses" ADD CONSTRAINT "FK_00cee6cce29c83289f3e5f5c650" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_a956bacea253f921eab7bb3b14e" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_f754443807ae962605b6158bf03" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_f754443807ae962605b6158bf03"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_a956bacea253f921eab7bb3b14e"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_7540635fef1922f0b156b9ef74f"`);
        await queryRunner.query(`ALTER TABLE "horses" DROP CONSTRAINT "FK_00cee6cce29c83289f3e5f5c650"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_fb465726b1745ecff7eea073e0e"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_fbcb737b3ecc7c968b0dc167122"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_aec1472403b8ae5d5c4ca632e41"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_fbde84e628534cdfba82c231c88"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_b138f300626648e9107e5521d0b"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_e49b8f6b8f74fb09c818078f198"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_cbfcd51c809f2ffb92eb2d285d2"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_c7481daf5059307842edef74d73"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_seller_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "chats"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "horses"`);
        await queryRunner.query(`DROP TYPE "public"."horses_verification_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."horses_sale_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."horses_discipline_enum"`);
        await queryRunner.query(`DROP TYPE "public"."horses_sex_enum"`);
        await queryRunner.query(`DROP TABLE "sales"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TYPE "public"."documents_purpose_enum"`);
        await queryRunner.query(`DROP TYPE "public"."documents_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."documents_type_enum"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
