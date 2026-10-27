import SideBar from "../components/SideBar"
import Filtros from "../components/Chamado/Inbox/Filtros"
import LayoutUsuario from "../components/LayoutUsuario"

import React, { useEffect } from "react"
import { excluirChamado, listarChamados } from "../api"

import vector from "../assets/img/Vector.png"

import { Send, Trash } from "lucide-react"

import ChamadoBullet from "../components/Chamado/Inbox/ChamadoBullet"

import { Link } from "react-router-dom"

const Inbox = ({ collapsed, setCollapsed }) => {

    const [checkedInboxes, setCheckedInboxes] = React.useState([])
    
    const [dataDe, setDataDe] = React.useState("")
    
    const [dataA, setDataA] = React.useState("")

    const [usuario, setUsuario] = React.useState("")

    const [chamados, setChamados] = React.useState([])
    const [carregando, setCarregando] = React.useState(true)
    const [erro, setErro] = React.useState("")
    const [erroExclusao, setErroExclusao] = React.useState("")

    const [filtrosSelecionados, setFiltrosSelecionados] = React.useState([])
   
    useEffect(() => {
        let ativo = true

        listarChamados()
            .then((dados) => {
                if (ativo) setChamados(dados)
            })
            .catch((error) => {
                if (ativo) setErro(error.message || "Não foi possível carregar os chamados.")
            })
            .finally(() => {
                if (ativo) setCarregando(false)
            })

        return () => { ativo = false }
    }, [])

    async function removerChamado(id) {
        try {
            await excluirChamado(id)
            setChamados((atuais) => atuais.filter((item) => item.id !== id))
            setCheckedInboxes((atuais) => atuais.filter((item) => item !== id))
            setErroExclusao("")
            return true
        } catch (error) {
            setErroExclusao(error.message || "Não foi possível excluir o chamado.")
            return false
        }
    }

    async function deletarChamados() {
        if (checkedInboxes.length === 0) {
            setErroExclusao("Selecione pelo menos um chamado para excluir.")
            return
        }

        const resultados = await Promise.allSettled(checkedInboxes.map((id) => excluirChamado(id)))
        const idsExcluidos = checkedInboxes.filter((_, index) => resultados[index].status === "fulfilled")
        const falha = resultados.find((resultado) => resultado.status === "rejected")

        if (idsExcluidos.length > 0) {
            setChamados((atuais) => atuais.filter((item) => !idsExcluidos.includes(item.id)))
            setCheckedInboxes((atuais) => atuais.filter((id) => !idsExcluidos.includes(id)))
        }

        setErroExclusao(falha?.reason?.message || "")
    }

    const chamadosFiltrados = chamados.filter((chamado) => {

    if (filtrosSelecionados.length > 0) {

        const passouNosFiltros = filtrosSelecionados.every((filtro) => {

            if (filtro === "favoritos") {
                return chamado.salvo === true
            }
            if (filtro === "nao-iniciados") {
                return chamado.status === 0
            }
            if (filtro === "progresso") {
                return chamado.status === 1
            }
            if (filtro === "resolvidos") {
                return chamado.status === 2
            }
            if (filtro === "urgentes") {
                return chamado.status === 4
            }

            return true
        })
        if (!passouNosFiltros) {
            return false
        }
    }

    if (usuario !== "") {
        if (!(chamado.nome || "").toLowerCase().includes(usuario.toLowerCase())) {
            return false
        }
    }
    if (dataDe !== "" || dataA !== "") {

        let dataChamado = chamado.dataDia || chamado.dataIso?.slice(0, 10)
        if (!dataChamado && chamado.data) {
            const partes = chamado.data.split(" ")
            const meses = {
                Janeiro: "01", Fevereiro: "02", Março: "03", Abril: "04",
                Maio: "05", Junho: "06", Julho: "07", Agosto: "08",
                Setembro: "09", Outubro: "10", Novembro: "11", Dezembro: "12"
            }
            const dia = partes[0]?.replace(",", "")
            dataChamado = `${partes[2]}-${meses[partes[1]]}-${dia?.padStart(2, "0")}`
        }

        if (dataDe !== "" && dataChamado < dataDe) {
            return false
        }
        if (dataA !== "" && dataChamado > dataA) {
            return false
        }
    }

    return true
})

    return (
        <div className="flex z-10 min-h-screen w-screen bg-fundo-fundo bg-cover bg-center items-stretch overflow-hidden">

            <SideBar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div
                className={`${!collapsed ? "ml-20" : "ml-0"
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

                    <Filtros 
                         filtrosSelecionados={filtrosSelecionados}
                         setFiltrosSelecionados={setFiltrosSelecionados}
                    />

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
                                className="flex rounded-md uppercase text-sm p-2 pr-7 pl-7 justify-between text-pri bg-fundo-razo"
                                type="date"
                                value={dataDe}
                                onChange={(e) => setDataDe(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-row justify-between text-2xl text-pri gap-2">
                            <label htmlFor="dataA">
                                A:
                            </label>

                            <input
                                id="dataA"
                                className="flex rounded-md uppercase text-sm p-2 pr-7 pl-7 justify-between text-pri bg-fundo-razo"
                                type="date"
                                value={dataA}
                                onChange={(e) => setDataA(e.target.value)}
                            />
                        </div>

                       <div className="w-70 border-b border-borda/30" />

                        <div className="flex flex-row justify-between text-2xl text-pri gap-2">
                            <label id="userPor">
                                Por:
                            </label>

                            <input
                                id="userPor"
                                className="flex rounded-md placeholder-white/25 w-44.25 text-center  text-sm p-2 pr-7 pl-7 justify-between text-pri bg-fundo-razo"
                                type="text"
                                placeholder="Usuário"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />
                        </div>


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

                    {carregando && <p className="p-6 text-center text-pri">Carregando chamados...</p>}
                    {!carregando && erro && <p role="alert" className="p-6 text-center text-sec-vermelho">{erro}</p>}
                    {erroExclusao && <p role="alert" className="p-4 text-center text-sec-vermelho">{erroExclusao}</p>}
                    {!carregando && !erro && chamadosFiltrados.length === 0 && (
                        <p className="p-6 text-center text-borda">Nenhum chamado encontrado.</p>
                    )}
                    {chamadosFiltrados.map((item) => (
                        <ChamadoBullet
                            key={item.id}
                            mockInfo={item}
                            onDelete={removerChamado}
                            checkedInboxes={checkedInboxes}
                            setCheckedInboxes={setCheckedInboxes}

                        />
                    ))}

                </div>

            </div>

        </div>
    )
}

export default Inbox
