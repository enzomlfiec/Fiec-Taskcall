import {
    Bookmark,
    CalendarDays,
    CircleUserRound,
    MapPin,
    Monitor,
    Tag,
    X,
} from "lucide-react"
import React from "react"
import { Clock4, TriangleAlert, CircleEllipsis, CircleAlert, CircleCheck, } from "lucide-react";

const coresStatus = {
    0: "bg-sec-amarelo/15 text-sec-amarelo",
    1: "bg-sec-azul/15 text-sec-azul",
    2: "bg-sec-verde/15 text-sec-verde",
    3: "bg-fundo-razo text-sec",
    4: "bg-sec-vermelho/15 text-sec-vermelho",
};

const fundosStatus = {
    0: "bg-sec-amarelo",
    1: "bg-sec-azul",
    2: "bg-sec-verde",
    3: "bg-fundo-razo",
    4: "bg-sec-vermelho",
};

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
                StatusID: 1,
                cor: "sec-azul",
                nome: "Em progresso.",
                icone: Clock4,
            })

        } else if (mockInfo.status == 3) {

            setStatusInfo({
                StatusID: 3,
                cor: "borda",
                nome: "Em análise.",
                icone: CircleEllipsis,
            })

            setProxStatusInfo({
                StatusID: 0,
                cor: "sec-amarelo",
                nome: "Não visualizado.",
                icone: CircleAlert,
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

                    <div className="hidden min-w-0 flex-1 border-r-2 border-borda/30 px-3 lg:block">
                        <p className="truncate text-pri">
                            {mockInfo.titulo}
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
                className={`fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50 p-4 backdrop-blur-[3px] transition-all duration-300 ${mostrarChamado
                    ? "opacity-100"
                    : "pointer-events-none invisible opacity-0"
                    }`}
                onClick={() => setMostrarChamado(false)}
            >
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`chamado-titulo-${mockInfo.id}`}
                    className={`poppins flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-4xl border-2 border-borda bg-fundo-fundo text-pri shadow-lg shadow-black/20 transition-all duration-300 ${
                        mostrarChamado ? "scale-100" : "scale-95"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <header className="flex items-start justify-between gap-4 border-b border-borda/30 px-6 py-5 sm:px-8">
                        <div className="min-w-0">
                            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-borda">
                                Chamado #{mockInfo.id}
                            </p>
                            <h1
                                id={`chamado-titulo-${mockInfo.id}`}
                                className="wrap-break-word text-2xl font-semibold sm:text-3xl"
                            >
                                {mockInfo.titulo || mockInfo.dispositivo}
                            </h1>
                        </div>
                        <button
                            type="button"
                            aria-label="Fechar detalhes do chamado"
                            onClick={() => setMostrarChamado(false)}
                            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-fundo-razo text-pri transition-all duration-200 hover:scale-105 hover:brightness-125"
                        >
                            <X size={20} />
                        </button>
                    </header>

                    <div className="scroll flex flex-col gap-6 overflow-y-auto px-6 py-6 sm:px-8">
                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white ${
                                    fundosStatus[statusInfo.StatusID]
                                }`}
                            >
                                <IconeStatus size={16} />
                                {statusInfo.nome}
                            </span>
                            <span className="inline-flex items-center gap-2 text-sm text-borda">
                                <CalendarDays size={16} />
                                {mockInfo.data}
                            </span>
                        </div>

                        <section aria-label="Informações do chamado">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-3xl border-2 border-borda/30 bg-fundo-medio/80 p-4 transition-all duration-300 hover:brightness-110">
                                    <CircleUserRound className="shrink-0 text-borda" size={20} />
                                    <div className="min-w-0">
                                        <p className="text-xs text-borda">Solicitante</p>
                                        <p className="truncate font-medium">{mockInfo.nome}</p>
                                        <p className="truncate text-sm text-borda">{mockInfo.cargo}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-3xl border-2 border-borda/30 bg-fundo-medio/80 p-4 transition-all duration-300 hover:brightness-110">
                                    <MapPin className="shrink-0 text-borda" size={20} />
                                    <div className="min-w-0">
                                        <p className="text-xs text-borda">Sala</p>
                                        <p className="truncate font-medium">{mockInfo.sala}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-3xl border-2 border-borda/30 bg-fundo-medio/80 p-4 transition-all duration-300 hover:brightness-110">
                                    <Tag className="shrink-0 text-borda" size={20} />
                                    <div className="min-w-0">
                                        <p className="text-xs text-borda">Categoria</p>
                                        <p className="truncate font-medium">{mockInfo.categoria}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-3xl border-2 border-borda/30 bg-fundo-medio/80 p-4 transition-all duration-300 hover:brightness-110">
                                    <Monitor className="shrink-0 text-borda" size={20} />
                                    <div className="min-w-0">
                                        <p className="text-xs text-borda">Dispositivo</p>
                                        <p className="truncate font-medium">{mockInfo.dispositivo}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-borda">
                                Descrição
                            </h2>
                            <p className="min-h-24 whitespace-pre-wrap rounded-3xl border-2 border-borda/30 bg-fundo-razo p-4 leading-relaxed text-pri">
                                {mockInfo.descricao || "Nenhuma descrição informada."}
                            </p>
                        </section>
                    </div>

                    <footer className="flex flex-col-reverse gap-3 border-t border-borda/30 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
                        <button
                            type="button"
                            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-sec-verde px-4 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
                        >
                            <Bookmark size={18} />
                            Favoritar
                        </button>
                        {mockInfo.status == 3 && (
                            <button
                                type="button"
                                className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 font-medium text-pri shadow-[0px_4px_0px_0px_#740510] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                                onClick={deletarChamado}
                            >
                                <X size={18} />
                                Recusar
                            </button>
                        )}
                        <button
                            type="button"
                            className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110 ${
                                fundosStatus[proxStatusInfo.StatusID]
                            }`}
                        >
                            <Clock4 size={18} />
                            Marcar como: {proxStatusInfo.nome}
                        </button>
                    </footer>
                </div>
            </div>
        </>
    )
}

export default ChamadoBullet