function CriacaoChamado() {
    return <>
        <div className="flex flex-col h-screen w-screen items-center justify-center bg-[url(public/assets/login2.png)]">
            {/* <img id="logo" src="public/assets/logo/logo-hor.png" className="w-125"></img> */}
            <div className="flex flex-col text-white bg-fundo-medio p-20 pt-5 gap-3 rounded-4xl border-sec border-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Criar Chamado</h1>
                    <div className="flex flex-col gap-5">
                        <button className="bg-accent botao w-15 h-10">Test 01</button>
                        <button className="bg-accent botao w-15 h-10">Test 02</button>
                    </div>
                </div>
                <div>
                    <label className="font-bold">Titulo Chamado</label>
                    <asterisco className="text-accent font-bold"> * </asterisco>
                </div>
                <input className="text-white  bg-fundo-razo w-lg rounded-md p-2" type="text" placeholder="*Insira aqui o titulo do chamado" />
                <div>
                    <label className="Categoria">Categoria</label>
                    <asterisco className="text-accent font-bold"> * </asterisco>
                </div>
                {/* <input className="text-white  bg-fundo-razo w-lg rounded-md p-2" type="text" placeholder="*Insira a senha vinculada ao perfil." /> */}
                <select className="text-white  bg-fundo-razo w-lg rounded-md p-2">
                    <option value="">Selecione uma categoria</option>
                    <option value="categoria1">Hardware</option>
                    <option value="categoria2">Software</option>
                </select>
                <br></br>
                <div className="flex items-center justify-center">
                    <button className="bg-accent botao w-3xs h-10"> Entrar </button>
                </div>
            </div>
        </div>

    </>;
}

export default CriacaoChamado;
