import { Bookmark, EllipsisIcon } from "lucide-react"
import React from "react"
import { Trash } from "lucide-react"
import { Clock4, TriangleAlert, CircleEllipsis, CircleAlert, CircleCheck, } from "lucide-react";

const ChamadoBullet = ({
    index,
    mockInfo,
    mockChamados,
    chamado,
    setChamados,
    checkedInboxes = [],
    setCheckedInboxes = () => { }
}) => {
    function deletarChamado() {
        const chamadosFiltrados = mockChamados.filter(
            (chamado) => chamado.id !== mockInfo.id
        )


        mockChamados.splice(
            0,
            mockChamados.length,
            ...chamadosFiltrados
        )

        setChamados(chamadosFiltrados)
        setMostrarChamado(false)
    }


    const [mostrarChamado, setMostrarChamado] = React.useState(false)

    const [proxStatusInfo, setProxStatusInfo] = React.useState({
        StatusID: 2,
        cor: "sec-verde",
        nome: "Insira aqui o nome do status",
        icone: "EllipsisIcon"
    })

    const [statusInfo, setStatusInfo] = React.useState({
        StatusID: 2,
        cor: "sec-verde",
        nome: "Insira aqui o nome do status.",
        icone: "EllipsisIcon"
    })

    React.useEffect(() => {

        if (mockInfo.status == 0) {

            setStatusInfo({
                StatusID: 0,
                cor: "sec-amarelo",
                nome: "Não visualizado.",
                icone: CircleAlert,
            })

            setProxStatusInfo({
                StatusID: 1,
                cor: "sec-azul",
                nome: "Em progresso.",
                icone: Clock4,
            })

        } else if (mockInfo.status == 1) {

            setStatusInfo({
                StatusID: 1,
                cor: "sec-azul",
                nome: "Em progresso.",
                icone: Clock4,
            })

            setProxStatusInfo({
                StatusID: 2,
                cor: "sec-verde",
                nome: "Resolvido.",
                icone: CircleCheck,
            })

        } else if (mockInfo.status == 2) {

            setStatusInfo({
                StatusID: 2,
                cor: "sec-verde",
                nome: "Resolvido.",
                icone: CircleCheck,
            })

            setProxStatusInfo({
                StatusID: 3,
                cor: "sec-amarelo",
                nome: "Em análise.",
                icone: CircleEllipsis,
            })

        } else if (mockInfo.status == 3) {

            setStatusInfo({
                StatusID: 3,
                cor: "borda",
                nome: "Em análise.",
                icone: CircleEllipsis,
            })

            setProxStatusInfo({
                StatusID: 4,
                cor: "sec-vermelho",
                nome: "Urgência.",
                icone: TriangleAlert,
            })

        } else if (mockInfo.status == 4) {
            setStatusInfo({
                StatusID: 4,
                cor: "sec-vermelho",
                nome: "Urgência.",
                icone: TriangleAlert
            })

            setProxStatusInfo({
                StatusID: 1,
                cor: "sec-azul",
                nome: "Em progresso.",
                icone: Clock4,
            })
        }
    }, [mockInfo.status])

    const IconeStatus = statusInfo.icone;
    const checkado = checkedInboxes.includes(index)

    function handleCheck() {

        if (checkedInboxes.includes(index)) {

            setCheckedInboxes(
                checkedInboxes.filter(
                    (item) => item !== index
                )
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
                className={`flex w-full min-w-0 items-center gap-3 rounded-2xl bg-fundo-razo px-4 font-semibold drop-shadow-sm drop-shadow-black ${checkado
                    ? "brightness-150 hover:brightness-300"
                    : "hover:brightness-150"
                    } cursor-pointer transition-all duration-200`}
            >

                <div className="flex shrink-0 items-center gap-3">

                    <span
                        role="checkbox"
                        className={
                            checkado
                                ? "checkboxTrue"
                                : "checkboxFalse"
                        }
                        onClick={handleCheck}
                    />

                    <Bookmark
                        className={`h-6 w-6 shrink-0 ${!mockInfo.bookmarked
                            ? "text-borda opacity-50"
                            : "text-pri fill-pri"
                            }`}
                    />

                </div>


                <div
                    className="flex min-w-0 flex-1 items-center py-2 bg-debug/0"
                    onClick={() => setMostrarChamado(!mostrarChamado)}
                >

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

                <span
                    id="ChamadoStatus"
                    className={`
                        h-6 w-6 shrink-0 rounded-full
                        bg-${statusInfo.cor}
                        drop-shadow-sm drop-shadow-black/25
                        shadow-[inset_0_5px_0_0px_#00000050]
                        brightness-90
                    `}
                >
                    <IconeStatus className={`p-0.5 opacity-100 text-white text-shadow-xl `} />
                </span>

            </div>


            <div
                className={`bg-fundo-profundo/80 backdrop-blur-lg inset-0 h-screen w-screen opacity-0 absolute flex z-50 ${mostrarChamado
                    ? "opacity-100"
                    : "invisible"
                    } justify-center items-center align-middle transition-all duration-500`}
                onClick={() => setMostrarChamado(!mostrarChamado)}
            >

                <div
                    className="h-90 w-200 rounded-4xl bg-fundo-razo text-pri flex flex-col items-baseline justify-baseline"
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className="flex flex-col poppins gap-2 p-5 bg-fundo-fundo border-2 border-borda rounded-4xl h-full w-full">

                        <h1 className="text-4xl font-medium">
                            {mockInfo.titulo}
                        </h1>


                        <div className="flex flex-row gap-3 justify-between">

                            <div className="flex flex-row gap-3">
                                <p>
                                    Chamado:
                                    <span className="font-bold">
                                        {mockInfo.id}
                                    </span>
                                </p>

                                <p>
                                    • Por:
                                    <span className="font-bold">
                                        {mockInfo.nome}
                                    </span>
                                </p>

                                <p>
                                    • Cargo:
                                    <span className="font-bold">
                                        {mockInfo.cargo}
                                    </span>
                                </p>
                            </div>


                            <div className=" flex w-7 h-7 justify-center items-center bg-pri text-black rounded-full hover:scale-105 cursor-pointer"
                                onClick={() => { setMostrarChamado(false) }}
                            >

                                <div className="">
                                    X
                                </div>
                            </div>
                        </div>

                        <h2 className="font-bold">
                            Descrição:
                        </h2>
                        <div className="p-2 bg-fundo-razo rounded h-30">

                            <p className="flex font-light">
                                {mockInfo.descricao}
                            </p>

                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-4 w-full">
                                <p>
                                    • Sala: {mockInfo.sala}
                                </p>

                                <p>
                                    • Máquina:{mockInfo.dispositivo}
                                </p>
                            </div>
                            <div className="flex justify-end w-full">
                                <p>
                                    Status: {statusInfo.nome}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 
                        ">
                            <button className="flex flex-row gap-2 justify-center items-center h-10 p-2  hover:scale-105 transition-all duration-200 rounded-sm bg-sec-verde
                            "
                            >
                                <Bookmark />
                                Favoritar
                            </button>
                            <button
                                className="flex flex-row gap-2 cursor-pointer justify-center items-center h-10 p-2 hover:scale-105 transition-all duration-200 rounded-sm bg-accent"
                                oonClick={deletarChamado}
                            >
                                <Trash /> Enviar à Lixeira
                            </button>
                            <button
                                className={`h-10 p-2 hover:scale-105 transition-all duration-200 rounded-sm bg-${proxStatusInfo.cor}`}
                            >
                                Marcar como: "{proxStatusInfo.nome}"
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChamadoBullet