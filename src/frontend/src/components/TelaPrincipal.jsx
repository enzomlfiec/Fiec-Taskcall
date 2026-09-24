import React from "react";
import SideBar from "./SideBar";
import LayoutUsuario from "./LayoutUsuario";
import ChamadosResumos from "./ChamadosResumos";
import ChamadoBullet from "./Chamado/Inbox/ChamadoBullet";
import mockChamados from "./Chamado/Inbox/mockChamados";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom"


{/* Icones */ }

import { EllipsisIcon, Heart, MessageCircleWarning } from 'lucide-react';
import { Clock4 } from 'lucide-react';
import { TriangleAlert } from 'lucide-react';
import { CircleEllipsis } from 'lucide-react';

const TelaPrincipal = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();
    return (
        <>
            <div className=" flex z-10 min-h-screen w-full bg-[url(public/assets/login2.png)] bg-cover bg-center justify-center items-stretch overflow-hidden">

                <SideBar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                <div className={`${!collapsed ? "ml-20" : "ml-0"}  transition-all duration-300`}>
                    <header className="flex flex-col gap-2 w-full m-2">

                        <LayoutUsuario />

                        <div className="flex flex-row text-pri text-lg justify-center items-center px-1 gap-2">
                            <div className="flex h-0.5 w-50 bg-borda rounded-2xl"></div>
                            Resumo Chamados
                            <div className="flex h-0.5 w-50 bg-borda rounded-3xl"></div>

                        </div>

                        <article className="flex flex-row w-full justify-between bg-debug/0 h-45">

                            {/* Chamados não visualizados */}
                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados não visualizados",
                                    cor: "sec-amarelo",
                                    icone: MessageCircleWarning,
                                    porcentagem: 25,
                                }}
                            />

                            {/* Chamados em progresso */}
                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados em progresso",
                                    cor: "sec-azul",
                                    icone: Clock4,
                                    porcentagem: 50,
                                }}
                            />

                            {/* Chamados emergenciais */}
                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados emergenciais",
                                    cor: "sec-vermelho",
                                    icone: TriangleAlert,
                                    porcentagem: 25,
                                }}
                            />

                            {/* Chamados em análise */}
                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados em análise",
                                    cor: "borda",
                                    icone: CircleEllipsis,
                                    porcentagem: 0,
                                }}
                            />

                            {/* Chamados não visualizados */}
                            {/* <ChamadosResumos
                                statusChamados={{
                                    texto: "natan é",
                                    cor: "debug",
                                    icone: Heart,
                                    porcentagem: "lindo",
                                }}
                            /> */}

                        </article>

                        <div className="flex flex-row text-pri text-lg justify-center items-center px-1 gap-2 mb-6.5">
                            <div className="flex h-0.5 w-50 bg-borda rounded-2xl"></div>
                            Inbox Recente
                            <div className="flex h-0.5 w-50 bg-borda rounded-3xl"></div>
                        </div>
                        <div className="relative isolate bg-debug/0 h-[30vw] w-full gap-3 flex flex-col justify-center items-center align-middle">
                            <div draggable={false} className="select-none contents pointer-events-none *:pointer-events-none">
                                {
                                    Array.from({ length: 12 }).map((_, index) => (
                                        <ChamadoBullet
                                            key={index}
                                            index={index}
                                            mockInfo={mockChamados[index]}
                                        />
                                    ))
                                }
                            </div>
                            <div className=" absolute inset-0 bg-linear-to-t from-[#1d192b] via-fundo-fundo-fun/0 to-transparent pointer-events-none z-5"></div>
                            <button
                                onClick={() => navigate("/inbox")}
                                className="text-white relative bottom-10 botao bg-accent w-32 pt-2 pb-5 text-center z-10 transition-all hover:brightness-70 duration-500! pointer-events-auto"
                            >
                                Ver tudo
                            </button>
                        </div>
                    </header>
                </div>
            </div >
        </>
    )
}

export default TelaPrincipal