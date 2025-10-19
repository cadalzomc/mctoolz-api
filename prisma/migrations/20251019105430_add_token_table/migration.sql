-- CreateEnum
CREATE TYPE "ETokenType" AS ENUM ('KEY', 'OTP', 'HASH');

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "type" "ETokenType" NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "owner" TEXT NOT NULL,
    "purpose" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");
