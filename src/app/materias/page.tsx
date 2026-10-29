import { TabelMaterias } from "@/components/TabelMaterias"; 

import { calcMetricaGastoMensal } from "@/lib/gastos";

import { prisma } from "@/lib/prisma";

import { CalendarCheck2, ArrowUp, Bus } from "lucide-react";

import Link from "next/link";

export default async function Materias() {

    const hoje = new Date();

    const lancamento = await prisma.lancamento.findMany({
        where: {
            tipo: "MATERIAL"
        }
    });

    const metricas = calcMetricaGastoMensal(lancamento, hoje);

    const critico = await prisma.material.findMany({
       where: {
        qtdAtual: {
            lt: prisma.material.fields.qtdMinima
        }
       }
    })

    const saudavel = await prisma.material.findMany({
        where: {
            qtdAtual: {
                gte: prisma.material.fields.qtdMinima
            }
        }
    })

    
    const dadosMaterial = await prisma.material.findMany({
        select: {
            id: true,
            nomeMaterial: true,
            unidade: true,
            obraNome: true,
            qtdAtual: true,
            qtdMinima: true,
            qdtPlanejada: true,
            valor: true,
            lacamento: true
        },
        orderBy: {
            nomeMaterial: "asc"
        }
    });

    let valorEstoqueSaudavel = 0
    let valorEstoqueCritico = 0

    dadosMaterial.forEach(m => {
        const estoqueCritico = m.qtdAtual * Number(m.valor)
        valorEstoqueSaudavel += estoqueCritico
    })

    saudavel.forEach(s => {
        const estoqueSaudavel = s.qtdAtual * Number(s.valor)
        valorEstoqueCritico += estoqueSaudavel
    })

    const saudeEstoque = (valorEstoqueCritico  /  valorEstoqueSaudavel) * 100

    const dados = dadosMaterial.map((material) => ({
        id: material.id,
        nomeMaterial: material.nomeMaterial,
        unidade: material.unidade,
        obraNome: material.obraNome,
        qtdAtual: Number(material.qtdAtual),
        qtdMinima: Number(material.qtdMinima),
        qdtPlanejada: material.qdtPlanejada === null ? null: Number(material.qdtPlanejada),
        valor: Number(material.valor),
        lancamento: material.lacamento.map(o => ({
            ...o,
            valor: Number(o.valor)
        }))
    }))

    return (
        <div>
            <div className="flex justify-between flex-col sm:flex-row gap-5 items-center mt-10 px-10">
                <h1 className="text-3xl font-bold">Inventario de materias</h1>
                <Link href="/materias/formularioMaterial">
                    <button className="bg-[#162839] p-3 rounded-2xl cursor-pointer mb-4 sm:mb-0">
                        <span className="text-lg font-bold">Adicionar Movimentação</span>
                    </button>
                
                </Link>
            </div>

            <div className="p-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <CalendarCheck2 size={20}/>
                        </div>

                        <div>
                            <span className="text-sm text-gray-400">
                                Saude do estoque: <span className="text-lg font-bold text-white">{saudeEstoque.toFixed(2)}%</span>
                            </span>
                            <h3 className="text-gray-500">{critico.length} mateiras com estoque baixo</h3>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <ArrowUp size={20} />
                        </div>

                        <div>
                            <span className="text-sm text-gray-400">
                                Consumo mensaul: <span className="text-lg font-bold text-amber-50">${metricas.totalMes / 100}k</span>
                            </span>
                            <br />
                            <span className="text-sm text-gray-300">
                                <span className="font-bold text-gray-50">{metricas.variacaoPct?.toFixed(2)}%</span>  
                                <span> em relação ao mês anterior</span>
                            </span>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <Bus size={20} />
                        </div>
                        <div>
                            <span>Pedidos pendente: 8 </span>
                            <br />
                            <span>Previsão de entrega: 24h</span>

                        </div>

                    </div>
                </div>
            </div>

            <TabelMaterias dados={dados} />
         </div>
    )
}