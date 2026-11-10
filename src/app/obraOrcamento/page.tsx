"use client"

import OrcamentoDetails from "@/components/OrcamentoDetails";

import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

export default function ObraOrcamento() {

    const search = useSearchParams()

    const id = search.get("id");

    return (
        <>  
            <Suspense fallback={<span>Carregando...</span>}>
                <OrcamentoDetails id={id || ""}/>

            </Suspense>
        
        </>
    )
}