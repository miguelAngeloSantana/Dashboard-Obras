/*
  Warnings:

  - You are about to drop the column `obraId` on the `Estoque` table. All the data in the column will be lost.
  - You are about to alter the column `qtdPlanejada` on the `Estoque` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Integer`.
  - You are about to alter the column `qtdDisponivel` on the `Estoque` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Integer`.
  - You are about to alter the column `qtdMinima` on the `Estoque` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Integer`.
  - You are about to drop the column `materialId` on the `ItemPedido` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the `_MaterialToObra` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[materialId]` on the table `Estoque` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pedidoId]` on the table `ItemPedido` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qtdMinima` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidade` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Estoque" DROP CONSTRAINT "Estoque_obraId_fkey";

-- DropForeignKey
ALTER TABLE "ItemPedido" DROP CONSTRAINT "ItemPedido_materialId_fkey";

-- DropForeignKey
ALTER TABLE "_MaterialToObra" DROP CONSTRAINT "_MaterialToObra_A_fkey";

-- DropForeignKey
ALTER TABLE "_MaterialToObra" DROP CONSTRAINT "_MaterialToObra_B_fkey";

-- DropIndex
DROP INDEX "Estoque_obraId_idx";

-- DropIndex
DROP INDEX "Estoque_obraId_materialId_key";

-- DropIndex
DROP INDEX "ItemPedido_pedidoId_materialId_key";

-- AlterTable
ALTER TABLE "Estoque" DROP COLUMN "obraId",
ALTER COLUMN "qtdPlanejada" SET DATA TYPE INTEGER,
ALTER COLUMN "qtdDisponivel" DROP DEFAULT,
ALTER COLUMN "qtdDisponivel" SET DATA TYPE INTEGER,
ALTER COLUMN "qtdMinima" DROP DEFAULT,
ALTER COLUMN "qtdMinima" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "ItemPedido" DROP COLUMN "materialId";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "status",
ADD COLUMN     "obraNome" TEXT[],
ADD COLUMN     "qtdMinima" INTEGER NOT NULL,
ADD COLUMN     "unidade" TEXT NOT NULL;

-- DropTable
DROP TABLE "_MaterialToObra";

-- CreateIndex
CREATE UNIQUE INDEX "Estoque_materialId_key" ON "Estoque"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemPedido_pedidoId_key" ON "ItemPedido"("pedidoId");
