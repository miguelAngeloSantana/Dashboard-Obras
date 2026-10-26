"use client";

import { ArrowDownToLine, ListFilter } from "lucide-react";

export default function ConfigMaterial(){

    return (
        <div className="flex gap-3" onClick={() => console.log("filtrados")}>
            <ListFilter size={20}/>
            <ArrowDownToLine size={20} />
        </div>
    )
}