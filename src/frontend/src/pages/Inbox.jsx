import SideBar from "../components/SideBar";
import Filtros from "../components/Chamado/Inbox/Filtros";
import LayoutUsuario from "../components/LayoutUsuario";
import mockChamados from "../assets/scripts/mock/mockChamados";
import React from "react";
import { ChevronDown, Inbox as InboxIcon, Minus, Plus, X } from "lucide-react";
import ChamadoBullet from "../components/Chamado/Inbox/ChamadoBullet";
import { Link } from "react-router-dom";

const camposDeBusca = [
    { campo: "nome", label: "Usuário", placeholder: "Nome do usuário" },
    { campo: "titulo", label: "Título", placeholder: "Título do chamado" },
    { campo: "id", label: "Número do chamado", placeholder: "Número" },
    { campo: "sala", label: "Sala", placeholder: "Número da sala" },
    { campo: "categoria", label: "Categoria", placeholder: "Categoria" },
    { campo: "dispositivo", label: "Dispositivo", placeholder: "Dispositivo" },
    { campo: "descricao", label: "Descrição", placeholder: "Descrição" },
    { campo: "cargo", label: "Cargo", placeholder: "Cargo" },
];

const meses = {
    janeiro: 0,
    fevereiro: 1,
    março: 2,
    abril: 3,
    maio: 4,
    junho: 5,
    julho: 6,
    agosto: 7,
    setembro: 8,
    outubro: 9,
    novembro: 10,
    dezembro: 11,
};

function valorNumericoData(data) {
    const partes = String(data).match(
        /(\d{1,2}),?\s+([a-zç]+)\s+(\d{4})\s*-\s*(\d{1,2}):(\d{2})/i,
    );
    if (!partes) return 0;

    const [, dia, nomeMes, ano, hora, minuto] = partes;
    const mes = meses[nomeMes.toLocaleLowerCase("pt-BR")];
    if (mes === undefined) return 0;

    return Date.UTC(Number(ano), mes, Number(dia), Number(hora), Number(minuto));
}

