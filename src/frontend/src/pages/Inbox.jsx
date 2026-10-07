import SideBar from "../components/SideBar"
import Filtros from "../components/Chamado/Inbox/Filtros"
import LayoutUsuario from "../components/LayoutUsuario"

import mockChamados from "../assets/scripts/mock/mockChamados"

import React from "react"

import vector from "../assets/img/vector.png"

import { Send, Trash } from "lucide-react"

import ChamadoBullet from "../components/Chamado/Inbox/ChamadoBullet"

import { Link } from "react-router-dom"

const Inbox = ({ collapsed, setCollapsed }) => {

    const [checkedInboxes, setCheckedInboxes] = React.useState([])
    
    const [dataDe, setDataDe] = React.useState("")
    
    const [dataA, setDataA] = React.useState("")

    const [usuario, setUsuario] = React.useState("")

    const [chamados, setChamados] = React.useState(mockChamados)

    const [filtrosSelecionados, setFiltrosSelecionados] = React.useState([])
   
    function deletarChamados() {
        const chamadosFiltrados = chamados.filter(
            (item, index) => !checkedInboxes.includes(index)
        )
        mockChamados.splice(
            0,
            mockChamados.length,
            ...chamadosFiltrados
        )

        setChamados(chamadosFiltrados)
        setCheckedInboxes([])
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
        if (!chamado.nome.toLowerCase().includes(usuario.toLowerCase())) {
            return false
        }
    }
    if (dataDe !== "" || dataA !== "") {

        const partes = chamado.data.split(" ")
        const dia = partes[0].replace(",", "")
        const mes = partes[1]
        const ano = partes[2]

        const meses = {
            Janeiro: "01",
            Fevereiro: "02",
            Março: "03",
            Abril: "04",
            Maio: "05",
            Junho: "06",
            Julho: "07",
            Agosto: "08",
            Setembro: "09",
            Outubro: "10",
            Novembro: "11",
            Dezembro: "12"
        }

        const dataChamado = `${ano}-${meses[mes]}-${dia.padStart(2, "0")}`

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

                    {chamadosFiltrados.map((item, index) => (
                        <ChamadoBullet
                            key={item.id}
                            index={index}
                            mockInfo={item}
                            mockChamados={chamados}
                            setChamados={setChamados}
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