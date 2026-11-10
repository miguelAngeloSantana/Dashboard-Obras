"use client";

import getOrcamentoObra, { getEtapaOrcamento, getMaterialLancamento, SumTypeOrcamento } from "@/actions/orcamentoAction"
import { MaterialType, ObraTypeOrcamento, TypeEtapas } from "@/lib/types";
// import { Decimal } from "@prisma/client/runtime/client";
import { useState, useEffect } from "react";

export interface IdObra {
    id: string
};

export default function OrcamentoDetails({id}: IdObra) {

    const [ dadosObra, setDadosObra ] = useState<ObraTypeOrcamento>();
    const [ dadosEtapa, setDadosEtapa ] = useState<TypeEtapas[]>();
    const [ dadosMaterial, setDadosMaterial ] = useState<MaterialType[]>();

    const [ dadosSomados, setDadosSomados ] = useState<{
        tipo: string
        _sum: {
            valor: number
        }
    }[]>()    
    
    
    useEffect(() => {
        if (!id) return;
        SumTypeOrcamento(id).then((res) => setDadosSomados(res))

        getOrcamentoObra(id)
            .then((res) => {
                
                setDadosObra(res)
            })
            .catch(error => console.log("Error ao buscar o orçamento da obra: ", error));

        getEtapaOrcamento(id)
            .then((res) => {
                setDadosEtapa(res)
            })
            .catch(error => console.log("Erros nos orçamentos das etapas: ", error));

        // getLancamentoOrcamento(id)
        //     .then((res) => {
        //         setDadosLancamento(res);
        //     })
        //     .catch(error => console.log("Erros ao obter os orcamentos dos gastos: ", error))

        getMaterialLancamento(id)
            .then((res) => {
                // Number(dadosMaterial?.valor)
                setDadosMaterial(res)
            })
            .catch(error => console.log("Error ao obter o orçamento do material: ", error))
    }, [id])

    if (!dadosObra) return "Obra não encontrada"
    console.log(dadosEtapa)

    const total = dadosObra.lancamentos
        .reduce((acc, s) => acc + Number(s.valor), 0) || 0

    return (
        <div className="pl-4">
            <h1 className="text-center my-5 text-2xl">Orcamento vs Realizado </h1>

            <div className="p-4">

                <div className="max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-4 mx-auto">
                    <div className="p-3 bg-amber-50 rounded-lg text-black">
                        <span className="font-bold text-lg">{dadosObra.orcamentoTotal?.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        </span>
                    </div>

                    <div className="p-3 bg-gray-900 rounded-lg">
                        <span className="font-bold text-lg">{total.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        </span>
                    </div>

                    <div className="p-3 bg-amber-700 rounded">
                        <span className="font-bold text-lg">{
                                (Number(dadosObra.orcamentoTotal) - total).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })
                            }
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="mt-9 text-center sm:text-left">
                <span className="text-lg font-semibold">
                    Por etapa - <span className="text-base text-gray-300 font-bold">{dadosObra.nome}:</span>
                </span>

                <div className="w-full p-6 flex justify-between items-center">
                    <ul className="w-full">
                        {
                            dadosEtapa?.map((etapa) => (
                                
                                <li key={etapa.id} className="flex justify-center sm:justify-start gap-10 w-full p-6">
                                    <span className="text-lg font-semibold">{etapa.nome}</span>
                                    <span className="text-lg font-bold text-red-600">
                                        R$ { Number(etapa.custoOrcamento) }
                                    </span>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className="w-full p-2 flex flex-col justify-start">
                    <h3 className="text-lg font-bold mb-3">Despesas Totais:</h3>
                    <ul>
                        {
                            dadosSomados?.map((e) => (
                                <li key={e.tipo} className="flex justify-center sm:justify-start gap-10 w-full p-6">
                                    <span className="font-medium sm:font-semibold text-sm sm:text-base">{e.tipo}: </span>
                                    <span className="font-semibold sm:font-bold text-base sm:text-lg ml-3">
                                        {Number(e._sum.valor).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL"
                                        })}
                                    </span>
                                </li>
                            ))
                        }

                    </ul>
                </div>

                <div>

                    {
                        Number(dadosMaterial?.length) !==0 ? (
                            <div className="w-full p-2 flex flex-col justify-start">
                                <span className="text-base sm:text-2xl font-bold my-7">Gastos por Material que Foram Cadastrados:</span>
                                <ul>
                                    {
                                    
                                        dadosMaterial?.map((e) => (
                                            <li key={e.id} className="flex justify-center sm:justify-start gap-10 w-full p-6">
                                                <span className="font-semibold text-lg">{e.nomeMaterial}:</span>
                                                <span className="font-bold text-lg sm:text-2xl">
                                                    {Number(e.valor).toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL"
                                                    })}
                                                </span>
                                            </li>
                                        )) 
                                    }
                                </ul>  
                            </div>
                        ): (
                            <span className="text-base sm:text-2xl font-bold mt-11">Nenhum material salvo para essa obra</span>
                        )
                    }
                </div>
            </div>
        </div>
    )
}