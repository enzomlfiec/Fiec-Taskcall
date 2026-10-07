import React from "react";
import SideBar from "../components/SideBar";
import LayoutUsuario from "../components/LayoutUsuario";
import ChamadosResumos from "../components/ChamadosResumos";
import ChamadoBullet from "../components/Chamado/Inbox/ChamadoBullet";
import mockChamados from "../assets/scripts/mock/mockChamados";
import { useNavigate } from "react-router-dom";
import { Clock4, TriangleAlert, CircleEllipsis, MessageCircleWarning } from "lucide-react";

const TelaPrincipal = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className=" flex z-10 min-h-screen w-full bg-[url(public/assets/login2.png)] bg-cover bg-center justify-center items-stretch overflow-x-hidden overflow-y-auto lg:overflow-y-hidden">
                <SideBar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />

                <div className={`${!collapsed ? "ml-16 sm:ml-20" : "ml-0"} w-full min-w-0 transition-all duration-300 px-2 sm:px-4`}>

                    <header className="flex flex-col gap-2 w-full m-1">
                        <LayoutUsuario />

                        <div className="flex flex-row text-pri text-lg justify-center items-center px-1 gap-2">
                            <div className="flex h-0.5 flex-1 max-w-50 bg-borda rounded-2xl"></div>
                            Resumo Chamados
                            <div className="flex h-0.5 flex-1 max-w-50 bg-borda rounded-3xl"></div>
                        </div>

                        <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-5 gap-2 sm:gap-3 w-full">

                            {/* Chamados não visualizados */}
                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados não visualizados",
                                    cor: "sec-amarelo",
                                    icone: MessageCircleWarning,
                                    porcentagem: 25
                                }}
                            />

                            {/* Chamados em progresso */}
                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados em progresso",
                                    cor: "sec-azul",
                                    icone: Clock4,
                                    porcentagem: 50
                                }}
                            />

                            {/* Chamados emergenciais */}
                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados emergenciais",
                                    cor: "sec-vermelho",
                                    icone: TriangleAlert,
                                    porcentagem: 25
                                }}
                            />

                            {/* Chamados em análise */}
                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados em análise",
                                    cor: "borda",
                                    icone: CircleEllipsis,
                                    porcentagem: 0
                                }} />
                        </article>
                            <div className="flex flex-row text-pri text-lg justify-center items-center px-1 gap-2 mb-6.5 mt-2">
                            <div className="flex h-0.5 flex-1 max-w-50 bg-borda rounded-2xl"></div>
                            Inbox Recente
                            <div className="flex h-0.5 flex-1 max-w-50 bg-borda rounded-3xl"></div>
                        </div>

                        <div className="relative w-full flex flex-col items-center">
                            <div className=" relative w-full h-105 sm:h-115 md:h-125 lg:h-[30vw] lg:max-h-125 overflow-hidden ">
                                <div draggable={false} className="select-none flex flex-col gap-3 w-full pointer-events-none">
                                    {
                                        Array.from({ length: 12 }).map((_, index) => (
                                            <ChamadoBullet
                                                key={index}
                                                index={index}
                                                mockInfo={mockChamados[index]}
                                            />
                                        ))}
                                </div>

                                {/* Sombra da prévia */}
                                <div className=" absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-[#1d192b] via-[#1d192b]/80 to-transparent pointer-events-none"></div>
                            </div>

                            <button
                                onClick={() => navigate("/inbox")}
                                className=" text-pri botao bg-accent w-32 pt-2 pb-5 text-center transition-all hover:brightness-70 duration-500 -mt-8.75  z-10 "
                            >
                                Ver tudo
                            </button>
                        </div>
                    </header>
                </div>
            </div>
        </>
    );
};

export default TelaPrincipal;