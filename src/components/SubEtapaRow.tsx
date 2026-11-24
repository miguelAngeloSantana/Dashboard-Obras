"use client";

import { useRef, useState } from "react";

import type { SubEtapaConfig } from "../lib/types";

import { formatarPeso } from "../lib/calculos";

import { updatePesoManua } from "@/actions/recalcularProgressoAction";

export default function SubEtapaRow({ sub, totalSubEtapas, onChange, onRemove}: SubEtapaConfig){

    const pesoAtual = sub.pesoManual !== null && Number(sub.pesoManual) > 0
        ?  (Number(sub.pesoManual) > 1 ? Number(sub.pesoManual) / 100 : Number(sub.pesoManual))
        : null

    const temPesoManual = pesoAtual !== null;
    
    const pesoAutomatico = 1 / totalSubEtapas // Escala 0..1 (ex: 0.5 para 2 sub-etapas)
    
    const [ pesoInput, setPesoInput ] = useState<string>(
        temPesoManual !== null ? String(Math.round(pesoAtual! * 100)) : ""
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const handlerProgressoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...sub, progressoPct: Number(e.target.value)});
    };

    const abrirEditarPeso = () => {
        setPesoInput(temPesoManual !== null ? String(Math.round(pesoAtual! *100)) : "");
        
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const confirmarPeso = async() => {
        const valor = parseInt(pesoInput);

        if (pesoInput.trim() == "" || isNaN(valor) || valor <= 0){

            //volta para os pesos automaticos
            onChange({ ...sub, pesoManual: null });
            await updatePesoManua(sub.id, null);
            setPesoInput("");
        } else {
            const pesoNovo = Math.max(0, Math.min(100, valor));
            const pesoDecimal = pesoNovo / 100;
            onChange({ ...sub, pesoManual: pesoDecimal });
            await updatePesoManua(sub.id, pesoDecimal);
        }
    };

    const resetarParaAuto = async () => {
        onChange({ ...sub, pesoManual: null });
        await updatePesoManua(sub.id, null)
        setPesoInput("");
    };

    const hanlderPesoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") confirmarPeso();
    };

        // Ambos usam escala 0..1, então formatarPeso (que faz * 100) funciona nos dois!
    const pesoLabel = temPesoManual 
        ? `Peso manual: ${formatarPeso(pesoAtual)}` 
        : `peso auto: 1/${totalSubEtapas} = ${formatarPeso(pesoAutomatico)}`

    return (
        <div 
            className="flex flex-col sm:flex-row justify-center items-start flex-wrap w-full sm:w-75vw gap-10 px-3 py-2.5 mb-24" 
            style={{position: "relative" as const }}
        >
            {/* Nome e info de pesos */}
            <div className="flex flex-1 justify-center items-center min-w-0 gap-10 text-center my-0 mx-auto">
                <div className="text-sm font-medium text-amber-50 overflow-hidden overfloe text-ellipsis whitespace-nowrap">
                    {sub.nome}
                </div>

                <div className="text-sm mt-[1]" style={{ color: temPesoManual ? "#854F0B": "green" }}>
                    {pesoLabel}
                </div>
            </div>

            {/* Slider de PRogresso */}
            <div className="flex items-center gap-8 shrink-0 w-full sm:w-auto">
                <input 
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={sub.progressoPct}
                    onChange={handlerProgressoChange}
                    aria-label={`Progresso de ${sub.nome}`}
                    className=" cursor-pointer w-full"
                    style={{ accentColor: "#3B6D11" }}
                />
                <span className="text-sm font-medium w-[30] text-right">{sub.progressoPct}%</span>
            </div>

            {/* Mini barra */}
            <div className="flex justify-between w-full sm:justify-start sm:w-auto">

                <button
                    type="button"
                    onClick={abrirEditarPeso}
                    title={temPesoManual ? "Peso Manual autoo - clique para editar": "Definir peso manual"}
                    aria-label="Definir peso das sub etapas"
                    className="text-sm px-2 py-0.5 rounded-[6] cursor-pointer shrink-0"
                >
                    { temPesoManual ? `peso de: ${formatarPeso(pesoAtual)}%`: "pesos" }

                </button>

                {/* botao para remover */}
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={`Remover sub etapa ${sub.nome}`}
                    className="text-sm py-0.5 px-1.5 rounded-[6] cursor-pointer shrink-0"
                >
                    X
                </button>
            </div>

            {/* Botao peso manual */}

            {/* popover de peso manual */}

            <div 
                role="dialog"
                aria-label="Definir peso manual"
                className="rounded-[10] p-[12] z-20 w-full sm:min-w-[190] flex flex-col gap-8"
            >
                <div className="text-sm">
                    Peso Manual - Deixe vazio para usar pesos automaticos
                </div>

                <input 
                    ref={inputRef}
                    type="number"
                    min={0}
                    max={100}
                    value={pesoInput}
                    onChange={e => setPesoInput(e.target.value)}
                    onKeyDown={hanlderPesoKeyDown}
                    placeholder="Ex: 40"
                    className="text-sm p-2 rounded-[6] w-full border border-amber-50"
                />

                <div className="flex gap-6">
                    <button
                        type="button"
                        onClick={confirmarPeso}
                        className="flex-1 text-sm py-1.5 rounded-[6] border-none bg-[#3B6D11] text-[#C0DD97] cursor-pointer font-medium"
                    >
                        Confirmar
                    </button>

                    <button 
                        type="button"
                        onClick={resetarParaAuto}
                        className="flex-1 text-sm py-1.5 rounded-[6] cursor-pointer"
                    >
                        Resetar Pesos
                    </button>
                </div>
            </div>
        </div>
    )
}