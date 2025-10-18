-- CreateEnum
CREATE TYPE "EUserRole" AS ENUM ('SUPER', 'ADMIN', 'CONSIGNEE', 'CONSIGNOR', 'MANAGER', 'CASHIER', 'GUEST');

-- CreateEnum
CREATE TYPE "EUserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LOCKED', 'FOR_VERIFICATION');

-- CreateEnum
CREATE TYPE "EProfileStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(90) NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "password" VARCHAR(300) NOT NULL,
    "role" "EUserRole" NOT NULL DEFAULT 'GUEST',
    "status" "EUserStatus" NOT NULL DEFAULT 'FOR_VERIFICATION',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(60),
    "updated_at" TIMESTAMP(3),
    "updated_by" VARCHAR(60),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(35) NOT NULL,
    "email" TEXT NOT NULL,
    "contact" VARCHAR(15),
    "address" VARCHAR(200),
    "photo" VARCHAR(300),
    "status" "EProfileStatus" NOT NULL DEFAULT 'INACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(60),
    "updated_at" TIMESTAMP(3),
    "updated_by" VARCHAR(60),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_is_deleted_idx" ON "users"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "profiles_is_deleted_idx" ON "profiles"("is_deleted");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
