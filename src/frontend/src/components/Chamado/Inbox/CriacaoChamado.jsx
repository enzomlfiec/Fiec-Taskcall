import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function CriacaoChamado() {
    const [titulo, setTitulo] = React.useState("")
    const [categoria, setCategoria] = React.useState("")
    const [descrição, setDescrição] = React.useState("")
    // const [first, setfirst] = React.useState("")

    function handleSubmit(event) {
        event.preventDefault()
    }

    return (
        <main className="flex min-h-screen w-screen items-center justify-center bg-[url(public/assets/login2.png)] bg-cover px-4 py-8 text-white">
            <section
                aria-labelledby="titulo-criacao-chamado"
                className="flex w-full max-w-3xl flex-col justify-center gap-5 rounded-4xl border-2 border-sec backdrop-blur-2xl p-6 md:p-10"
            >
                <div>
                    <Link to="/inbox">
                        <ArrowLeft
                            className="cursor-pointer w-6 h-6 text-borda hover:text-white transition-all duration-200 "

                        />
                    </Link>
                </div>
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 id="titulo-criacao-chamado" className="text-3xl font-bold text-white">
                        Criar Chamado
                    </h1>

                    <nav aria-label="Ações do chamado" className="flex flex-col gap-3 sm:items-end">
                        <button
                            type="button"
                            className="bg-accent botao h-10 min-w-32 rounded-md px-4 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-fundo-medio"
                        >
                            Rascunhos
                        </button>
                        <button
                            type="button"
                            className="bg-accent botao h-10 min-w-32 rounded-md px-4 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-fundo-medio"
                        >
                            Chamados Anteriores
                        </button>
                    </nav>
                </header>

                <hr aria-hidden="true" className="mt-1 w-full rounded-full border-0 bg-borda" />

                <form aria-label="Formulário de criação de chamado" className="flex w-full flex-col gap-5">
                    <div className="flex w-full flex-col gap-2">
                        <label htmlFor="titulo-chamado" className="font-bold text-white">
                            Título do Chamado
                            <span aria-hidden="true" className="ml-1 text-accent font-bold">*</span>
                        </label>
                        <input
                            // onChange={}
                            id="titulo-chamado"
                            name="titulo"
                            type="text"
                            required
                            aria-required="true"
                            placeholder="Insira aqui o título do chamado"
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-white placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-fundo-medio"
                        />
                    </div>

                    <div className="flex w-full flex-col gap-2">
                        <label htmlFor="categoria-chamado" className="font-bold text-white">
                            Categoria
                            <span aria-hidden="true" className="ml-1 text-accent font-bold">*</span>
                        </label>
                        <select
                            id="categoria-chamado"
                            name="categoria"
                            required
                            aria-required="true"
                            defaultValue=""
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-fundo-medio"
                        >
                            <option value="" disabled>
                                Selecione uma categoria
                            </option>
                            <option value="categoria1">Hardware</option>
                            <option value="categoria2">Software</option>
                        </select>
                    </div>

                    <div className="flex w-full flex-col gap-2">
                        <label htmlFor="descricao-chamado" className="font-bold text-white">
                            Descrição do Chamado
                            <span aria-hidden="true" className="ml-1 text-accent font-bold">*</span>
                        </label>
                        <textarea
                            id="descricao-chamado"
                            name="descricao"
                            required
                            aria-required="true"
                            rows="6"
                            placeholder="Descreva o problema ou a solicitação"
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-white placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-fundo-medio"
                        />
                    </div>

                    <p className="text-sm text-slate-300">
                        Campos marcados com <span aria-hidden="true" className="font-bold text-accent">*</span> são obrigatórios.
                    </p>

                    <div className="flex items-center justify-center pt-2">
                        <button
                            type="submit"
                            className="bg-accent botao h-11 min-w-40 rounded-md px-6 text-base font-bold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-fundo-medio"
                        >
                            Enviar chamado
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default CriacaoChamado;
