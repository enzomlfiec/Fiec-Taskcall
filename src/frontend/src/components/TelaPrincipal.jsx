import React from "react"

import SideBar from "./SideBar"
import LayoutUsuario from "./LayoutUsuario"
import ChamadosResumos from "./ChamadosResumos"
import ChamadoBullet from "./Chamado/Inbox/ChamadoBullet"

import { useNavigate } from "react-router-dom"

import {
    MessageCircleWarning,
    Clock4,
    TriangleAlert,
    CircleEllipsis
} from "lucide-react"


const TelaPrincipal = ({
    collapsed,
    setCollapsed
}) => {

    const navigate = useNavigate()

    const [chamados, setChamados] = React.useState([])
    const [carregando, setCarregando] = React.useState(true)
    const [erro, setErro] = React.useState("")


    React.useEffect(() => {

        async function carregarChamados() {

            try {

                setCarregando(true)
                setErro("")

                const resposta = await fetch(
                    "http://127.0.0.1:8000/api/painel"
                )

                if (!resposta.ok) {
                    throw new Error(
                        "Não foi possível carregar os chamados."
                    )
                }

                const dados = await resposta.json()

                setChamados(
                    dados.chamados || []
                )

            } catch (error) {

                console.error(
                    "ERRO AO CARREGAR CHAMADOS:",
                    error
                )

                setErro(error.message)

            } finally {

                setCarregando(false)

            }
        }

        carregarChamados()

    }, [])


    /*
     * RESUMO DOS CHAMADOS
     */

    const totalChamados = chamados.length


    const quantidadeAbertos =
        chamados.filter(
            (chamado) =>
                String(chamado.status).trim() === "Aberto"
        ).length


    const quantidadeProgresso =
        chamados.filter(
            (chamado) =>
                String(chamado.status).trim() === "Em progresso"
        ).length


    const quantidadeUrgencia =
        chamados.filter(
            (chamado) =>
                String(chamado.status).trim() === "Urgencia"
        ).length


    const quantidadeAnalise =
        chamados.filter(
            (chamado) =>
                String(chamado.status).trim() === "Aguardando"
        ).length


    function calcularPorcentagem(quantidade) {

        if (totalChamados === 0) {
            return 0
        }

        return Math.round(
            (quantidade / totalChamados) * 100
        )
    }


    /*
     * PRIMEIROS 12 CHAMADOS
     */

    const chamadosRecentes =
        chamados.slice(0, 12)


    return (
        <>

            <div className="flex z-10 min-h-screen w-full bg-[url(public/assets/login2.png)] bg-cover bg-center justify-center items-stretch overflow-hidden">

                <SideBar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />


                <div
                    className={`${
                        !collapsed
                            ? "ml-20"
                            : "ml-0"
                    } transition-all duration-300`}
                >

                    <header className="flex flex-col gap-2 w-full m-2">

                        <LayoutUsuario />


                        {/* RESUMO CHAMADOS */}

                        <div className="flex flex-row text-pri text-lg justify-center items-center px-1 gap-2">

                            <div className="flex h-0.5 w-50 bg-borda rounded-2xl" />

                            Resumo Chamados

                            <div className="flex h-0.5 w-50 bg-borda rounded-3xl" />

                        </div>


                        <article className="flex flex-row w-full justify-between bg-debug/0 h-45">


                            {/* NÃO VISUALIZADOS */}

                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados não visualizados",
                                    cor: "bg-sec-amarelo",
                                    borda: "border-sec-amarelo",
                                    textoCor: "text-sec-amarelo",
                                    icone: MessageCircleWarning,
                                    porcentagem:
                                        calcularPorcentagem(
                                            quantidadeAbertos
                                        )
                                }}
                            />


                            {/* EM PROGRESSO */}

                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados em progresso",
                                    cor: "bg-sec-azul",
                                    borda: "border-sec-azul",
                                    textoCor: "text-sec-azul",
                                    icone: Clock4,
                                    porcentagem:
                                        calcularPorcentagem(
                                            quantidadeProgresso
                                        )
                                }}
                            />


                            {/* EMERGENCIAIS */}

                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados emergenciais",
                                    cor: "bg-sec-vermelho",
                                    borda: "border-sec-vermelho",
                                    textoCor: "text-sec-vermelho",
                                    icone: TriangleAlert,
                                    porcentagem:
                                        calcularPorcentagem(
                                            quantidadeUrgencia
                                        )
                                }}
                            />


                            {/* EM ANÁLISE */}

                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados em análise",
                                    cor: "bg-borda",
                                    borda: "border-borda",
                                    textoCor: "text-borda",
                                    icone: CircleEllipsis,
                                    porcentagem:
                                        calcularPorcentagem(
                                            quantidadeAnalise
                                        )
                                }}
                            />

                        </article>


                        {/* INBOX RECENTE */}

                        <div className="flex flex-row text-pri text-lg justify-center items-center px-1 gap-2 mb-6.5">

                            <div className="flex h-0.5 w-50 bg-borda rounded-2xl" />

                            Inbox Recente

                            <div className="flex h-0.5 w-50 bg-borda rounded-3xl" />

                        </div>


                        {/* LISTA */}

                        <div className="relative isolate bg-debug/0 h-[30vw] w-full gap-3 flex flex-col justify-center items-center align-middle">


                            <div
                                draggable={false}
                                className="select-none contents pointer-events-none *:pointer-events-none"
                            >

                                {carregando && (

                                    <p className="text-pri">
                                        Carregando chamados...
                                    </p>

                                )}


                                {!carregando &&
                                    !erro &&
                                    chamadosRecentes.map(
                                        (chamado, index) => (

                                            <ChamadoBullet
                                                key={
                                                    chamado.cod_chamado
                                                }
                                                index={index}
                                                chamado={chamado}
                                            />

                                        )
                                    )
                                }

                            </div>


                            {/* GRADIENTE ORIGINAL */}

                            <div className="absolute inset-0 bg-linear-to-t from-[#1d192b] via-fundo-fundo-fun/0 to-transparent pointer-events-none z-5" />


                            {/* BOTÃO ORIGINAL */}

                            <button
                                onClick={() =>
                                    navigate("/inbox")
                                }
                                className="text-pri relative bottom-10 botao bg-accent w-32 pt-2 pb-5 text-center z-10 transition-all hover:brightness-70 duration-500! pointer-events-auto"
                            >
                                Ver tudo
                            </button>

                        </div>

                    </header>

                </div>

            </div>

        </>
    )
}

export default TelaPrincipal
