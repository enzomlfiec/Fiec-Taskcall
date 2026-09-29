import { Bookmark } from 'lucide-react'
import React, { useEffect } from 'react'

const ChamadoBullet = ({ index, mockInfo, checkedInboxes,setCheckedInboxes}) => {
    const [statusInfo, setStatusInfo] = React.useState({
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

    }, [mockInfo.status])
    const [mostrarChamado, setMostrarChamado] = React.useState(false)

    const checkado = checkedInboxes.includes(index)

    function handleCheck() {
        if (checkedInboxes.includes(index)) {
            setCheckedInboxes(
                checkedInboxes.filter((item) => item !== index)
            )
        } else {
            setCheckedInboxes(
                [...checkedInboxes, index]
            )
        }
    }


    return (
        <>
            <div
                id="ChamadoBullet"
                className={`flex w-full min-w-0 items-center gap-3 rounded-2xl bg-fundo-razo px-4 font-semibold drop-shadow-sm drop-shadow-black ${checkado ? "brightness-150 hover:brightness-300" : "hover:brightness-150"} cursor-pointer transition-all duration-200`}
            >
                <div
                    className="flex shrink-0 items-center gap-3"
                >
                    <span
                        role="checkbox"
                        className={checkado ? "checkboxTrue" : "checkboxFalse"}
                        onClick={() => handleCheck()}
                    ></span>

                    <Bookmark className={`h-6 w-6 shrink-0 ${!mockInfo.bookmarked? "text-borda opacity-50": "text-pri fill-pri"}`} />
                
                </div>

                <div className="flex min-w-0 flex-1 items-center py-2 bg-debug/0"
                    onClick={() => setMostrarChamado(!mostrarChamado)}>

                    <div className="min-w-0 flex-1 border-r-2 border-borda/30 px-3">
                        <p className="truncate text-pri">
                            {mockInfo.nome}
                        </p>
                    </div>

                    <div className="hidden min-w-0 flex-1 border-r-2 border-borda/30 px-3 sm:block">
                        <p className="truncate text-borda">
                            {mockInfo.categoria}
                        </p>
                    </div>

                    <div className="hidden min-w-0 flex-1 border-r-2 border-borda/30 px-3 md:block">
                        <p className="truncate text-borda">
                            {mockInfo.sala}
                        </p>
                    </div>

                    <div className="hidden min-w-0 flex-1 border-r-2 border-borda/30 px-3 lg:block">
                        <p className="truncate text-pri">
                            {mockInfo.dispositivo}
                        </p>
                    </div>

                    <div className="hidden min-w-0 flex-1 px-3 xl:block">
                        <p className="truncate text-borda">
                            {mockInfo.data}
                        </p>
                    </div>
                </div>

                <div
                    id="ChamadoStatus"
                    className={`
            h-6 w-6 shrink-0 rounded-full
            bg-${statusInfo.cor}
            drop-shadow-sm drop-shadow-black/25
            shadow-[inset_0_5px_0_0px_#00000050]
        `}
                ></div>
            </div >
            <div className={`bg-fundo-profundo/80 backdrop-blur-lg inset-0 h-screen w-screen opacity-0 absolute flex z-50 ${mostrarChamado ? " opacity-100" : "invisible"} justify-center items-center align-middle transition-all duration-500`}
                onClick={() => setMostrarChamado(!mostrarChamado)}>
                <div className="p-1 h-100 w-200 rounded-lg bg-fundo-profundo text-pri flex flex-col items-baseline justify-baseline">
                    <div className="bg-debug h-full w-full ">
                        <p className="flex ">Chamado: {mockInfo.id}</p>
                        <p className="flex "> Descrição:{mockInfo.descricao} </p>
                        <p>• Por: {mockInfo.nome}</p>
                        <p>• Cargo: {mockInfo.cargo}</p>
                        <p>• Sala {mockInfo.salas}</p>
                        <p>• {mockInfo.dispositivo}</p>
                        <p>• Status: {statusInfo.nome}</p>
                    </div>

                </div>

            </div>
        </>

    )
}

export default ChamadoBullet
