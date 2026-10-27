import { useNavigate } from "react-router-dom"
import React, { useEffect } from "react";
import { autenticarUsuario } from "../api";
import { Link } from "react-router-dom";
import { EyeClosed } from "lucide-react";
import { Eye } from "lucide-react";

function Login() {

    const navigate = useNavigate();
    const [login, setLogin] = React.useState("")
    const [senha, setSenha] = React.useState("")
    const [valid, setValid] = React.useState(false)
    const [passtype, setPassType] = React.useState("password")
    const [erro, setErro] = React.useState("")
    const [entrando, setEntrando] = React.useState(false)

    useEffect(() => {
        if (senha != "" && login != "") {
            setValid(true)
        } else { setValid(false) }
    }, [senha, login])

    async function handleSubmit(event) {
        event.preventDefault()
        setErro("")
        setEntrando(true)
        try {
            const usuario = await autenticarUsuario({ login: login.trim(), senha })
            localStorage.setItem("authToken", usuario.token)
            localStorage.setItem("userInfo", JSON.stringify({
                id: usuario.id,
                uid: usuario.uid,
                name: usuario.nome,
                cargo: usuario.cargo,
                email: usuario.email,
                RM: usuario.rm,
            }))
            navigate("/tela-principal")
        } catch (error) {
            setErro(error.message || "RM/e-mail ou senha incorretos.")
        } finally {
            setEntrando(false)
        }
    }

    return (
        <div className="flex flex-col relative h-screen w-screen items-center justify-center bg-[url(public/assets/Login2.png)] bg-cover">
            <div className="flex flex-col relative h-screen w-screen items-center justify-center bottom-10">
                <img id="logo" src="public/assets/logo/logo-hor.png" className="w-125" alt="Taskcall" />

                <form onSubmit={handleSubmit} className="relative flex flex-col items-center text-pri bg-fundo-medio/20 backdrop-blur-sm p-20 pr-30 pl-30 gap-3 rounded-4xl border-sec border-2">
                    <div className="flex flex-col gap-4 items-baseline">
                        <div className="flex items-center justify-center">
                            <h1 className="select-none text-3xl font-bold">Entrar</h1>
                        </div>
                        {erro && <p role="alert" className="max-w-lg rounded-md bg-sec-vermelho/20 p-3 text-sec-vermelho">{erro}</p>}
                        <div>
                            <label className="font-bold">RM/Email</label>
                            <span className="text-accent font-bold select-none"> * </span>
                        </div>
                        <input
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                            autoComplete="username"
                            className="text-pri bg-fundo-profundo font-medium w-lg rounded-md p-2"
                            type="text"
                            placeholder="*Insira seu código RM ou Email."
                        />

                        <div>
                            <label className="font-bold">Senha</label>
                            <span className="text-accent font-bold select-none"> * </span>
                        </div>
                        <div className="flex flex-row items-center justify-center gap-2">
                            <input value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                className="text-pri bg-fundo-profundo font-medium w-lg rounded-md p-2"
                                type={passtype}
                                autoComplete="current-password"
                                placeholder="*Insira a senha vinculada ao perfil."
                            />
                            <span
                                className="cursor-pointer"
                                onClick={() => setPassType(passtype === "password" ? "text" : "password")}
                            >
                                {passtype === "password" ? <EyeClosed /> : <Eye />}
                            </span>
                        </div>
                        <br />
                    </div>
                    <div className="flex items-center justify-center mb-4">
                        <button type="submit" disabled={!valid || entrando} className="botao disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:scale-97 disabled:bg-[#740510] bg-accent"> {entrando ? "Entrando..." : "Entrar"} </button>
                    </div>
                    <p>
                        Não tem uma conta?
                        <Link to="/registro" className="text-accent ml-2 hover:underline">
                            Cadastre-se
                        </Link>
                    </p>
                </form>
            </div >
        </div >
    )
}

export default Login
