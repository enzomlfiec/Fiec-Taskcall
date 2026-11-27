import { useNavigate, Link, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import { EyeClosed, Eye } from "lucide-react";
import { alertaErro, alertaSucesso } from "../utils/alertaSite";
import { useAuth } from "../context/AuthContext";

function Login({ isClaro = false }) {
    const navigate = useNavigate();
    const { autenticado, entrar } = useAuth();
    const [login, setLogin] = React.useState("");
    const [senha, setSenha] = React.useState("");
    const [valid, setValid] = React.useState(false);
    const [enviando, setEnviando] = React.useState(false);
    const [passtype, setPassType] = React.useState("password");

    useEffect(() => {
        if (senha !== "" && login.trim() !== "") {
            setValid(true);
        } else {
            setValid(false);
        }
    }, [senha, login]);

    if (autenticado) {
        return <Navigate to="/tela-principal" replace />;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (enviando) return;

        setEnviando(true);
        try {
            const resposta = await entrar({
                login: login.trim(),
                senha,
            });

            await alertaSucesso({
                title: "Login realizado!",
                text: resposta?.usuario?.nome
                    ? `Bem-vindo(a) de volta, ${resposta.usuario.nome}!`
                    : "Acesso liberado com sucesso.",
                timer: 1400,
                confirmButtonText: "Continuar",
            });

            navigate("/tela-principal");
        } catch (err) {
            await alertaErro({
                title: err.status === 403 ? "Conta inativa" : "Falha ao entrar",
                text:
                    err.message ||
                    "RM/Email ou senha incorretos. Verifique seus dados e tente novamente.",
                confirmButtonText: "Tentar novamente",
            });
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="flex flex-col relative min-h-screen w-full items-center justify-center bg-login bg-cover bg-center px-4 py-6">
            <div className="flex flex-col relative w-full items-center justify-center gap-4">
                <img
                    id="logo"
                    src={isClaro ? "/assets/logo/logo-hor-claro.png" : "/assets/logo/logo-hor.png"}
                    alt="Logo FIEC Taskcall"
                    className="w-full max-w-125 px-4"
                />

                <form
                    onSubmit={handleSubmit}
                    className="relative flex w-full max-w-xl flex-col items-center text-pri bg-fundo-medio/30 backdrop-blur-sm p-6 sm:p-12 md:p-16 md:px-20 gap-3 rounded-3xl sm:rounded-4xl border-sec border-2"
                >
                    <div className="flex w-full flex-col gap-3 items-baseline">
                        <div className="flex items-center justify-center mb-1">
                            <h1 className="select-none text-2xl sm:text-3xl font-bold">Entrar</h1>
                        </div>

                        <div>
                            <label htmlFor="login-identificacao" className="font-bold">
                                RM ou Email
                            </label>
                            <span className="text-accent font-bold select-none" aria-hidden="true">
                                {" "}*{" "}
                            </span>
                        </div>
                        <input
                            id="login-identificacao"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="text-pri bg-fundo-profundo font-medium w-full rounded-md p-2.5 focus-visible:outline-2 focus-visible:outline-accent"
                            type="text"
                            required
                            placeholder="*Insira seu código RM ou Email."
                        />

                        <div>
                            <label htmlFor="login-senha" className="font-bold">
                                Senha
                            </label>
                            <span className="text-accent font-bold select-none" aria-hidden="true">
                                {" "}*{" "}
                            </span>
                        </div>
                        <div className="flex w-full flex-row items-center justify-center gap-2">
                            <input
                                id="login-senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="text-pri bg-fundo-profundo font-medium w-full rounded-md p-2.5 [&::-ms-reveal]:hidden [&::-webkit-password-toggle-button]:hidden focus-visible:outline-2 focus-visible:outline-accent"
                                type={passtype}
                                required
                                placeholder="*Insira a senha vinculada ao perfil."
                                minLength={8}
                            />
                            <button
                                type="button"
                                aria-label={passtype === "password" ? "Mostrar senha" : "Ocultar senha"}
                                aria-pressed={passtype === "text"}
                                className="cursor-pointer rounded p-1.5 text-pri focus-visible:outline-2 focus-visible:outline-accent"
                                onClick={() =>
                                    setPassType((prev) => (prev === "password" ? "text" : "password"))
                                }
                            >
                                {passtype === "password" ? <EyeClosed /> : <Eye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center mt-4 mb-2">
                        <button
                            type="submit"
                            disabled={!valid || enviando}
                            className="botao text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:scale-97 disabled:bg-[#740510] bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pri"
                        >
                            {enviando ? "Entrando..." : "Entrar"}
                        </button>
                    </div>

                    <p className="text-sm sm:text-base text-center">
                        Não tem uma conta?
                        <Link
                            to="/registro"
                            className="text-accent font-semibold ml-2 hover:underline focus-visible:outline-2 focus-visible:outline-accent rounded"
                        >
                            Cadastrar
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
