/*
  Warnings:

  - The `item_status` column on the `order_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('rented', 'returned', 'active');

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "item_status",
ADD COLUMN     "item_status" "OrderItemStatus" NOT NULL DEFAULT 'active';
