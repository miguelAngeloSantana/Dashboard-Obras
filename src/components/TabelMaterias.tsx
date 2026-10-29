"use client"
import { FiltrosMaterias, statusType, TypeDadosMaterial } from "@/lib/types";


import { useState, useMemo } from "react";

import { ListFilter, Pencil, ArrowDownToLine } from "lucide-react";

import Link from "next/link";
import ModalFiltros from "./ModalFiltros";

interface Dados {
    dados: TypeDadosMaterial[]
}

const filtrosIniciais: FiltrosMaterias = {
    nome: "",
    status: "Todos",
    obraNome: "",
    qtdMinima: "",
    qtdAtual: "",
    orderBy: "Nome",
    order: "asc"
 };

function statusMaterial(dado: statusType) {
    if (dado.qtdAtual === dado.qtdMinima) {
        return "Atenção"
    } else if (dado.qtdAtual > dado.qtdMinima) {
        return "Normal"
    } else if (dado.qtdAtual < dado.qtdMinima) {
        return "Critico"
    }
}

function statusMaterialStyle(dado: statusType) {
    if (dado.qtdAtual === dado.qtdMinima) {
        return "#BA7517"
    } else if (dado.qtdAtual > dado.qtdMinima) {
        return "#d1d5dc"
    } else if (dado.qtdAtual < dado.qtdMinima) {
        return "#E24B4A"
    }
}


