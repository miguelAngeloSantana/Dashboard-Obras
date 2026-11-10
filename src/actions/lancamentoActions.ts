"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import {
    NovoTipoLancamentoInput,
    NovoLancamentoFormState,
    NovoLancamentoFormError,
    LancamentoActionResult,
    Despesa
} from "@/lib/types"

export async function validarNovoDados(form: NovoLancamentoFormState): Promise<NovoLancamentoFormError> {
    const erros: NovoLancamentoFormError = {}
    
    if ( !form.obraId ){
        erros.obraId = "selecione uma Obra"
    }

    if ( !form.tipo ){
        erros.tipo = "Seleciona um tipo"
    }

    if ( !form.valor || isNaN(Number(form.valor)) ){
        erros.obraId = "informe um valor valido"
    }

    if ( Number(form.valor) <= 0 ){
        erros.obraId = "o valor deve ser maior que 0"
    }

    if ( !form.date ){
        erros.obraId = "informe uma data de lançamento"
    }

    return erros
}

export async function parseFormLancamentos(form: NovoLancamentoFormState): Promise<NovoTipoLancamentoInput> {
    return {
        obraId: form.obraId,
        etapaId: form.etapaId,
        tipo: form.tipo,
        valor: form.valor,
        date: new Date(form.date),
        descricao: form.descricao,
        notaFiscal: form.notaFiscal,
        comprovante: form.comprovante
    }
};

export async function criarLancamento(input: NovoTipoLancamentoInput): Promise<LancamentoActionResult>{
    try {
        const obra = await prisma.obra.findUnique({
            where: {
                id: input.obraId
            },

            select: { id: true }
        })

        if (!obra) {
            return { ok: false, erro: "Obra não encontrada" }
        };

        const lancamento = await prisma.lancamento.create({
            data: {
                obraId: input.obraId,
                etapaId: input.etapaId,
                tipo: input.tipo,
                valor: input.valor,
                data: input.date,
                descricao: input.descricao,
                comprovante: input.comprovante,
                notaFiscal: input.notaFiscal
            }
        })

        revalidatePath("/");
        revalidatePath(`/obras/${input.obraId}/etapa`);

        return { ok: true, lancamentoId: lancamento.id }
    } catch(error) {
        console.log("Erros ao lançar: ", error)
        return { ok: false, erro: "Erros ao registrar o lançamento, tente novamente..." }
    }
}

export async function getObra() {
    const obra = await prisma.obra.findMany();

    return obra;
}

export async function postDespesa(form: Despesa) {
   try {
        const getObraId = await prisma.obra.findFirst({
            where: {
                nome: form.obraNome
            }
        })

        await prisma.lancamento.create({
            data: {
                data: new Date(),
                obraId: getObraId?.id || "",
                valor: form.valor,
                tipo: form.tipo
            }
        })

        return { sucess: true }
   } catch(error) {
    console.log(`Error ao criar há despesa da obra: ${form.obraNome} - ${error}`)
    return { ok: false, erro: "Erros ao registrar o lançamento, tente novamente..." }
   }    
}