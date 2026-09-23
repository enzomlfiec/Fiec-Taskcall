import React from "react";
import SideBar from "./SideBar";
import LayoutUsuario from "./LayoutUsuario";

{/* Icones */ }
import { MessageCircleWarning } from 'lucide-react';
import { Clock4 } from 'lucide-react';
import { TriangleAlert } from 'lucide-react';
import { CircleEllipsis } from 'lucide-react';

const TelaPrincipal = () => {
    const [collapsed, setCollapsed] = React.useState(false)
    const [statusChamados, setStatusChamados] = React.useState([25, 50, 25, 0])

    return (
        <>
            <div className=" flex z-10 min-h-screen w-screen bg-[url(public/assets/login2.png)] bg-cover bg-center items-stretch overflow-hidden">

                <SideBar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                <div className={`${!collapsed ? "ml-20" : "ml-0"} transition-all duration-300`}>
                    <header className="flex flex-col gap-2 w-full m-2">

                        <LayoutUsuario />

                        <div className="flex flex-row text-pri text-lg justify-center items-center px-1 gap-2">
                            <div className="flex h-0.5 w-50 bg-borda rounded-2xl"></div>
                            Resumo Chamados
                            <div className="flex h-0.5 w-50 bg-borda rounded-3xl"></div>

                        </div>

                        <article className="flex flex-row w-full justify-between bg-debug/0 h-45">
                            <div className="flex flex-row h-40 w-[25%] gap-3 bg-fundo-razo rounded-2xl p-4 m-3 items-center justify-center text-pri text-xl ">
                                <div className="flex items-center justify-center w-20 h-20 shrink-0 bg-sec-amarelo rounded-xl text-pri  shadow-lg">
                                    <MessageCircleWarning
                                        className="w-12 h-12" />
                                </div>
                                <span className="flex text-pri text-lg">Chamados não visualizados</span>

                                <div className="flex items-center justify-center w-20 h-20 ml-auto shrink-0 rounded-full border-15 border-sec-amarelo text-lg text-orange-400 ">
                                    <div className="mix-blend-plus-lighter font-bold">
                                        {statusChamados[0]}%
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row h-40 w-[25%] gap-3 bg-fundo-razo rounded-2xl p-4 m-3 items-center justify-center text-pri text-xl ">
                                <div className="flex items-center justify-center w-20 h-20 shrink-0 bg-sec-azul rounded-xl text-pri
                    shadow-lg">
                                    <Clock4 className="w-12 h-12" />
                                </div>
                                <span className="flex text-pri text-lg">Chamados em Progresso</span>
                                <div className="flex items-center justify-center w-20 h-20 ml-auto shrink-0 rounded-full border-15 border-sec-azul text-lg text-blue-600 ">
                                    <div className="mix-blend-plus-lighter font-bold">
                                        {statusChamados[1]}%
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row h-40 w-[25%] gap-3 bg-fundo-razo rounded-2xl p-4 m-3 items-center justify-center text-pri text-xl ">
                                <div className="flex items-center justify-center w-20 h-20 shrink-0 bg-sec-vermelho rounded-xl text-pri shadow-lg">
                                    <TriangleAlert className="w-12 h-12" />
                                </div>
                                <span className="flex text-pri text-lg">Chamados Emergencial</span>
                                <div className="flex items-center justify-center w-20 h-20 ml-auto shrink-0 rounded-full border-15 border-sec-vermelho text-lg text-red-700">
                                    <div className="mix-blend-plus-lighter font-bold">
                                        {statusChamados[2]}%
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row h-40 w-[25%] gap-3 bg-fundo-razo rounded-2xl p-4 m-3 items-center justify-center text-pri text-xl ">

                                <div className="flex items-center justify-center w-20 h-20 shrink-0 bg-sec rounded-xl text-pri shadow-lg">
                                    <CircleEllipsis className="w-12 h-12" />
                                </div>

                                <span className="flex text-pri text-lg">Chamados em Análise</span>

                                <div className="flex items-center justify-center w-20 h-20 ml-auto shrink-0 rounded-full border-15 border-sec text-lg text-pri">
                                    <div className="mix-blend-plus-lighter font-bold">
                                        {statusChamados[3]}%
                                    </div>
                                </div>
                            </div>
                        </article>

                        <div className="flex flex-row text-pri text-lg justify-center items-center px-1 gap-2">
                            <div className="flex h-0.5 w-50 bg-borda rounded-2xl"></div>
                            Inbox Recente
                            <div className="flex h-0.5 w-50 bg-borda rounded-3xl"></div>
                        </div>
                    </header>
                </div>
            </div >
        </>
    )
}

export default TelaPrincipal