export function TabelMaterias({ dados }: Dados) {

    const [ modalAberto, setModalAberto ] = useState(false);

    // Filtros que o usário usa e não afeta a exibição da tabela
    const [ rascunhos, setRascunhos ] = useState<FiltrosMaterias>(filtrosIniciais); 

    //Filtros que o usuário irá usar para mudar a exibição da tabela
    const [ filtrosAplicados, setFiltrosAplicados ] = useState<FiltrosMaterias>(filtrosIniciais);

    const obras = useMemo(() => {
        return Array.from(
            new Set(dados.flatMap((material) => material.obraNome ?? []).sort((a, b) => a.localeCompare(b, "pt")))
        )
    }, [dados]);

    const materiasFiltrados = useMemo(() => {
        const resultado = dados.filter((material) => {
            const nomeCorrespondente = material.nomeMaterial.toLocaleLowerCase("pt").includes(filtrosAplicados.nome.trim().toLocaleLowerCase("pt"));

            const estado = statusMaterial(material);

            const estadoCorrespondente = filtrosAplicados.status === "Todos" || estado === filtrosAplicados.status;

            const obraCorrespondente = !filtrosAplicados.obraNome || (material.obraNome ?? []).includes(filtrosAplicados.obraNome);

            const temMinima = filtrosAplicados.qtdMinima.trim() !== "";
            const temMaxima = filtrosAplicados.qtdAtual?.trim() !== "";

            const minimo = temMinima ? Number(filtrosAplicados.qtdMinima) : null;

            const maximo = temMaxima ? Number(filtrosAplicados.qtdAtual) : null;

            const qtdMinimaCorrespondente = minimo === null || material.qtdAtual >= minimo;

            const qtdMaximaCorrespondente = maximo === null || material.qtdAtual <= maximo;

            return (
                nomeCorrespondente &&
                estadoCorrespondente &&
                obraCorrespondente &&
                qtdMaximaCorrespondente &&
                qtdMinimaCorrespondente
            );
        });

        // "Nenhuma" preserva a ordem recebida no prisma
        if ( filtrosAplicados.orderBy === "Nenhuma" ) {
            return resultado
        };

        const direcao = filtrosAplicados.order === "asc" ? 1 : -1;

        return [...resultado].sort((a, b) => {
            let comparacao = 0

            switch(filtrosAplicados.orderBy) {
                case "Nome":
                    comparacao = a.nomeMaterial.localeCompare(
                        b.nomeMaterial,
                        "pt",
                        { sensitivity: "base" }
                    );
                    break

                case "Quantidade Atual":
                    comparacao = a.qtdAtual - b.qtdAtual
                    break;

                case "Quantidade Minima":
                    comparacao = a.qtdMinima - b.qtdMinima
                    break
            }

            return comparacao * direcao
        });
    }, [dados, filtrosAplicados]);

    function abrirModal(){
        setRascunhos({ ...filtrosAplicados });
        setModalAberto(true);
    };

    function aplicarFiltro(){
        setFiltrosAplicados({ ...rascunhos });
        setModalAberto(false);
    };

    function limparFiltro(){
        setFiltrosAplicados({ ...filtrosIniciais });
    };

    function cancelarFiltro(){
        setFiltrosAplicados({ ...filtrosAplicados });
        setModalAberto(false);
    };

    const filtrosAtivos = 
        filtrosAplicados.nome.trim() !== "" ||
        filtrosAplicados.obraNome !== "" ||
        filtrosAplicados.orderBy !== "Nenhuma" ||
        filtrosAplicados.qtdAtual !== "" ||
        filtrosAplicados.qtdMinima !== "" ||
        filtrosAplicados.status !== "Todos"


    return (

        <div className="x-full p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-sm text-gray-400">
                    {materiasFiltrados.length} de { dados.length } materias
                </span>

                <div className="flex gap-5 items-center">
                    <div className="border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-800 cursor-pointer">

                    <ArrowDownToLine size={18}/>
                    </div>

                    <button
                        type="button"
                        onClick={abrirModal}
                        className="flex items-center gap-2 rounded-xl border 
                            border-zinc-700 px-4 py-2 hover:bg-zinc-800 cursor-pointer"
                    >
                        <ListFilter size={18}/>

                        <span className="text-sm sm:text-base">Filtrar e Ordernar</span>
                        { filtrosAtivos && (
                            <span className="rounded-full bg-sky-700 px-2 py-0.5 text-sm">
                                Ativo
                            </span>
                        ) }
                    </button>
                </div>
            </div>


            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full text-center border-collapse sm:border rounded-lg">
                    <thead className="text-sm bg-[#2f2f2f]">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Material</th>
                            <th className="px-6 py-3 font-semibold">Qtd. Atual</th>
                            <th className="px-6 py-3 font-semibold"> Projetos</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                            <th className="px-6 py-3 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">

                        { materiasFiltrados.map((material) => (
                            <tr key={material.id} className="hover:bg-[#2f2f2f]">
                                <td className="px-6 py-4 text-lg">
                                    <span>{ material.nomeMaterial } { material.unidade}</span>
                                    <br/>
                                    <span className="text-xs text-gray-500">Quantidade minima para alerta: {material.qtdMinima}</span>
                                </td>

                                <td className="px-6 py-4 text-sm">
                                    <div className="text-lg font-bold">{material.qtdAtual}</div>
                                    <div className="text-sm text-shadow-gray-500">Planejada: {material.qdtPlanejada ?? "-"}</div>
                                </td>

                                <td className="px-6 py-4 text-base font-semibold">
                                    { material.obraNome.length ? material.obraNome.join(", ") : "Obra sem nome" }
                                </td>

                                <td className="px-6 py-4 text-sm" style={{ color: statusMaterialStyle(material) }}>
                                    { statusMaterial(material) }
                                </td>

                                <td className="px-6 py-4 text-sm">
                                    <Link
                                        href={{ 
                                            pathname: `/materias/formularioMaterialUptade`,
                                            query: {
                                                id: material.id, 
                                                nomeMaterial: material.nomeMaterial, 
                                                qdtPlanejada: material.qdtPlanejada, 
                                                qtdAtual: material.qtdAtual, 
                                                qtdMinima: material.qtdMinima

                                            }
                                         }}
                                    >
                                        <Pencil size={20} className="mx-auto"/>
                                    </Link>
                                </td>
                            </tr>
                        )) }

                        { materiasFiltrados.length === 0 &&  (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-shadow-gray-400">
                                    Nenhum Material correspondende aos filtros
                                    { filtrosAtivos ?? (
                                        <div className="mt-3">
                                            <button 
                                                type="button" 
                                                className="text-sky-400 underline"
                                                onClick={() => { 
                                                    setFiltrosAplicados({...filtrosIniciais})
                                                    setRascunhos({...filtrosIniciais})
                                                }}
                                                >
                                                    Limpar Filtros
                                                </button>
                                        </div>
                                    ) }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            { modalAberto && (
                <ModalFiltros 
                    filtros={rascunhos}
                    obras={obras}
                    onChange={setRascunhos}
                    onAplicar={aplicarFiltro}
                    onLimpar={limparFiltro}
                    onCancelar={cancelarFiltro}
                />
            ) }

        </div>

    )
}