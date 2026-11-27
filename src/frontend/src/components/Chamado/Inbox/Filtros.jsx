import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const Filtros = ({ filtrosSelecionados, setFiltrosSelecionados }) => {
  const [aberto, setAberto] = useState(true);
  const { usuario } = useAuth();
  const isTi = usuario?.perfil === "ti";

  const tiposChamados = [
    { id: "todos", label: "Todos os Chamados", bg: "bg-fundo-razo" },
    { id: "favoritos", label: "Favoritados", bg: "bg-fundo-medio/60 border border-borda/20" },
    ...(!isTi
      ? [{ id: "emAnalise", label: "Em Análise", bg: "bg-zinc-500/15 border border-zinc-400/40 text-sec" }]
      : []),
    { id: "naoVisualizado", label: "Não Visualizado", bg: "bg-sec-amarelo/10 border border-sec-amarelo/30 text-sec-amarelo" },
    { id: "emProgresso", label: "Em Progresso", bg: "bg-sec-azul/10 border border-sec-azul/30 text-sec-azul" },
    { id: "urgentes", label: "Chamados Urgentes", bg: "bg-sec-vermelho/10 border border-sec-vermelho/30 text-sec-vermelho" },
    { id: "resolvido", label: "Resolvidos", bg: "bg-sec-verde/10 border border-sec-verde/30 text-sec-verde" },
  ];

  function handleFiltros(id) {
    if (id === "todos") {
      setFiltrosSelecionados([]);
      return;
    }
    if (filtrosSelecionados.includes(id)) {
      setFiltrosSelecionados(
        filtrosSelecionados.filter((filtro) => filtro !== id)
      );
    } else {
      setFiltrosSelecionados([...filtrosSelecionados, id]);
    }
  }

  return (
    <div className="w-full flex flex-col px-4 text-pri">
      <button
        type="button"
        aria-expanded={aberto}
        onClick={() => setAberto(!aberto)}
        className="w-full flex items-center justify-between py-2 mb-3 border-b border-borda/30 cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-accent rounded"
      >
        <div className="flex-1 h-0.5 bg-borda/30 rounded-2xl" />

        <span className="px-4 font-semibold text-lg sm:text-xl tracking-wide">
          Filtros
        </span>

        <div className="flex-1 h-0.5 bg-borda/30 rounded-2xl" />

        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 ml-2 text-pri transition-transform duration-300 ${aberto ? "" : "rotate-180"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden flex flex-col gap-2.5 ${
          aberto ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        {tiposChamados.map((item) => (
          <label
            key={item.id}
            className={`flex w-full min-h-10 py-1.5 ${item.bg} rounded-xl items-center px-3.5 justify-start gap-3 text-sm sm:text-base font-medium cursor-pointer transition-transform hover:translate-x-1 select-none`}
          >
            <input
              type="checkbox"
              checked={
                item.id === "todos"
                  ? filtrosSelecionados.length === 0
                  : filtrosSelecionados.includes(item.id)
              }
              onChange={() => handleFiltros(item.id)}
              className="w-5 h-5 border-2 checkbox rounded border-borda/60 text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
            />
            <span className="truncate">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filtros;
