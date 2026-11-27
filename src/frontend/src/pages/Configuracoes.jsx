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
import { authApi } from "../services/api";

function lerConfigLocal(chave, valorPadrao) {
    try {
        const bruto = localStorage.getItem(chave);
        if (bruto !== null) {
            return JSON.parse(bruto);
        }
        localStorage.setItem(chave, JSON.stringify(valorPadrao));
        return valorPadrao;
    } catch {
        return valorPadrao;
    }
}

function Configuracoes({
    collapsed,
    setCollapsed,
    corTema: propCorTema,
    setCorTema: propSetCorTema,
    simpleAnims: propSimpleAnims,
    setSimpleAnims: propSetSimpleAnims,
    fontSize: propFontSize,
    setFontSize: propSetFontSize,
}) {
    const [corTemaLocal, setCorTemaLocal] = React.useState(() => lerConfigLocal("corTema", "system"));
    const corTema = propCorTema !== undefined ? propCorTema : corTemaLocal;
    const setCorTema = propSetCorTema || setCorTemaLocal;

    const [notificacoes, setNotificacoes] = React.useState(() => lerConfigLocal("notifications", true));
    const [symbolStatus, setSymbolStatus] = React.useState(() => lerConfigLocal("symbolStatus", true));
    const [simpleAnimsLocal, setSimpleAnimsLocal] = React.useState(() => {
        const val = lerConfigLocal("simpleAnims", false);
        return val === true || val === "true";
    });
    const simpleAnims = propSimpleAnims !== undefined ? propSimpleAnims : simpleAnimsLocal;
    const setSimpleAnims = propSetSimpleAnims || setSimpleAnimsLocal;

    const [fontSizeLocal, setFontSizeLocal] = React.useState(() => lerConfigLocal("fontSize", "default"));
    const fontSize = propFontSize !== undefined ? propFontSize : fontSizeLocal;
    const setFontSize = propSetFontSize || setFontSizeLocal;

    const [isConected, setIsConected] = React.useState(false);

    React.useEffect(() => {
        let ativo = true;
        authApi
            .health()
            .then(() => {
                if (ativo) setIsConected(true);
            })
            .catch(() => {
                if (ativo) setIsConected(false);
            });
        return () => {
            ativo = false;
        };
    }, []);

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
        localStorage.setItem("corTema", JSON.stringify(valor));
    }

    function alterarNotificacoes() {
        const novoValor = !notificacoes;
        setNotificacoes(novoValor);
        localStorage.setItem("notifications", JSON.stringify(novoValor));
    }

    function alterarPreferencia(nome, valor, setter) {
        setter(valor);
        localStorage.setItem(nome, JSON.stringify(valor));
    }

    const texto =
        fontSize === "small"
            ? "text-xs sm:text-sm"
            : fontSize === "large"
              ? "text-base sm:text-lg"
              : "text-sm sm:text-base";

    return (
        <div className="flex z-10 min-h-screen w-full flex-col bg-login bg-cover bg-center justify-center items-center overflow-x-hidden overflow-y-auto">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
            <main
                className={`flex flex-col justify-center w-full min-w-0 min-h-screen px-4 sm:px-12 lg:px-24 pt-6 pb-24 md:py-8 transition-all duration-300 ${
                    !collapsed ? "md:ml-20" : "md:ml-0"
                }`}
            >
                <div className="flex flex-col mb-8 pl-4 gap-2">
                    <div className="flex flex-row gap-3">
                        <Settings className="h-12 w-12 text-pri" />
                        <h1 className="text-3xl font-bold text-pri sm:text-4xl">Configurações</h1>
                    </div>
                    <p className="text-sm text-sec sm:text-base">Personalize sua experiência no sistema.</p>
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

                                <div role="radiogroup" aria-label="Opções de tema" className="flex flex-wrap gap-3">
                                    {temas.map((tema) => {
                                        const selecionado = corTema === tema.value;

                                        return (
                                            <button
                                                key={tema.label}
                                                type="button"
                                                role="radio"
                                                aria-checked={selecionado}
                                                onClick={() => alterarTema(tema.value)}
                                                className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                                                    selecionado
                                                        ? "bg-accent text-white"
                                                        : "bg-fundo-razo text-sec hover:text-pri"
                                                }`}
                                            >
                                                <span>{tema.label}</span>
                                                {selecionado && <Check className="h-4 w-4" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="mt-3 text-xs text-sec">
                                    O tema Sistema utiliza a preferência do dispositivo.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-5 w-5 text-sec" />
                                        <div>
                                            <label htmlFor="cfg-notificacoes" className="cursor-pointer font-semibold text-pri">
                                                Notificações
                                            </label>
                                            <p className="text-xs text-sec">Receber notificações do sistema.</p>
                                        </div>
                                    </div>

                                    <input
                                        id="cfg-notificacoes"
                                        type="checkbox"
                                        checked={notificacoes}
                                        onChange={alterarNotificacoes}
                                        className="h-5 w-5 cursor-pointer checkbox rounded border-2 border-borda/60 bg-fundo-razo text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                    />
                                </div>

                                <Link
                                    to="/usuario"
                                    className="group mt-2 flex items-center justify-between gap-4 rounded-xl bg-fundo-razo p-4 text-pri transition-all duration-300 hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
                                        <label htmlFor="cfg-simbolos" className="cursor-pointer font-semibold text-pri">
                                            Símbolos nos status
                                        </label>
                                        <p className="text-xs text-sec">Exibe símbolos junto aos status dos chamados.</p>
                                    </div>
                                </div>

                                <input
                                    id="cfg-simbolos"
                                    type="checkbox"
                                    checked={symbolStatus}
                                    onChange={() => alterarPreferencia("symbolStatus", !symbolStatus, setSymbolStatus)}
                                    className="h-5 w-5 cursor-pointer checkbox rounded border-2 border-borda/60 bg-fundo-razo text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-5 w-5 shrink-0 text-sec" />
                                    <div>
                                        <label htmlFor="cfg-animacoes" className="cursor-pointer font-semibold text-pri">
                                            Reduzir animações
                                        </label>
                                        <p className="text-xs text-sec">
                                            Reduz ou desativa animações e transições visuais na interface.
                                        </p>
                                    </div>
                                </div>

                                <input
                                    id="cfg-animacoes"
                                    type="checkbox"
                                    checked={simpleAnims}
                                    onChange={() => alterarPreferencia("simpleAnims", !simpleAnims, setSimpleAnims)}
                                    className="h-5 w-5 cursor-pointer checkbox rounded border-2 border-borda/60 bg-fundo-razo text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                />
                            </div>

                            <div>
                                <div className="mb-3 flex items-center gap-3">
                                    <Type className="h-5 w-5 text-sec" />
                                    <span className="font-semibold text-pri">Tamanho da fonte</span>
                                </div>

                                <div role="group" aria-label="Opções de tamanho da fonte" className="grid grid-cols-3 gap-2">
                                    {tamanhosFonte.map((tamanho) => (
                                        <button
                                            key={tamanho.value}
                                            type="button"
                                            aria-pressed={fontSize === tamanho.value}
                                            onClick={() => alterarPreferencia("fontSize", tamanho.value, setFontSize)}
                                            className={`rounded-xl px-2 py-3 cursor-pointer font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                                                fontSize === tamanho.value
                                                    ? "bg-accent text-white"
                                                    : "bg-fundo-razo text-sec hover:text-pri"
                                            }`}
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
                                <span className="font-medium text-pri">1.0.0</span>
                            </div>

                            <div className="flex items-center justify-between gap-4 border-b border-borda/20 py-4">
                                <span className="text-sec">Última atualização</span>
                                <span className="font-medium text-pri">{ultimaAtualizacao}</span>
                            </div>

                            <div className="flex items-center justify-between gap-4 py-4">
                                <span className="text-sec">Conexão</span>
                                <div
                                    className={`flex items-center gap-2 font-medium transition-all duration-200 ${
                                        isConected ? "text-sec-verde" : "text-sec-vermelho"
                                    }`}
                                >
                                    <span
                                        className={`h-3 w-3 rounded-full ${
                                            isConected ? "bg-sec-verde" : "bg-sec-vermelho"
                                        }`}
                                    />
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
