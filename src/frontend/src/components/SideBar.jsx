import taskcall from "../assets/taskcall.png";
import home from "../assets/home.png";
import vector from "../assets/vector.png";
import vector2 from "../assets/vector2.png";
import configuracao from "../assets/configuracao.png";
import perfil from "../assets/perfil.png";
import { Link } from "react-router-dom";
import React from "react";

function SideBar({collapsed,setCollapsed}) {



  return (
    <div className={`h-screen z-5 flex flex-row align-middle items-center justify-baseline ${collapsed ? "absolute -left-20" : "absolute left-0"} transition-[left] duration-300`}>
      <div className="w-20 h-full bg-fundo-razo rounded-r-3xl flex flex-col items-center justify-between pb-5 overflow-hidden">

        {/* parte superior */}

        <div className="flex flex-col items-center gap-5 h-full justify-between">

          <img
            className="w-16 opacity-30 mt-5"
            src={taskcall}
            alt="Logo Taskcall"
          />

          <div className="w-24 h-0.5 bg-cl-razo opacity-30 rounded"></div>

          <Link to="/tela-principal">
            <img
              className="w-10 opacity-30 hover:opacity-50 transition-opacity"
              src={home}
              alt="Ícone casa - início"
            />
          </Link>

          <button className="w-10 h-0.5 bg-cl-razo opacity-30 rounded"></button>

          <Link to="/inbox">
            <img
              className="w-10 opacity-30 hover:opacity-50 transition-opacity"
              src={vector}
              alt="Ícone Inbox"
            />
          </Link>

          <div className="w-10 h-0.5 bg-cl-razo opacity-30 rounded"></div>

          <Link to="/chamados">
            <img
              className="w-10 opacity-30 hover:opacity-50 transition-opacity"
              src={vector2}
              alt="Ícone Chamados"
            />
          </Link>

          <div className="w-10 h-0.5 bg-cl-razo opacity-30 rounded"></div>

        </div>

        <div className="h-[50%]"></div>

        {/* parte inferior */}

        <div className="flex flex-col items-center gap-5">

          <div className="w-10 h-5bg-cl-razo opacity-30 rounded"></div>

          <Link to="/configuracoes">
            <img
              className="w-10 opacity-30 hover:opacity-50 transition-opacity"
              src={configuracao}
              alt="Ícone Configurações"
            />
          </Link>

          <div className="w-10 h-0.5 bg-cl-razo opacity-30 rounded"></div>

          <Link to="/usuario">
            <img
              className="w-10 opacity-30 hover:opacity-50 transition-opacity"
              src={perfil}
              alt="Ícone Usuário"
            />
          </Link>

        </div>
      </div>
      <div id="sidebarpull" className={`bg-fundo-razo text-5xl text-borda font-bold select-none pt-5 pb-5 rounded-br-4xl rounded-tr-4xl text-center align-middle leading-loose cursor-pointer hover:bg-borda transition-all duration-300 hover:text-white`}
        onClick={() => {setCollapsed(!collapsed)}}
      ><p className={`${!collapsed? "rotate-180":"rotate-0"} transition-all duration-500`}>
        ➡️
          
        </p></div>
    </div>
  );
}

export default SideBar;