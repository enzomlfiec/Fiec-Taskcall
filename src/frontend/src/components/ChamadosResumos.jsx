import React from "react";
import "../../style.css";

const CORES_MAP = {
    "sec-amarelo": {
        bg: "bg-sec-amarelo",
        text: "text-sec-amarelo",
        cssVar: "var(--color-sec-amarelo)",
    },
    "sec-azul": {
        bg: "bg-sec-azul",
        text: "text-sec-azul",
        cssVar: "var(--color-sec-azul)",
    },
    "sec-vermelho": {
        bg: "bg-sec-vermelho",
        text: "text-sec-vermelho",
        cssVar: "var(--color-sec-vermelho)",
    },
    "sec-verde": {
        bg: "bg-sec-verde",
        text: "text-sec-verde",
        cssVar: "var(--color-sec-verde)",
    },
    borda: {
        bg: "bg-borda",
        text: "text-borda",
        cssVar: "var(--color-borda)",
    },
    cinza: {
        bg: "bg-zinc-500",
        text: "text-zinc-400",
        cssVar: "#71717a",
    },
};

const ChamadosResumos = ({ statusChamados }) => {
    const temaCor = CORES_MAP[statusChamados.cor] || CORES_MAP.borda;
    const porcentagem = Math.max(0, Math.min(100, Number(statusChamados.porcentagem) || 0));
    const Icone = statusChamados.icone;

    return (
        <div className="flex flex-row min-h-24 sm:min-h-28 w-full min-w-0 gap-3 bg-fundo-razo/95 border border-borda/15 rounded-2xl p-3.5 sm:p-4 items-center justify-between text-pri shadow-sm">
            <div
                className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 shrink-0 ${temaCor.bg} rounded-xl text-white shadow-md`}
            >
                <Icone className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
            </div>

            <span className="min-w-0 flex-1 text-pri text-sm sm:text-base font-medium leading-snug">
                {statusChamados.texto}
            </span>

            <div
                className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full p-1.5"
                style={{
                    background:
                        porcentagem > 0
                            ? `conic-gradient(${temaCor.cssVar} ${porcentagem}%, var(--color-fundo-medio) ${porcentagem}%)`
                            : "var(--color-fundo-medio)",
                }}
            >
                <div
                    className={`flex items-center bg-fundo-razo justify-center w-full h-full rounded-full text-xs sm:text-sm font-bold ${temaCor.text}`}
                >
                    {porcentagem}%
                </div>
            </div>
        </div>
    );
};

export default ChamadosResumos;
