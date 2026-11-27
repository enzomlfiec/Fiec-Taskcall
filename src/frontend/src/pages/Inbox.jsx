import SideBar from "../components/SideBar";
import Filtros from "../components/Chamado/Inbox/Filtros";
import LayoutUsuario from "../components/LayoutUsuario";
import React from "react";
import { ChevronDown, Inbox as InboxIcon, Minus, Plus, SlidersHorizontal, Trash2, X } from "lucide-react";
import ChamadoBullet from "../components/Chamado/Inbox/ChamadoBullet";
import { Link } from "react-router-dom";
import { alertaAviso } from "../utils/alertaSite";
import { chamadosApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
    PRIORIDADE_META,
    adaptarChamadoApi,
    alternarFavoritoUsuario,
    lerFavoritosUsuario,
} from "../utils/chamadoAdapter";

const camposDeBusca = [
    { campo: "nome", label: "Usuário", placeholder: "Nome do usuário" },
    { campo: "titulo", label: "Título", placeholder: "Título do chamado" },
    { campo: "id", label: "Número do chamado", placeholder: "Número" },
    { campo: "sala", label: "Sala", placeholder: "Número da sala" },
    { campo: "categoria", label: "Categoria", placeholder: "Categoria" },
    { campo: "dispositivo", label: "Dispositivo", placeholder: "Dispositivo" },
    { campo: "descricao", label: "Descrição", placeholder: "Descrição" },
    { campo: "cargo", label: "Cargo", placeholder: "Cargo" },
];

