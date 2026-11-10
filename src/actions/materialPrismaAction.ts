"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { MaterialActionResult, MaterialTypeUptade } from "@/lib/types";

import { schemaMateriaisType } from "@/components/FormMateriais";


export async function criarMaterial(dados: schemaMateriaisType): Promise<MaterialActionResult> {
    try {
        const materiais = await prisma.material.create({
            data: {
                nomeMaterial: dados.nomeMaterial,
                obraNome: [dados.obraNome],
                qtdAtual: dados.qtdAtual || 0,
                qtdMinima: dados.qtdMinima || 0,
                qdtPlanejada: dados.qdtPlanejada,
                unidade: dados.unidade,
                valor: dados.valor
            }
        })

        revalidatePath("/");
        revalidatePath("/materias/formularioMaterial");

        const acharObraId = await prisma.obra.findFirst({
            where: {
                nome: dados.obraNome,
            },
            select: {
                id: true
            }
        })

        await prisma.lancamento.create({
            data: {
                obraId: acharObraId?.id || "",
                valor: dados.valor,
                data: new Date(),
                tipo: "MATERIAL",
                materialId: materiais.id
            }
        })

        return {ok: true, materialId: materiais.id}
    } catch(erro) {
        console.log("Erro ao registrar o material: ", erro)
        return {ok: false, erro: "Erro ao regsitrar um novo material, insira os dados novamente... "}
    }
}

export default async function uptadeMaterial(materialDate: MaterialTypeUptade) {

    await prisma.material.update({
        where: {
            id: materialDate.id
        },
        
        data: {
            qtdAtual: materialDate.qtdAtual,
            qdtPlanejada: materialDate.qdtPlanejada,
            qtdMinima: materialDate.qtdMinima
        }
    })
}