const Inbox = ({ collapsed, setCollapsed }) => {
    const [checkedInboxes, setCheckedInboxes] = React.useState([]);
    const [dataDe, setDataDe] = React.useState("");
    const [dataA, setDataA] = React.useState("");
    const [buscas, setBuscas] = React.useState({});
    const [filtrosDeBuscaAtivos, setFiltrosDeBuscaAtivos] = React.useState([
        "nome",
    ]);
    const [menuFiltrosAberto, setMenuFiltrosAberto] = React.useState(false);
    const [chamados, setChamados] = React.useState(mockChamados);
    const [filtrosSelecionados, setFiltrosSelecionados] = React.useState([]);
    const [ordenacao, setOrdenacao] = React.useState({
        campo: "data",
        direcao: "desc",
    });

    const colunas = [
        { campo: "nome", label: "Nome", visibilidade: "" },
        { campo: "titulo", label: "Título", visibilidade: "hidden lg:block" },
        { campo: "categoria", label: "Categoria", visibilidade: "hidden sm:block" },
        { campo: "sala", label: "Sala", visibilidade: "hidden md:block" },
        { campo: "data", label: "Data", visibilidade: "hidden xl:block" },
    ];

    function ordenarPor(campo) {
        setOrdenacao((atual) => ({
            campo,
            direcao:
                atual.campo === campo && atual.direcao === "desc"
                    ? "asc"
                    : "desc",
        }));
    }

    function atualizarBusca(campo, valor) {
        setBuscas((buscasAtuais) => ({ ...buscasAtuais, [campo]: valor }));
    }

    function adicionarFiltro(campo) {
        setFiltrosDeBuscaAtivos((filtrosAtuais) => [...filtrosAtuais, campo]);
        setMenuFiltrosAberto(false);
    }

    function removerFiltro(campo) {
        setFiltrosDeBuscaAtivos((filtrosAtuais) =>
            filtrosAtuais.filter((filtro) => filtro !== campo),
        );
        setBuscas((buscasAtuais) => {
            const novasBuscas = { ...buscasAtuais };
            delete novasBuscas[campo];
            return novasBuscas;
        });
    }

    function deletarChamados() {
        const chamadosFiltrados = chamados.filter(
            (item, index) => !checkedInboxes.includes(index),
        );
        mockChamados.splice(0, mockChamados.length, ...chamadosFiltrados);
        setChamados(chamadosFiltrados);
        setCheckedInboxes([]);
    }

    const chamadosFiltrados = chamados.filter((chamado) => {
        if (filtrosSelecionados.length > 0) {
            const passouNosFiltros = filtrosSelecionados.some((filtro) => {
                if (filtro === "favoritos") return chamado.salvo === true;
                if (filtro === "nao-iniciados") return chamado.status === 0;
                if (filtro === "progresso") return chamado.status === 1;
                if (filtro === "resolvidos") return chamado.status === 2;
                if (filtro === "urgentes") return chamado.status === 4;
                return true;
            });
            if (!passouNosFiltros) return false;
        }

        const passouNasBuscas = filtrosDeBuscaAtivos.every((campo) => {
            const busca = buscas[campo]?.trim().toLowerCase();
            if (!busca) return true;

            return String(chamado[campo] ?? "")
                .toLowerCase()
                .includes(busca);
        });
        if (!passouNasBuscas) {
            return false;
        }

        if (dataDe !== "" || dataA !== "") {
            const partes = chamado.data.split(" ");
            const dia = partes[0].replace(",", "");
            const mes = partes[1];
            const ano = partes[2];

            const meses = {
                Janeiro: "01",
                Fevereiro: "02",
                Março: "03",
                Abril: "04",
                Maio: "05",
                Junho: "06",
                Julho: "07",
                Agosto: "08",
                Setembro: "09",
                Outubro: "10",
                Novembro: "11",
                Dezembro: "12",
            };

            const dataChamado = `${ano}-${meses[mes]}-${dia.padStart(2, "0")}`;

            if (dataDe !== "" && dataChamado < dataDe) return false;
            if (dataA !== "" && dataChamado > dataA) return false;
        }

        return true;
    });

    const chamadosOrdenados = [...chamadosFiltrados].sort((a, b) => {
        const valorA =
            ordenacao.campo === "data"
                ? valorNumericoData(a.data)
                : a[ordenacao.campo];
        const valorB =
            ordenacao.campo === "data"
                ? valorNumericoData(b.data)
                : b[ordenacao.campo];
        const comparacao =
            typeof valorA === "number" && typeof valorB === "number"
                ? valorA - valorB
                : String(valorA ?? "").localeCompare(String(valorB ?? ""), "pt-BR", {
                    numeric: true,
                    sensitivity: "base",
                });

        return ordenacao.direcao === "asc" ? comparacao : -comparacao;
    });

    return (
        <div className="flex flex-col-reverse lg:flex-row z-10 h-screen w-screen bg-fundo-fundo bg-cover bg-center items-stretch overflow-hidden">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div
                className={`w-full lg:w-auto h-1/2 lg:h-full ${!collapsed ? "lg:ml-20" : "lg:ml-0 scroll"
                    } transition-all duration-300 shrink-0`}
            >
                <aside className="w-full lg:ml-5 h-full lg:max-w-sm bg-fundo-fundo border-b lg:border-b-0 lg:border-r border-borda lg:rounded-r-3xl flex flex-col items-center py-4 lg:py-8 gap-4 overflow-y-auto">
                    <Link to="/inbox/criacaochamado" className="w-full px-5">
                        <div className="flex w-full justify-center items-center">
                            <button
                                type="button"
                                className="w-full h-12 lg:h-15 bg-accent px-6 rounded-lg shadow-[0px_4px_0px_0px_#740510] lg:shadow-[0px_6px_0px_0px_#740510] transition-transform duration-150 cursor-pointer hover:scale-102 active:scale-98 text-pri text-xl lg:text-2xl font-bold"
                            >
                                Escrever
                            </button>
                        </div>
                    </Link>

                    <Filtros
                        filtrosSelecionados={filtrosSelecionados}
                        setFiltrosSelecionados={setFiltrosSelecionados}
                    />

                    <div className="w-11/12 border-b border-borda/30" />

                    <div className="flex flex-col gap-2 w-full px-6">
                        <div className="flex flex-row justify-between items-center text-lg lg:text-2xl text-pri gap-3">
                            <label htmlFor="dataDe">De:</label>
                            <input
                                id="dataDe"
                                className="flex rounded-md uppercase text-xs lg:text-sm p-2 justify-between text-pri bg-fundo-razo"
                                type="date"
                                value={dataDe}
                                onChange={(e) => setDataDe(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-row justify-between items-center text-lg lg:text-2xl text-pri gap-2">
                            <label htmlFor="dataA">A:</label>
                            <input
                                id="dataA"
                                className="flex rounded-md uppercase text-xs lg:text-sm p-2 justify-between text-pri bg-fundo-razo"
                                type="date"
                                value={dataA}
                                onChange={(e) => setDataA(e.target.value)}
                            />
                        </div>

                        <div className="w-full border-b border-borda/30 my-1" />

                        <section
                            className="flex w-full flex-col gap-3"
                            aria-label="Filtros por campo"
                        >
                            <h2 className="text-lg font-semibold tracking-wide text-pri">
                                Buscar por
                            </h2>

                            {filtrosDeBuscaAtivos.map((campo) => {
                                const filtro = camposDeBusca.find(
                                    (item) => item.campo === campo,
                                );
                                if (!filtro) return null;

                                return (
                                    <div
                                        key={campo}
                                        className="flex flex-col gap-3 rounded-2xl border border-borda/30 bg-fundo-medio/60 p-4"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <label
                                                htmlFor={`filtro-${campo}`}
                                                className="text-base font-semibold text-pri"
                                            >
                                                {filtro.label}
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => removerFiltro(campo)}
                                                aria-label={`Remover filtro ${filtro.label}`}
                                                className="flex h-9 w-9 items-center justify-center rounded-full bg-fundo-razo text-borda transition-all duration-200 hover:scale-105 hover:bg-sec-vermelho hover:text-pri"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <input
                                            id={`filtro-${campo}`}
                                            className="w-full rounded-xl border border-borda/30 bg-fundo-fundo px-4 py-3 text-base text-pri placeholder:text-pri/40 focus:border-accent focus:outline-none"
                                            type="text"
                                            placeholder={filtro.placeholder}
                                            value={buscas[campo] ?? ""}
                                            onChange={(e) => atualizarBusca(campo, e.target.value)}
                                        />
                                    </div>
                                );
                            })}

                            <div className="relative">
                                <button
                                    type="button"
                                    aria-expanded={menuFiltrosAberto}
                                    aria-controls="opcoes-filtros"
                                    onClick={() => setMenuFiltrosAberto((aberto) => !aberto)}
                                    className=" cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-fundo-razo px-4 py-3 text-base font-semibold text-pri shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] transition-transform duration-150 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                                >
                                    <Plus size={16} />
                                    Mais filtros
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${menuFiltrosAberto ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {menuFiltrosAberto && (
                                    <div
                                        id="opcoes-filtros"
                                        className="absolute left-0 right-0 z-20 mt-2 flex flex-col gap-1 rounded-2xl border border-borda/30 bg-fundo-medio p-2 shadow-lg"
                                    >
                                        {camposDeBusca
                                            .filter(
                                                ({ campo }) => !filtrosDeBuscaAtivos.includes(campo),
                                            )
                                            .map(({ campo, label }) => (
                                                <button
                                                    key={campo}
                                                    type="button"
                                                    onClick={() => adicionarFiltro(campo)}
                                                    className="cursor-pointer rounded-xl px-4 py-3 text-left font-semibold text-pri transition-all duration-200 hover:bg-fundo-razo hover:brightness-110"
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </aside>
            </div>

            <div className="flex flex-col h-1/2 lg:h-screen flex-1 px-4 lg:px-10 overflow-hidden">
                <div className="flex flex-col w-full lg:w-[70%] items-center my-2 lg:mb-10">
                    <header className="flex flex-row items-center justify-between w-full">
                        <LayoutUsuario />

                        <div className="flex flex-row justify-center items-center h-12 lg:h-20 gap-2 px-2">
                            <span className="hidden lg:block flex-1 h-1 w-32 bg-borda rounded-lg" />
                            <InboxIcon className="w-8 h-8 lg:w-12 lg:h-12 text-pri opacity-50 transition-opacity" />
                            <p className="font-semibold tracking-wide text-pri text-2xl lg:text-4xl">
                                Inbox
                            </p>
                            <span className="hidden lg:block flex-1 h-1 w-32 bg-borda rounded-lg" />
                        </div>
                    </header>
                </div>

                <div
                    className="flex shrink-0 flex-col flex-1 min-h-0"
                >
                    <div className="flex w-full shrink-0 items-center gap-3 px-4 py-2 font-semibold text-pri">
                        <div className="flex w-15 shrink-0 items-center gap-3" />
                        <div className="flex min-w-0 flex-1 items-center">
                            {colunas.map(({ campo, label, visibilidade }) => (
                                <div
                                    key={campo}
                                    className={`min-w-0 flex-1 px-3 ${visibilidade}`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => ordenarPor(campo)}
                                        aria-label={`Ordenar por ${label}`}
                                        className="flex w-full cursor-pointer items-center gap-1 truncate text-left hover:text-sec"
                                    >
                                        <span className="truncate">{label}</span>
                                        {ordenacao.campo === campo ? (
                                            <ChevronDown
                                                size={18}
                                                className={`shrink-0 transition-transform ${
                                                    ordenacao.direcao === "asc"
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        ) : (
                                            <Minus size={18} aria-hidden="true" className="shrink-0" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <span className="h-6 w-6 shrink-0" />
                    </div>

                    <div
                        id="div-chamados"
                        className="scroll flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pb-4"
                    >
                        {chamadosOrdenados.map((item) => (
                            <ChamadoBullet
                                key={item.id}
                                index={chamados.indexOf(item)}
                                mockInfo={item}
                                mockChamados={chamados}
                                setChamados={setChamados}
                                checkedInboxes={checkedInboxes}
                                setCheckedInboxes={setCheckedInboxes}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inbox;
