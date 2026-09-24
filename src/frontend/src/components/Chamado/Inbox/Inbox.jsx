import SideBar from "../../SideBar";
import Filtros from "../../Filtros";
import LayoutUsuario from "../../LayoutUsuario";
import mockChamados from '../../../assets/scripts/mock/mockChamados'
import React from "react";

{/* Icons */ }
import vector from "../../../assets/img/vector.png";
import { Send } from 'lucide-react';
import { Trash } from 'lucide-react';
import ChamadoBullet from "./ChamadoBullet";
import { Link } from "react-router-dom";

const Inbox = ({ collapsed, setCollapsed }) => {



    return (
        <div className="flex z-10 min-h-screen w-screen bg-fundo-fundo bg-cover bg-center items-stretch overflow-hidden">
            <div>oi</div>

            <SideBar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <div className={`${!collapsed ? "ml-20" : "ml-0"}  transition-all duration-300`}>
                <aside className="ml-5 min-h-screen w- max-w-sm bg-fundo-fundo border border-borda rounded-r-3xl flex flex-col items-center pt-8 pb-8 gap-4 overflow-y-auto">

                    <Link to="/inbox/criacaochamado">
                        <div className={`flex w-60 px-4 cursor-pointer justify-center flex-col items-center className="w-full h-15 bg-accent rounded-lg shadow-[0px_6px_0px_0px_#740510] transition-transform duration-150 hover:scale-102 active:scale-98 text-pri text-2xl font-bold`}>
                            <button className="cursor-pointer">
                                Escrever
                            </button>
                        </div>
                    </Link>

                    <Filtros />


                    <div className="flex w-full px-4 justify-center flex-row items-center">
                        <button className="flex flex-row w-full h-10 bg-sec-verde rounded-lg shadow-[0px_6px_0px_0px_#09943E] transition-transform duration-1500 cursor-pointer hover:scale-102 active:scale-98 text-pri text-2xl font-bold items-center justify-center">
                            <Send /> Enviados
                        </button>
                    </div>

                    <div className="flex w-full px-4 justify-center flex-col items-center">
                        <button className=" flex flex-row w-full h-10 bg-accent rounded-lg shadow-[0px_6px_0px_0px_#740510] transition-transform duration-150 cursor-pointer hover:scale-102 active:scale-98 text-pri text-2xl font-bold justify-center items-center">
                            <Trash /> Lixeira
                        </button>
                    </div>

                    <div className="w-80  border-b border-borda/30">
                    </div>

                    <div className="flex flex-col gap-2 justify-center w-84">
                        <div className="flex flex-row text-2xl text-pri gap-3">
                            <label className="" htmlFor="De">Data Inicial:</label>
                            <input className="flex bg-fundo-razo" type="date" />
                        </div>

                        <div className="flex flex-row text-2xl text-pri gap-2">
                            <label className="" htmlFor="De">Data final:</label>
                            <input className="flex bg-fundo-razo" type="date" />
                        </div>

                        <div className="w-80  border-b border-borda/30">
                        </div>
                    </div>

                </aside>
            </div >
            <div className="flex flex-col h-screen flex-1 pr-10 pl-10 overflow-hidden">
                <div className="flex flex-col w-[70%] items-center mb-10">
                    <header className="flex flex-row">
                        <LayoutUsuario />
                        <div className="flex flex-row justify-center items-center h-20 gap-2 px-2">
                            <span className="flex-1 h-1 w-70 bg-borda rounded-lg"></span>
                            <img className="w-12 opacity-30 hover:opacity-100 transition-opacity " src={vector} alt="Icone" />
                            <p className=" font-semibold tracking-wide text-pri text-4xl">Inbox</p>
                            <span className="flex-1 h-1 w-60 bg-borda rounded-lg"></span>
                        </div>
                    </header>
                </div>
                <div id="div-chamados" className="scroll shrink-0 flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto"

                >
                    {
                        Array.from({ length: mockChamados.length }).map((_, index) => (
                            <ChamadoBullet
                                key={index}
                                index={index}
                                mockInfo={mockChamados[index]}

                            />
                        ))
                    }
                </div>
            </div>
        </div >
    );
};

export default Inbox;



{/* Filtros 

            <div className=" flex flex-row w-80 h-5 bg-fundo-razo items-center justify-center">

                <div className="bg-sec w-30 rounded-lg items  "></div>
                Filtros
                <div className="bg-sec w-30 rounded-lg"></div>
            </div>
            <div className="flex flex-col bg-fundo-medio w-80 h-100 gap-2 ">

                <button className=" flex w-full h-10 bg-fundo-razo rounded-lg text-2xl text-pri flex-row justify-start items-center">
                    <div className="flex w-5 h-5 m-6 rounded-m border-borda border-3 text-pri text-2xl"></div>
                    Todos os Chamados
                </button>

                 <button className=" flex w-full h-10 bg-fundo-razo  rounded-lg text-2xl text-pri flex-row justify-start items-center">
                    <div className="flex w-5 h-5 m-6 rounded-m border-borda border-3 text-pri text-2xl">
                    </div>
                    Todos os Chamados
                </button>
            </div> */}