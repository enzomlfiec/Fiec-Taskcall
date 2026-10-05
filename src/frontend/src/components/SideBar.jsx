import taskcall from "../assets/img/taskcall.png";
import home from "../assets/img/home.png";
import vector from "../assets/img/vector.png";
import vector2 from "../assets/img/vector2.png";
import configuracao from "../assets/img/configuracao.png";
import perfil from "../assets/img/perfil.png";
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

function SideBar({ collapsed, setCollapsed }) {
  return (
    <div className={`fixed top-0 left-0 z-50 h-screen flex flex-row items-center ${collapsed ? "-translate-x-20" : "translate-x-0"} transition-transform duration-300`} >
      <div className="w-16 sm:w-20 h-full bg-fundo-razo rounded-r-3xl flex flex-col items-center justify-between pb-5 overflow-hidden">


        <div className="flex flex-col items-center gap-4 sm:gap-5 h-full justify-between">

          <img
            className="w-12 sm:w-16 opacity-30 mt-5"
            src={taskcall}
            alt="Logo Taskcall"
          />

          <div className="w-16 sm:w-24 h-0.5 bg-cl-razo opacity-30 rounded"></div>

          <Link to="/tela-principal">
            <img
              className="w-8 sm:w-10 opacity-30 hover:opacity-50 transition-opacity"
              src={home}
              alt="Ícone casa - início"
            />
          </Link>

          <button
            className="w-8 sm:w-10 h-0.5 bg-cl-razo opacity-30 rounded"
            aria-label="Separador"
          ></button>

          <Link to="/inbox">
            <img
              className="w-8 sm:w-10 opacity-30 hover:opacity-50 transition-opacity"
              src={vector}
              alt="Ícone Inbox"
            />
          </Link>

          <div className="w-8 sm:w-10 h-0.5 bg-cl-razo opacity-30 rounded"></div>

          <Link to="/chamados">
            <img
              className="w-8 sm:w-10 opacity-30 hover:opacity-50 transition-opacity"
              src={vector2}
              alt="Ícone Chamados"
            />
          </Link>

          <div className="w-8 sm:w-10 h-0.5 bg-cl-razo opacity-30 rounded"></div>

        </div>

        <div className="h-[30%] sm:h-[50%]"></div>

        <div className="flex flex-col items-center gap-4 sm:gap-5">

          <div className="w-8 sm:w-10 h-0.5 bg-cl-razo opacity-30 rounded"></div>

          <Link to="/configuracoes">
            <img
              className="w-8 sm:w-10 opacity-30 hover:opacity-50 transition-opacity"
              src={configuracao}
              alt="Ícone Configurações"
            />
          </Link>

          <div className="w-8 sm:w-10 h-0.5 bg-cl-razo opacity-30 rounded"></div>

          <Link to="/usuario">
            <img
              className="w-8 sm:w-10 opacity-30 hover:opacity-50 transition-opacity"
              src={perfil}
              alt="Ícone Usuário"
            />
          </Link>

        </div>
      </div>

      <button id="sidebarpull"  aria-label={collapsed ? "Abrir menu lateral" : "Fechar menu lateral"} className="bg-fundo-razo text-borda font-bold select-none pt-4 pb-4 px-1 rounded-br-4xl rounded-tr-4xl text-center cursor-pointer hover:bg-borda hover:text-pri transition-all duration-300" 
      onClick={() => setCollapsed(!collapsed)} >
        <span className={`${collapsed ? "rotate-180" : "rotate-0"} block transition-all duration-500`} >
         
          <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" />
        </span>
      </button>
    </div>
  );
}

export default SideBar;