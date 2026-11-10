// "use client"

import { ObraTypeOrcamento } from "@/lib/types";

// import { prisma } from "@/lib/prisma";

import Link from "next/link";

interface Dados {
    dados: ObraTypeOrcamento[]
}

export default function TabelOrcamento({ dados }: Dados) {
    // const idObra = dados.map((obra) => obra.id);
    // const dadosOrcamento = await prisma.lancamento.aggregate({
    //     where: {
    //         obraId: {
    //             in: idObra
    //         }
    //     },

    //     _sum: {
    //         valor: true
    //     }

        
    // })

//    const dadosOrcamento = await Promise.all(
//     dados.map(async(obra) => {
//         const valores = await prisma.lancamento.findMany({
//             where: {
//                 obraId: obra.id
//             }
//         })

//         const custoTotal = valores.reduce((acc, s ) => acc + Number(s.valor), 0);

//        return {
//         custoTotal
//        }
//     })
//    )


    // dadosOrcamento.filter(item => item.id === idObra)


   

    return (
        <div className="x-full p-6">
            <h2 className="text-lg mb-5">Detalhadamento por Projeto</h2>

            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full text-center border-collapse sm:border rounded-lg">
                    <thead className="text-sm bg-[#2f2f2f]">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Obra</th>
                            <th className="px-6 py-3 font-semibold">Previsto</th>
                            <th className="px-6 py-3 font-semibold">Realizado</th>
                            <th className="px-6 py-3 font-semibold">Desvio</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-800">
                        {/* {
                            dados.map((obra) => (
                                <tr key={obra.id} className="hover:bg-[#2f2f2f]">
                                    <td className="px-6 py-4 text-lg">
                                        <span>{obra.nome}</span>
                                    </td>

                                    <td className="px-6 py-4 text-2xl">
                                        <span className="text-gray-400">${obra.orcamentoTotal}</span>
                                    </td>

                                    <td className="px-6 py-4 text-2xl">
                                        <span className="text-lg font-semibold">0</span>
                                    </td>

                                    <td className="px-6 py-4 text-lg">
                                        <span>4</span>
                                    </td>

                                    <td className="px-6 py-4 text-lg">
                                        <span>{obra.status}</span>
                                    </td>
                                </tr>
                            ))
                        } */}

                        {
                            dados.map((obra) => {
                                // const custoTotal = obra.lancamento.reduce((acumulador, lancamento) => {
                                //     return acumulador + Number(lancamento.valor)
                                // }, 0)

                                const filtrar = obra.lancamentos.filter((lancamento) => lancamento.obraId === obra.id)
                                .reduce((acumulador, lancamento) => acumulador + Number(lancamento.valor), 0)

                                const previsto = obra.orcamentoTotal || 0

                                const desvioAbsoluto = previsto - filtrar;

                                const desvio = previsto > 0 ? ( desvioAbsoluto / previsto ) * 100 : 0

                                return (
                                     <tr key={obra.id} className="hover:bg-[#2f2f2f]">
                                        <td className="px-6 py-4 text-lg">
                                            <Link href={{
                                                pathname: "/obraOrcamento",
                                                query: {
                                                    id: obra.id
                                                }
                                            }}>
                                                <span>{obra.nome}</span>
                                            </Link>
                                        </td>

                                        <td className="px-6 py-4 text-2xl">
                                            <span className="text-gray-400">{obra.orcamentoTotal?.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL"
                                            })}</span>
                                        </td>

                                        <td className="px-6 py-4 text-2xl">
                                            <span className="text-lg font-semibold">{
                                                filtrar.toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL"
                                                })   
                                            }</span>
                                        </td>

                                        <td className="px-6 py-4 text-lg">
                                            <span>
                                                {
                                                    desvio.toFixed(1)
                                                }%
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-lg">
                                            <span>{obra.status}</span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}