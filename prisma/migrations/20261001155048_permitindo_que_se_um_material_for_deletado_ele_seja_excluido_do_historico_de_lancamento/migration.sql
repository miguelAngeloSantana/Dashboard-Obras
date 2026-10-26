-- DropForeignKey
ALTER TABLE "Lancamento" DROP CONSTRAINT "Lancamento_materialId_fkey";

-- AddForeignKey
ALTER TABLE "Lancamento" ADD CONSTRAINT "Lancamento_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
