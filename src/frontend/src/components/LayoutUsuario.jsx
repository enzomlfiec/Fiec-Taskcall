import { Bell, CheckCheck, Cpu } from "lucide-react";
import perfilImg from "../assets/img/perfil.png";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificacoesApi } from "../services/api";
import { formatarDataTaskCall } from "../utils/chamadoAdapter";

const PERFIL_LABELS = {
    usuario: "Usuário",
    coordenador: "Coordenadora",
    ti: "Setor de TI",
};

const LayoutUsuario = () => {
    const { usuario } = useAuth();
    const foto = usuario?.foto_perfil_url || perfilImg;
    const [aberto, setAberto] = React.useState(false);
    const [notificacoes, setNotificacoes] = React.useState([]);
    const [naoLidas, setNaoLidas] = React.useState(0);
    const notifRef = React.useRef(null);

    const notificacoesAtivas = React.useMemo(() => {
        try {
            const val = localStorage.getItem("notifications");
            return val === null ? true : JSON.parse(val) !== false;
        } catch {
            return true;
        }
    }, []);

    const carregarNotificacoes = React.useCallback(async () => {
        if (!usuario || !notificacoesAtivas) return;
        try {
            const res = await notificacoesApi.listar();
            setNotificacoes(Array.isArray(res?.notificacoes) ? res.notificacoes : []);
            setNaoLidas(Number(res?.nao_lidas) || 0);
        } catch {
            // Silencioso para não interromper o cabeçalho
        }
    }, [usuario, notificacoesAtivas]);

    React.useEffect(() => {
        carregarNotificacoes();
    }, [carregarNotificacoes]);

    React.useEffect(() => {
        if (!aberto) return;

        function handleClickOutside(e) {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setAberto(false);
            }
        }

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setAberto(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [aberto]);

    async function handleMarcarLida(id) {
        try {
            await notificacoesApi.marcarLida(id);
            await carregarNotificacoes();
        } catch {
            // ignora erro pontual
        }
    }

    async function handleMarcarTodas() {
        try {
            await notificacoesApi.marcarTodasLidas();
            await carregarNotificacoes();
        } catch {
            // ignora erro pontual
        }
    }

    const nomeExibido = usuario?.nome || "Usuário FIEC";
    const funcaoExibida = usuario?.funcao || PERFIL_LABELS[usuario?.perfil] || "Sem função atribuída";

    return (
        <div className="flex justify-start w-auto max-w-full min-w-0 p-1 items-center gap-3 relative">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-full">
                <Link
                    to="/usuario"
                    aria-label="Abrir perfil do usuário"
                    className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    <img
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full opacity-85 hover:opacity-100 transition-opacity object-cover"
                        src={foto}
                        alt="Ícone do usuário"
                        onError={(e) => {
                            e.currentTarget.src = perfilImg;
                        }}
                    />
                </Link>

                <div className="flex flex-col gap-1 min-w-0">
                    <span className="min-h-7 max-w-52 sm:max-w-60 px-2.5 py-0.5 bg-fundo-razo rounded-md text-pri font-medium text-sm sm:text-base md:text-lg flex items-center truncate">
                        <span className="truncate">{nomeExibido}</span>
                    </span>

                    <div className="flex items-center gap-1.5 min-w-0">
                        <Cpu className="text-borda w-4 h-4 shrink-0" aria-hidden="true" />
                        <div className="h-6 px-2 bg-fundo-medio text-borda text-xs sm:text-sm rounded-md border border-borda/60 flex items-center min-w-0">
                            <span className="truncate">{funcaoExibida}</span>
                        </div>
                    </div>
                </div>
            </div>

            {notificacoesAtivas && (
                <div ref={notifRef} className="relative z-40">
                    <button
                        type="button"
                        aria-label={`Notificações (${naoLidas} não lidas)`}
                        aria-expanded={aberto}
                        onClick={() => {
                            const prox = !aberto;
                            setAberto(prox);
                            if (prox) carregarNotificacoes();
                        }}
                        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-fundo-razo border border-borda/25 text-pri cursor-pointer hover:brightness-110 transition-all focus-visible:outline-2 focus-visible:outline-accent"
                    >
                        <Bell className="w-5 h-5" />
                        {naoLidas > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center">
                                {naoLidas > 99 ? "99+" : naoLidas}
                            </span>
                        )}
                    </button>

                    {aberto && (
                        <div className="fixed inset-x-3 top-20 sm:absolute sm:inset-x-auto sm:top-full sm:left-0 sm:right-auto sm:mt-2 w-auto sm:w-80 max-w-[calc(100vw-1.5rem)] z-[999] rounded-2xl border border-borda/40 bg-fundo-medio shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-borda/25">
                                <span className="font-semibold text-sm text-pri">Notificações</span>
                                {naoLidas > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleMarcarTodas}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline cursor-pointer"
                                    >
                                        <CheckCheck className="w-3.5 h-3.5" />
                                        Marcar lidas
                                    </button>
                                )}
                            </div>
                            <div className="max-h-72 overflow-y-auto scroll divide-y divide-borda/20">
                                {notificacoes.length === 0 ? (
                                    <p className="p-4 text-xs text-sec text-center">
                                        Nenhuma notificação registrada.
                                    </p>
                                ) : (
                                    notificacoes.map((notif) => (
                                        <button
                                            key={notif.id}
                                            type="button"
                                            onClick={() => handleMarcarLida(notif.id)}
                                            className={`w-full text-left px-4 py-3 transition-colors cursor-pointer hover:bg-fundo-razo/60 ${
                                                notif.lida_em ? "opacity-70" : "bg-fundo-razo/30"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-semibold text-pri truncate">
                                                    {notif.titulo}
                                                </p>
                                                {!notif.lida_em && (
                                                    <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-sec mt-1 line-clamp-2">
                                                {notif.mensagem}
                                            </p>
                                            <p className="text-[11px] text-borda mt-1">
                                                {formatarDataTaskCall(notif.created_at)}
                                            </p>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LayoutUsuario;
