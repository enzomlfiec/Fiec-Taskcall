import React, { useEffect } from 'react'
import "../../style.css";

const ChamadosResumos = ({ statusChamados }) => {

    let cor = statusChamados.cor

    return (
        <div className="flex flex-row h-40 w-full gap-3 bg-fundo-razo rounded-2xl p-4 m-3 items-center justify-center text-pri text-xl ">
            <div className={`flex items-center justify-center w-20 h-20 shrink-0 bg-${cor} rounded-xl text-pri  shadow-lg`}>
                <statusChamados.icone
                    className="w-12 h-12" />
            </div>
            <span className="flex text-pri text-lg">{statusChamados.texto}</span>
            <div className={`flex flex-col items-center justify-center gap-2 ml-auto ${statusChamados.porcentagem ? `bg-conic border-3 bg-${cor} border-fundo-razo from-${cor} from-${statusChamados.porcentagem}% to-fundo-medio to-${statusChamados.porcentagem}%` : 'bg-fundo-medio'} rounded-full p-4`}>
                <div className={`flex items-center bg-fundo-razo justify-center w-15 h-15 ml-auto shrink-0 rounded-full text-lg text-${cor}`}>
                    <div className=" font-bold">
                        {statusChamados.porcentagem}%
                    </div>
                </div>
            </div>
            {/* <div className="bg-sec-amarelo bg-sec-azul bg-sec-vermelho bg-borda bg-debug">
            </div> */}
        </div>
    )
}

export default ChamadosResumos
