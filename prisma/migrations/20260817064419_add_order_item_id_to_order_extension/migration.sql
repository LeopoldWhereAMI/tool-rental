/*
  Warnings:

  - Added the required column `order_item_id` to the `order_extensions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_extensions" ADD COLUMN     "order_item_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "order_extensions" ADD CONSTRAINT "order_extensions_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
