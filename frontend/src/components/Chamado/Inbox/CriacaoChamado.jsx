import { ArrowLeft } from "lucide-react"
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { criarChamado } from "../../../api"

function CriacaoChamado() {
    // const [campoTitulo, setTitulo] = React.useState("")
    const [campoSala, setSala] = React.useState("")
    const [campoDescricao, setDescricao] = React.useState("")
    const [campoCategoria, setCategoria] = React.useState("")
    const [campoDispositivo, setDispositivo] = React.useState("")
    const [enviando, setEnviando] = React.useState(false)
    const [erro, setErro] = React.useState("")

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setEnviando(true)
        setErro("")

        try {
            await criarChamado({
                sala: campoSala.trim(),
                descricao: campoDescricao.trim(),
                categoria: campoCategoria,
                dispositivo: campoDispositivo.trim(),
            })
            navigate("/inbox")
        } catch (error) {
            setErro(error.message || "Não foi possível criar o chamado.")
        } finally {
            setEnviando(false)
        }
    }

    return (
        <main className="flex min-h-screen w-screen items-center justify-center bg-[url(public/assets/Login2.png)] bg-cover px-4 py-8 text-pri">

            <section className="flex w-full max-w-3xl flex-col gap-5 rounded-4xl border-2 border-sec p-6 backdrop-blur-2xl md:p-10">

                <Link to="/inbox">
                    <div className="cursor-pointer text-borda transition-all duration-300 hover:text-pri">
                        <ArrowLeft />
                    </div>
                </Link>

                <header>
                    <h1 className="text-3xl font-bold text-pri">
                        Criar Chamado
                    </h1>
                </header>

                <hr className="w-full border-0 bg-borda" />

                <form
                    className="flex w-full flex-col gap-5"
                    onSubmit={handleSubmit}
                >

                    {/* Titulo */}

                    {/* <div className="flex w-full flex-col gap-2">
                        <label
                            htmlFor="Titulo"
                            className="font-bold text-pri"
                        >
                            Titulo
                            <span className="ml-1 text-accent">
                                *
                            </span>
                        </label>

                        <input
                            id="Titulo"
                            type="text"
                            required
                            value={campoTitulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Insira seu Titulo"
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        />
                    </div> */}


                    {/* SALA */}

                    <div className="flex w-full flex-col gap-2">
                        <label
                            htmlFor="sala"
                            className="font-bold text-pri"
                        >
                            Sala
                            <span className="ml-1 text-accent">
                                *
                            </span>
                        </label>

                        <input
                            id="sala"
                            type="text"
                            required
                            value={campoSala}
                            onChange={(e) => setSala(e.target.value)}
                            placeholder="Ex: Sala 39"
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        />
                    </div>


                    {/* CATEGORIA */}

                    <div className="flex w-full flex-col gap-2">
                        <label
                            htmlFor="categoria"
                            className="font-bold text-pri"
                        >
                            Categoria
                            <span className="ml-1 text-accent">
                                *
                            </span>
                        </label>

                        <select
                            id="categoria"
                            required
                            value={campoCategoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <option value="" disabled>
                                Selecione uma categoria
                            </option>

                            <option value="Hardware">
                                Hardware
                            </option>

                            <option value="Software">
                                Software
                            </option>
                        </select>
                    </div>


                    {/* CARGO */}
{/* 
                    <div className="flex w-full flex-col gap-2">
                        <label
                            htmlFor="cargo"
                            className="font-bold text-pri"
                        >
                            Cargo
                            <span className="ml-1 text-accent">
                                *
                            </span>
                        </label>

                        <input
                            id="cargo"
                            type="text"
                            required
                            value={campoCargo}
                            onChange={(e) => setCargo(e.target.value)}
                            placeholder="Ex: Professor"
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        />
                    </div> */}


                    {/* DISPOSITIVO */}

                    <div className="flex w-full flex-col gap-2">
                        <label
                            htmlFor="dispositivo"
                            className="font-bold text-pri"
                        >
                            Dispositivo
                            <span className="ml-1 text-accent">
                                *
                            </span>
                        </label>

                        <input
                            id="dispositivo"
                            type="text"
                            required
                            value={campoDispositivo}
                            onChange={(e) => setDispositivo(e.target.value)}
                            placeholder="Ex: Máquina 25"
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        />
                    </div>


                    {/* DESCRIÇÃO */}

                    <div className="flex w-full flex-col gap-2">
                        <label
                            htmlFor="descricao"
                            className="font-bold text-pri"
                        >
                            Descrição
                            <span className="ml-1 text-accent">
                                *
                            </span>
                        </label>

                        <textarea
                            id="descricao"
                            required
                            maxLength={150}
                            value={campoDescricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            rows="6"
                            placeholder="Descreva o problema ou solicitação"
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        />
                    </div>


                    {erro && (
                        <p role="alert" className="rounded-md border border-sec-vermelho bg-sec-vermelho/10 p-3 text-sec-vermelho">
                            {erro}
                        </p>
                    )}

                    <div className="flex items-center justify-center pt-2">
                        <button
                            type="submit"
                            disabled={enviando}
                            className="botao h-11 min-w-40 rounded-md bg-accent px-6 text-base font-bold text-pri transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
                        >
                            {enviando ? "Salvando..." : "Enviar chamado"}
                        </button>
                    </div>

                </form>

            </section>

        </main>
    )
}

export default CriacaoChamado
