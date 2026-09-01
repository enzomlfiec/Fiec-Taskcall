function Painel() {

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[url(public/assets/login2.png)]">
            <div className="flex flex-col text-white bg-mauve-800 p-5 rounded-xl border-white">
                <h1>Entrar</h1>
                <label>RM/Email</label>
                <input className="text-black bg-white w-lg rounded-md p-2" type="text" placeholder="*Insira seu código RM ou Email."/>

                <label>Senha</label>
                <input className="text-black bg-white" type="text" placeholder="*Insira a senha vinculada ao perfil."/>
                <br></br>
                <button className="bg-red-600"> Entrar </button>
            </div>
        </div>
    )

}

export default Painel
