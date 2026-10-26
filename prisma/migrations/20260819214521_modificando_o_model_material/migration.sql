/*
  Warnings:

  - You are about to drop the column `categoria` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `unidade` on the `Material` table. All the data in the column will be lost.
  - Added the required column `qtdAtual` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" DROP COLUMN "categoria",
DROP COLUMN "unidade",
ADD COLUMN     "qdtPlanejada" INTEGER,
ADD COLUMN     "qtdAtual" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_MaterialToObra" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MaterialToObra_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MaterialToObra_B_index" ON "_MaterialToObra"("B");

-- AddForeignKey
ALTER TABLE "_MaterialToObra" ADD CONSTRAINT "_MaterialToObra_A_fkey" FOREIGN KEY ("A") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToObra" ADD CONSTRAINT "_MaterialToObra_B_fkey" FOREIGN KEY ("B") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
