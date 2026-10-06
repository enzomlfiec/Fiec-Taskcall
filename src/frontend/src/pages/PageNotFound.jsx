import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-fundo-fundo px-6 text-pri">
      <div className="flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-borda/60 bg-fundo-razo/90 px-8 py-12 text-center shadow-[0_20px_40px_rgba(0,0,0,0.35)] md:px-14">
        <span className="mb-3 text-6xl font-black leading-none tracking-tight text-accent md:text-8xl">
          Oops!
        </span>

        <span className="mb-5 text-5xl font-extrabold text-pri md:text-7xl">
          404
        </span>

        <h1 className="mb-6 text-2xl font-bold text-pri md:text-4xl">
          Esta página não foi encontrada
        </h1>

        <p className="mb-8 max-w-lg text-lg text-sec md:text-xl">
          A página que você tentou acessar não existe ou foi movida.
        </p>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Link
            to="/tela-principal"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-base font-bold text-pri shadow-[0px_6px_0px_0px_#740510] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] md:text-lg"
          >
            Voltar para a tela principal
          </Link>

          <a
            href="https://fiec.com.br/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-borda bg-fundo-medio px-6 py-3 text-base font-semibold text-pri transition-colors duration-150 hover:bg-fundo-medio/80 md:text-lg"
          >
            Visitar a FIEC
          </a>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
