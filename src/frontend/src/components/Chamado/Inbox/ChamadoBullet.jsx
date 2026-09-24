import { Bookmark } from 'lucide-react'
import React, { useEffect } from 'react'

const ChamadoBullet = ({ index, mockInfo }) => {

    const [StatusInfo, setStatusInfo] = React.useState({
        StatusID: 2,
        cor: "sec-verde",
        nome: "ResolvStatusIDo.",
    })
    React.useEffect(() => {
        if (mockInfo.status == 0) {
            setStatusInfo({
                StatusID: 0,
                cor: "sec-amarelo",
                nome: "Não visualizado.",
            })
        } else if (mockInfo.status == 1) {
            setStatusInfo({
                StatusID: 1,
                cor: "sec-azul",
                nome: "Em progresso.",
            })
        } else if (mockInfo.status == 2) {
            setStatusInfo({
                StatusID: 2,
                cor: "sec-verde",
                nome: "Resolvido.",
            })
        } else if (mockInfo.status == 3) {
            setStatusInfo({
                StatusID: 3,
                cor: "borda",
                nome: "Em analise.",
            })
        } else if (mockInfo.status == 4) {
            setStatusInfo({
                StatusID: 4,
                cor: "sec-vermelho",
                nome: "Urgencia.",
            })
        }

    },[mockInfo.status])


    return (
        <>
            <div id="ChamadoBullet" className="hover:brightness-150 brightness-100 shrink-0 drop-shadow-sm drop-shadow-black font-semibold bg-fundo-razo h-[2vw] w-full rounded-2xl pl-5 pr-5 flex flex-row items-center text-center justify-baseline cursor-pointer transition-all duration-200">
                <div className='flex flex-row w-full'>
                    <div className='flex flex-row gap-5'>
                        <span role="checkbox" className='checkboxFalse'></span>
                        <Bookmark
                            // fill='var(--color-borda)' 
                            className='w-6 h-6 text-borda opacity-50' />
                    </div>

                    <div className='w-[15%] text-white border-r-2 border-borda/30'>
                        <p alt="Nome professor">{mockInfo.nome}</p>
                    </div>
                    <div className='w-[15%] text-borda border-r-2 border-borda/30'>
                        <p alt="Categoria">{mockInfo.categoria}</p>
                    </div>
                    <div className='w-[15%] text-borda border-r-2 border-borda/30'>
                        <p alt="Sala 39">{mockInfo.sala}</p>
                    </div>
                    <div className='w-[15%] text-white border-r-2 border-borda/30'>
                        <p alt="Dispositivo">{mockInfo.dispositivo}</p>
                    </div>
                    <div className='w-[20%] text-borda border-borda/30'>
                        <p alt="DD, MMMM YYYY - HH:MM">{mockInfo.data}</p>
                    </div>
                </div>
                <div id="ChamadoStatus" className={`w-6 h-6 bg-${StatusInfo.cor} rounded-full drop-shadow-sm drop-shadow-black/25 shadow-[inset_0_5px_0_0px_#00000050]`}>
                </div>
            </div>
        </>

    )
}

export default ChamadoBullet
