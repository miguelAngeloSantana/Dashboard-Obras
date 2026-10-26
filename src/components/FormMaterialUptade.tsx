"use client";

import { z } from "zod";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import uptadeMaterial from "@/actions/materialPrismaAction";

import { MaterialType, MaterialTypeUptade } from "@/lib/types";

const materialUptadeSchema = z.object({
    id: z.string(),
    qtdAtual: z.int(),
    qdtPlanejada: z.int(),
    qdtMinima: z.int() 
})

type materialUptadeType = z.infer< typeof materialUptadeSchema >

function CampoFormularioEdit({ label, obrigatorio = false, children }: {
    label: string, obrigatorio?:boolean, children: React.ReactNode
}) {
    return (
        <div className="flex flex-col text-center justify-center mb-8 w-full">
            <label className="mb-2">{label}</label>
            { obrigatorio ?? <span className="text-[#E24B4A] ml-2">*</span> }
            { children }
        </div>
    )
}

export default function FormMaterialUptade(dados: MaterialTypeUptade) {
    const router = useRouter();
    
    const query = useSearchParams()
    
    const { register, handleSubmit } = useForm<materialUptadeType>({
        resolver: zodResolver(materialUptadeSchema),
        defaultValues: {
            id: dados.id,
            qtdAtual: Number(query.get("qtdAtual")),
            qdtPlanejada: Number(query.get("qdtPlanejada")),
            qdtMinima: Number(query.get("qtdMinima"))
        }
    });

    async function handlerSubmit(materialDate: MaterialType, e: React.SubmitEvent){
        e.preventDefault();

        await uptadeMaterial(materialDate);

        router.back();
    };

    return (
        <>
            <form
                className="flex flex-col justify-center text-center w-full"
                onSubmit={handleSubmit(handlerSubmit, (error)=>console.log(error))}
            >
                <CampoFormularioEdit label="Quantidade Atual Nova" obrigatorio>
                    <input 
                        type="number"
                        required
                        className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3 w-[40%] mx-auto"
                        {...register("qtdAtual", { valueAsNumber: true })}
                    />
                </CampoFormularioEdit>

                <CampoFormularioEdit label="Quantidade Planejada Nova">
                    <input 
                        type="number"
                        // required
                        className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3 w-[40%] mx-auto"
                        {...register("qdtPlanejada", { valueAsNumber: true })}
                    />
                </CampoFormularioEdit>

                <CampoFormularioEdit label="Quantidade Minima Nova ( Opcional )">
                    <input 
                        type="number"
                        // required
                        className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3 w-[40%] mx-auto"
                        {...register("qdtMinima", { valueAsNumber: true })}
                    />
                </CampoFormularioEdit>

                <input 
                    className="border mx-auto w-[40%] py-2 rounded-[14px] font-bold text-lg cursor-pointer hover:bg-gray-950 my-4" 
                    type="submit" 
                    value="Enviar" 
                />
            </form>
        </>
    )
}