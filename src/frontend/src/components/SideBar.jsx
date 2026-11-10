import taskcall from "../assets/img/taskcall.png";
import home from "../assets/img/home.png";
import configuracao from "../assets/img/configuracao.png";
import perfil from "../assets/img/perfil.png";
import React from "react";
import { ChevronLeft, Inbox, Monitor } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
function SideBar({ collapsed, setCollapsed }) {

  const location = useLocation();

  return (
    <div className={`select-none fixed top-0 left-0 z-50 h-screen flex flex-row items-center ${collapsed ? "-translate-x-20" : "translate-x-0"} transition-transform duration-300`} >
      <div className="w-16 sm:w-20 h-full bg-fundo-razo rounded-r-3xl flex flex-col items-center justify-between pb-5 overflow-hidden">


        <div className="flex flex-col items-center gap-4 sm:gap-5 h-full justify-between">

          <img
            className="w-12 opacity-50 sm:w-16 mt-5 in-[.claro]:invert in-[.claro]:opacity-50"
            src={taskcall}
            alt="Logo Taskcall"
            title="Taskcall"
          />

          <div className="w-8 sm:w-15 h-0.5 bg-pri opacity-30 rounded"></div>

          <Link to="/tela-principal">
            <img
              className={`w-8 sm:w-10 ${location.pathname === "/tela-principal" ? "opacity-80" : "opacity-30"} hover:opacity-50 transition-opacity sidebar-icon`}
              src={home}
              alt="Ícone casa - início"
              title="Tela Principal"
            />
          </Link>

          <div className="w-8 sm:w-15 h-0.5 bg-pri opacity-30 rounded"></div>

          <Link to="/inbox">
            <Inbox
              className={`w-8 h-8 sm:w-10 sm:h-10 text-pri ${location.pathname === "/inbox" ? "opacity-80" : "opacity-30"} hover:opacity-50 transition-opacity`}
              title="Inbox"
            />
          </Link>

          <div className="w-8 sm:w-15 h-0.5 bg-pri opacity-30 rounded"></div>

          {/*<Link to="/chamados">
            <Monitor
              className={`w-8 h-8 sm:w-10 sm:h-10 text-pri ${location.pathname === "/chamados" ? "opacity-80" : "opacity-30"} hover:opacity-50 transition-opacity`}
              title="Chamados"
            />
          </Link>

          */}
          
        </div>

        <div className="h-[30%] sm:h-[50%]"></div>

        <div className="flex flex-col items-center gap-4 sm:gap-5">

          <div className="w-8 sm:w-15 h-0.5 bg-pri opacity-30 rounded"></div>

          <Link to="/configuracoes">
            <img
              className={`w-8 sm:w-10 ${location.pathname === "/configuracoes" ? "opacity-80" : "opacity-30"} hover:opacity-50 transition-opacity sidebar-icon`}
              src={configuracao}
              alt="Ícone Configurações"
              title="Configurações"
            />
          </Link>

          <div className="w-8 sm:w-15 h-0.5 bg-pri opacity-30 rounded"></div>

          <Link to="/usuario">
            <img
              className={`w-8 sm:w-10 ${location.pathname === "/usuario" ? "opcaity-80" : "opacity-30"} hover:opacity-50 rounded-full transition-opacity`}
              src={perfil}
              alt="Ícone Usuário"
              title="Usuário"
            />
          </Link>

        </div>
      </div>

      <button id="sidebarpull" aria-label={collapsed ? "Abrir menu lateral" : "Fechar menu lateral"} className="relative -left-2.5 hover:left-0 bg-fundo-razo text-borda font-bold select-none pt-4 pb-4 px-1 rounded-br-[100%] rounded-tr-[100%] text-center cursor-pointer hover:bg-borda hover:text-pri transition-all duration-500 z-[-1]"
        onClick={() => setCollapsed(!collapsed)} >
        <span className={`${collapsed ? "rotate-180" : "rotate-0"} block transition-all duration-500`} >
          <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" />
        </span>
      </button>
    </div>
  );
}

export default SideBar;