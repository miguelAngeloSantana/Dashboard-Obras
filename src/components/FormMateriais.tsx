"use client";

import { useRouter } from "next/navigation";

import { ObraType } from "@/lib/types";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { criarMaterial } from "@/actions/materialPrismaAction";

const schemaMateriais = z.object({
    // id: z.string(),
    nomeMaterial: z.string(),
    unidade: z.string(),
    valor: z.coerce.number(),
    qtdAtual: z.coerce.number().optional(),
    qdtPlanejada: z.coerce.number(),
    qtdMinima: z.coerce.number().optional(),
    obraNome: z.string()
})

export type schemaMateriaisType = z.infer<typeof schemaMateriais>

type obra = {
    obra: ObraType[]
}

function CampoFormulario({
    label, obrigatorio = false, children
}: {
    label: string, obrigatorio?: boolean, children: React.ReactNode
}) {
    return (

        <div className="flex flex-col text-center justify-center mb-8 w-full">
            <label className="mb-2">{label}</label>
            { obrigatorio ?? <span className="text-[#E24B4A] ml-2">*</span> }
            { children }
        </div>

    )
}

export default function FormMateriais({obra}: obra) {

    const route = useRouter()

    const { register, handleSubmit } = useForm<schemaMateriaisType>({
        resolver: zodResolver(schemaMateriais),
        defaultValues: {
            nomeMaterial: "",
            unidade: "",
            qtdAtual: 0,
            qdtPlanejada: 0,
            qtdMinima: 0,
            obraNome: ""
        }
    })

    async function handleSubmitForm(data: schemaMateriaisType, e: React.SubmitEvent) {
        e.preventDefault();

        await criarMaterial({
            ...data,
            valor: Number(data.valor),

        });

        route.back();
    }

    return (
        <form 
            className="flex flex-col justify-center text-center w-full"
            onSubmit={handleSubmit(handleSubmitForm, (error)=>console.log(error))}
        >

            <CampoFormulario label="Nome do Material" obrigatorio>
                <input 
                    type="text"
                    required
                    placeholder="Pregos"
                    className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3 w-[40%] mx-auto"
                    {...register("nomeMaterial")}
                />
            </CampoFormulario>

            <CampoFormulario label="Unidade">
                <input
                    type="text"
                    placeholder="sc, sacos, m³, un, kg, m, m²"
                    className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3 w-[40%] mx-auto"
                    {...register("unidade")}
                />
            </CampoFormulario>

            <CampoFormulario label="Valor pago da mercadoria" obrigatorio>
                <input 
                    type="number"
                    required
                    placeholder="ex: 12,00"
                    className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3 w-[40%] mx-auto"
                    {...register("valor", {valueAsNumber: true})}
                />
            </CampoFormulario>

            <CampoFormulario label="Quantidade Atual" obrigatorio>
                <input 
                    type="number"
                    required
                    className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3 w-[40%] mx-auto"
                    {...register("qtdAtual", {valueAsNumber: true})}
                />
            </CampoFormulario>

            <CampoFormulario label="Quantidade Planejada">
                <input 
                    type="number"
                    // required
                    className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3 w-[40%] mx-auto"
                    {...register("qdtPlanejada", {valueAsNumber: true})}
                />
            </CampoFormulario>

            <CampoFormulario label="Quantidade Minima">
                <input 
                    type="number"
                    placeholder="(Opcional) será usado para laçar um alert quando a quantidade do estoque atinguir esse nivel"
                    className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3 w-[40%] mx-auto"
                    {...register("qtdMinima", {valueAsNumber: true})}
                />
            </CampoFormulario>

            <div className="flex text-center justify-center mb-8">
                <label className="text-xl font-bold">Qual obra esse material percente?</label>
                <select {...register("obraNome")} required className="cursor-pointer">
                    <option>selecione a obra...</option>
                    {
                        obra.map(obra => (
                            <option key={obra.id} value={obra.nome}>{obra.nome}</option>
                        ))
                    }
                </select>
            </div>

            <input 
                className="border mx-auto w-[40%] py-2 rounded-[14px] font-bold text-lg cursor-pointer hover:bg-gray-950 my-4" 
                type="submit" 
                value="enviar" 
            />
        </form>
    )
}