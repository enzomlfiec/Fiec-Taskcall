import { useNavigate } from "react-router-dom"
import React, { useEffect } from "react";
import { cadastrarUsuario } from "../api";
import { Link } from "react-router-dom";
import { EyeClosed } from "lucide-react";
import { Eye } from "lucide-react";

function Registro() {

    const navigate = useNavigate();
    const [campoRM, setCampoRM] = React.useState("")
    const [campoNome, setCampoNome] = React.useState("")
    const [campoEmail, setCampoEmail] = React.useState("")
    const [campoSenha, setCampoSenha] = React.useState("")
    const [campoValid, setCampoValid] = React.useState(false)
    const [passtype, setPassType] = React.useState("password")
    const [erro, setErro] = React.useState("")
    const [salvando, setSalvando] = React.useState(false)


    useEffect(() => {
        if (campoNome.trim() && campoSenha.length >= 8 && campoRM.trim() && campoEmail.trim()) {
            setCampoValid(true)
        } else { setCampoValid(false) }
    }, [campoNome, campoSenha, campoRM, campoEmail])

    async function handleSubmit(event) {
        event.preventDefault()
        setErro("")
        setSalvando(true)
        try {
            await cadastrarUsuario({
                nome: campoNome.trim(),
                rm: campoRM,
                email: campoEmail.trim(),
                senha: campoSenha,
            })
            window.alert("Usuário cadastrado com sucesso. Faça login para continuar.")
            navigate("/login")
        } catch (error) {
            setErro(error.message || "Não foi possível cadastrar o usuário.")
        } finally {
            setSalvando(false)
        }
    }

    // const userInfo = userMockData.find(validarUsuario)

    return (
        <div className="flex flex-col relative h-screen w-screen items-center justify-center bg-[url(public/assets/Login2.png)] bg-cover">
            <div className="flex flex-col relative h-screen w-screen items-center justify-center bottom-10">
                <img id="logo" src="public/assets/logo/logo-hor.png" className="w-125"></img>
                <div className="flex flex-col gap-4 items-baseline">


                    <form onSubmit={handleSubmit} className="relative flex flex-col items-center text-pri bg-fundo-medio/20 backdrop-blur-sm p-20 pr-30 pl-30 gap-3 rounded-4xl border-sec border-2">
                        <div className="flex flex-col gap-4 items-baseline">
                            <div className="flex items-center justify-center">
                                <h1 className="select-none text-3xl font-bold">Cadastrar</h1>
                            </div>
                            {erro && <p role="alert" className="max-w-lg rounded-md bg-sec-vermelho/20 p-3 text-sec-vermelho">{erro}</p>}
                            <div>
                                <label className="font-bold">Nome</label>
                                <span className="text-accent font-bold select-none"> * </span>
                            </div>
                            <input
                                value={campoNome}
                                onChange={(e) => setCampoNome(e.target.value)}
                                required
                                className="text-pri bg-fundo-profundo font-medium w-lg rounded-md p-2"
                                type="text"
                                placeholder="*Insira o nome do usuário."
                            />
                            <div>
                                <label className="font-bold">RM</label>
                                <span className="text-accent font-bold select-none"> * </span>
                            </div>
                            <input
                                value={campoRM}
                                onChange={(e) => setCampoRM(e.target.value)}
                                required
                                className="text-pri bg-fundo-profundo font-medium w-lg rounded-md p-2"
                                type="number"
                                placeholder="*Insira o código RM do usuário."
                            />
                            <div>
                                <label className="font-bold">Email</label>
                                <span className="text-accent font-bold select-none"> * </span>
                            </div>
                            <input
                                value={campoEmail}
                                onChange={(e) => setCampoEmail(e.target.value)}
                                required
                                className="text-pri bg-fundo-profundo font-medium w-lg rounded-md p-2"
                                type="email"
                                autoComplete="email"
                                placeholder="*Insira o Email do usuário."
                            />

                            <div>
                                <label className="font-bold">Senha</label>
                                <span className="text-accent font-bold select-none"> * </span>
                            </div>
                            <div className="flex flex-row items-center justify-center gap-2">
                                <input value={campoSenha}
                                    onChange={(e) => setCampoSenha(e.target.value)}
                                    required
                                    minLength={8}
                                    maxLength={72}
                                    className="text-pri bg-fundo-profundo font-medium w-lg rounded-md p-2"
                                    type={passtype}
                                    autoComplete="new-password"
                                    placeholder="*Insira a senha vinculada ao perfil."
                                />
                                <span
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (passtype == "password") {
                                            setPassType("text")
                                        } else {
                                            setPassType("password")
                                        }
                                    }}
                                >
                                    {passtype == "password" ? <EyeClosed /> : <Eye />}
                                </span>
                            </div>
                            <br></br>

                            <br></br>
                        </div>
                        <div className="flex items-center justify-center">
                            <button type="submit" disabled={!campoValid || salvando} className="botao disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:scale-97 disabled:bg-[#740510] bg-accent"> {salvando ? "Salvando..." : "Cadastrar"} </button>
                        </div>

                        <p>
                            Já tem uma conta?
                            <Link to="/login" className="text-accent ml-2 hover:underline">
                                Faça login
                            </Link>
                        </p>
                    </form>
                    {/* onClick={() => navigate("/tela-principal")} */}
                </div>
            </div>
        </div>
    )

}

export default Registro
