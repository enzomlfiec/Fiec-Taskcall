import { useNavigate } from "react-router-dom"
import React, { useEffect } from "react";
import userMockData from "../assets/scripts/mock/userMockData";

function Login() {

    const navigate = useNavigate();
    const [login, setLogin] = React.useState("")
    const [senha, setSenha] = React.useState("")
    const [valid, setValid] = React.useState(false)

    useEffect(() => {
        if (senha != "" && login != "") {
            setValid(true)
        } else { setValid(false) }
    }, [senha, login])

    function handleSubmit(event) {
        event.preventDefault()


        const usuario = userMockData.find(

            function (usuario) {
                return (usuario.RM === login || usuario.email === login) &&
                    usuario.senha === senha
            })

        if (usuario) {
            navigate("/tela-principal")
        } else {
            alert("RM/Email ou senha incorretos.")
        }
    }

    // const userInfo = userMockData.find(validarUsuario)

    return (
        <div className="flex flex-col relative h-screen w-screen items-center justify-center bg-[url(public/assets/login2.png)] bg-cover">
            <div className="flex flex-col relative h-screen w-screen items-center justify-center bottom-10">
                <img id="logo" src="public/assets/logo/logo-hor.png" className="w-125"></img>

                <form onSubmit={handleSubmit} className="relative flex flex-col text-white bg-fundo-medio/20 backdrop-blur-sm p-20 pr-30 pl-30 gap-3 rounded-4xl border-sec border-2">
                    <div className="flex items-center justify-center">
                        <h1 className="select-none text-3xl font-bold">Entrar</h1>
                    </div>
                    <div>
                        <label className="font-bold">RM/Email</label>
                        <asterisco className="text-accent font-bold select-none"> * </asterisco>
                    </div>
                    <input
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="text-white bg-fundo-profundo font-medium w-lg rounded-md p-2"
                        type="text"
                        placeholder="*Insira seu código RM ou Email."
                    />

                    <div>
                        <label className="font-bold">Senha</label>
                        <asterisco className="text-accent font-bold select-none"> * </asterisco>
                    </div>
                    <input value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="text-white bg-fundo-profundo font-medium w-lg rounded-md p-2"
                        type="password"
                        placeholder="*Insira a senha vinculada ao perfil."
                    />

                    <br></br>

                    <div className="flex items-center justify-center">
                        <button type="submit" disabled={!valid} className="botao disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:scale-97 disabled:bg-[#740510] bg-accent"> Entrar </button>
                    </div>
                    {/* onClick={() => navigate("/tela-principal")} */}
                </form>
            </div>
        </div>
    )

}

export default Login
