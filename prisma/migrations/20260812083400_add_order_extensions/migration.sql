/*
  Warnings:

  - A unique constraint covering the columns `[user_id,order_number]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "order_extensions" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "paid_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_extensions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_user_id_order_number_key" ON "orders"("user_id", "order_number");

-- AddForeignKey
ALTER TABLE "order_extensions" ADD CONSTRAINT "order_extensions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
