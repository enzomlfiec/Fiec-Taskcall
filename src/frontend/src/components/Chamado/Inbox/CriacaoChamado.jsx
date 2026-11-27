import { ArrowLeft, History } from "lucide-react";
import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { alertaAviso, alertaCarregando, alertaErro, alertaSucesso } from "../../../utils/alertaSite";
import { chamadosApi } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { PRIORIDADES_OFICIAIS, adaptarChamadoApi } from "../../../utils/chamadoAdapter";

function CriacaoChamado() {
    const { usuario } = useAuth();
    const [searchParams] = useSearchParams();
    const reutilizarParam = searchParams.get("reutilizar");

    const [campoTitulo, setTitulo] = React.useState("");
    const [campoSala, setSala] = React.useState("");
    const [campoNumeroSala, setNumeroSala] = React.useState(false);
    const [campoDescricao, setDescricao] = React.useState("");
    const [campoCategoria, setCategoria] = React.useState("");
    const [campoDispositivo, setDispositivo] = React.useState("");
    const [campoPrioridade, setPrioridade] = React.useState("Média");
    const [chamadoOrigemId, setChamadoOrigemId] = React.useState(null);

    const [anteriores, setAnteriores] = React.useState([]);
    const [mostrarHistorico, setMostrarHistorico] = React.useState(false);
    const [enviando, setEnviando] = React.useState(false);
    const navigate = useNavigate();

    const preencherComChamado = React.useCallback((chamado) => {
        if (!chamado) return;
        setTitulo(chamado.titulo || "");
        setSala(chamado.sala && chamado.sala !== "-" ? String(chamado.sala) : "");
        setCategoria(chamado.categoria || "");
        setDispositivo(chamado.dispositivo && chamado.dispositivo !== "-" ? chamado.dispositivo : "");
        setDescricao(chamado.descricao || "");
        setPrioridade(chamado.prioridade || "Média");
        setChamadoOrigemId(chamado.id);
        setMostrarHistorico(false);
    }, []);

    React.useEffect(() => {
        let ativo = true;
        chamadosApi
            .listar({ meus: 1 })
            .then((lista) => {
                if (!ativo || !Array.isArray(lista)) return;
                const adaptados = lista
                    .map((item) => adaptarChamadoApi(item))
                    .filter((item) => Number(item.id_usuario) === Number(usuario?.id_usuario));
                setAnteriores(adaptados);

                if (reutilizarParam) {
                    const encontrado = adaptados.find((c) => String(c.id) === String(reutilizarParam));
                    if (encontrado) {
                        preencherComChamado(encontrado);
                    }
                }
            })
            .catch(() => {
                // Silencioso caso histórico não carregue
            });
        return () => {
            ativo = false;
        };
    }, [reutilizarParam, preencherComChamado, usuario?.id_usuario]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (enviando) return;

        if (usuario?.perfil === "ti") {
            await alertaAviso({
                title: "Ação não permitida",
                text: "Contas do setor de TI atendem chamados; apenas solicitantes e coordenação abrem novos chamados.",
            });
            return;
        }

        if (!campoNumeroSala) {
            await alertaAviso({
                title: "Número da sala inválido",
                text: "Informe um número válido para a sala antes de enviar o chamado.",
            });
            return;
        }

        setEnviando(true);
        alertaCarregando({
            title: "Enviando chamado...",
            text: "Registrando sua solicitação no sistema.",
        });

        try {
            const resposta = await chamadosApi.criar({
                titulo: campoTitulo.trim(),
                sala: parseInt(campoSala, 10),
                categoria: campoCategoria,
                dispositivo: campoDispositivo.trim(),
                descricao: campoDescricao.trim(),
                prioridade: campoPrioridade,
                chamado_origem_id: chamadoOrigemId || null,
            });

            const criado = resposta?.chamado;
            await alertaSucesso({
                title: "Chamado enviado!",
                text: `O chamado #${criado?.cod_chamado ?? ""} ("${campoTitulo.trim()}") foi registrado com sucesso e já está disponível no Inbox.`,
                confirmButtonText: "Ver no Inbox",
            });

            navigate("/inbox");
        } catch (err) {
            await alertaErro({
                title: "Erro ao abrir chamado",
                text: err.message || "Não foi possível registrar o chamado. Verifique os campos e tente novamente.",
            });
        } finally {
            setEnviando(false);
        }
    }

    React.useEffect(() => {
        if (campoSala !== "") {
            const numero = parseInt(campoSala, 10);
            setNumeroSala(!isNaN(numero) && numero > 0);
        } else {
            setNumeroSala(false);
        }
    }, [campoSala]);

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-login bg-cover bg-center px-3 sm:px-4 py-6 sm:py-8 text-pri">
            <section className="flex w-full max-w-3xl flex-col gap-5 rounded-2xl sm:rounded-4xl border-2 border-sec bg-fundo-medio/30 p-5 sm:p-8 md:p-10 backdrop-blur-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                        to="/inbox"
                        aria-label="Voltar para o Inbox"
                        className="w-fit rounded-lg p-1 text-borda transition-all duration-300 hover:text-pri focus-visible:outline-2 focus-visible:outline-accent"
                    >
                        <ArrowLeft />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMostrarHistorico((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-xl bg-fundo-razo border border-borda/30 px-3.5 py-2 text-xs sm:text-sm font-semibold text-pri cursor-pointer hover:brightness-110 transition-all focus-visible:outline-2 focus-visible:outline-accent"
                    >
                        <History className="w-4 h-4 text-accent" />
                        {mostrarHistorico ? "Fechar histórico" : "Reutilizar chamado anterior"}
                    </button>
                </div>

                <header>
                    <h1 className="text-2xl sm:text-3xl font-bold text-pri">
                        Criar Chamado
                    </h1>
                    {chamadoOrigemId && (
                        <p className="mt-1 text-xs sm:text-sm text-sec">
                            Preenchendo nova solicitação com base no chamado #{chamadoOrigemId} (o original permanecerá inalterado).
                        </p>
                    )}
                </header>

                {mostrarHistorico && (
                    <div className="rounded-2xl border border-borda/30 bg-fundo-fundo/90 p-4 flex flex-col gap-2 max-h-60 overflow-y-auto scroll">
                        <p className="text-xs font-semibold uppercase tracking-wider text-sec">
                            Selecione um chamado anterior para preencher o formulário:
                        </p>
                        {anteriores.length === 0 ? (
                            <p className="text-xs text-sec py-2">Nenhum chamado anterior disponível.</p>
                        ) : (
                            anteriores.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => preencherComChamado(item)}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-borda/20 bg-fundo-razo/80 px-3.5 py-2.5 text-left text-xs sm:text-sm hover:brightness-115 cursor-pointer transition-all"
                                >
                                    <div className="min-w-0">
                                        <p className="font-semibold text-pri truncate">
                                            #{item.id} • {item.titulo}
                                        </p>
                                        <p className="text-xs text-sec truncate">
                                            Sala {item.sala} • {item.dispositivo} • {item.categoria}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-xs font-semibold text-accent">
                                        Usar dados
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                )}

                <hr className="w-full border-0 h-px bg-borda/30" />

                <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex w-full flex-col gap-2">
                        <label htmlFor="Titulo" className="font-bold text-pri">
                            Titulo
                            <span className="ml-1 text-accent">*</span>
                        </label>

                        <input
                            id="Titulo"
                            type="text"
                            required
                            maxLength={100}
                            value={campoTitulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Insira seu Titulo"
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri placeholder:text-sec/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        />
                    </div>

                    <div className="flex w-full flex-col gap-2">
                        <label htmlFor="sala" className="font-bold text-pri">
                            Sala
                            <span className="ml-1 text-accent">*</span>
                        </label>

                        <input
                            id="sala"
                            type="number"
                            required
                            min={1}
                            value={campoSala}
                            onChange={(e) => setSala(e.target.value)}
                            placeholder="Ex: 39"
                            className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-md border border-borda bg-fundo-razo p-3 text-pri placeholder:text-sec/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        />
                        {campoSala !== "" && !campoNumeroSala && (
                            <p className="text-sm text-accent">Precisa ser um número válido</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex w-full flex-col gap-2">
                            <label htmlFor="categoria" className="font-bold text-pri">
                                Categoria
                                <span className="ml-1 text-accent">*</span>
                            </label>

                            <select
                                id="categoria"
                                required
                                value={campoCategoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                <option value="" disabled>
                                    Selecione uma categoria
                                </option>
                                <option value="Hardware">Hardware</option>
                                <option value="Software">Software</option>
                                <option value="Rede">Rede</option>
                            </select>
                        </div>

                        <div className="flex w-full flex-col gap-2">
                            <label htmlFor="prioridade" className="font-bold text-pri">
                                Prioridade
                            </label>

                            <select
                                id="prioridade"
                                value={campoPrioridade}
                                onChange={(e) => setPrioridade(e.target.value)}
                                className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                {PRIORIDADES_OFICIAIS.map((prio) => (
                                    <option key={prio} value={prio}>
                                        {prio}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-2">
                        <label htmlFor="dispositivo" className="font-bold text-pri">
                            Dispositivo
                            <span className="ml-1 text-accent">*</span>
                        </label>

                        <input
                            id="dispositivo"
                            type="text"
                            required
                            maxLength={100}
                            value={campoDispositivo}
                            onChange={(e) => setDispositivo(e.target.value)}
                            placeholder="Ex: Máquina 25"
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri placeholder:text-sec/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        />
                    </div>

                    <div className="flex w-full flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="descricao" className="font-bold text-pri">
                                Descrição
                                <span className="ml-1 text-accent">*</span>
                            </label>
                            <span className="text-xs text-sec">{campoDescricao.length}/150</span>
                        </div>

                        <textarea
                            id="descricao"
                            required
                            maxLength={150}
                            value={campoDescricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            rows="6"
                            placeholder="Descreva o problema ou solicitação"
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri placeholder:text-sec/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        />
                    </div>

                    <div className="flex items-center justify-center pt-2">
                        <button
                            type="submit"
                            disabled={enviando}
                            className="botao h-11 min-w-40 rounded-md bg-accent px-6 text-base font-bold text-white transition hover:brightness-110 disabled:opacity-60"
                        >
                            {enviando ? "Enviando..." : "Criar Chamado"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default CriacaoChamado;
