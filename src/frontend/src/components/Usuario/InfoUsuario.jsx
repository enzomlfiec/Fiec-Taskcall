import React from "react";
import { UserRound, Mail, ShieldCheck, Settings, ChevronRight, X, LogOut, Users, Eye, ImagePlus } from "lucide-react";
import SideBar from "../SideBar";
import perfilImg from "../../assets/img/perfil.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../services/api";
import { alertaErro, alertaSucesso } from "../../utils/alertaSite";
import { formatarDataTaskCall } from "../../utils/chamadoAdapter";

const PERFIL_ROTULOS = {
    usuario: "Usuário Solicitante",
    coordenador: "Coordenação",
    ti: "Equipe de TI",
};

function InfoUsuario({ collapsed, setCollapsed }) {
    const { usuario, sair, atualizarUsuario } = useAuth();
    const navigate = useNavigate();
    const [floating, setFloating] = React.useState(false);
    const [menuFotoAberto, setMenuFotoAberto] = React.useState(false);
    const [enviandoFoto, setEnviandoFoto] = React.useState(false);
    const menuFotoRef = React.useRef(null);
    const inputFotoRef = React.useRef(null);
    const foto = usuario?.foto_perfil_url || perfilImg;

    React.useEffect(() => {
        if (!menuFotoAberto) return;

        function handleClickOutside(e) {
            if (menuFotoRef.current && !menuFotoRef.current.contains(e.target)) {
                setMenuFotoAberto(false);
            }
        }

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setMenuFotoAberto(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuFotoAberto]);

    async function handleAlterarFoto(event) {
        const arquivo = event.target.files?.[0];
        event.target.value = "";
        if (!arquivo) return;

        if (arquivo.size > 4 * 1024 * 1024) {
            await alertaErro({
                title: "Arquivo muito grande",
                text: "A imagem deve ter no máximo 4 MB.",
            });
            return;
        }

        setEnviandoFoto(true);
        try {
            const resposta = await authApi.atualizarFoto(arquivo);
            if (resposta?.usuario) {
                atualizarUsuario(resposta.usuario);
            }
            await alertaSucesso({
                title: "Foto atualizada",
                text: resposta?.mensagem || "Sua foto de perfil foi atualizada com sucesso.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            await alertaErro({
                title: "Erro ao atualizar foto",
                text: err.message || "Não foi possível salvar a nova foto de perfil.",
            });
        } finally {
            setEnviandoFoto(false);
        }
    }

    const isAdminTi = usuario?.perfil === "ti" && Boolean(usuario?.is_admin_ti);
    const nome = usuario?.nome || "Usuário FIEC";
    const funcao = usuario?.funcao || "Sem função atribuída";
    const rmExibido = usuario?.possui_rm && usuario?.rm ? usuario.rm : "Não aplicável";
    const email = usuario?.email || "-";
    const tipoAcesso = isAdminTi
        ? "Equipe de TI (Administrador)"
        : PERFIL_ROTULOS[usuario?.perfil] || usuario?.perfil || "-";
    const dataCadastro = usuario?.created_at ? formatarDataTaskCall(usuario.created_at) : "-";
    const ultimoAcesso = usuario?.ultimo_acesso_em
        ? formatarDataTaskCall(usuario.ultimo_acesso_em)
        : "Sessão atual";
    const ativo = usuario?.ativo !== false;

    const dadosPessoais = [
        { label: "Nome", value: nome },
        { label: "RM", value: rmExibido },
        { label: "E-mail", value: email },
    ];

    const informacoesConta = [
        { label: "Tipo de acesso", value: tipoAcesso },
        { label: "Data de cadastro", value: dataCadastro },
        { label: "Último acesso", value: ultimoAcesso },
        { label: "Status", value: ativo ? "Ativo" : "Inativo", status: ativo },
    ];

    async function handleLogout() {
        await sair();
        navigate("/login");
    }

    return (
        <>
            <div className="flex z-10 min-h-screen w-full bg-login bg-cover bg-center justify-center items-stretch overflow-x-hidden overflow-y-auto">
                <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
                <main
                    className={`w-full min-w-0 min-h-screen px-4 sm:px-6 lg:px-10 pt-6 pb-24 md:py-8 transition-all duration-300 ${
                        !collapsed ? "md:ml-20" : "md:ml-0"
                    }`}
                >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <UserRound className="w-12 h-12 text-pri" />

                            <div className="flex flex-col">
                                <h1 className="text-pri text-3xl sm:text-4xl font-bold">Meu Perfil</h1>
                                <p className="text-sec text-sm sm:text-base">
                                    Visualize suas informações pessoais.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-xl bg-fundo-razo border border-borda/30 px-4 py-2.5 text-sm font-semibold text-pri cursor-pointer hover:bg-sec-vermelho hover:text-white transition-all focus-visible:outline-2 focus-visible:outline-accent"
                        >
                            <LogOut className="w-4 h-4" />
                            Sair da conta
                        </button>
                    </div>

                    <section className="w-full flex flex-col sm:flex-row items-center sm:items-center gap-6 bg-fundo-medio/80 border-2 border-borda/30 rounded-3xl p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:brightness-110">
                        <div ref={menuFotoRef} className="relative flex shrink-0">
                            <div
                                role="button"
                                tabIndex={0}
                                aria-label="Opções da foto do perfil"
                                aria-expanded={menuFotoAberto}
                                className="flex shrink-0 items-center justify-center w-32 h-32 rounded-full bg-fundo-medio border-2 hover:brightness-125 transition-all duration-300 cursor-pointer p-2 border-borda shadow-lg overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                onClick={() => setMenuFotoAberto((v) => !v)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setMenuFotoAberto((v) => !v);
                                    }
                                }}
                            >
                                <img
                                    className="w-full h-full shrink-0 rounded-full object-cover transition-opacity"
                                    src={foto}
                                    alt="Ícone do usuário"
                                    onError={(e) => {
                                        e.currentTarget.src = perfilImg;
                                    }}
                                />
                            </div>

                            <input
                                ref={inputFotoRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                className="hidden"
                                onChange={handleAlterarFoto}
                            />

                            {menuFotoAberto && (
                                <div
                                    role="menu"
                                    aria-label="Ações da foto do perfil"
                                    className="absolute top-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-48 z-[999] rounded-2xl border border-borda/40 bg-fundo-medio shadow-2xl overflow-hidden py-1.5"
                                >
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => {
                                            setMenuFotoAberto(false);
                                            setFloating(true);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-pri hover:bg-fundo-razo/70 transition-colors cursor-pointer"
                                    >
                                        <Eye className="w-4 h-4 text-sec" />
                                        Ver imagem
                                    </button>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        disabled={enviandoFoto}
                                        onClick={() => {
                                            setMenuFotoAberto(false);
                                            inputFotoRef.current?.click();
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-pri hover:bg-fundo-razo/70 transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        <ImagePlus className="w-4 h-4 text-accent" />
                                        {enviandoFoto ? "Enviando..." : "Alterar imagem"}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 flex-1 text-center sm:text-left">
                            <h2 className="text-pri text-2xl font-bold">{nome}</h2>
                            <p className="text-sec text-lg">{funcao}</p>

                            <div className="flex justify-center sm:justify-start mt-1">
                                <span
                                    className={`flex items-center gap-2 ${
                                        ativo ? "bg-sec-verde/20" : "bg-sec-vermelho/20"
                                    } text-pri rounded-lg px-3 py-1 text-sm font-semibold`}
                                >
                                    <div className="relative flex flex-row">
                                        {ativo && (
                                            <span className="absolute inset-0 w-3 h-3 rounded-full animate-ping-m opacity-50 bg-sec-verde" />
                                        )}
                                        <span
                                            className={`w-3 h-3 rounded-full ${
                                                ativo ? "bg-sec-verde" : "bg-sec-vermelho"
                                            }`}
                                        />
                                    </div>
                                    {ativo ? "Ativo" : "Inativo"}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2">
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-sec">
                                    <Mail className="w-5 h-5" />
                                    {email}
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
                                {dadosPessoais.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex justify-between items-center py-4 border-b border-borda/50"
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
                                {informacoesConta.map((item) => (
                                    <div
                                        key={item.label}
                                        className={`flex justify-between items-center py-4 ${
                                            item.label !== "Status" ? "border-b border-borda/20" : ""
                                        }`}
                                    >
                                        <span className="text-sec">{item.label}</span>

                                        {item.status !== undefined ? (
                                            <span className="flex items-center gap-2 text-pri font-medium">
                                                <span
                                                    className={`w-3 h-3 rounded-full ${
                                                        item.status ? "bg-sec-verde" : "bg-sec-vermelho"
                                                    }`}
                                                />
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

                    {isAdminTi && (
                        <Link
                            to="/usuarios"
                            className="group w-full flex items-center justify-between gap-5 mt-5 p-5 text-left bg-fundo-medio/80 border-2 border-borda/30 rounded-3xl text-pri cursor-pointer transition-all duration-300 hover:brightness-125 hover:border-borda/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                            <div className="flex flex-row gap-5">
                                <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-sec-azul text-white transition-all duration-300 group-hover:opacity-80">
                                    <Users className="w-7 h-7" />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-lg font-bold">Gerenciar Usuários e Perfis</span>
                                    <span className="text-sec text-sm">
                                        Cadastre, edite, inative contas e atribua permissões institucionais.
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className="w-7 h-7 text-borda transition-all duration-300 group-hover:text-pri group-hover:translate-x-1" />
                        </Link>
                    )}

                    <Link
                        to="/configuracoes"
                        className="group w-full flex items-center justify-between gap-5 mt-5 p-5 text-left bg-fundo-medio/80 border-2 border-borda/30 rounded-3xl text-pri cursor-pointer transition-all duration-300 hover:brightness-125 hover:border-borda/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                        <div className="flex flex-row gap-5">
                            <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-accent text-white transition-all duration-300 group-hover:opacity-50">
                                <Settings className="w-7 h-7 transition-transform duration-300 group-hover:rotate-90" />
                            </div>
                            <div className="flex flex-col flex-1">
                                <span className="text-lg font-bold">Configurações</span>
                                <span className="text-sec text-sm">
                                    Ajuste suas configurações de conta e sistema.
                                </span>
                            </div>
                        </div>
                        <ChevronRight className="w-7 h-7 text-borda transition-all duration-300 group-hover:text-pri group-hover:translate-x-1" />
                    </Link>
                </main>
            </div>

            <div
                id="floatingWindowUserImage"
                className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-[opacity,backdrop-filter] duration-500 ${
                    floating ? "opacity-100 pointer-events-auto backdrop-blur-[3px]" : "pointer-events-none opacity-0"
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
                            onError={(e) => {
                                e.currentTarget.src = perfilImg;
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default InfoUsuario;
