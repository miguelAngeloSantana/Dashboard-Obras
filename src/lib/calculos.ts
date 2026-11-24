import { SubEtapasDB, TypeEtapas, SubEtapaComPeso, EtapaComProgresso } from "../lib/types";

export function calcPesoSub(subs: SubEtapasDB[]): SubEtapaComPeso[] {
    if (subs.length === 0) return [];

    // Normaliza: ignora 0/null e converte 1..100 para 0.01..1
    const subsNorm = subs.map(s => {
        const val = s.pesoManual !== null && s.pesoManual !== undefined ? Number(s.pesoManual) : 0;
        return {
            ...s,
            pesoValido: val > 0 ? (val > 1 ? val / 100 : val) : null
        };
    });

    const totalManual = subsNorm
        .filter(s => s.pesoValido !== null)
        .reduce((acc, s) => acc + s.pesoValido!, 0);

    const nAuto = subsNorm.filter(s => s.pesoValido === null).length;

    // Caso 1: Existem sub-etapas sem peso manual -> divide o restante entre elas
    if (nAuto > 0) {
        const pesoAuto = Math.max(0, 1 - totalManual) / nAuto; // Trava os pesos garantindo o minimo de zero
        return subsNorm.map(({ pesoValido, ...s }) => ({
            ...s,
            pesoEfetivo: pesoValido !== null ? pesoValido : pesoAuto
        }));
    }

    // Caso 2: TODAS têm peso manual -> normaliza proporcionalmente para somar 1 (100%)
    // (Ex: se só tem 1 sub-etapa com peso 50%, o peso efetivo dela na etapa é 100%)
    return subsNorm.map(({ pesoValido, ...s }) => ({
        ...s,
        pesoEfetivo: totalManual > 0 ? pesoValido! / totalManual : 1 / subs.length
    })); // Divide os pesos das sub-etapas pelo total de pesos
};

export function calcProgEtapa(etapa: TypeEtapas): number {
    if (etapa.subEtapa.length === 0) {
        return etapa.progressoPct;
    };

    const subsComPeso = calcPesoSub(etapa.subEtapa);

    const resultado = subsComPeso.reduce(
        (acc, s) => acc + s.progressoPct * s.pesoEfetivo, 0
    );

    return Math.round(resultado);
};

export function calcProgObra(etapas: TypeEtapas[]): number {
    if (etapas.length === 0) return 0;

    const getPeso = (e: TypeEtapas) => {
        const p = Number(e.pesoOrcamento) > 0 ? Number(e.pesoOrcamento) : Number(e.pesoFixoPadrao);
        return p > 1 ? p / 100 : p;
    };

    const somaPesos = etapas.reduce((acc, e) => acc + getPeso(e), 0);
    if (somaPesos === 0) return 0;

    const progressoObra = etapas.reduce((acc, etapa) => {
        return acc + calcProgEtapa(etapa) * getPeso(etapa);
    }, 0);

    
    // Garante que mesmo que novas sub-etapas forem adicionadas, o progresso não irá passar de 100%
    return Math.round(progressoObra / somaPesos);
};

export function enriquecerEtapa(etapas: TypeEtapas[]):EtapaComProgresso[] {
    return etapas.map(etapa => {
        const pesoAtivo = Number(etapa.pesoOrcamento) > 0
            ? Number(etapa.pesoOrcamento)
            : Number(etapa.pesoFixoPadrao);
        const progressoCalculado = calcProgEtapa(etapa);
        const contribuicaoObra = parseFloat((progressoCalculado * pesoAtivo).toFixed(2));
        const subEtapas = calcPesoSub(etapa.subEtapa);

        return {
            ...etapa,
            subEtapas,
            pesoAtivo,
            progressoCalculado,
            contribuicaoObra
        };
    });


    // return etapas.map(etapa => {
    //     const pesoAtivo = etapa.pesoOrcamento ?? etapa.pesoFixoPadrao;
    //     const pesoAtivo = Number(etapa.pesoOrcamento) > 0
    //         ? Number(etapa.pesoOrcamento)
    //         : Number(etapa.pesoFixoPadrao)
    //     const progressoCalculado = calcProgEtapa(etapa);
    //     const contribuicaoObra = parseFloat((progressoCalculado * Number(pesoAtivo)).toFixed(2));
    //     const subEtapas = calcPesoSub(etapa.subEtapa);

    //     return {
    //         ...etapa,
    //         subEtapas,
    //         pesoAtivo,
    //         progressoCalculado,
    //         contribuicaoObra
    //     };
    // });
};

export function formatarPeso(peso: number):string {
    return `${Math.round(peso * 100)}%`;
};

export function statusProgresso(pct: number): "concluido" | "em_andamento" | "pendente" {
    if (pct >= 100) return "concluido";
    if (pct > 0) return "em_andamento";
    return "pendente";
};