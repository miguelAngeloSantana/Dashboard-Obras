/*
  Warnings:

  - A unique constraint covering the columns `[pedidoId,materialId]` on the table `ItemPedido` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `materialId` to the `ItemPedido` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ItemPedido_pedidoId_key";

-- AlterTable
ALTER TABLE "ItemPedido" ADD COLUMN     "materialId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ItemPedido_pedidoId_materialId_key" ON "ItemPedido"("pedidoId", "materialId");
