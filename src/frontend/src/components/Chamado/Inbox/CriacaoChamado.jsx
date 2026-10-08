import { ArrowLeft } from "lucide-react"
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import mockChamados from "../../../assets/scripts/mock/mockChamados"

function CriacaoChamado() {
    // const [campoTitulo, setTitulo] = React.useState("")
    const [campoSala, setSala] = React.useState("")
    const [campoDescricao, setDescricao] = React.useState("")
    const [campoCategoria, setCategoria] = React.useState("")
    const [campoCargo, setCargo] = React.useState("")
    const [campoDispositivo, setDispositivo] = React.useState("")

    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()

        const today = new Date()

        const dia = today.getDate()
        const mes = today.getMonth() + 1
        const ano = today.getFullYear()
        const hora = today.getHours()
        const minuto = today.getMinutes()

        const newEntry = {
            id: mockChamados.length + 1,
            nome:"Usuário Debug",
            salvo: false,
            sala: campoSala,
            descricao: campoDescricao,
            categoria: campoCategoria,
            cargo: "Supremo",
            dispositivo: campoDispositivo,
            data:
                dia + "/" +
                mes + "/" +
                ano + " - " +
                hora + ":" +
                minuto,
            lixeira: false,
            status: 0
        }

        mockChamados.unshift(newEntry)

        navigate("/inbox")
    }

    return (
        <main className="flex min-h-screen w-screen items-center justify-center bg-[url(public/assets/login2.png)] bg-cover px-4 py-8 text-pri">

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
                            value={campoDescricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            rows="6"
                            placeholder="Descreva o problema ou solicitação"
                            className="w-full rounded-md border border-borda bg-fundo-razo p-3 text-pri placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        />
                    </div>


                    <div className="flex items-center justify-center pt-2">
                        <button
                            type="submit"
                            className="botao h-11 min-w-40 rounded-md bg-accent px-6 text-base font-bold text-pri transition hover:brightness-110"
                        >
                            Enviar chamado
                        </button>
                    </div>

                </form>

            </section>

        </main>
    )
}

export default CriacaoChamado