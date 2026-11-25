-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "extension_id" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_extension_id_fkey" FOREIGN KEY ("extension_id") REFERENCES "order_extensions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
