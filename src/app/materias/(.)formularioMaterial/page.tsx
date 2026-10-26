import FormMateriais from "@/components/FormMateriais";
import { prisma } from "@/lib/prisma"

export default async function formularioMaterial() {

    const obra = await prisma.obra.findMany();

    const dadosFormatados = obra.map(o => ({
        ...o,
        orcamentoTotal: Number(o.orcamentoTotal)
    }))

    return (
        <div className="w-full">
            <h1 className="text-center my-7 text-xl font-semibold">Adicionar movimentação</h1>

            <FormMateriais obra={dadosFormatados}/>
            
        </div>
    )
}