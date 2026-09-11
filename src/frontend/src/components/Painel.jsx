import { useNavigate } from "react-router-dom"

function Painel() {

    const navigate = useNavigate()

    return (
        <div className="flex flex-col h-screen w-screen items-center justify-center bg-[url(public/assets/login2.png)]">
            <img id="logo" src="public/assets/logo/logo-hor.png" className="w-125"></img>
            <div className="flex flex-col text-white bg-fundo-medio p-20 pr-30 pl-30 gap-3 rounded-4xl border-sec border-2">
                <div className="flex items-center justify-center">
                    <h1 className="text-3xl font-bold">Entrar</h1>
                </div>
                <div>
                    <label className="font-bold">RM/Email</label>
                    <asterisco className="text-accent font-bold"> * </asterisco>
                </div>
                <input className="text-black bg-white w-lg rounded-md p-2" type="text" placeholder="*Insira seu código RM ou Email." />
                <div>
                    <label className="font-bold">Senha</label>
                    <asterisco className="text-accent font-bold"> * </asterisco>
                </div>
                <input className="text-black bg-white w-lg rounded-md p-2" type="password" placeholder="*Insira a senha vinculada ao perfil." />
                <br></br>
                <div className="flex items-center justify-center">
                    <button className="bg-accent botao desabilitado"> Entrar </button>
                </div>
            </div>
        </div>
    )

}

export default Painel