const Inbox = ({ collapsed, setCollapsed }) => {
    const { usuario } = useAuth();
    const [checkedInboxes, setCheckedInboxes] = React.useState([]);
    const [dataDe, setDataDe] = React.useState("");
    const [dataA, setDataA] = React.useState("");
    const [buscas, setBuscas] = React.useState({});
    const [filtrosDeBuscaAtivos, setFiltrosDeBuscaAtivos] = React.useState(["nome"]);
    const [menuFiltrosAberto, setMenuFiltrosAberto] = React.useState(false);
    const [filtrosMobileAbertos, setFiltrosMobileAbertos] = React.useState(false);
    const [incluirRecusados, setIncluirRecusados] = React.useState(false);
    const [chamados, setChamados] = React.useState([]);
    const [carregando, setCarregando] = React.useState(true);
    const [erroCarga, setErroCarga] = React.useState("");
    const [filtrosSelecionados, setFiltrosSelecionados] = React.useState([]);
    const [ordenacao, setOrdenacao] = React.useState({
        campo: "data",
        direcao: "desc",
    });

    const podeAbrirChamado = usuario?.perfil === "usuario" || usuario?.perfil === "coordenador";

    const carregarChamados = React.useCallback(async () => {
        setCarregando(true);
        setErroCarga("");
        try {
            const lista = await chamadosApi.listar(
                incluirRecusados ? { incluir_recusados: 1 } : {}
            );
            const favSet = new Set(lerFavoritosUsuario(usuario?.id_usuario));
            const adaptados = Array.isArray(lista)
                ? lista.map((item) => adaptarChamadoApi(item, favSet))
                : [];
            setChamados(adaptados);
        } catch (err) {
            setErroCarga(err.message || "Não foi possível carregar os chamados.");
        } finally {
            setCarregando(false);
        }
    }, [incluirRecusados, usuario?.id_usuario]);

    React.useEffect(() => {
        carregarChamados();
    }, [carregarChamados]);

    const colunas = [
        { campo: "nome", label: "Nome", visibilidade: "" },
        { campo: "titulo", label: "Título", visibilidade: "hidden lg:block" },
        { campo: "categoria", label: "Categoria", visibilidade: "hidden sm:block" },
        { campo: "sala", label: "Sala", visibilidade: "hidden md:block" },
        { campo: "data", label: "Data", visibilidade: "hidden xl:block" },
    ];

    const totalFiltrosAtivos =
        filtrosSelecionados.length +
        (dataDe ? 1 : 0) +
        (dataA ? 1 : 0) +
        (incluirRecusados ? 1 : 0) +
        Object.values(buscas).filter((v) => v && v.trim() !== "").length;

    function ordenarPor(campo) {
        setOrdenacao((atual) => ({
            campo,
            direcao: atual.campo === campo && atual.direcao === "desc" ? "asc" : "desc",
        }));
    }

    function atualizarBusca(campo, valor) {
        setBuscas((buscasAtuais) => ({ ...buscasAtuais, [campo]: valor }));
    }

    function adicionarFiltro(campo) {
        setFiltrosDeBuscaAtivos((filtrosAtuais) => [...filtrosAtuais, campo]);
        setMenuFiltrosAberto(false);
    }

    function removerFiltro(campo) {
        setFiltrosDeBuscaAtivos((filtrosAtuais) =>
            filtrosAtuais.filter((filtro) => filtro !== campo)
        );
        setBuscas((buscasAtuais) => {
            const novasBuscas = { ...buscasAtuais };
            delete novasBuscas[campo];
            return novasBuscas;
        });
    }

    function handleToggleFavorito(codChamado) {
        if (!usuario?.id_usuario) return;
        const atualizados = alternarFavoritoUsuario(usuario.id_usuario, codChamado);
        const favSet = new Set(atualizados);
        setChamados((listaAtual) =>
            listaAtual.map((item) => ({
                ...item,
                salvo: favSet.has(Number(item.id)),
            }))
        );
    }

    function handleChamadoAtualizado(chamadoBrutoAtualizado) {
        if (!chamadoBrutoAtualizado) {
            carregarChamados();
            return;
        }
        const favSet = new Set(lerFavoritosUsuario(usuario?.id_usuario));
        const adaptado = adaptarChamadoApi(chamadoBrutoAtualizado, favSet);

        setChamados((listaAtual) => {
            if (!incluirRecusados && adaptado.triagem_status === "recusado") {
                return listaAtual.filter((c) => Number(c.id) !== Number(adaptado.id));
            }
            const existe = listaAtual.some((c) => Number(c.id) === Number(adaptado.id));
            if (!existe) return [adaptado, ...listaAtual];
            return listaAtual.map((c) => (Number(c.id) === Number(adaptado.id) ? adaptado : c));
        });
    }

    async function acaoSelecaoEmLote() {
        const qtd = checkedInboxes.length;
        if (qtd === 0) return;

        await alertaAviso({
            title: "Exclusão física desabilitada",
            text: "Conforme as regras institucionais do TaskCall, chamados não podem ser excluídos definitivamente do histórico. Para solicitações improcedentes, a coordenação pode registrar a recusa individual na triagem do chamado.",
            confirmButtonText: "Entendi",
        });
        setCheckedInboxes([]);
    }

    const chamadosFiltrados = chamados.filter((chamado) => {
        if (filtrosSelecionados.length > 0) {
            const passouNosFiltros = filtrosSelecionados.some((filtro) => {
                if (filtro === "favoritos") return chamado.salvo === true;
                if (filtro === "emAnalise") return chamado.status === "emAnalise";
                if (filtro === "naoVisualizado") return chamado.status === "naoVisualizado";
                if (filtro === "emProgresso") return chamado.status === "emProgresso";
                if (filtro === "resolvido") return chamado.status === "resolvido";
                if (filtro === "urgentes") {
                    return Boolean(PRIORIDADE_META[chamado.prioridade]?.urgente);
                }
                return true;
            });
            if (!passouNosFiltros) return false;
        }

        const passouNasBuscas = filtrosDeBuscaAtivos.every((campo) => {
            const busca = buscas[campo]?.trim().toLowerCase();
            if (!busca) return true;

            return String(chamado[campo] ?? "")
                .toLowerCase()
                .includes(busca);
        });
        if (!passouNasBuscas) {
            return false;
        }

        if (dataDe !== "" || dataA !== "") {
            const dataChamado = chamado.dataIsoDia;
            if (dataChamado) {
                if (dataDe !== "" && dataChamado < dataDe) return false;
                if (dataA !== "" && dataChamado > dataA) return false;
            }
        }

        return true;
    });

    const chamadosOrdenados = [...chamadosFiltrados].sort((a, b) => {
        const valorA =
            ordenacao.campo === "data" ? a.dataTimestamp : a[ordenacao.campo];
        const valorB =
            ordenacao.campo === "data" ? b.dataTimestamp : b[ordenacao.campo];
        const comparacao =
            typeof valorA === "number" && typeof valorB === "number"
                ? valorA - valorB
                : String(valorA ?? "").localeCompare(String(valorB ?? ""), "pt-BR", {
                      numeric: true,
                      sensitivity: "base",
                  });

        return ordenacao.direcao === "asc" ? comparacao : -comparacao;
    });

    return (
        <div className="flex flex-col lg:flex-row z-10 min-h-screen lg:h-screen w-full bg-fundo-fundo bg-cover bg-center items-stretch overflow-x-hidden lg:overflow-hidden">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div
                className={`flex flex-1 min-w-0 flex-col lg:flex-row transition-all duration-300 ${
                    !collapsed ? "md:ml-20" : "md:ml-0"
                } pb-24 md:pb-6 lg:pb-0`}
            >
                <aside
                    id="inbox-filtros-aside"
                    className={`${
                        filtrosMobileAbertos ? "flex" : "hidden"
                    } lg:flex order-2 lg:order-1 w-full lg:w-76 xl:w-88 shrink-0 lg:h-full bg-fundo-medio/40 lg:bg-fundo-fundo border-y lg:border-y-0 lg:border-r border-borda/35 lg:rounded-r-3xl flex-col items-center py-4 lg:py-6 gap-4 lg:overflow-y-auto scroll`}
                >
                    {podeAbrirChamado && (
                        <Link
                            to="/inbox/criacaochamado"
                            className="hidden lg:block w-full px-5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                            <div className="flex w-full justify-center items-center">
                                <span className="flex items-center justify-center w-full h-13 bg-accent px-6 rounded-xl shadow-[0px_5px_0px_0px_#740510] transition-transform duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] text-white text-xl font-bold">
                                    Escrever
                                </span>
                            </div>
                        </Link>
                    )}

                    <Filtros
                        filtrosSelecionados={filtrosSelecionados}
                        setFiltrosSelecionados={setFiltrosSelecionados}
                    />

                    {usuario?.perfil === "coordenador" && (
                        <div className="w-full px-4">
                            <label className="flex w-full min-h-10 py-1.5 bg-fundo-medio/60 border border-borda/20 rounded-xl items-center px-3.5 justify-start gap-3 text-xs sm:text-sm font-medium text-sec cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={incluirRecusados}
                                    onChange={(e) => setIncluirRecusados(e.target.checked)}
                                    className="w-4 h-4 border-2 checkbox rounded border-borda/60 text-accent cursor-pointer"
                                />
                                <span className="truncate">Mostrar recusados (Histórico)</span>
                            </label>
                        </div>
                    )}

                    <div className="w-11/12 border-b border-borda/30" />

                    <div className="flex flex-col gap-3 w-full px-5">
                        <div className="flex flex-row justify-between items-center text-base sm:text-lg text-pri gap-3">
                            <label htmlFor="dataDe" className="w-8 shrink-0 font-semibold">
                                De:
                            </label>
                            <input
                                id="dataDe"
                                className="min-w-0 flex-1 rounded-lg uppercase text-xs sm:text-sm p-2 text-pri bg-fundo-razo border border-borda/20 focus-visible:outline-2 focus-visible:outline-accent"
                                type="date"
                                value={dataDe}
                                onChange={(e) => setDataDe(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-row justify-between items-center text-base sm:text-lg text-pri gap-3">
                            <label htmlFor="dataA" className="w-8 shrink-0 font-semibold">
                                A:
                            </label>
                            <input
                                id="dataA"
                                className="min-w-0 flex-1 rounded-lg uppercase text-xs sm:text-sm p-2 text-pri bg-fundo-razo border border-borda/20 focus-visible:outline-2 focus-visible:outline-accent"
                                type="date"
                                value={dataA}
                                onChange={(e) => setDataA(e.target.value)}
                            />
                        </div>

                        <div className="w-full border-b border-borda/30 my-1" />

                        <section
                            className="flex w-full flex-col gap-3"
                            aria-label="Filtros por campo"
                        >
                            <h2 className="text-base sm:text-lg font-semibold tracking-wide text-pri">
                                Buscar por
                            </h2>

                            {filtrosDeBuscaAtivos.map((campo) => {
                                const filtro = camposDeBusca.find((item) => item.campo === campo);
                                if (!filtro) return null;

                                return (
                                    <div
                                        key={campo}
                                        className="flex flex-col gap-2.5 rounded-2xl border border-borda/30 bg-fundo-medio/60 p-3.5"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <label
                                                htmlFor={`filtro-${campo}`}
                                                className="text-sm sm:text-base font-semibold text-pri"
                                            >
                                                {filtro.label}
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => removerFiltro(campo)}
                                                aria-label={`Remover filtro ${filtro.label}`}
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-fundo-razo text-borda transition-all duration-200 hover:scale-105 hover:bg-sec-vermelho hover:text-white cursor-pointer"
                                            >
                                                <X size={15} />
                                            </button>
                                        </div>
                                        <input
                                            id={`filtro-${campo}`}
                                            className="w-full rounded-xl border border-borda/30 bg-fundo-fundo px-3.5 py-2.5 text-sm sm:text-base text-pri placeholder:text-sec/60 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-accent"
                                            type="text"
                                            placeholder={filtro.placeholder}
                                            value={buscas[campo] ?? ""}
                                            onChange={(e) => atualizarBusca(campo, e.target.value)}
                                        />
                                    </div>
                                );
                            })}

                            <div className="relative">
                                <button
                                    type="button"
                                    aria-expanded={menuFiltrosAberto}
                                    aria-controls="opcoes-filtros"
                                    onClick={() => setMenuFiltrosAberto((aberto) => !aberto)}
                                    className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-fundo-razo px-4 py-2.5 text-sm sm:text-base font-semibold text-pri shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] transition-transform duration-150 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                                >
                                    <Plus size={16} />
                                    Mais filtros
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${menuFiltrosAberto ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {menuFiltrosAberto && (
                                    <div
                                        id="opcoes-filtros"
                                        className="absolute left-0 right-0 z-20 mt-2 flex flex-col gap-1 rounded-2xl border border-borda/30 bg-fundo-medio p-2 shadow-lg max-h-60 overflow-y-auto scroll"
                                    >
                                        {camposDeBusca
                                            .filter(({ campo }) => !filtrosDeBuscaAtivos.includes(campo))
                                            .map(({ campo, label }) => (
                                                <button
                                                    key={campo}
                                                    type="button"
                                                    onClick={() => adicionarFiltro(campo)}
                                                    className="cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm sm:text-base font-semibold text-pri transition-all duration-200 hover:bg-fundo-razo hover:brightness-110"
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </aside>

                <div className="contents lg:flex lg:order-2 lg:flex-1 lg:min-w-0 lg:flex-col lg:h-full lg:px-8 lg:pt-5 lg:overflow-hidden">
                    <div className="order-1 px-3 sm:px-6 pt-3 pb-2 lg:px-0 lg:pt-0 lg:pb-0 shrink-0">
                        <header className="flex flex-wrap items-center justify-between gap-3 w-full mb-3 lg:mb-6">
                            <LayoutUsuario />

                            <div className="flex flex-row items-center gap-2 sm:gap-3 px-1">
                                <span className="hidden xl:block h-1 w-20 bg-borda/60 rounded-lg" />
                                <InboxIcon className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-pri opacity-60 shrink-0" />
                                <h1 className="font-semibold tracking-wide text-pri text-xl sm:text-2xl lg:text-3xl">
                                    Inbox
                                </h1>
                                <span className="hidden xl:block h-1 w-20 bg-borda/60 rounded-lg" />
                            </div>
                        </header>

                        <div className="flex flex-wrap items-center gap-2.5 mb-2 lg:hidden">
                            {podeAbrirChamado && (
                                <Link
                                    to="/inbox/criacaochamado"
                                    className="flex-1 min-w-36 flex items-center justify-center h-11 bg-accent px-5 rounded-xl shadow-[0px_4px_0px_0px_#740510] text-white text-base font-bold transition-transform duration-150 hover:scale-[1.01] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                >
                                    Escrever
                                </Link>
                            )}

                            <button
                                type="button"
                                aria-expanded={filtrosMobileAbertos}
                                aria-controls="inbox-filtros-aside"
                                onClick={() => setFiltrosMobileAbertos((aberto) => !aberto)}
                                className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-fundo-razo border border-borda/25 text-pri text-sm sm:text-base font-semibold cursor-pointer transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-accent"
                            >
                                <SlidersHorizontal size={17} />
                                <span>Filtros</span>
                                {totalFiltrosAtivos > 0 && (
                                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-accent text-white text-xs font-bold">
                                        {totalFiltrosAtivos}
                                    </span>
                                )}
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-200 ${
                                        filtrosMobileAbertos ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="order-3 px-3 sm:px-6 pb-4 lg:px-0 lg:pb-0 flex flex-col lg:flex-1 lg:min-h-0">
                        {checkedInboxes.length > 0 && (
                            <div className="flex items-center justify-between gap-3 mb-3 px-4 py-2.5 rounded-xl bg-fundo-razo border border-accent/40 text-pri">
                                <span className="text-sm font-medium">
                                    {checkedInboxes.length}{" "}
                                    {checkedInboxes.length === 1
                                        ? "chamado selecionado"
                                        : "chamados selecionados"}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCheckedInboxes([])}
                                        className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-sec hover:text-pri cursor-pointer"
                                    >
                                        Limpar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={acaoSelecaoEmLote}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs sm:text-sm font-semibold cursor-pointer hover:brightness-110"
                                    >
                                        <Trash2 size={14} />
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex w-full shrink-0 items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base font-semibold text-pri">
                            <div className="flex w-12 sm:w-15 shrink-0 items-center" />
                            <div className="flex min-w-0 flex-1 items-center">
                                {colunas.map(({ campo, label, visibilidade }) => (
                                    <div
                                        key={campo}
                                        className={`min-w-0 flex-1 px-2 sm:px-3 ${visibilidade}`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => ordenarPor(campo)}
                                            aria-label={`Ordenar por ${label}`}
                                            className="flex w-full cursor-pointer items-center gap-1 truncate text-left hover:text-sec"
                                        >
                                            <span className="truncate">{label}</span>
                                            {ordenacao.campo === campo ? (
                                                <ChevronDown
                                                    size={16}
                                                    className={`shrink-0 transition-transform ${
                                                        ordenacao.direcao === "asc" ? "rotate-180" : ""
                                                    }`}
                                                />
                                            ) : (
                                                <Minus size={16} aria-hidden="true" className="shrink-0" />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <span className="h-6 w-6 shrink-0" />
                        </div>

                        <div role="status" aria-live="polite" className="sr-only">
                            {chamadosOrdenados.length === 0
                                ? "Nenhum chamado encontrado com os filtros aplicados."
                                : `${chamadosOrdenados.length} ${
                                      chamadosOrdenados.length === 1
                                          ? "chamado encontrado"
                                          : "chamados encontrados"
                                  }.`}
                        </div>

                        <div
                            id="div-chamados"
                            className="scroll flex min-h-0 flex-1 flex-col gap-2.5 lg:overflow-y-auto pb-4"
                        >
                            {carregando ? (
                                <p className="py-10 text-center text-sec">Carregando chamados...</p>
                            ) : erroCarga ? (
                                <p className="py-10 text-center text-sec-vermelho">{erroCarga}</p>
                            ) : chamadosOrdenados.length === 0 ? (
                                <p className="py-10 text-center text-sec">
                                    Nenhum chamado encontrado para os filtros selecionados.
                                </p>
                            ) : (
                                chamadosOrdenados.map((item) => (
                                    <ChamadoBullet
                                        key={item.id}
                                        index={item.id}
                                        mockInfo={item}
                                        checkedInboxes={checkedInboxes}
                                        setCheckedInboxes={setCheckedInboxes}
                                        onToggleFavorito={handleToggleFavorito}
                                        onChamadoAtualizado={handleChamadoAtualizado}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inbox;
