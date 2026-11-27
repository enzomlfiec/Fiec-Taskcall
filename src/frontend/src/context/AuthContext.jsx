import React from "react";
import { authApi } from "../services/api";

const AuthContext = React.createContext(null);

function lerUsuarioCache() {
    try {
        const bruto = localStorage.getItem("taskcall:usuario");
        return bruto ? JSON.parse(bruto) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = React.useState(() => lerUsuarioCache());
    const [carregando, setCarregando] = React.useState(() => Boolean(localStorage.getItem("taskcall:token")));

    const carregarSessao = React.useCallback(async () => {
        const token = localStorage.getItem("taskcall:token");
        if (!token) {
            setUsuario(null);
            setCarregando(false);
            return null;
        }

        try {
            const dados = await authApi.me();
            localStorage.setItem("taskcall:usuario", JSON.stringify(dados));
            setUsuario(dados);
            return dados;
        } catch {
            localStorage.removeItem("taskcall:token");
            localStorage.removeItem("taskcall:usuario");
            setUsuario(null);
            return null;
        } finally {
            setCarregando(false);
        }
    }, []);

    React.useEffect(() => {
        carregarSessao();
    }, [carregarSessao]);

    const entrar = React.useCallback(async (credenciais) => {
        const resposta = await authApi.login(credenciais);
        localStorage.setItem("taskcall:token", resposta.token);
        localStorage.setItem("taskcall:usuario", JSON.stringify(resposta.usuario));
        setUsuario(resposta.usuario);
        return resposta;
    }, []);

    const sair = React.useCallback(async () => {
        try {
            if (localStorage.getItem("taskcall:token")) {
                await authApi.logout();
            }
        } catch {
            // Mesmo se o token já tiver expirado, limpa a sessão local
        } finally {
            localStorage.removeItem("taskcall:token");
            localStorage.removeItem("taskcall:usuario");
            setUsuario(null);
        }
    }, []);

    const atualizarUsuario = React.useCallback((novoUsuario) => {
        if (!novoUsuario) return;
        localStorage.setItem("taskcall:usuario", JSON.stringify(novoUsuario));
        setUsuario(novoUsuario);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                carregando,
                autenticado: Boolean(usuario && localStorage.getItem("taskcall:token")),
                entrar,
                sair,
                atualizarUsuario,
                recarregarSessao: carregarSessao,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = React.useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth deve ser utilizado dentro de AuthProvider.");
    }
    return ctx;
}
