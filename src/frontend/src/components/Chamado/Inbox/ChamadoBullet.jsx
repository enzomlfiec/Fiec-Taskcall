import {
    Bookmark,
    CalendarDays,
    CheckCircle2,
    CircleUserRound,
    Clock4,
    Copy,
    MapPin,
    Monitor,
    RotateCcw,
    Tag,
    Wrench,
    X,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { alertaConfirmacao, alertaErro, alertaSucesso } from "../../../utils/alertaSite";
import { chamadosApi } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import {
    PRIORIDADES_OFICIAIS,
    PRIORIDADE_META,
    STATUS_META,
    STATUS_TI_PERMITIDOS,
    TRIAGEM_LABELS,
    adaptarChamadoApi,
    formatarDataTaskCall,
    getStatusMeta,
    lerFavoritosUsuario,
} from "../../../utils/chamadoAdapter";

const ChamadoBullet = ({
    index,
    mockInfo,
    checkedInboxes = [],
    setCheckedInboxes = () => {},
    onToggleFavorito = () => {},
    onChamadoAtualizado = () => {},
}) => {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [mostrarChamado, setMostrarChamado] = React.useState(false);
    const [detalhe, setDetalhe] = React.useState(mockInfo);
    const [carregandoDetalhe, setCarregandoDetalhe] = React.useState(false);

    // Controles para TI (RF06 / C05 / C06)
    const [novoStatus, setNovoStatus] = React.useState(mockInfo.status);
    const [comentarioStatus, setComentarioStatus] = React.useState("");
    const [novaPrioridade, setNovaPrioridade] = React.useState(mockInfo.prioridade || "Média");
    const [mostrarFormAtendimento, setMostrarFormAtendimento] = React.useState(false);
    const [procedimentos, setProcedimentos] = React.useState("");
    const [materiais, setMateriais] = React.useState("");
    const [orientacoes, setOrientacoes] = React.useState("");
    const [tipoRegistro, setTipoRegistro] = React.useState("solucao");
    const [solucao, setSolucao] = React.useState("");
    const [pendencia, setPendencia] = React.useState("");
    const [concluirAoSalvar, setConcluirAoSalvar] = React.useState(true);
    const [processando, setProcessando] = React.useState(false);

    React.useEffect(() => {
        setDetalhe(mockInfo);
        setNovoStatus(mockInfo.status);
        setNovaPrioridade(mockInfo.prioridade || "Média");
    }, [mockInfo]);

    const symbolStatus = React.useMemo(() => {
        try {
            const val = localStorage.getItem("symbolStatus");
            return val === null ? true : JSON.parse(val) !== false;
        } catch {
            return true;
        }
    }, [mostrarChamado]);

    React.useEffect(() => {
        if (!mostrarChamado) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setMostrarChamado(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [mostrarChamado]);

    async function abrirDetalhes() {
        setMostrarChamado(true);
        setCarregandoDetalhe(true);
        try {
            const dados = await chamadosApi.detalhar(mockInfo.id);
            const favSet = new Set(lerFavoritosUsuario(usuario?.id_usuario));
            const adaptado = adaptarChamadoApi(dados, favSet);
            setDetalhe(adaptado);
            setNovoStatus(adaptado.status);
            setNovaPrioridade(adaptado.prioridade || "Média");
            if (usuario?.perfil === "ti" && !mockInfo.visualizado && adaptado.visualizado) {
                onChamadoAtualizado(dados);
            }
        } catch {
            // Mantém dados da listagem caso falhe
        } finally {
            setCarregandoDetalhe(false);
        }
    }

    async function handleTriagem(decisao) {
        if (processando) return;

        if (decisao === "recusado") {
            const res = await alertaConfirmacao({
                title: "Recusar chamado na triagem?",
                text: `O chamado #${detalhe.id} ("${detalhe.titulo}") será recusado na triagem e preservado apenas no histórico.`,
                icon: "warning",
                confirmButtonText: "Recusar chamado",
                cancelButtonText: "Cancelar",
            });
            if (!res.isConfirmed) return;
        }

        setProcessando(true);
        try {
            const res = await chamadosApi.triar(detalhe.id, {
                decisao,
                prioridade: novaPrioridade,
            });
            onChamadoAtualizado(res.chamado);
            await alertaSucesso({
                title: decisao === "aprovado" ? "Chamado aprovado!" : "Chamado recusado",
                text: res.mensagem,
                timer: 1700,
                showConfirmButton: false,
            });
            if (decisao === "recusado") {
                setMostrarChamado(false);
            } else if (res.chamado) {
                const favSet = new Set(lerFavoritosUsuario(usuario?.id_usuario));
                setDetalhe(adaptarChamadoApi(res.chamado, favSet));
            }
        } catch (err) {
            await alertaErro({
                title: "Falha na triagem",
                text: err.message,
            });
        } finally {
            setProcessando(false);
        }
    }

    async function handleAtualizarStatus() {
        if (processando) return;
        setProcessando(true);
        try {
            const res = await chamadosApi.atualizarStatus(detalhe.id, {
                status: novoStatus,
                comentario: comentarioStatus.trim() || null,
                prioridade: novaPrioridade,
            });
            setComentarioStatus("");
            const favSet = new Set(lerFavoritosUsuario(usuario?.id_usuario));
            setDetalhe(adaptarChamadoApi(res.chamado, favSet));
            onChamadoAtualizado(res.chamado);
            await alertaSucesso({
                title: "Status atualizado",
                text: res.mensagem,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            await alertaErro({
                title: "Não foi possível alterar o status",
                text: err.message,
            });
        } finally {
            setProcessando(false);
        }
    }

    async function handleSalvarPrioridade(valor) {
        setNovaPrioridade(valor);
        if (!["ti", "coordenador"].includes(usuario?.perfil)) return;
        try {
            const res = await chamadosApi.atualizarPrioridade(detalhe.id, { prioridade: valor });
            const favSet = new Set(lerFavoritosUsuario(usuario?.id_usuario));
            setDetalhe(adaptarChamadoApi(res.chamado, favSet));
            onChamadoAtualizado(res.chamado);
        } catch (err) {
            await alertaErro({ title: "Erro ao atualizar prioridade", text: err.message });
        }
    }

    async function handleRegistrarAtendimento(e) {
        e.preventDefault();
        if (processando) return;
        setProcessando(true);
        try {
            const res = await chamadosApi.registrarAtendimento(detalhe.id, {
                procedimentos: procedimentos.trim(),
                materiais: materiais.trim() || null,
                orientacoes: orientacoes.trim() || null,
                tipo_registro: tipoRegistro,
                solucao: tipoRegistro === "solucao" ? solucao.trim() : null,
                pendencia: tipoRegistro === "pendencia" ? pendencia.trim() : null,
                concluir_chamado: tipoRegistro === "solucao" ? concluirAoSalvar : false,
            });
            setProcedimentos("");
            setMateriais("");
            setOrientacoes("");
            setSolucao("");
            setPendencia("");
            setMostrarFormAtendimento(false);
            const favSet = new Set(lerFavoritosUsuario(usuario?.id_usuario));
            const adaptado = adaptarChamadoApi(res.chamado, favSet);
            setDetalhe(adaptado);
            setNovoStatus(adaptado.status);
            onChamadoAtualizado(res.chamado);
            await alertaSucesso({
                title: "Atendimento registrado",
                text: res.mensagem,
                timer: 1600,
                showConfirmButton: false,
            });
        } catch (err) {
            await alertaErro({
                title: "Erro ao registrar atendimento",
                text: err.message,
            });
        } finally {
            setProcessando(false);
        }
    }

    async function handleReabrirChamado() {
        const motivo = window.prompt("Informe o motivo obrigatório para reabrir o chamado:");
        if (!motivo || motivo.trim().length < 5) {
            await alertaErro({
                title: "Motivo obrigatório",
                text: "Informe uma justificativa com pelo menos 5 caracteres para reabrir o chamado.",
            });
            return;
        }

        setProcessando(true);
        try {
            const res = await chamadosApi.reabrir(detalhe.id, { motivo: motivo.trim() });
            const favSet = new Set(lerFavoritosUsuario(usuario?.id_usuario));
            const adaptado = adaptarChamadoApi(res.chamado, favSet);
            setDetalhe(adaptado);
            setNovoStatus(adaptado.status);
            onChamadoAtualizado(res.chamado);
            await alertaSucesso({
                title: "Chamado reaberto",
                text: res.mensagem,
                timer: 1700,
                showConfirmButton: false,
            });
        } catch (err) {
            await alertaErro({
                title: "Não foi possível reabrir",
                text: err.message,
            });
        } finally {
            setProcessando(false);
        }
    }

    const statusInfo = getStatusMeta(detalhe.status);
    const IconeStatus = statusInfo.icone;
    const prioridadeInfo = PRIORIDADE_META[detalhe.prioridade] || PRIORIDADE_META["Média"];
    const checkado = checkedInboxes.includes(index);

    const isTi = usuario?.perfil === "ti";
    const isCoordenadora = usuario?.perfil === "coordenador";
    const isSolicitanteDono = Number(usuario?.id_usuario) === Number(detalhe.id_usuario);
    const podeReabrir = detalhe.status === "resolvido" && (isTi || isSolicitanteDono);
    const podeReutilizar = (usuario?.perfil === "usuario" || isCoordenadora) && isSolicitanteDono;

    function handleCheck() {
        if (checkedInboxes.includes(index)) {
            setCheckedInboxes(checkedInboxes.filter((item) => item !== index));
        } else {
            setCheckedInboxes([...checkedInboxes, index]);
        }
    }

    return (
        <>
            <div
                id="ChamadoBullet"
                className={`flex w-full min-w-0 items-center gap-2 sm:gap-3 rounded-2xl border bg-fundo-razo px-3 sm:px-4 py-1 font-semibold shadow-sm transition-all duration-200 cursor-pointer ${
                    checkado
                        ? "border-accent/70 bg-fundo-medio ring-1 ring-accent/50"
                        : "border-borda/15 hover:border-borda/40 hover:bg-fundo-medio/80"
                }`}
            >
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <span
                        role="checkbox"
                        tabIndex={0}
                        aria-checked={checkado}
                        aria-label={`Selecionar chamado #${detalhe.id} de ${detalhe.nome}`}
                        className={checkado ? "checkboxTrue" : "checkboxFalse"}
                        onClick={handleCheck}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleCheck();
                            }
                        }}
                    />

                    <button
                        type="button"
                        aria-label={detalhe.salvo ? "Remover dos favoritos" : "Favoritar chamado"}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorito(detalhe.id);
                        }}
                        className="cursor-pointer rounded p-0.5 focus-visible:outline-2 focus-visible:outline-accent"
                    >
                        <Bookmark
                            className={`h-5 w-5 sm:h-6 sm:w-6 shrink-0 ${
                                !detalhe.salvo ? "text-borda opacity-50" : "text-pri fill-pri"
                            }`}
                        />
                    </button>
                </div>

                <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Abrir detalhes do chamado #${detalhe.id}: ${detalhe.titulo}, solicitante ${detalhe.nome}, status ${statusInfo.nome}`}
                    className="flex min-w-0 flex-1 items-center py-1.5 sm:py-2 rounded-lg focus-visible:outline-2 focus-visible:outline-accent"
                    onClick={abrirDetalhes}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            abrirDetalhes();
                        }
                    }}
                >
                    <div className="min-w-0 flex-1 border-r-0 sm:border-r-2 border-borda/30 px-2 sm:px-3">
                        <p className="truncate text-sm sm:text-base text-pri">{detalhe.nome}</p>
                        <p className="truncate text-xs font-medium text-sec lg:hidden">
                            {detalhe.titulo || detalhe.dispositivo}
                        </p>
                        <p className="truncate text-[11px] font-normal text-borda sm:hidden">
                            {detalhe.categoria} • Sala {detalhe.sala}
                        </p>
                    </div>

                    <div className="hidden min-w-0 flex-1 border-r-2 border-borda/30 px-3 lg:block">
                        <p className="truncate text-pri">{detalhe.titulo}</p>
                    </div>

                    <div className="hidden min-w-0 flex-1 border-r-2 border-borda/30 px-3 sm:block">
                        <p className="truncate text-sm sm:text-base text-sec">{detalhe.categoria}</p>
                    </div>

                    <div className="hidden min-w-0 flex-1 border-r-2 border-borda/30 px-3 md:block">
                        <p className="truncate text-sm sm:text-base text-sec">{detalhe.sala}</p>
                    </div>

                    <div className="hidden min-w-0 flex-1 px-3 xl:block">
                        <p className="truncate text-sm text-sec">{detalhe.data}</p>
                    </div>
                </div>

                <span
                    id="ChamadoStatus"
                    title={`${statusInfo.nome} • Prioridade: ${detalhe.prioridade}`}
                    aria-label={`Status: ${statusInfo.nome}`}
                    className={`
                        flex items-center justify-center
                        h-6 w-6 shrink-0 rounded-full
                        ${statusInfo.bgClass || "bg-fundo-razo"}
                        drop-shadow-sm drop-shadow-black/25
                        shadow-[inset_0_4px_0_0px_#00000040]
                    `}
                >
                    {symbolStatus && <IconeStatus className="w-4 h-4 text-white" />}
                </span>
            </div>

            <div
                className={`fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-[3px] transition-all duration-300 ${
                    mostrarChamado ? "opacity-100" : "pointer-events-none invisible opacity-0"
                }`}
                onClick={() => setMostrarChamado(false)}
            >
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`chamado-titulo-${detalhe.id}`}
                    className={`poppins flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl sm:rounded-4xl border-2 border-borda/60 bg-fundo-fundo text-pri shadow-lg shadow-black/20 transition-all duration-300 ${
                        mostrarChamado ? "scale-100" : "scale-95"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <header className="flex items-start justify-between gap-4 border-b border-borda/30 px-4 py-4 sm:px-8 sm:py-5">
                        <div className="min-w-0">
                            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-borda">
                                Chamado #{detalhe.id} {carregandoDetalhe ? "• Atualizando..." : ""}
                            </p>
                            <h1
                                id={`chamado-titulo-${detalhe.id}`}
                                className="wrap-break-word text-xl font-semibold sm:text-3xl"
                            >
                                {detalhe.titulo || detalhe.dispositivo}
                            </h1>
                        </div>
                        <button
                            type="button"
                            aria-label="Fechar detalhes do chamado"
                            onClick={() => setMostrarChamado(false)}
                            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-fundo-razo text-pri transition-all duration-200 hover:scale-105 hover:brightness-125"
                        >
                            <X size={20} />
                        </button>
                    </header>

                    <div className="scroll flex flex-col gap-5 sm:gap-6 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white ${statusInfo.bgClass}`}
                            >
                                <IconeStatus size={16} />
                                {statusInfo.nome}
                            </span>

                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${prioridadeInfo.badgeClass}`}
                            >
                                Prioridade: {detalhe.prioridade}
                            </span>

                            {detalhe.status !== "emAnalise" && (
                                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-fundo-medio border border-borda/25 text-sec">
                                    {detalhe.visualizado ? "Visualizado pela TI" : "Não visualizado pela TI"}
                                </span>
                            )}

                            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-fundo-medio border border-borda/25 text-sec">
                                {TRIAGEM_LABELS[detalhe.triagem_status] || detalhe.triagem_status}
                            </span>

                            <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-borda">
                                <CalendarDays size={16} />
                                {detalhe.data}
                            </span>
                        </div>

                        <section aria-label="Informações do chamado">
                            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-2xl sm:rounded-3xl border-2 border-borda/30 bg-fundo-medio/80 p-3.5 sm:p-4">
                                    <CircleUserRound className="shrink-0 text-borda" size={20} />
                                    <div className="min-w-0">
                                        <p className="text-xs text-borda">Solicitante</p>
                                        <p className="truncate font-medium">{detalhe.nome}</p>
                                        <p className="truncate text-sm text-borda">{detalhe.cargo}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl sm:rounded-3xl border-2 border-borda/30 bg-fundo-medio/80 p-3.5 sm:p-4">
                                    <MapPin className="shrink-0 text-borda" size={20} />
                                    <div className="min-w-0">
                                        <p className="text-xs text-borda">Sala</p>
                                        <p className="truncate font-medium">{detalhe.sala}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl sm:rounded-3xl border-2 border-borda/30 bg-fundo-medio/80 p-3.5 sm:p-4">
                                    <Tag className="shrink-0 text-borda" size={20} />
                                    <div className="min-w-0">
                                        <p className="text-xs text-borda">Categoria</p>
                                        <p className="truncate font-medium">{detalhe.categoria}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl sm:rounded-3xl border-2 border-borda/30 bg-fundo-medio/80 p-3.5 sm:p-4">
                                    <Monitor className="shrink-0 text-borda" size={20} />
                                    <div className="min-w-0">
                                        <p className="text-xs text-borda">Dispositivo</p>
                                        <p className="truncate font-medium">{detalhe.dispositivo}</p>
                                    </div>
                                </div>
                            </div>
                            {detalhe.responsavel_ti_nome && (
                                <p className="mt-2 text-xs text-sec">
                                    Responsável técnico pelo atendimento: <strong className="text-pri">{detalhe.responsavel_ti_nome}</strong>
                                </p>
                            )}
                            {detalhe.triagem_observacao && (
                                <p className="mt-1 text-xs text-sec-amarelo">
                                    Observação da triagem: {detalhe.triagem_observacao}
                                </p>
                            )}
                        </section>

                        <section>
                            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-borda">
                                Descrição
                            </h2>
                            <p className="min-h-20 whitespace-pre-wrap rounded-2xl sm:rounded-3xl border-2 border-borda/30 bg-fundo-razo p-4 leading-relaxed text-pri">
                                {detalhe.descricao || "Nenhuma descrição informada."}
                            </p>
                        </section>

                        {/* Controles da Equipe de TI (RF06 & C06) */}
                        {isTi && detalhe.status !== "emAnalise" && detalhe.triagem_status === "aprovado" && (
                            <section className="rounded-2xl border border-borda/30 bg-fundo-medio/70 p-4 flex flex-col gap-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-pri">
                                        Ações Técnicas (Setor de TI)
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setMostrarFormAtendimento((v) => !v)}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-sec-azul px-3 py-1.5 text-xs font-semibold text-white cursor-pointer hover:brightness-110"
                                    >
                                        <Wrench size={14} />
                                        {mostrarFormAtendimento ? "Fechar atendimento" : "Registrar atendimento"}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    <select
                                        value={novoStatus}
                                        disabled={detalhe.status === "resolvido"}
                                        onChange={(e) => setNovoStatus(e.target.value)}
                                        aria-label="Selecionar novo status"
                                        className="rounded-lg border border-borda/30 bg-fundo-razo px-3 py-2 text-xs sm:text-sm text-pri"
                                    >
                                        {STATUS_TI_PERMITIDOS.map((st) => (
                                            <option key={st} value={st}>
                                                {STATUS_META[st].nome}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={novaPrioridade}
                                        onChange={(e) => handleSalvarPrioridade(e.target.value)}
                                        aria-label="Selecionar prioridade"
                                        className="rounded-lg border border-borda/30 bg-fundo-razo px-3 py-2 text-xs sm:text-sm text-pri"
                                    >
                                        {PRIORIDADES_OFICIAIS.map((prio) => (
                                            <option key={prio} value={prio}>
                                                Prioridade: {prio}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Comentário da alteração (opcional)"
                                        value={comentarioStatus}
                                        disabled={detalhe.status === "resolvido"}
                                        onChange={(e) => setComentarioStatus(e.target.value)}
                                        className="rounded-lg border border-borda/30 bg-fundo-razo px-3 py-2 text-xs sm:text-sm text-pri placeholder:text-sec/60"
                                    />
                                </div>

                                {mostrarFormAtendimento && (
                                    <form
                                        onSubmit={handleRegistrarAtendimento}
                                        className="mt-2 rounded-xl border border-borda/25 bg-fundo-fundo p-3.5 flex flex-col gap-3"
                                    >
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-sec">
                                            Registro de Atendimento e Solução (C06)
                                        </h3>

                                        <textarea
                                            required
                                            rows={2}
                                            value={procedimentos}
                                            onChange={(e) => setProcedimentos(e.target.value)}
                                            placeholder="Procedimentos realizados *"
                                            className="w-full rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-xs sm:text-sm text-pri placeholder:text-sec/60"
                                        />

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            <input
                                                type="text"
                                                value={materiais}
                                                onChange={(e) => setMateriais(e.target.value)}
                                                placeholder="Materiais utilizados (opcional)"
                                                className="rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-xs sm:text-sm text-pri placeholder:text-sec/60"
                                            />
                                            <select
                                                value={tipoRegistro}
                                                onChange={(e) => setTipoRegistro(e.target.value)}
                                                className="rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-xs sm:text-sm text-pri"
                                            >
                                                <option value="solucao">Solução encontrada</option>
                                                <option value="pendencia">Registrar pendência</option>
                                            </select>
                                        </div>

                                        {tipoRegistro === "solucao" ? (
                                            <>
                                                <textarea
                                                    required
                                                    rows={2}
                                                    value={solucao}
                                                    onChange={(e) => setSolucao(e.target.value)}
                                                    placeholder="Descreva a solução aplicada *"
                                                    className="w-full rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-xs sm:text-sm text-pri placeholder:text-sec/60"
                                                />
                                                <label className="flex items-center gap-2 text-xs text-pri cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={concluirAoSalvar}
                                                        onChange={(e) => setConcluirAoSalvar(e.target.checked)}
                                                        className="w-4 h-4 checkbox rounded border-borda/60"
                                                    />
                                                    Marcar chamado como Resolvido ao salvar solução
                                                </label>
                                            </>
                                        ) : (
                                            <textarea
                                                required
                                                rows={2}
                                                value={pendencia}
                                                onChange={(e) => setPendencia(e.target.value)}
                                                placeholder="Descreva a pendência identificada *"
                                                className="w-full rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-xs sm:text-sm text-pri placeholder:text-sec/60"
                                            />
                                        )}

                                        <input
                                            type="text"
                                            value={orientacoes}
                                            onChange={(e) => setOrientacoes(e.target.value)}
                                            placeholder="Orientações fornecidas ao solicitante (opcional)"
                                            className="rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-xs sm:text-sm text-pri placeholder:text-sec/60"
                                        />

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processando}
                                                className="rounded-lg bg-sec-verde px-4 py-2 text-xs sm:text-sm font-semibold text-white cursor-pointer hover:brightness-110 disabled:opacity-60"
                                            >
                                                {processando ? "Salvando..." : "Salvar atendimento"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </section>
                        )}

                        {/* Atendimentos Técnicos Registrados (C06) */}
                        {detalhe.atendimentos && detalhe.atendimentos.length > 0 && (
                            <section>
                                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-borda">
                                    Atendimentos e Soluções ({detalhe.atendimentos.length})
                                </h2>
                                <div className="flex flex-col gap-2.5">
                                    {detalhe.atendimentos.map((at) => (
                                        <div
                                            key={at.id}
                                            className="rounded-2xl border border-borda/25 bg-fundo-medio/70 p-3.5 text-xs sm:text-sm"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                                <span className="font-bold text-pri">
                                                    {at.tipo_registro === "solucao" ? "Solução Registrada" : "Pendência Registrada"}
                                                    {at.tecnico?.nome ? ` • ${at.tecnico.nome}` : ""}
                                                </span>
                                                <span className="text-[11px] text-borda">
                                                    {formatarDataTaskCall(at.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-sec">
                                                <strong className="text-pri">Procedimentos:</strong> {at.procedimentos}
                                            </p>
                                            {at.materiais && (
                                                <p className="text-sec mt-0.5">
                                                    <strong className="text-pri">Materiais:</strong> {at.materiais}
                                                </p>
                                            )}
                                            {at.solucao && (
                                                <p className="text-sec-verde mt-0.5">
                                                    <strong>Solução:</strong> {at.solucao}
                                                </p>
                                            )}
                                            {at.pendencia && (
                                                <p className="text-sec-amarelo mt-0.5">
                                                    <strong>Pendência:</strong> {at.pendencia}
                                                </p>
                                            )}
                                            {at.orientacoes && (
                                                <p className="text-sec mt-0.5">
                                                    <strong className="text-pri">Orientações:</strong> {at.orientacoes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Histórico de Alterações (RF04 / RF07) */}
                        {detalhe.historicos && detalhe.historicos.length > 0 && (
                            <section>
                                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-borda">
                                    Histórico do Chamado
                                </h2>
                                <div className="flex flex-col gap-2">
                                    {detalhe.historicos.map((h) => (
                                        <div
                                            key={h.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 rounded-xl border border-borda/20 bg-fundo-razo/60 px-3.5 py-2 text-xs"
                                        >
                                            <span className="text-pri">{h.descricao_evento}</span>
                                            <span className="text-borda shrink-0">
                                                {formatarDataTaskCall(h.created_at)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <footer className="flex flex-col-reverse flex-wrap gap-2.5 border-t border-borda/30 px-4 py-4 sm:flex-row sm:justify-end sm:px-8">
                        <button
                            type="button"
                            onClick={() => onToggleFavorito(detalhe.id)}
                            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-sec-verde px-4 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
                        >
                            <Bookmark size={18} className={detalhe.salvo ? "fill-white" : ""} />
                            {detalhe.salvo ? "Desfavoritar" : "Favoritar"}
                        </button>

                        {podeReutilizar && (
                            <button
                                type="button"
                                onClick={() => {
                                    setMostrarChamado(false);
                                    navigate(`/inbox/criacaochamado?reutilizar=${detalhe.id}`);
                                }}
                                className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-fundo-razo border border-borda/30 px-4 font-medium text-pri transition-all duration-200 hover:brightness-115"
                            >
                                <Copy size={17} />
                                Reutilizar
                            </button>
                        )}

                        {podeReabrir && (
                            <button
                                type="button"
                                disabled={processando}
                                onClick={handleReabrirChamado}
                                className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-sec-amarelo px-4 font-medium text-white transition-all duration-200 hover:brightness-110"
                            >
                                <RotateCcw size={17} />
                                Reabrir Chamado
                            </button>
                        )}

                        {isCoordenadora && detalhe.status !== "resolvido" && (
                            <>
                                {detalhe.triagem_status !== "recusado" && (
                                    <button
                                        type="button"
                                        disabled={processando}
                                        onClick={() => handleTriagem("recusado")}
                                        className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 font-medium text-white shadow-[0px_4px_0px_0px_#740510] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <X size={18} />
                                        Recusar
                                    </button>
                                )}
                                {(detalhe.triagem_status === "pendente" || detalhe.status === "emAnalise") &&
                                    detalhe.triagem_status !== "recusado" && (
                                    <button
                                        type="button"
                                        disabled={processando}
                                        onClick={() => handleTriagem("aprovado")}
                                        className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-sec-azul px-4 font-medium text-white transition-all duration-200 hover:brightness-110"
                                    >
                                        <CheckCircle2 size={18} />
                                        Aprovar Triagem
                                    </button>
                                )}
                            </>
                        )}

                        {isTi &&
                            detalhe.status !== "emAnalise" &&
                            detalhe.triagem_status === "aprovado" &&
                            detalhe.status !== "resolvido" && (
                            <button
                                type="button"
                                disabled={processando}
                                onClick={handleAtualizarStatus}
                                className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110 ${
                                    getStatusMeta(novoStatus).bgClass
                                }`}
                            >
                                <Clock4 size={18} />
                                Salvar status: {getStatusMeta(novoStatus).nome}
                            </button>
                        )}
                    </footer>
                </div>
            </div>
        </>
    );
};

export default ChamadoBullet;
