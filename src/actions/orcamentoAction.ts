"use server";

import { prisma } from "@/lib/prisma";

export default async function getOrcamentoObra(id: string) {
    const orcamentoObra = await prisma.obra.findUniqueOrThrow({
        where: {
            id: id
        },

        select: {
            lancamentos: true,
            orcamentoTotal: true,
            id: true,
            nome: true,
            endereco: true,
            cep: true,
            clienteNome: true,
            clientTel: true,
            dataInicio: true,
            dataFim: true,
            status: /*statusObra*/ true,
            progresso_pct: true
        }
    })

    return {
        ...orcamentoObra,
        orcamentoTotal: Number(orcamentoObra.orcamentoTotal),
   lancamentos: orcamentoObra.lancamentos.map((e) => ({
        ...e,
    valor: Number(e.valor)
  }))
    };
};

export async function SumTypeOrcamento(id: string) {

    const totais = await prisma.lancamento.groupBy({
        where: {
            obraId: id,
        },
        by: ["tipo"],
        
        _sum: {
            valor: true
        }
    })

    const dadosTotais = totais.map((e) => ({
        ...e,
        _sum: {
            valor: e._sum.valor ? e._sum.valor.toNumber() : 0
        }
    }))

    return dadosTotais
}

export async function getEtapaOrcamento(id: string) {
    const etapaOrcamento = await prisma.etapa.findMany({
        where: {
            obraId: id
        },

        select: {
            id: true,
            nome: true,
            dataInicio: true,
            dataFim:  true,
            status: true,
            obraId: true,
            ordem: true,
            dataFimPrev:  true,
            progressoPct: true,
            custoOrcamento: true,
            pesoFixo: true,
            pesoFixoPadrao: true,
            pesoOrcamento:  true,
            custoEtapa:  true,
            subEtapa: true
        }
        
    })

    const dadosEstruturados = etapaOrcamento.map((e) => ({
        ...e,
        pesoFixoPadrao: Number(e.pesoFixoPadrao),
        pesoOrcamento: Number(e.pesoOrcamento),
        custoOrcamento: Number(e.custoOrcamento)
    }))

    return dadosEstruturados;
}

export async function getMaterialLancamento(id: string) {
    const materialLancamento = await prisma.material.findMany({
        where: {
            lacamento: {
                some: {
                    obraId: {
                        contains: id,
                        mode: "insensitive"
                    }
                }
            }
        }
    });

    return materialLancamento;
}