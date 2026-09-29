import React from "react"

const ChamadosResumos = ({ statusChamados }) => {

    const Icone = statusChamados.icone

    return (
        <div className="flex flex-row h-40 w-full gap-3 bg-fundo-razo rounded-2xl p-4 m-3 items-center justify-center text-pri text-xl">

            <div
                className={`
                    flex items-center justify-center
                    w-20 h-20 shrink-0
                    ${statusChamados.cor}
                    rounded-xl
                    text-pri
                    shadow-lg
                `}
            >
                <Icone className="w-12 h-12" />
            </div>


            <span className="flex text-pri text-lg">
                {statusChamados.texto}
            </span>


            <div
                className={`
                    flex items-center justify-center
                    w-20 h-20 ml-auto shrink-0
                    rounded-full
                    border-[15px]
                    ${statusChamados.borda}
                    text-lg
                    ${statusChamados.textoCor}
                `}
            >
                <div className="mix-blend-plus-lighter font-bold">
                    {statusChamados.porcentagem}%
                </div>
            </div>

        </div>
    )
}

export default ChamadosResumos
