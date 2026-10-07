import React from "react";
import { UserRound, Mail, Phone, ShieldCheck, Settings, ChevronRight, X } from "lucide-react";
import SideBar from "../SideBar";
import perfil from "../../assets/img/perfil.png";
import { Link } from "react-router-dom";

function InfoUsuario({ collapsed, setCollapsed }) {
    const [floating, setFloating] = React.useState(false)
    const [foto, setFoto] = React.useState(perfil)
    const dadosPessoaisMock = [
        { label: "Nome", value: "Nome do Usuário" },
        { label: "Matrícula", value: "S1337" },
        { label: "E-mail", value: "natanbobao@fiec.edu.br" },
        { label: "Telefone", value: "(19) 99999-9999" },
    ];
    const informacoesContaMock = [
        { label: "Tipo de acesso", value: "Debug" },
        { label: "Data de cadastro", value: "12/08/2025" },
        { label: "Último acesso", value: "06/10/2026 18:32" },
        { label: "Status", value: "Não Ativo", status: false },
    ];

    return (
        <>
            <div className="flex z-10 min-h-screen w-full bg-[url(public/assets/login2.png)] bg-cover bg-center justify-center items-stretch overflow-x-hidden overflow-y-auto">
                <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
                <main
                    className={`w-full min-w-0 min-h-screen px-4 sm:px-6 lg:px-10 py-8 transition-all duration-300 ${!collapsed ? "ml-16 sm:ml-20" : "ml-0"
                        }`}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <UserRound className="w-12 h-12 text-pri" />

                        <div className="flex flex-col">
                            <h1 className="text-pri text-3xl sm:text-4xl font-bold">Meu Perfil</h1>
                            <p className="text-sec text-sm sm:text-base">
                                Visualize suas informações pessoais.
                            </p>
                        </div>
                    </div>

                    <section className="w-full flex flex-col sm:flex-row items-center sm:items-center gap-6 bg-fundo-medio/80 border-2 border-borda/30 rounded-3xl p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:brightness-110">
                        <div className="flex shrink-0 items-center justify-center w-32 h-32 rounded-full bg-fundo-medio border-2 hover:brightness-150 transition-all duration-300 cursor-pointer p-2 border-borda shadow-lg"
                            onClick={(() => { setFloating(true) })}
                        >
                            <img
                                className=" shrink-0 rounded-full transition-opacity"
                                src={foto}
                                alt="Ícone do usuário" />
                        </div>

                        <div className="flex flex-col gap-2 flex-1 text-center sm:text-left">
                            <h2 className="text-pri text-2xl font-bold">Usuário S1337</h2>
                            <p className="text-sec text-lg">Técnico em Informática</p>

                            <div className="flex justify-center sm:justify-start mt-1">
                                <span className="flex items-center gap-2 bg-sec-verde/20 text-pri rounded-lg px-3 py-1 text-sm font-semibold">
                                    <div className="relative flex flex-row">
                                        <span className="absolute inset-0 w-3 h-3 rounded-full animate-ping-m opacity-50 bg-sec-verde" />
                                        <span className="w-3 h-3 rounded-full bg-sec-verde" />
                                    </div>
                                    Ativo
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2">
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-sec">
                                    <Mail className="w-5 h-5" />
                                    natanbobao@fiec.edu.br
                                </div>

                                <div className="flex items-center justify-center sm:justify-start gap-2 text-sec">
                                    <Phone className="w-5 h-5" />
                                    (19) 99999-9999
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                        <article className="bg-fundo-medio/80 border-2 border-borda/30 rounded-3xl p-6 transition-all duration-300 hover:brightness-110">
                            <div className="flex items-center gap-3 mb-6">
                                <UserRound className="w-7 h-7 text-pri" />
                                <h2 className="text-pri text-xl font-bold">Dados pessoais</h2>
                            </div>

                            <div className="flex flex-col">
                                {dadosPessoaisMock.map((item) => (
                                    <div
                                        key={item.label}
                                        className={`flex justify-between items-center py-4 ${item.label !== "Telefone" ? "border-b border-borda/20" : ""
                                            }`}
                                    >
                                        <span className="text-sec">{item.label}</span>
                                        <span className="text-pri font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="bg-fundo-medio/80 border-2 border-borda/30 rounded-3xl p-6 transition-all duration-300 hover:brightness-110">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="w-7 h-7 text-pri" />
                                <h2 className="text-pri text-xl font-bold">Informações da conta</h2>
                            </div>

                            <div className="flex flex-col">
                                {informacoesContaMock.map((item) => (
                                    <div
                                        key={item.label}
                                        className={`flex justify-between items-center py-4 ${item.label !== "Status" ? "border-b border-borda/20" : ""
                                            }`}
                                    >
                                        <span className="text-sec">{item.label}</span>

                                        {item.status ? (
                                            <span className="flex items-center gap-2 text-pri font-medium">
                                                <span className="w-3 h-3 rounded-full bg-sec-verde" />
                                                {item.value}
                                            </span>
                                        ) : (
                                            <span className="text-pri font-medium">{item.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </article>
                    </section>

                    <button
                        type="button"
                        className="group w-full flex items-center  justify-between gap-5 mt-5 p-5 text-left bg-fundo-medio/80 border-2 border-borda/30 rounded-3xl text-pri cursor-pointer transition-all duration-300 hover:brightness-125 hover:border-borda/60"
                    >
                        <Link to="/configuracoes">
                            <div className="flex flex-row gap-5">

                                <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-accent transition-all duration-300 group-hover:opacity-50">
                                    <Settings className="w-7 h-7 transition-transform duration-300 group-hover:rotate-90" />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-lg font-bold">Configurações</span>
                                    <span className="text-sec text-sm">
                                        Ajuste suas configurações de conta e sistema.
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <ChevronRight className="w-7 h-7 text-borda transition-all duration-300 group-hover:text-pri group-hover:translate-x-1" />
                    </button>
                </main>
            </div >
            <div
                id="floatingWindowUserImage"
                className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-[opacity,backdrop-filter] duration-500 ${floating ? "opacity-100 pointer-events-auto backdrop-blur-[3px]" : "pointer-events-none opacity-0"
                    }`}
                onClick={() => setFloating(false)}
            >
                <div className="flex flex-col items-end">
                    <button
                        type="button"
                        className="mb-2 relative left-10 flex items-center justify-center w-8 h-8 rounded-full bg-fundo-razo/50 text-white hover:brightness-150 cursor-pointer"
                        onClick={() => setFloating(false)}
                        aria-label="Fechar imagem do perfil"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div id="imagem">
                        <img
                            className="shrink-0 w-[20vw] min-w-55 aspect-square rounded-lg bg-fundo-razo object-cover"
                            src={foto}
                            alt="Ícone do usuário"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default InfoUsuario;