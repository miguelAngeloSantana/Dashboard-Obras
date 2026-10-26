"use client";

import type { FilterTypes, FiltrosMaterias } from "@/lib/types";

export default function ModalFiltros({
    filtros,
    obras,
    onChange,
    onAplicar,
    onLimpar,
    onCancelar
}: FilterTypes) {
    function alterar<K extends keyof FiltrosMaterias>(
        campo: K,
        valor: FiltrosMaterias[K]
    ) {
        onChange({ ...filtros, [campo]:valor })
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onCancelar()
            }}    
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-filtro"
                className="w-full max-w-lg rounded-2xl border-zinc-700 bg-zinc-900 p-6 text-white shadow-xl"
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 id="titulo-filtro" className="text-xl font-bold">
                        Filtar Materias
                    </h2>

                    <button
                        type="button"
                        onClick={onCancelar}
                        aria-label="Cancelar Filtros"
                        className="rounded-lg px-3 py-1 text-2xl text-zinc-400 hover:text-zinc-800 cursor-pointer"
                    >
                        X
                    </button>
                </div>


                <div className="grid gap-4">

                    <label htmlFor="nome" className="grid gap-1 text-sm">Nome do Material</label>
                    <input 
                        id="nome"
                        value={filtros.nome}
                        onChange={(e) => alterar("nome", e.target.value)}
                        placeholder="EX. Cimento"
                        className="rounded-lg border border-zinc-700 bg-zinc-950 p-3"
                    />


                    <label htmlFor="status" className="grid gap-1 text-sm">Status</label>
                    <select 
                        id="status"
                        value={filtros.status}
                        onChange={(e) => alterar("status", e.target.value as FiltrosMaterias["status"])}
                        className="rounded-lg border border-zinc-700 bg-zinc-950 p-3"
                    >
                        <option value="todos">Todos os status</option>
                        <option value="Normal">Normal</option>
                        <option value="Atenção">Atenção</option>
                        <option value="Critico">Critico</option>
                    </select>

                    <label htmlFor="obras" className="grid gap-1 text-sm">Obra</label>
                    <select 
                        id="obras"
                        value={filtros.obraNome}
                        onChange={(e) => alterar("obraNome", e.target.value)}
                        className="rounded-lg border border-zinc-700 bg-zinc-950 p-3"
                    >
                        <option>Todas as obras salvas</option>
                        { obras.map((obra) => (
                            <option key={obra} value={obra}>{obra}</option>
                        )) }
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                        <label htmlFor="qtdMinima" className="grid gap-1 text-sm">
                            Quantidade Minima
                            <input 
                                id="qtdMinima"
                                value={filtros.qtdMinima}
                                type="number"
                                min={0}
                                placeholder="Sem limite"
                                onChange={(e) => alterar("qtdMinima", e.target.value)}
                                className="min-w-0 rounded-lg border border-zinc-700 bg-zinc-950 p-3"
                            />
                            </label>

                        <label htmlFor="qtdAtual" className="grid gap-1 text-sm">
                            Quantidade Atual
                            <input 
                                id="qtdMaxima"
                                value={filtros.qtdAtual}
                                type="number"
                                min={0}
                                placeholder="Sem limite"
                                onChange={(e) => alterar("qtdAtual", e.target.value)}
                                className="min-w-0 rounded-lg border border-zinc-700 bg-zinc-950 p-3"
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">

                        <label htmlFor="orderBy" className="grid gap-1 text-sm">
                            Ordernar Por ...
                            <select 
                                id="orderBy"
                                value={filtros.orderBy}
                                onChange={(e) => alterar("orderBy", e.target.value as FiltrosMaterias["orderBy"])}
                                className="rounded-lg border border-zinc-700 bg-zinc-950 p-3"
                            >
                                <option value="Padrao">Padrão</option>
                                <option value="Nome">Nome</option>
                                <option value="Quantidade Atual">Quantidade Atual</option>
                                <option value="Quantidade Minima">Quantidade Minima</option>
                            </select>
                        </label>

                        <label htmlFor="order">
                            Tipo de Ordenação
                            <select 
                                id="order"
                                value={filtros.order}
                                onChange={(e) => alterar("order", e.target.value as FiltrosMaterias["order"])}
                                disabled={filtros.orderBy === "Nenhuma"}
                                className="rounded-lg border border-zinc-700 bg-zinc-950 p-3 disabled:opacity-40"
                            >
                                <option value="asc">Crescente</option>
                                <option value="desc">Decrescente</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="mt-7 flex flex-wrap justify-end gap-3">
                    <button
                        type="button"
                        onClick={onLimpar}
                        className="rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 cursor-pointer"
                    >
                        Limpar Filtros
                    </button>

                    <button
                        type="button"
                        onClick={onCancelar}
                        className="rounded-lg px-4 py-2 hover:bg-zinc-800 cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={onAplicar}
                        className="rounded-lg bg-blue-700 px-4 py-2 font-semibold hover:bg-sky-600 cursor-pointer"
                    >
                        Aplicar
                    </button>
                </div>
                
            </section>
        </div>
    )
}