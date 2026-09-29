import { Bookmark } from "lucide-react"
import React from "react"

const statusConfig = {
    "Aberto": {
        cor: "bg-sec-amarelo",
        nome: "Não visualizado."
    },

    "Em progresso": {
        cor: "bg-sec-azul",
        nome: "Em progresso."
    },

    "Aguardando": {
        cor: "bg-borda",
        nome: "Em analise."
    },

    "Resolvido": {
        cor: "bg-sec-verde",
        nome: "Resolvido."
    },

    "Urgencia": {
        cor: "bg-sec-vermelho",
        nome: "Urgencia."
    }
}

const proximoStatusConfig = {
    "Aberto": {
        cor: "bg-sec-azul",
        nome: "Em progresso."
    },

    "Em progresso": {
        cor: "bg-sec-verde",
        nome: "Resolvido."
    },

    "Resolvido": {
        cor: "bg-borda",
        nome: "Em analise."
    },

    "Aguardando": {
        cor: "bg-sec-vermelho",
        nome: "Urgencia."
    },

    "Urgencia": {
        cor: "bg-sec-azul",
        nome: "Em progresso."
    }
}

const ChamadoBullet = ({
    index,
    chamado,
    checkedInboxes = [],
    setCheckedInboxes = () => {}
}) => {

    const [mostrarChamado, setMostrarChamado] = React.useState(false)

    const statusAtual = String(
        chamado?.status || ""
    ).trim()

    const statusInfo =
        statusConfig[statusAtual] || {
            cor: "bg-borda",
            nome: statusAtual || "Status desconhecido"
        }

    const proxStatusInfo =
        proximoStatusConfig[statusAtual] || {
            cor: "bg-borda",
            nome: "Status desconhecido"
        }

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
                className={`flex w-full min-w-0 items-center gap-3 rounded-2xl bg-fundo-razo px-4 font-semibold drop-shadow-sm drop-shadow-black ${
                    checkado
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
                        className={`h-6 w-6 shrink-0 ${
                            !chamado?.bookmarked
                                ? "text-borda opacity-50"
                                : "text-pri fill-pri"
                        }`}
                    />

                </div>


                <div
                    className="flex min-w-0 flex-1 items-center py-2 bg-debug/0"
                    onClick={() =>
                        setMostrarChamado(!mostrarChamado)
                    }
                >

                    <div className="min-w-0 flex-1 border-r-2 border-borda/30 px-3">
                        <p className="truncate text-pri">
                            {chamado?.solicitante || "Usuário"}
                        </p>
                    </div>


                    <div className="hidden min-w-0 flex-1 border-r-2 border-borda/30 px-3 sm:block">
                        <p className="truncate text-borda">
                            {chamado?.categoria}
                        </p>
                    </div>


                    <div className="hidden min-w-0 flex-1 border-r-2 border-borda/30 px-3 md:block">
                        <p className="truncate text-borda">
                            {chamado?.setor}
                        </p>
                    </div>


                    <div className="hidden min-w-0 flex-1 border-r-2 border-borda/30 px-3 lg:block">
                        <p className="truncate text-pri">
                           Máquina {chamado?.num_equipamento}
                        </p>
                    </div>


                    <div className="hidden min-w-0 flex-1 px-3 xl:block">
                        <p className="truncate text-borda">
                            {chamado?.data}
                        </p>
                    </div>

                </div>


                <div
                    id="ChamadoStatus"
                    className={`
                        h-6 w-6 shrink-0 rounded-full
                        ${statusInfo.cor}
                        drop-shadow-sm drop-shadow-black/25
                        shadow-[inset_0_5px_0_0px_#00000050]
                    `}
                />

            </div>


            {/* MODAL */}

            <div
                className={`bg-fundo-profundo/80 backdrop-blur-lg inset-0 h-screen w-screen opacity-0 absolute flex z-50 ${
                    mostrarChamado
                        ? "opacity-100"
                        : "invisible"
                } justify-center items-center align-middle transition-all duration-500`}
                onClick={() =>
                    setMostrarChamado(!mostrarChamado)
                }
            >

                <div
                    className="h-100 w-200 rounded-4xl bg-fundo-razo text-pri flex flex-col items-baseline justify-baseline"
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className="flex flex-col poppins gap-2 p-5 bg-fundo-fundo border-2 border-borda rounded-4xl h-full w-full">

                        <h1 className="text-4xl font-medium">
                            {chamado?.titulo}
                        </h1>


                        <div className="flex flex-row gap-3">

                            <p>
                                Chamado:

                                <span className="font-bold">
                                    {chamado?.cod_chamado}
                                </span>
                            </p>


                            <p>
                                • Por:

                                <span className="font-bold">
                                    {chamado?.solicitante}
                                </span>
                            </p>


                            <p>
                                • Cargo:

                                <span className="font-bold">
                                    {chamado?.usuario?.funcao || "Usuário"}
                                </span>
                            </p>

                        </div>


                        <h2 className="font-bold">
                            Descrição:
                        </h2>


                        <div className="p-2 bg-fundo-razo rounded h-20">

                            <p className="flex font-light">
                                {chamado?.descricao}
                            </p>

                        </div>


                        <div className="flex flex-row justify-between">

                            <div className="flex flex-row gap-3 w-full">

                                <p>
                                    {chamado?.setor}
                                </p>

                                <p>
                                    • {chamado?.num_equipamento}
                                </p>

                            </div>


                            <div className="flex justify-end w-full">

                                <p>
                                    Status: {statusInfo.nome}
                                </p>

                            </div>

                        </div>


                        <div className="flex justify-end gap-3">

                            <button>
                                Favoritar
                            </button>


                            <button>
                                Enviar a Lixeira
                            </button>


                            <button
                                className={proxStatusInfo.cor}
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
