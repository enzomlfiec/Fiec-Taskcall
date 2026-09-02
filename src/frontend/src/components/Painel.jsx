function Painel() {

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
                <input className="text-black bg-white w-lg rounded-md p-2" type="text" placeholder="*Insira a senha vinculada ao perfil." />
                <br></br>
                <div className="flex items-center justify-center">
                    <button className="bg-accent w-50 h-10 rounded-md shadow-[0px_8px_0px_0px_#740510] cursor-pointer hover:scale-105 transition-transform"> Entrar </button>
                </div>
            </div>
        </div>
    )

}

export default Painel
