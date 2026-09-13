import { useState } from "react";

const Filtros = () => {
  //Aberta (true) fechada (false)
  const [aberto, setAberto] = useState(true);

  const [fechado, setFechado] = useState(false)


  const tiposChamados = [
    { id: "todos", label: "Todos os Chamados", corCheck: "accent", bg: "bg-fundo-razo" },
    { id: "favoritos", label: "Favoritados", corCheck: "borda", bg: "bg-fundo-medio/60 border border-borda/20" },
    { id: "nao-iniciados", label: "Não iniciados", corCheck: "sec-amarelo", bg: "bg-sec-amarelo/10 border border-sec-amarelo/30 text-sec-amarelo" },
    { id: "progresso", label: "Em progresso", corCheck: "sec-azul", bg: "bg-sec-azul/10 border border-sec-azul/30 text-sec-azul" },
    { id: "urgentes", label: "Chamados Urgentes", corCheck: "sec-vermelho", bg: "bg-sec-vermelho/10 border border-sec-vermelho/30 text-sec-vermelho" },
    { id: "resolvidos", label: "Resolvidos", corCheck: "sec-verde", bg: "bg-sec-verde/10 border border-sec-verde/30 text-sec-verde" },
  ];

  return (
    <div className="w-full flex flex-col px-4 text-pri">
      
      {/*Abrir e fechar o Filtro*/}
      <button
        onClick={() => setAberto(!aberto)}
        className="w-full flex items-center justify-between py-2 mb-4 border-b border-borda/30 cursor-pointer hover:opacity-80 transition-opacity">

        <div className="flex-1 h-0.5 bg-borda/30 rounded-2xl"></div>
        
        <span className="px-4 font-semibold text-xl tracking-wide">
            Filtros
        </span>
        
        <div className="flex-1 h-0.5 bg-borda/30 rounded-2xl"></div>

        {/* setinha de abri e fechar */}
        <svg
          className={`w-6 h-6 ml-2 text-pri transition-transform duration-300 ${aberto ? "" : "rotate-180"}`} 
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden flex flex-col gap-3 ${
          aberto ? "max-h-600px opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        {tiposChamados.map((item) => (
          <label
            key={item.id}
            className={`flex w-full h-10 ${item.bg} rounded-xl items-center px-4 justify-start gap-4 text-lg font-medium cursor-pointer transition-transform hover:translate-x-1 select-none`}>

            {/*Div clicável*/}
            <input 
              type="checkbox" 
              name={item.id} 
              className="w-5 h-5 rounded border-borda/60 text-accent focus:ring-0 cursor-pointer stroke-sec-verde"/>
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filtros;