import { Bookmark } from 'lucide-react'
import React, { useEffect } from 'react'

const ChamadoBullet = ({ index, mockInfo }) => {
    const [mostrarChamado, setMostrarChamado] = React.useState(false)
    const proxStatus = {

    }

    const [proxStatusInfo, setProxStatusInfo] = React.useState({
        StatusID: 2,
        cor: "sec-verde",
        nome: "Insira aqui o nome do status",
    })

    const [statusInfo, setStatusInfo] = React.useState({
        StatusID: 2,
        cor: "sec-verde",
        nome: "Insira aqui o nome do status.",
    })


    React.useEffect(() => {
        if (mockInfo.status == 0) {
            setStatusInfo({
                StatusID: 0,
                cor: "sec-amarelo",
                nome: "Não visualizado.",
            })

            setProxStatusInfo({
                StatusID: 1,
                cor: "sec-azul",
                nome: "Em progresso.",
            })

        } else if (mockInfo.status == 1) {
            setStatusInfo({
                StatusID: 1,
                cor: "sec-azul",
                nome: "Em progresso.",
            })

            setProxStatusInfo({
                StatusID: 2,
                cor: "sec-verde",
                nome: "Resolvido.",
            })

        } else if (mockInfo.status == 2) {
            setStatusInfo({
                StatusID: 2,
                cor: "sec-verde",
                nome: "Resolvido.",
            })

            setProxStatusInfo({
                StatusID: 3,
                cor: "sec-amarelo",
                nome: "Em analise.",
            })

        } else if (mockInfo.status == 3) {
            setStatusInfo({
                StatusID: 3,
                cor: "borda",
                nome: "Em analise.",
            })

            setProxStatusInfo({
                StatusID: 4,
                cor: "sec-vermelho",
                nome: "Urgencia.",
            })

        } else if (mockInfo.status == 4) {
            setStatusInfo({
                StatusID: 4,
                cor: "sec-vermelho",
                nome: "Urgencia.",
            })

            // Não existe próximo status
            setProxStatusInfo({
                StatusID: 1,
                cor: "sec-azul",
                nome: "Em progresso.",
            })
        }
    }, [mockInfo.status])


    return (
        <>
            <div id="ChamadoBullet" className="hover:brightness-150 brightness-100 shrink-0 drop-shadow-sm drop-shadow-black font-semibold bg-fundo-razo h-[2vw] w-full rounded-2xl pl-5 pr-5 flex flex-row items-center text-center justify-baseline cursor-pointer transition-all duration-200"
                onClick={() => setMostrarChamado(!mostrarChamado)}
            >
                <div className='flex flex-row w-full'>
                    <div className='flex flex-row gap-5'>
                        <span role="checkbox" className='checkboxFalse'></span>
                        <Bookmark
                            // fill='var(--color-borda)' 
                            className='w-6 h-6 text-borda opacity-50' />
                    </div>

                    <div className='overflow-hidden w-[15%] text-pri border-r-2 border-borda/30'>
                        <p alt="Nome professor">{mockInfo.nome}</p>
                    </div>
                    <div className='overflow-hidden w-[15%] text-borda border-r-2 border-borda/30'>
                        <p alt="Categoria">{mockInfo.categoria}</p>
                    </div>
                    <div className='overflow-hidden w-[15%] text-borda border-r-2 border-borda/30'>
                        <p>{mockInfo.salas}</p>
                    </div>
                    <div className='overflow-hidden w-[15%] text-pri border-r-2 border-borda/30'>
                        <p alt="Dispositivo">{mockInfo.dispositivo}</p>
                    </div>
                    <div className='w-[20%] text-borda border-borda/30'>
                        <p alt="DD, MMMM YYYY - HH:MM">{mockInfo.data}</p>
                    </div>
                </div>
                <div id="ChamadoStatus" className={`w-6 h-6 bg-${statusInfo.cor} rounded-full drop-shadow-sm drop-shadow-black/25 shadow-[inset_0_5px_0_0px_#00000050]`}>
                </div>
            </div>
            <div className={`bg-fundo-profundo/80 backdrop-blur-lg inset-0 h-screen w-screen opacity-0 absolute flex z-50 ${mostrarChamado ? " opacity-100" : "invisible"} justify-center items-center align-middle transition-all duration-500`}
                onClick={() => setMostrarChamado(!mostrarChamado)}>
                <div className="h-100 w-200 rounded-4xl bg-fundo-razo text-pri flex flex-col items-baseline justify-baseline">
                    <div className="flex flex-col poppins gap-2 p-5 bg-fundo-fundo border-2 border-borda rounded-4xl h-full w-full ">
                        <h1 className='text-4xl font-medium'>{mockInfo.titulo}</h1>
                        <div className='flex flex-row gap-3'>
                            <p className="">Chamado: <span className='font-bold'>
                                {mockInfo.id}</span></p>
                            <p>• Por: <span className='font-bold'>
                                {mockInfo.nome}</span></p>
                            <p>• Cargo: <span className='font-bold'>
                                {mockInfo.cargo}</span></p>
                        </div>
                        <h2 className='font-bold'>Descrição:</h2>
                        <div className='p-2 bg-fundo-razo rounded h-20'>
                            <p className="flex font-light">{mockInfo.descricao} </p>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <div className='flex flex-row gap-3 w-full'>
                                <p >{mockInfo.sala}</p>
                                <p>• {mockInfo.dispositivo}</p>
                            </div>
                            <div className='flex justify-end w-full'>
                                <p>Status: {statusInfo.nome}</p>
                            </div>
                        </div>
                        <div className='flex justify-end gap-3'>
                            <button>Favoritar</button>
                            <button>Enviar a Lixeira</button>
                            <button className={`bg-${proxStatusInfo.cor}`}>Marcar como:"{proxStatusInfo.nome}"</button>
                        </div>
                    </div>

                </div>

            </div>
        </>

    )
}

export default ChamadoBullet
