import React from "react";
import SideBar from "../components/SideBar";
import LayoutUsuario from "../components/LayoutUsuario";
import ChamadosResumos from "../components/ChamadosResumos";
import ChamadoBullet from "../components/Chamado/Inbox/ChamadoBullet";
import { useNavigate } from "react-router-dom";
import {
    Clock4,
    TriangleAlert,
    Ellipsis,
    MessageCircleWarning,
    BarChart3,
    FilterX,
} from "lucide-react";
import { chamadosApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
    PRIORIDADES_OFICIAIS,
    STATUS_META,
    STATUS_OFICIAIS,
    adaptarChamadoApi,
    lerFavoritosUsuario,
} from "../utils/chamadoAdapter";

const TelaPrincipal = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [chamados, setChamados] = React.useState([]);
    const [indicadores, setIndicadores] = React.useState(null);
    const [carregando, setCarregando] = React.useState(true);
    const [mostrarIndicadores, setMostrarIndicadores] = React.useState(false);
    const [filtrosInd, setFiltrosInd] = React.useState({
        status: "",
        prioridade: "",
        sala: "",
        dispositivo: "",
        data_de: "",
        data_ate: "",
    });

    const carregarPainel = React.useCallback(async (filtrosAtivos = {}) => {
        setCarregando(true);
        try {
            const [listaBruta, dadosInd] = await Promise.all([
                chamadosApi.listar(filtrosAtivos),
                chamadosApi.indicadores(filtrosAtivos),
            ]);

            const favSet = new Set(lerFavoritosUsuario(usuario?.id_usuario));
            const adaptados = Array.isArray(listaBruta)
                ? listaBruta.map((item) => adaptarChamadoApi(item, favSet))
                : [];
            setChamados(adaptados);
            setIndicadores(dadosInd);
        } catch {
            // Mantém estado vazio em caso de falha momentânea
        } finally {
            setCarregando(false);
        }
    }, [usuario?.id_usuario]);

    React.useEffect(() => {
        carregarPainel(filtrosInd);
    }, [carregarPainel, filtrosInd]);

    const cards = indicadores?.resumo_cards || {};

    return (
        <div className="flex z-10 min-h-screen w-full bg-login bg-cover bg-center justify-center items-stretch overflow-x-hidden overflow-y-auto">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

            <main
                className={`${
                    !collapsed ? "md:ml-20" : "md:ml-0"
                } w-full min-w-0 transition-all duration-300 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-24 md:pb-8`}
            >
                <div className="flex flex-col gap-3 w-full max-w-7xl mx-auto">
                    <header className="flex flex-col gap-3 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <LayoutUsuario />
                            <button
                                type="button"
                                onClick={() => setMostrarIndicadores((v) => !v)}
                                className="inline-flex items-center gap-2 rounded-xl bg-fundo-razo border border-borda/30 px-4 py-2 text-sm font-semibold text-pri cursor-pointer hover:brightness-110 transition-all focus-visible:outline-2 focus-visible:outline-accent"
                            >
                                <BarChart3 className="w-4 h-4 text-accent" />
                                {mostrarIndicadores ? "Ocultar indicadores" : "Consultar indicadores"}
                            </button>
                        </div>

                        <div className="flex flex-row text-pri text-base sm:text-lg font-semibold justify-center items-center px-1 gap-3 mt-1">
                            <div className="flex h-0.5 flex-1 max-w-50 bg-borda/60 rounded-2xl" />
                            <span className="whitespace-nowrap">Resumo Chamados</span>
                            <div className="flex h-0.5 flex-1 max-w-50 bg-borda/60 rounded-3xl" />
                        </div>

                        <article className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 py-2 gap-3 sm:gap-4 w-full">
                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados não visualizados",
                                    cor: "sec-amarelo",
                                    icone: MessageCircleWarning,
                                    porcentagem: cards.nao_visualizados?.porcentagem ?? 0,
                                }}
                            />

                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados em progresso",
                                    cor: "sec-azul",
                                    icone: Clock4,
                                    porcentagem: cards.em_progresso?.porcentagem ?? 0,
                                }}
                            />

                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados emergenciais",
                                    cor: "sec-vermelho",
                                    icone: TriangleAlert,
                                    porcentagem: cards.urgentes?.porcentagem ?? 0,
                                }}
                            />

                            <ChamadosResumos
                                statusChamados={{
                                    texto: "Chamados em análise",
                                    cor: "cinza",
                                    icone: Ellipsis,
                                    porcentagem: cards.em_analise?.porcentagem ?? 0,
                                }}
                            />
                        </article>
                    </header>

                    {mostrarIndicadores && (
                        <section
                            aria-label="Indicadores detalhados de chamados"
                            className="rounded-2xl border border-borda/30 bg-fundo-medio/85 p-4 sm:p-5 text-pri flex flex-col gap-4"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold">
                                        Indicadores de Chamados ({indicadores?.total ?? 0} no recorte)
                                    </h2>
                                    <p className="text-xs text-sec">
                                        Filtre por status, prioridade, sala, dispositivo ou período.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFiltrosInd({
                                            status: "",
                                            prioridade: "",
                                            sala: "",
                                            dispositivo: "",
                                            data_de: "",
                                            data_ate: "",
                                        })
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-fundo-razo px-3 py-1.5 text-xs font-semibold text-sec hover:text-pri cursor-pointer"
                                >
                                    <FilterX className="w-3.5 h-3.5" />
                                    Limpar filtros
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
                                <select
                                    value={filtrosInd.status}
                                    onChange={(e) => setFiltrosInd((f) => ({ ...f, status: e.target.value }))}
                                    aria-label="Filtrar indicadores por status"
                                    className="rounded-lg border border-borda/30 bg-fundo-razo px-3 py-2 text-xs text-pri"
                                >
                                    <option value="">Todos os status</option>
                                    {STATUS_OFICIAIS.filter((st) => !(usuario?.perfil === "ti" && st === "emAnalise")).map((st) => (
                                        <option key={st} value={st}>
                                            {STATUS_META[st].nome}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filtrosInd.prioridade}
                                    onChange={(e) => setFiltrosInd((f) => ({ ...f, prioridade: e.target.value }))}
                                    aria-label="Filtrar indicadores por prioridade"
                                    className="rounded-lg border border-borda/30 bg-fundo-razo px-3 py-2 text-xs text-pri"
                                >
                                    <option value="">Todas prioridades</option>
                                    {PRIORIDADES_OFICIAIS.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    placeholder="Sala"
                                    value={filtrosInd.sala}
                                    onChange={(e) => setFiltrosInd((f) => ({ ...f, sala: e.target.value }))}
                                    className="rounded-lg border border-borda/30 bg-fundo-razo px-3 py-2 text-xs text-pri placeholder:text-sec/60"
                                />

                                <input
                                    type="text"
                                    placeholder="Dispositivo"
                                    value={filtrosInd.dispositivo}
                                    onChange={(e) => setFiltrosInd((f) => ({ ...f, dispositivo: e.target.value }))}
                                    className="rounded-lg border border-borda/30 bg-fundo-razo px-3 py-2 text-xs text-pri placeholder:text-sec/60"
                                />

                                <input
                                    type="date"
                                    aria-label="Data inicial dos indicadores"
                                    value={filtrosInd.data_de}
                                    onChange={(e) => setFiltrosInd((f) => ({ ...f, data_de: e.target.value }))}
                                    className="rounded-lg border border-borda/30 bg-fundo-razo px-3 py-2 text-xs text-pri"
                                />

                                <input
                                    type="date"
                                    aria-label="Data final dos indicadores"
                                    value={filtrosInd.data_ate}
                                    onChange={(e) => setFiltrosInd((f) => ({ ...f, data_ate: e.target.value }))}
                                    className="rounded-lg border border-borda/30 bg-fundo-razo px-3 py-2 text-xs text-pri"
                                />
                            </div>

                            {indicadores?.total === 0 ? (
                                <p className="text-xs text-sec py-2">
                                    Nenhum chamado corresponde aos filtros selecionados.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                    <div className="rounded-xl bg-fundo-razo/80 border border-borda/20 p-3">
                                        <p className="font-semibold mb-2 text-pri">Por Status</p>
                                        <div className="flex flex-col gap-1">
                                            {Object.entries(indicadores?.por_status || {}).map(([st, qtd]) => (
                                                <div key={st} className="flex justify-between">
                                                    <span className="text-sec">{STATUS_META[st]?.nome || st}</span>
                                                    <span className="font-bold text-pri">{qtd}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-fundo-razo/80 border border-borda/20 p-3">
                                        <p className="font-semibold mb-2 text-pri">Por Prioridade e Local</p>
                                        <div className="flex flex-col gap-1">
                                            {Object.entries(indicadores?.por_prioridade || {}).map(([pr, qtd]) => (
                                                <div key={pr} className="flex justify-between">
                                                    <span className="text-sec">{pr}</span>
                                                    <span className="font-bold text-pri">{qtd}</span>
                                                </div>
                                            ))}
                                            {(indicadores?.por_local || []).slice(0, 3).map((loc) => (
                                                <div key={loc.sala} className="flex justify-between border-t border-borda/15 pt-1 mt-1">
                                                    <span className="text-sec">Sala {loc.sala}</span>
                                                    <span className="font-bold text-pri">{loc.total}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-fundo-razo/80 border border-borda/20 p-3">
                                        <p className="font-semibold mb-2 text-pri">Ocorrências Recorrentes</p>
                                        {(indicadores?.ocorrencias_recorrentes || []).length === 0 ? (
                                            <p className="text-sec">Nenhuma recorrência (2+ chamados) no recorte.</p>
                                        ) : (
                                            <div className="flex flex-col gap-1.5">
                                                {indicadores.ocorrencias_recorrentes.slice(0, 5).map((rec, i) => (
                                                    <div key={i} className="flex justify-between gap-2">
                                                        <span className="text-sec truncate">
                                                            Sala {rec.sala} • {rec.dispositivo} ({rec.categoria})
                                                        </span>
                                                        <span className="font-bold text-sec-vermelho shrink-0">
                                                            {rec.total}x
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    <div className="flex flex-row text-pri text-base sm:text-lg font-semibold justify-center items-center px-1 gap-3 my-2">
                        <div className="flex h-0.5 flex-1 max-w-50 bg-borda/60 rounded-2xl" />
                        <span className="whitespace-nowrap">Inbox Recente</span>
                        <div className="flex h-0.5 flex-1 max-w-50 bg-borda/60 rounded-3xl" />
                    </div>

                    <section aria-label="Prévia de chamados recentes" className="relative w-full flex flex-col items-center">
                        <div className="relative w-full h-76 sm:h-96 lg:h-[27rem] overflow-hidden rounded-2xl">
                            <div
                                draggable={false}
                                inert
                                aria-hidden="true"
                                className="select-none flex flex-col gap-2.5 sm:gap-3 w-full pointer-events-none"
                            >
                                {carregando ? (
                                    <p className="py-10 text-center text-sec">Carregando chamados recentes...</p>
                                ) : chamados.length === 0 ? (
                                    <p className="py-10 text-center text-sec">Nenhum chamado registrado ainda.</p>
                                ) : (
                                    chamados.slice(0, 12).map((chamado, index) => (
                                        <ChamadoBullet
                                            key={chamado.id ?? index}
                                            index={chamado.id}
                                            mockInfo={chamado}
                                        />
                                    ))
                                )}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-linear-to-t from-fundo-fundo via-fundo-fundo/85 to-transparent pointer-events-none" />
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/inbox")}
                            className="text-white font-bold botao bg-accent px-6 text-center transition-all hover:brightness-90 duration-300 -mt-6 z-10 mb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pri"
                        >
                            Ver tudo
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default TelaPrincipal;
