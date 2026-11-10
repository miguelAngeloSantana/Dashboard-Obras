import { getObra } from "@/actions/lancamentoActions";
import FormDespesa from "@/components/FormDespesa";

export default async function FormularioDespesa() {

    const obra = await getObra()

    const dadosFormatados = obra.map((e) => ({
        ...e,
        orcamentoTotal: Number(e.orcamentoTotal)
    }))

    return (
        <div className="w-full">
            <h1 className="text-2xl text-center font-bold mt-3">Adicionar uma nova despesa</h1>

            <FormDespesa obra={dadosFormatados}/>
        </div>
    )
}