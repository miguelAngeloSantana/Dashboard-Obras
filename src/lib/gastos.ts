import {
    Lancamento,
    MetricaGastoMensal,
    Periodo,
    TipoLancamento
} from "@/lib/types";

export function inicioMes(dataRef: Date): Date {
    return new Date(dataRef.getFullYear(), dataRef.getMonth(), 1, 0, 0, 0, 0);
};

export function fimMes(dataRef: Date): Date {
    return new Date(dataRef.getFullYear(), dataRef.getMonth() + 1, 0, 23, 59, 59, 999);
};

export function incioMesAnteior(dataRef: Date): Date {
    return new Date(dataRef.getFullYear(), dataRef.getMonth() - 1, 1, 0, 0, 0, 0);
};

export function fimMesAnteior(dataRef: Date): Date {
    return new Date(dataRef.getFullYear(), dataRef.getMonth(), 0, 23, 59, 59, 999);
};

export function periodoMesAntual(dataRef: Date): Periodo {
    return {
        de: inicioMes(dataRef),
        ate: fimMes(dataRef)
    }
};

export function periodoMesAnterior(dataRef: Date): Periodo {
    return {
        de: incioMesAnteior(dataRef),
        ate: fimMesAnteior(dataRef)
    }
};

export function filtrarPeriodo(lancamentos: Lancamento[], de: Date, ate: Date): Lancamento[] {
    return lancamentos.filter(p => {
        const dataLancamento = new Date(p.data)
        return dataLancamento >= de && dataLancamento <= ate
    })  
};

export function somarLancamentos(lancamentos: Lancamento[]): number {    
    
    return lancamentos.reduce((acc, l) => acc + Number(l.valor), 0);
};

export function calcVariacaoMensal(atual: number, anterior: number): number {
    if (anterior === 0) return atual > 0 ? 100 : 0;

    return (( atual - anterior ) / anterior) * 100
};

export function agruparPorObra(lancamentos: Lancamento[]): Map<string, number>{
    return lancamentos.reduce((map, p) => {
        map.set(p.obraId, (map.get(p.obraId) ?? 0) + Number(p.valor))
        return map
    }, new Map<string, number>())
};

export function agruparPorTipoO(lancamentos: Lancamento[]): Map<TipoLancamento, number>{
    return lancamentos.reduce((map, o) => {
        map.set(o.tipo, (map.get(o.tipo) ?? 0) + Number(o.valor));
        return map;
    }, new Map<TipoLancamento, number>())
};

export function calcMetricaGastoMensal(lancamentos: Lancamento[], ref: Date = new Date()): MetricaGastoMensal {
    const { de: deMes, ate: ateMes } = periodoMesAntual(ref);
    const { de: deAntes, ate: ateAntes } = periodoMesAnterior(ref);
    const lancMes = filtrarPeriodo(lancamentos, deMes, ateMes);
    const lancMesAnterior = filtrarPeriodo(lancamentos, deAntes, ateAntes);
    const totalMes = somarLancamentos(lancMes);
    const totalMesAnterior = somarLancamentos(lancMesAnterior);
    const variacaoPct = lancMesAnterior.length === 0 ? null : calcVariacaoMensal(totalMes, totalMesAnterior);     

    return {
        totalMes,
        totalMesAnterior,
        variacaoPct,
        porObra: agruparPorObra(lancMes),
        porTipo: agruparPorTipoO(lancMes)
    }
};