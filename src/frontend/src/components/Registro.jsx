import { useNavigate } from "react-router-dom"
import React, { useEffect } from "react";
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


    useEffect(() => {
        if (campoSenha != "" && campoRM != "" && campoEmail != "") {
            setCampoValid(true)
        } else { setCampoValid(false) }
    }, [campoSenha, campoRM, campoEmail])

    //substituição da função com mock para o banco de dados
   async function handleSubmit(event) {
    event.preventDefault();

    try {
        const response = await fetch("http://localhost:8000/api/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                id_usuario: Number(campoRM), //apesar de ser numero, esse input estava sendo entendido como STRING, por isso colocar o NUMBER
                nome: campoNome,
                email: campoEmail,
                senha: campoSenha,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            alert(data.message ?? "Erro ao cadastrar usuário.");
            return;
        }

        alert("Usuário cadastrado com sucesso!");
        navigate("/login");

    } catch (error) {
        console.error(error);
        alert("Não foi possível conectar ao servidor.");
    }
}

    // const userInfo = userMockData.find(validarUsuario)

    return (
        <div className="flex flex-col relative h-screen w-screen items-center justify-center bg-[url(public/assets/login2.png)] bg-cover">
            <div className="flex flex-col relative h-screen w-screen items-center justify-center bottom-10">
                <img id="logo" src="public/assets/logo/logo-hor.png" className="w-125"></img>
                <div className="flex flex-col gap-4 items-baseline">


                    <form onSubmit={handleSubmit} className="relative flex flex-col items-center text-pri bg-fundo-medio/20 backdrop-blur-sm p-20 pr-30 pl-30 gap-3 rounded-4xl border-sec border-2">
                        <div className="flex flex-col gap-4 items-baseline">
                            <div className="flex items-center justify-center">
                                <h1 className="select-none text-3xl font-bold">Cadastrar</h1>
                            </div>
                            <div>
                                <label className="font-bold">Nome</label>
                                <span className="text-accent font-bold select-none"> * </span>
                            </div>
                            <input
                                value={campoNome}
                                onChange={(e) => setCampoNome(e.target.value)}
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
                                className="text-pri bg-fundo-profundo font-medium w-lg rounded-md p-2"
                                type="text"
                                placeholder="*Insira o Email do usuário."
                            />

                            <div>
                                <label className="font-bold">Senha</label>
                                <span className="text-accent font-bold select-none"> * </span>
                            </div>
                            <div className="flex flex-row items-center justify-center gap-2">
                                <input value={campoSenha}
                                    onChange={(e) => setCampoSenha(e.target.value)}
                                    className="text-pri bg-fundo-profundo font-medium w-lg rounded-md p-2"
                                    type={passtype}
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
                            <button type="submit" disabled={!campoValid} className="botao disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:scale-97 disabled:bg-[#740510] bg-accent"> Cadastrar </button>
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
