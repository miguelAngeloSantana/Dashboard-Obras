import TabelOrcamento from "@/components/TabelOrcamento";

import { Download } from "lucide-react";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Orcamento() {

    const dadosObra = await prisma.obra.findMany()

    const dadosLacamento = await prisma.lancamento.findMany()

    const dadosSerializados = dadosLacamento.map((e) => ({
        ...e,
        valor: Number(e.valor)
    }))

    const dados = dadosObra.map((obra) => ({
        id: obra.id,
        nome: obra.nome,
        endereco: obra.endereco,
        cep: obra.cep || "",
        clienteNome: obra.clienteNome,
        clientTel: obra.clientTel || "",
        dataInicio: obra.dataInicio,
        dataFim: obra.dataFim || null,
        status: obra.status,
        progresso_pct: obra.progresso_pct,
        orcamentoTotal: Number(obra.orcamentoTotal) || 0,
        lancamentos: dadosSerializados
    }))

    const dadosFiltradosOrcamentoRealizado = dadosLacamento.reduce((valor, acc) => valor + Number(acc.valor), 0);

    const dadosFiltradosPrevisto = dadosObra.reduce((valor, acc) => valor + Number(acc.orcamentoTotal), 0);

    const gastoTotal = dadosFiltradosPrevisto - dadosFiltradosOrcamentoRealizado
    

    return (
        <div>
            <div className="flex justify-between flex-col sm:flex-row gap-5 items-center mt-10 px-10">
                <h1 className="text-2xl font-bold">Orçamento do Projeto</h1>
                
                <div className="flex justify-between w-auto gap-5">
                    <div className="flex bg-gray-950 p-3 rounded-2xl cursor-pointer mb-4 gap-4">
                        <Download size={20}/>
                        <button>
                            <span className="font-semibold">Export PDF</span>
                        </button>
                    </div>

                    <div>
                        <Link href={"/formularioDespesa"}>
                            <button className="bg-[#162839] p-3 rounded-2xl cursor-pointer mb-4 sm:mb-0">
                                + Adicionar Despesa
                            </button> 
                        </Link>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3">
                    <div 
                        className="p-4 rounded-xl shasow-sm border border-gray-950 flex items-center justify-center space-x-4"
                    >
                        <div className="flex flex-col">
                            <span className="text-lg">Saudo Final ( Previsto )</span>
                            <span className="text-xs text-gray-400 my-4">
                                <span className="text-4xl font-bold text-white">
                                    {dadosFiltradosPrevisto.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}
                                </span>
                            </span>
                        </div>
                    </div>


                    <div 
                        className="p-4 rounded-xl shasow-sm border-t border-t-gray-800 
                          sm:border-l sm:border-l-gray-800 sm:border-t-0 flex items-center justify-center space-x-4"
                    >
                        <div className="flex flex-col gap-4">
                            <span className="text-lg">Total Gasto ( Realizado )</span>
                            <span className="text-sm text-gray-400 border-b-amber-700">
                                <span className="text-3xl font-bold">
                                    {dadosFiltradosOrcamentoRealizado.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}
                                </span>
                            </span>
                        </div>

                    </div>

                    <div 
                        className="p-4 rounded-xl shadow-sm border-t border-t-amber-700 
                            sm:border-l sm:border-l-amber-700 sm:border-t-0 flex items-center justify-center space-x-4"
                    >
                        <div className="flex flex-col gap-4">
                            <span className="text-lg">Total Estimado</span>
                            <span className="text-sm text-gray-400">
                                {/* R$<span className="font-bold text-3xl">1.250,000</span> */}
                                <span className="font-bold text-3xl">
                                    { gastoTotal.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    }) }
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <TabelOrcamento dados={dados}/>
        </div>
    )
}