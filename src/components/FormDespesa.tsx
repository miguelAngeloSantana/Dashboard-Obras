"use client";

import { z } from "zod";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Despesa, ObraType } from "@/lib/types";

import { postDespesa } from "@/actions/lancamentoActions";

import { useRouter } from "next/navigation";

const schemaDespesa = z.object({
    valor: z.number(),
    tipo: z.string(),
    obraNome: z.string(),
})

type schemaTypeDespesa = z.infer<typeof schemaDespesa>;

function CampoFormulario({
    label, children
}: {
    label: string, children: React.ReactNode
}) {
    return (

        <div className="flex flex-col text-center justify-center mb-8 w-full">
            <label className="mb-2">{label}</label>
            { children }
        </div>

    )
}

interface TypeObras {
    obra: ObraType[]
}

export default function FormDespesa({obra}: TypeObras){

    const router = useRouter()

    const { register, handleSubmit } = useForm<schemaTypeDespesa>({
        resolver: zodResolver(schemaDespesa),
        defaultValues: {
            valor: 0,
            tipo: "MATERIAL",
            obraNome: ""
        }
    })

    async function handlerSubmit(form: Despesa, e: React.SubmitEvent) {
        e.preventDefault();

        await postDespesa(form);

        router.back();
    }

    return (
        <form 
            className="flex flex-col justify-center items-center mt-5"
            onSubmit={handleSubmit(handlerSubmit, (error) => console.log("Error ao enviar as despesas", error))}
        >
            <CampoFormulario label="Qual o valor da despesa?">
                <input 
                    type="number"
                    required
                    placeholder="5, 50, 500"
                    className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3 w-[40%] mx-auto"
                    {...register("valor", { valueAsNumber: true })}
                />
            </CampoFormulario>

            <div className="flex flex-col text-center justify-center mb-12">
                <label className="text-xl font-bold">Qual tipo de despesa</label>
                <select 
                    required
                    className="cursor-pointer"
                    {...register("tipo")}
                >
                    <option>Escolha um tipo...</option>
                    <option value="MATERIAL">MATERIAL</option>
                    <option value="MAO_DE_OBRA">MAO DE OBRA</option>
                    <option value="EQUIPAMENTO">EQUIPAMENTO</option>
                    <option value="SERVICO">SERVICO</option>
                    <option value="OUTRO">OUTRO</option>
                </select>
            </div>

            <div className="flex flex-col text-center justify-center mb-8">
                <label className="text-xl font-bold">Qual obra essa despesa pertence</label>
                <select 
                    required
                    className="cursor-pointer"
                    {...register("obraNome")}
                >
                    <option>Obras salvas...</option>
                    {
                        obra.map((e) => (
                            <option key={e.id} value={e.nome}>{e.nome}</option>
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