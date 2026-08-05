/*
  Warnings:

  - The primary key for the `contract_templates` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "contract_templates" DROP CONSTRAINT "contract_templates_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "contract_templates_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "contract_templates_id_seq";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "order_number" SET DATA TYPE TEXT;
