import { prisma } from "@/lib/prisma";
import Link from "next/link";

import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";

export default async function Obras() {

    const obras = await prisma.obra.findMany({
        orderBy: { id: "asc" }
    })

    return (
        <>
            <Header />
            <h1 className="text-center my-8 text-lg font-semibold">Obras Salvas</h1>

           <ul className="flex flex-col w-full items-center gap-9">
                {
                    obras.map((obra) => (
                        <li 
                            key={obra.id} 
                            className="flex flex-col sm:flex-row justify-center sm:justify-between items-center text-center p-4 w-[60%] bg-[#1e1e1e] rounded-2xl"
                        >
                            <div className="gap-4 flex items-center">
                                <span className="bg-white text-blue-700 rounded-[3rem] py-1 px-2.5 text-sm">
                                    {obra.status}
                                </span>
                                <Link href={`/obras/${obra.id}/etapa`} className="text-base sm:text-lg font-medium">
                                    {obra.nome}
                                </Link>
                            </div>

                            <div className="flex items-center gap-3.5 mt-3 sm:mt-0">
                                <div className="flex items-center">
                                    <span className="text-[#99a1af]">{new Date(obra.dataInicio).getDay()}/{new Date(obra.dataInicio).getMonth()}</span>
                                    <ArrowRight width={17} height={17} className="text-[#99a1af]"/>
                                    <span className="text-[#99a1af]">{new Date(obra.dataFim || 0).getDay()}/{new Date(obra.dataFim || 0).getMonth()}</span>
                                </div>

                                <span className="">{obra.progresso_pct}%</span>
                            </div>

                        </li>
                    ))
                }
           </ul>
        </>

       
    )
}