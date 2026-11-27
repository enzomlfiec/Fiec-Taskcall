import React from "react";
import { Edit3, Plus, Search, Shield, Trash2, UserCheck, UserX, Users } from "lucide-react";
import SideBar from "../components/SideBar";
import LayoutUsuario from "../components/LayoutUsuario";
import { usuariosAdminApi } from "../services/api";
import { alertaConfirmacao, alertaErro, alertaSucesso } from "../utils/alertaSite";
import { useAuth } from "../context/AuthContext";

const PERFIL_NOMES = {
    usuario: "Usuário",
    coordenador: "Coordenadora",
    ti: "TI",
};

function GerenciarUsuarios({ collapsed, setCollapsed }) {
    const { usuario: usuarioAtual } = useAuth();
    const [usuarios, setUsuarios] = React.useState([]);
    const [carregando, setCarregando] = React.useState(true);
    const [busca, setBusca] = React.useState("");
    const [filtroPerfil, setFiltroPerfil] = React.useState("");
    const [filtroAtivo, setFiltroAtivo] = React.useState("");

    const [formAberto, setFormAberto] = React.useState(false);
    const [editandoId, setEditandoId] = React.useState(null);
    const [nome, setNome] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [rm, setRm] = React.useState("");
    const [funcao, setFuncao] = React.useState("");
    const [perfil, setPerfil] = React.useState("usuario");
    const [isAdminTi, setIsAdminTi] = React.useState(false);
    const [senha, setSenha] = React.useState("");
    const [salvando, setSalvando] = React.useState(false);

    const carregarUsuarios = React.useCallback(async () => {
        setCarregando(true);
        try {
            const res = await usuariosAdminApi.listar({
                busca,
                perfil: filtroPerfil,
                ativo: filtroAtivo,
            });
            setUsuarios(Array.isArray(res) ? res : []);
        } catch (err) {
            await alertaErro({
                title: "Erro ao carregar usuários",
                text: err.message,
            });
        } finally {
            setCarregando(false);
        }
    }, [busca, filtroPerfil, filtroAtivo]);

    React.useEffect(() => {
        carregarUsuarios();
    }, [carregarUsuarios]);

    function abrirNovo() {
        setEditandoId(null);
        setNome("");
        setEmail("");
        setRm("");
        setFuncao("");
        setPerfil("usuario");
        setIsAdminTi(false);
        setSenha("");
        setFormAberto(true);
    }

    function abrirEdicao(u) {
        setEditandoId(u.id_usuario);
        setNome(u.nome || "");
        setEmail(u.email || "");
        setRm(u.possui_rm && u.rm ? String(u.rm) : "");
        setFuncao(u.funcao || "");
        setPerfil(u.perfil || "usuario");
        setIsAdminTi(Boolean(u.is_admin_ti));
        setSenha("");
        setFormAberto(true);
    }

    async function handleSalvar(e) {
        e.preventDefault();
        if (salvando) return;
        setSalvando(true);

        const payload = {
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            rm: rm.trim() !== "" ? rm.trim() : null,
            funcao: funcao.trim() !== "" ? funcao.trim() : null,
            perfil,
            is_admin_ti: perfil === "ti" ? isAdminTi : false,
        };
        if (senha !== "") {
            payload.senha = senha;
        }

        try {
            if (editandoId) {
                await usuariosAdminApi.atualizar(editandoId, payload);
                await alertaSucesso({
                    title: "Usuário atualizado",
                    text: "Dados e permissões salvos com sucesso.",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                await usuariosAdminApi.criar(payload);
                await alertaSucesso({
                    title: "Usuário cadastrado",
                    text: "Nova conta institucional criada com sucesso.",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
            setFormAberto(false);
            await carregarUsuarios();
        } catch (err) {
            await alertaErro({
                title: "Falha ao salvar usuário",
                text: err.message,
            });
        } finally {
            setSalvando(false);
        }
    }

    async function handleAlternarAtivo(u) {
        const novoAtivo = !u.ativo;
        const conf = await alertaConfirmacao({
            title: novoAtivo ? `Reativar ${u.nome}?` : `Inativar ${u.nome}?`,
            text: novoAtivo
                ? "O usuário voltará a ter acesso ao sistema."
                : "O usuário será desconectado e impedido de acessar o sistema, mantendo seu histórico.",
            confirmButtonText: novoAtivo ? "Sim, reativar" : "Sim, inativar",
        });
        if (!conf.isConfirmed) return;

        try {
            await usuariosAdminApi.inativar(u.id_usuario, novoAtivo);
            await carregarUsuarios();
        } catch (err) {
            await alertaErro({
                title: "Erro ao alterar status da conta",
                text: err.message,
            });
        }
    }

    async function handleTentarExcluir(u) {
        const conf = await alertaConfirmacao({
            title: `Excluir conta de ${u.nome}?`,
            text: "Contas com chamados vinculados não podem ser excluídas definitivamente e devem ser inativadas.",
            confirmButtonText: "Verificar e excluir",
        });
        if (!conf.isConfirmed) return;

        try {
            await usuariosAdminApi.remover(u.id_usuario);
            await alertaSucesso({
                title: "Usuário removido",
                text: "Conta sem vínculos removida.",
                timer: 1500,
                showConfirmButton: false,
            });
            await carregarUsuarios();
        } catch (err) {
            await alertaErro({
                title: "Exclusão bloqueada",
                text: err.message,
            });
        }
    }

    return (
        <div className="flex z-10 min-h-screen w-full bg-login bg-cover bg-center justify-center items-stretch overflow-x-hidden overflow-y-auto">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
            <main
                className={`w-full min-w-0 min-h-screen px-4 sm:px-6 lg:px-10 pt-5 pb-24 md:py-8 transition-all duration-300 ${
                    !collapsed ? "md:ml-20" : "md:ml-0"
                }`}
            >
                <div className="flex flex-col gap-5 max-w-7xl mx-auto">
                    <header className="flex flex-wrap items-center justify-between gap-4">
                        <LayoutUsuario />
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-pri opacity-75" />
                            <h1 className="text-2xl sm:text-3xl font-bold text-pri">
                                Usuários e Permissões
                            </h1>
                        </div>
                    </header>

                    <section className="rounded-3xl border border-borda/30 bg-fundo-medio/85 p-5 text-pri flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2.5 flex-1">
                                <div className="relative flex-1 min-w-56">
                                    <Search className="w-4 h-4 text-sec absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value)}
                                        placeholder="Buscar por nome, e-mail, RM ou função..."
                                        className="w-full rounded-xl border border-borda/30 bg-fundo-razo pl-9 pr-3 py-2 text-sm text-pri placeholder:text-sec/60"
                                    />
                                </div>

                                <select
                                    value={filtroPerfil}
                                    onChange={(e) => setFiltroPerfil(e.target.value)}
                                    aria-label="Filtrar por perfil"
                                    className="rounded-xl border border-borda/30 bg-fundo-razo px-3 py-2 text-sm text-pri"
                                >
                                    <option value="">Todos os perfis</option>
                                    <option value="usuario">Usuário</option>
                                    <option value="coordenador">Coordenadora</option>
                                    <option value="ti">TI</option>
                                </select>

                                <select
                                    value={filtroAtivo}
                                    onChange={(e) => setFiltroAtivo(e.target.value)}
                                    aria-label="Filtrar por situação"
                                    className="rounded-xl border border-borda/30 bg-fundo-razo px-3 py-2 text-sm text-pri"
                                >
                                    <option value="">Todos os status</option>
                                    <option value="1">Ativos</option>
                                    <option value="0">Inativos</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={abrirNovo}
                                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-[0px_4px_0px_0px_#740510] cursor-pointer hover:brightness-110"
                            >
                                <Plus className="w-4 h-4" />
                                Novo Usuário
                            </button>
                        </div>

                        {formAberto && (
                            <form
                                onSubmit={handleSalvar}
                                className="rounded-2xl border border-borda/35 bg-fundo-fundo p-4 sm:p-5 flex flex-col gap-4"
                            >
                                <h2 className="text-lg font-bold text-pri">
                                    {editandoId ? "Editar Usuário" : "Cadastrar Usuário"}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nome completo *"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        className="rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-sm text-pri"
                                    />
                                    <input
                                        type="email"
                                        required
                                        placeholder="E-mail @fiec.edu.br *"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-sm text-pri"
                                    />
                                    <input
                                        type="text"
                                        placeholder={
                                            perfil === "ti"
                                                ? "RM numérico (obrigatório para TI) *"
                                                : "RM numérico (opcional)"
                                        }
                                        required={perfil === "ti" && !editandoId}
                                        value={rm}
                                        onChange={(e) => setRm(e.target.value)}
                                        className="rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-sm text-pri"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Função institucional (ex: Professor, Secretário)"
                                        value={funcao}
                                        onChange={(e) => setFuncao(e.target.value)}
                                        className="rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-sm text-pri"
                                    />
                                    <select
                                        value={perfil}
                                        onChange={(e) => setPerfil(e.target.value)}
                                        aria-label="Perfil de acesso"
                                        className="rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-sm text-pri"
                                    >
                                        <option value="usuario">Perfil: Usuário</option>
                                        <option value="coordenador">Perfil: Coordenadora</option>
                                        <option value="ti">Perfil: Equipe de TI</option>
                                    </select>
                                    <input
                                        type="password"
                                        required={!editandoId}
                                        minLength={8}
                                        placeholder={editandoId ? "Nova senha (opcional)" : "Senha inicial (mín. 8) *"}
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        className="rounded-lg border border-borda/30 bg-fundo-razo p-2.5 text-sm text-pri"
                                    />
                                </div>

                                {perfil === "ti" && (
                                    <label className="flex items-center gap-2 text-sm text-pri cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isAdminTi}
                                            onChange={(e) => setIsAdminTi(e.target.checked)}
                                            className="w-4 h-4 checkbox rounded border-borda/60"
                                        />
                                        <Shield className="w-4 h-4 text-sec-azul" />
                                        Conceder permissão administrativa de TI (gerenciar usuários e perfis)
                                    </label>
                                )}

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormAberto(false)}
                                        className="rounded-lg bg-fundo-razo px-4 py-2 text-sm font-semibold text-sec hover:text-pri cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={salvando}
                                        className="rounded-lg bg-sec-verde px-4 py-2 text-sm font-semibold text-white cursor-pointer hover:brightness-110 disabled:opacity-60"
                                    >
                                        {salvando ? "Salvando..." : "Salvar"}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="overflow-x-auto scroll">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-borda/30 text-sec">
                                        <th className="py-3 px-2">Nome</th>
                                        <th className="py-3 px-2">E-mail</th>
                                        <th className="py-3 px-2">RM</th>
                                        <th className="py-3 px-2">Função</th>
                                        <th className="py-3 px-2">Perfil</th>
                                        <th className="py-3 px-2">Status</th>
                                        <th className="py-3 px-2 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-borda/20">
                                    {carregando ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-sec">
                                                Carregando contas...
                                            </td>
                                        </tr>
                                    ) : usuarios.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-sec">
                                                Nenhum usuário encontrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        usuarios.map((u) => {
                                            const isSelf = Number(u.id_usuario) === Number(usuarioAtual?.id_usuario);
                                            return (
                                                <tr key={u.id_usuario} className="hover:bg-fundo-razo/30">
                                                    <td className="py-3 px-2 font-semibold text-pri">
                                                        {u.nome}
                                                        {u.is_admin_ti && (
                                                            <span className="ml-2 rounded-full bg-sec-azul/20 px-2 py-0.5 text-[11px] font-semibold text-sec-azul">
                                                                Admin TI
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-2 text-sec">{u.email}</td>
                                                    <td className="py-3 px-2 text-sec">
                                                        {u.possui_rm && u.rm ? u.rm : "Não aplicável"}
                                                    </td>
                                                    <td className="py-3 px-2 text-sec">
                                                        {u.funcao || "Não atribuída"}
                                                    </td>
                                                    <td className="py-3 px-2 text-pri">
                                                        {PERFIL_NOMES[u.perfil] || u.perfil}
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                                u.ativo
                                                                    ? "bg-sec-verde/20 text-sec-verde"
                                                                    : "bg-sec-vermelho/20 text-sec-vermelho"
                                                            }`}
                                                        >
                                                            {u.ativo ? "Ativo" : "Inativo"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => abrirEdicao(u)}
                                                                title="Editar usuário"
                                                                aria-label={`Editar ${u.nome}`}
                                                                className="rounded-lg bg-fundo-razo p-2 text-pri hover:brightness-125 cursor-pointer"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            {!isSelf && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleAlternarAtivo(u)}
                                                                        title={u.ativo ? "Inativar conta" : "Reativar conta"}
                                                                        aria-label={u.ativo ? `Inativar ${u.nome}` : `Reativar ${u.nome}`}
                                                                        className="rounded-lg bg-fundo-razo p-2 text-sec-amarelo hover:brightness-125 cursor-pointer"
                                                                    >
                                                                        {u.ativo ? (
                                                                            <UserX className="w-4 h-4" />
                                                                        ) : (
                                                                            <UserCheck className="w-4 h-4" />
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleTentarExcluir(u)}
                                                                        title="Excluir conta sem vínculos"
                                                                        aria-label={`Excluir ${u.nome}`}
                                                                        className="rounded-lg bg-fundo-razo p-2 text-sec-vermelho hover:brightness-125 cursor-pointer"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default GerenciarUsuarios;
