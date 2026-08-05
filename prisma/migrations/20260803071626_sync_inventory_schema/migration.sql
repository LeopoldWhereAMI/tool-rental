/*
  Warnings:

  - A unique constraint covering the columns `[user_id,article]` on the table `inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "inventory" ALTER COLUMN "status" SET DEFAULT 'available',
ALTER COLUMN "maintenance_interval_days" SET DEFAULT 30,
ALTER COLUMN "work_days_count" SET DEFAULT 0,
ALTER COLUMN "total_work_days" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "inventory_user_id_article_key" ON "inventory"("user_id", "article");
