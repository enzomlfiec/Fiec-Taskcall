import taskcall from "../assets/img/taskcall.png";
import home from "../assets/img/home.png";
import configuracao from "../assets/img/configuracao.png";
import perfil from "../assets/img/perfil.png";
import React from "react";
import { ChevronLeft, Inbox, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SideBar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { usuario } = useAuth();
  const isAdminTi = usuario?.perfil === "ti" && Boolean(usuario?.is_admin_ti);
  const fotoUsuario = usuario?.foto_perfil_url || perfil;

  const linkClass = (ativo) =>
    `flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl min-w-14 md:min-w-0 md:p-1.5 md:rounded-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
      ativo
        ? "bg-accent/15 text-pri md:bg-transparent"
        : "text-sec hover:bg-fundo-medio/60 md:hover:bg-transparent"
    }`;

  return (
    <nav
      aria-label="Navegação principal"
      className={`select-none fixed z-50 bottom-3 left-3 right-3 mx-auto max-w-md md:mx-0 md:max-w-none md:top-0 md:bottom-auto md:left-0 md:right-auto md:h-screen flex flex-row items-center transition-transform duration-300 ${
        collapsed ? "md:-translate-x-20" : "md:translate-x-0"
      }`}
    >
      <div className="w-full h-16 px-2 rounded-2xl bg-fundo-razo/95 backdrop-blur-md border border-borda/25 shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex flex-row items-center justify-around gap-1 md:w-20 md:h-full md:px-0 md:pb-5 md:rounded-none md:rounded-r-3xl md:border-0 md:shadow-none md:bg-fundo-razo md:backdrop-blur-none md:flex-col md:justify-between overflow-hidden">
        <div className="contents md:flex md:flex-col md:items-center md:gap-5">
          <img
            className="hidden md:block w-14 opacity-50 mt-5 in-[.claro]:invert in-[.claro]:opacity-50"
            src={taskcall}
            alt="Logo Taskcall"
            title="Taskcall"
          />

          <div className="hidden md:block w-14 h-0.5 bg-pri opacity-30 rounded" />

          <Link
            to="/tela-principal"
            aria-label="Tela Principal"
            aria-current={location.pathname === "/tela-principal" ? "page" : undefined}
            className={linkClass(location.pathname === "/tela-principal")}
          >
            <img
              className={`w-6 h-6 md:w-10 md:h-10 ${
                location.pathname === "/tela-principal" ? "opacity-90" : "opacity-40 md:opacity-30"
              } hover:opacity-70 transition-opacity sidebar-icon`}
              src={home}
              alt="Ícone casa - início"
              title="Tela Principal"
            />
            <span
              className={`text-[11px] font-semibold leading-none md:hidden ${
                location.pathname === "/tela-principal" ? "text-pri" : "text-sec"
              }`}
            >
              Início
            </span>
          </Link>

          <div className="hidden md:block w-14 h-0.5 bg-pri opacity-30 rounded" />

          <Link
            to="/inbox"
            aria-label="Inbox de chamados"
            aria-current={location.pathname === "/inbox" ? "page" : undefined}
            className={linkClass(location.pathname === "/inbox")}
          >
            <Inbox
              aria-hidden="true"
              className={`w-6 h-6 md:w-10 md:h-10 text-pri ${
                location.pathname === "/inbox" ? "opacity-90" : "opacity-40 md:opacity-30"
              } hover:opacity-70 transition-opacity`}
              title="Inbox"
            />
            <span
              className={`text-[11px] font-semibold leading-none md:hidden ${
                location.pathname === "/inbox" ? "text-pri" : "text-sec"
              }`}
            >
              Inbox
            </span>
          </Link>

          <div className="hidden md:block w-14 h-0.5 bg-pri opacity-30 rounded" />

          {isAdminTi && (
            <>
              <Link
                to="/usuarios"
                aria-label="Gerenciar usuários e perfis"
                aria-current={location.pathname === "/usuarios" ? "page" : undefined}
                className={linkClass(location.pathname === "/usuarios")}
              >
                <Users
                  aria-hidden="true"
                  className={`w-6 h-6 md:w-9 md:h-9 text-pri ${
                    location.pathname === "/usuarios" ? "opacity-90" : "opacity-40 md:opacity-30"
                  } hover:opacity-70 transition-opacity`}
                  title="Usuários"
                />
                <span
                  className={`text-[11px] font-semibold leading-none md:hidden ${
                    location.pathname === "/usuarios" ? "text-pri" : "text-sec"
                  }`}
                >
                  Usuários
                </span>
              </Link>
              <div className="hidden md:block w-14 h-0.5 bg-pri opacity-30 rounded" />
            </>
          )}
        </div>

        <div className="contents md:flex md:flex-col md:items-center md:gap-5">
          <div className="hidden md:block w-14 h-0.5 bg-pri opacity-30 rounded" />

          <Link
            to="/configuracoes"
            aria-label="Configurações"
            aria-current={location.pathname === "/configuracoes" ? "page" : undefined}
            className={linkClass(location.pathname === "/configuracoes")}
          >
            <img
              className={`w-6 h-6 md:w-10 md:h-10 ${
                location.pathname === "/configuracoes" ? "opacity-90" : "opacity-40 md:opacity-30"
              } hover:opacity-70 transition-opacity sidebar-icon`}
              src={configuracao}
              alt="Ícone Configurações"
              title="Configurações"
            />
            <span
              className={`text-[11px] font-semibold leading-none md:hidden ${
                location.pathname === "/configuracoes" ? "text-pri" : "text-sec"
              }`}
            >
              Config.
            </span>
          </Link>

          <div className="hidden md:block w-14 h-0.5 bg-pri opacity-30 rounded" />

          <Link
            to="/usuario"
            aria-label="Perfil do Usuário"
            aria-current={location.pathname === "/usuario" ? "page" : undefined}
            className={linkClass(location.pathname === "/usuario")}
          >
            <img
              className={`w-6 h-6 md:w-10 md:h-10 object-cover ${
                location.pathname === "/usuario" ? "opacity-95 ring-2 ring-accent/70 md:ring-0" : "opacity-50 md:opacity-30"
              } hover:opacity-75 rounded-full transition-opacity`}
              src={fotoUsuario}
              alt="Ícone Usuário"
              title="Usuário"
              onError={(e) => {
                e.currentTarget.src = perfil;
              }}
            />
            <span
              className={`text-[11px] font-semibold leading-none md:hidden ${
                location.pathname === "/usuario" ? "text-pri" : "text-sec"
              }`}
            >
              Perfil
            </span>
          </Link>
        </div>
      </div>

      <button
        id="sidebarpull"
        type="button"
        aria-label={collapsed ? "Abrir menu lateral" : "Fechar menu lateral"}
        className="hidden md:block relative -left-2.5 hover:left-0 bg-fundo-razo text-borda font-bold select-none pt-4 pb-4 px-1 rounded-br-[100%] rounded-tr-[100%] text-center cursor-pointer hover:bg-borda hover:text-pri transition-all duration-500 z-[-1] focus-visible:outline-2 focus-visible:outline-accent"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className={`${collapsed ? "rotate-180" : "rotate-0"} block transition-all duration-500`}>
          <ChevronLeft className="w-8 h-8" />
        </span>
      </button>
    </nav>
  );
}

export default SideBar;
