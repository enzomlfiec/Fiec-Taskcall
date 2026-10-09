import React from "react";
import {
    Settings,
    Palette,
    Info,
    Bell,
    UserRound,
    ChevronRight,
    Check,
    Type,
    Sparkles,
    PersonStanding,
    CircleDashedCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";
import ELSD from "../assets/scripts/ELSD";

function Configuracoes({ collapsed, setCollapsed }) {
    const [corTema, setCorTema] = React.useState(() => ELSD.read("corTema", "system"));
    const [notificacoes, setNotificacoes] = React.useState(() => ELSD.read("notifications", true));
    const [symbolStatus, setSymbolStatus] = React.useState(() => ELSD.read("symbolStatus", true));
    const [simpleAnims, setSimpleAnims] = React.useState(() => ELSD.read("simpleAnims", false));
    const [fontSize, setFontSize] = React.useState(() => ELSD.read("fontSize", "default"));
    const [isConected, setIsConected] = React.useState(true);

    const ultimaAtualizacao = new Date().toLocaleDateString("pt-BR");

    const temas = [
        { label: "Claro", value: true },
        { label: "Escuro", value: false },
        { label: "Sistema", value: "system" },
    ];

    const tamanhosFonte = [
        { label: "A-", value: "small" },
        { label: "Padrão", value: "default" },
        { label: "A+", value: "large" },
    ];

    function alterarTema(valor) {
        setCorTema(valor);
        ELSD.write("corTema", valor);
    }

    function alterarNotificacoes() {
        const novoValor = !notificacoes;
        setNotificacoes(novoValor);
        ELSD.write("notifications", novoValor);
    }

    function alterarPreferencia(nome, valor, setter) {
        setter(valor);
        ELSD.write(nome, valor);
    }

    const texto = fontSize === "small" ? "text-xs sm:text-sm" : fontSize === "large" ? "text-base sm:text-lg" : "text-sm sm:text-base";

    return (
        <div className="flex z-10 min-h-screen w-full bg-[url(public/assets/login2.png)] bg-cover bg-center justify-center items-stretch overflow-x-hidden overflow-y-auto">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

            <main className={`w-full min-w-0 min-h-screen px-4 sm:px-6 lg:px-10 py-8 transition-all duration-300 ${!collapsed ? "ml-16 sm:ml-20" : "ml-0"}`}>
                <div className="mb-8 flex items-center gap-4">
                    <Settings className="h-12 w-12 text-pri" />
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-pri sm:text-4xl">Configurações</h1>
                        <p className="text-sm text-sec sm:text-base">Personalize sua experiência no sistema.</p>
                    </div>
                </div>

                <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <article className="lg:col-span-2 rounded-3xl border border-borda/30 bg-fundo-medio/80 p-6 transition-all duration-300 hover:brightness-110">
                        <div className="mb-6 flex items-center gap-3">
                            <Settings className="h-7 w-7 text-pri" />
                            <h2 className="text-xl font-bold text-pri">Geral</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <Palette className="h-5 w-5 text-sec" />
                                    <span className="font-semibold text-pri">Tema</span>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {temas.map((tema) => {
                                        const selecionado = corTema === tema.value;

                                        return (
                                            <button
                                                key={tema.label}
                                                type="button"
                                                role="radio"
                                                aria-checked={selecionado}
                                                onClick={() => alterarTema(tema.value)}
                                                className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all duration-200 ${selecionado ? "bg-accent text-pri" : "bg-fundo-razo text-sec hover:text-pri"}`}
                                            >
                                                <span>{tema.label}</span>
                                                {selecionado && <Check className="h-4 w-4" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="mt-3 text-xs text-sec">O tema Sistema utiliza a preferência do dispositivo.</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-5 w-5 text-sec" />
                                        <div>
                                            <p className="font-semibold text-pri">Notificações</p>
                                            <p className="text-xs text-sec">Receber notificações do sistema.</p>
                                        </div>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={notificacoes}
                                        onChange={alterarNotificacoes}
                                        className="h-5 w-5 cursor-pointer checkbox rounded border-2 border-borda/60 bg-fundo-razo text-accent focus:ring-0"
                                    />
                                </div>

                                <Link
                                    to="/usuario"
                                    className="group mt-2 flex items-center justify-between gap-4 rounded-xl bg-fundo-razo p-4 text-pri transition-all duration-300 hover:brightness-125"
                                >
                                    <div className="flex items-center gap-3">
                                        <UserRound className="h-6 w-6 text-sec" />
                                        <div>
                                            <p className="font-bold">Configurações de Conta</p>
                                            <p className="text-xs text-sec">Visualize as informações do seu usuário.</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-6 w-6 text-borda transition-all duration-300 group-hover:translate-x-1 group-hover:text-pri" />
                                </Link>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-3xl border border-borda/30 bg-fundo-medio/80 p-6 transition-all duration-300 hover:brightness-110">
                        <div className="mb-6 flex items-center gap-3">
                            <PersonStanding className="h-7 w-7 text-pri" />
                            <h2 className="text-xl font-bold text-pri">Acessibilidade</h2>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <CircleDashedCheck className="h-5 w-5 shrink-0 text-sec" />
                                    <div>
                                        <p className="font-semibold text-pri">Símbolos nos status</p>
                                        <p className="text-xs text-sec">Exibe símbolos junto aos status dos chamados.</p>
                                    </div>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={symbolStatus}
                                    onChange={() => alterarPreferencia("symbolStatus", !symbolStatus, setSymbolStatus)}
                                    className="h-5 w-5 cursor-pointer checkbox  rounded border-2 border-borda/60 bg-fundo-razo text-accent focus:ring-0"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-5 w-5 shrink-0 text-sec" />
                                    <div>
                                        <p className="font-semibold text-pri">Reduzir animações</p>
                                        <p className="text-xs text-sec">A configuração fica salva, mas não altera a interface.</p>
                                    </div>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={simpleAnims}
                                    onChange={() => alterarPreferencia("simpleAnims", !simpleAnims, setSimpleAnims)}
                                    className="h-5 w-5 cursor-pointer checkbox  rounded border-2 border-borda/60 bg-fundo-razo text-accent focus:ring-0"
                                />
                            </div>

                            <div>
                                <div className="mb-3 flex items-center gap-3">
                                    <Type className="h-5 w-5 text-sec" />
                                    <span className="font-semibold text-pri">Tamanho da fonte</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {tamanhosFonte.map((tamanho) => (
                                        <button
                                            key={tamanho.value}
                                            type="button"
                                            aria-pressed={fontSize === tamanho.value}
                                            onClick={() => alterarPreferencia("fontSize", tamanho.value, setFontSize)}
                                            className={`rounded-xl px-2 py-3 cursor-pointer font-semibold transition-all duration-200 ${fontSize === tamanho.value ? "bg-accent text-pri" : "bg-fundo-razo text-sec hover:text-pri"}`}
                                        >
                                            {tamanho.label}
                                        </button>
                                    ))}
                                </div>
                                <p className={`mt-3 text-sec ${texto}`}>Exemplo de texto com o tamanho selecionado.</p>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-3xl border border-borda/30 bg-fundo-medio/80 p-6 transition-all duration-300 hover:brightness-110">
                        <div className="mb-6 flex items-center gap-3">
                            <Info className="h-7 w-7 text-pri" />
                            <h2 className="text-xl font-bold text-pri">Informações do sistema</h2>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center justify-between gap-4 border-b border-borda/20 py-4">
                                <span className="text-sec">Versão do sistema</span>
                                <span className="font-medium text-pri">0.0.0</span>
                            </div>

                            <div className="flex items-center justify-between gap-4 border-b border-borda/20 py-4">
                                <span className="text-sec">Última atualização</span>
                                <span className="font-medium text-pri">{ultimaAtualizacao}</span>
                            </div>

                            <div className="flex items-center justify-between gap-4 py-4">
                                <span className="text-sec">Conexão</span>
                                <div
                                    // type="button"
                                    // onClick={() => setIsConected(!isConected)}
                                    className={`flex items-center cursor-pointer gap-2 font-medium transition-all duration-200 hover:brightness-125 ${isConected ? "text-sec-verde" : "text-sec-vermelho"}`}
                                >
                                    <span className={`h-3 w-3 rounded-full ${isConected ? "bg-sec-verde" : "bg-sec-vermelho"}`} />
                                    {isConected ? "Online" : "Offline"}
                                </div>
                            </div>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}

export default Configuracoes;
