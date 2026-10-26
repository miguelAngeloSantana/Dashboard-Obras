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
