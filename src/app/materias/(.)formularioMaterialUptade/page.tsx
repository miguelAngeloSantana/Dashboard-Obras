"use client";

import FormMaterialUptade from "@/components/FormMaterialUptade";

import { useSearchParams } from 'next/navigation';

export default function FormMateriaisUptade(){

    const search = useSearchParams()

    const id = search.get("id");
     
    const qdtPlanejada = Number(search.get("qdtPlanejada"));
    const qtdAtual = Number(search.get("qtdAtual"));
    const qtdMinima = Number(search.get("qtdMinima"));

    return (
        <>
            <h1 className="text-center text-xl font-semibold my-7">Editar informações do material</h1>

            <FormMaterialUptade  id={id ?? ""} qtdMinima={qtdMinima ?? 0} qdtPlanejada={qdtPlanejada ?? 0} qtdAtual={qtdAtual ?? 0}/>
        
        </>
    )
}