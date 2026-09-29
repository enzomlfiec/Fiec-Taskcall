import SideBar from "../../SideBar"
import Filtros from "../../Filtros"
import LayoutUsuario from "../../LayoutUsuario"

import React from "react"

import vector from "../../../assets/img/vector.png"

import { Send, Trash } from "lucide-react"

import ChamadoBullet from "./ChamadoBullet"

import { Link } from "react-router-dom"


const Inbox = ({
    collapsed,
    setCollapsed
}) => {

    const [checkedInboxes, setCheckedInboxes] =
        React.useState([])

    const [chamados, setChamados] =
        React.useState([])

    const [carregando, setCarregando] =
        React.useState(true)

    const [erro, setErro] =
        React.useState("")

//oi
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

                const dados =
                    await resposta.json()

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


    async function deletarChamados() {

        const selecionados =
            checkedInboxes.map(
                (index) => chamados[index]
            )


        try {

            await Promise.all(

                selecionados.map(
                    (chamado) =>

                        fetch(
                            `http://127.0.0.1:8000/api/chamados/${chamado.cod_chamado}`,
                            {
                                method: "DELETE"
                            }
                        )

                )

            )


            setChamados(
                chamados.filter(
                    (_, index) =>
                        !checkedInboxes.includes(index)
                )
            )


            setCheckedInboxes([])

        } catch (error) {

            setErro(
                "Não foi possível excluir os chamados."
            )

        }

    }


    return (

        <div className="flex z-10 min-h-screen w-screen bg-fundo-fundo bg-cover bg-center items-stretch overflow-hidden">


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

                <aside className="ml-5 min-h-screen max-w-sm bg-fundo-fundo border border-borda rounded-r-3xl flex flex-col items-center pt-8 pb-8 gap-4 overflow-y-auto">


                    <Link to="/inbox/criacaochamado">

                        <div className="flex w-full pr-5 pl-5 justify-center items-center">

                            <button
                                type="button"
                                className="w-full h-15 bg-accent pr-10 pl-10 rounded-lg shadow-[0px_6px_0px_0px_#740510] transition-transform duration-150 cursor-pointer hover:scale-102 active:scale-98 text-pri text-2xl font-bold"
                            >
                                Escrever
                            </button>

                        </div>

                    </Link>


                    <Filtros />


                    <div className="flex w-full px-4 justify-center items-center">

                        <button
                            type="button"
                            className="flex flex-row w-full h-10 bg-sec-verde rounded-lg shadow-[0px_6px_0px_0px_#09943E] transition-transform duration-150 cursor-pointer hover:scale-102 active:scale-98 text-pri text-2xl font-bold items-center justify-center"
                        >

                            <Send />

                            Enviados

                        </button>

                    </div>


                    <div className="flex w-full px-4 justify-center flex-col items-center">

                        <button
                            type="button"
                            onClick={deletarChamados}
                            className="flex flex-row w-full h-10 bg-accent rounded-lg shadow-[0px_6px_0px_0px_#740510] transition-transform duration-150 cursor-pointer hover:scale-102 active:scale-98 text-pri text-2xl font-bold justify-center items-center"
                        >

                            <Trash />

                            Lixeira

                        </button>

                    </div>


                    <div className="w-80 border-b border-borda/30" />


                    <div className="flex flex-col gap-2 w-84 pl-10 pr-10">

                        <div className="flex flex-row justify-between text-2xl text-pri gap-3">

                            <label htmlFor="dataDe">
                                De:
                            </label>

                            <input
                                id="dataDe"
                                className="flex uppercase text-sm p-2 pr-7 pl-7 justify-between text-borda bg-fundo-razo"
                                type="date"
                            />

                        </div>


                        <div className="flex flex-row justify-between text-2xl text-pri gap-2">

                            <label htmlFor="dataA">
                                A:
                            </label>

                            <input
                                id="dataA"
                                className="flex uppercase text-sm p-2 pr-7 pl-7 justify-between text-borda bg-fundo-razo"
                                type="date"
                            />

                        </div>


                        <div className="flex flex-row justify-between text-2xl text-pri gap-2">

                            <label htmlFor="dataPor">
                                Por:
                            </label>

                            <input
                                id="dataPor"
                                className="flex uppercase text-sm p-2 pr-7 pl-7 justify-between text-borda bg-fundo-razo"
                                type="date"
                            />

                        </div>


                        <div className="w-80 border-b border-borda/30" />

                    </div>

                </aside>

            </div>


            <div className="flex flex-col h-screen flex-1 pr-10 pl-10 overflow-hidden">


                <div className="flex flex-col w-[70%] items-center mb-10">

                    <header className="flex flex-row">

                        <LayoutUsuario />


                        <div className="flex flex-row justify-center items-center h-20 gap-2 px-2">

                            <span className="flex-1 h-1 w-70 bg-borda rounded-lg" />


                            <img
                                className="w-12 opacity-30 hover:opacity-100 transition-opacity"
                                src={vector}
                                alt="Icone"
                            />


                            <p className="font-semibold tracking-wide text-pri text-4xl">
                                Inbox
                            </p>


                            <span className="flex-1 h-1 w-60 bg-borda rounded-lg" />

                        </div>

                    </header>

                </div>


                <div
                    id="div-chamados"
                    className="scroll shrink-0 flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto"
                >


                    {carregando && (

                        <p className="text-pri text-center">
                            Carregando chamados...
                        </p>

                    )}


                    {!carregando && erro && (

                        <p className="text-accent text-center">
                            {erro}
                        </p>

                    )}


                    {!carregando &&
                        !erro &&
                        chamados.length === 0 && (

                            <p className="text-borda text-center">
                                Nenhum chamado encontrado.
                            </p>

                        )
                    }


                    {!carregando &&
                        !erro &&
                        chamados.map(
                            (item, index) => (

                                <ChamadoBullet
                                    key={
                                        item.cod_chamado
                                    }
                                    index={index}
                                    chamado={item}
                                    checkedInboxes={
                                        checkedInboxes
                                    }
                                    setCheckedInboxes={
                                        setCheckedInboxes
                                    }
                                />

                            )
                        )
                    }

                </div>

            </div>

        </div>
    )
}

export default Inbox
