import Login from "./pages/Login";
import "../style.css";
import FakeLayers from "./pages/FakeLayers";
import Inbox from "./pages/Inbox";
import TelaPrincipal from "./pages/TelaPrincipal";
import Registro from "./components/Registro";
import PageNotFound from "./pages/PageNotFound";
import React from "react";
import Configuracoes from "./pages/Configuracoes";
import InfoUsuario from "./components/Usuario/InfoUsuario";
import ELSD from "./assets/scripts/ELSD";

{/* Rotas */ }
import { Routes, Route } from "react-router-dom";
import CriacaoChamado from "./components/Chamado/Inbox/CriacaoChamado";

function App() {
  const [simpleAnims, setSimpleAnims] = React.useState(() => ELSD.read("simpleAnims", "false"));
  const [corTema, setCorTema] = React.useState(() => ELSD.read("corTema", "system"));
  const [collapsed, setCollapsed] = React.useState(false);

  // Modo claro ativo se corTema for true (ou se for "system" e o dispositivo preferir tema claro)
  const isClaro = corTema === true || (corTema === "system" && window.matchMedia?.("(prefers-color-scheme: light)")?.matches);

  // Atualiza classe no <html> para garantir propagação global
  React.useEffect(() => {
    if (isClaro) {
      document.documentElement.classList.add("claro");
    } else {
      document.documentElement.classList.remove("claro");
    }
  }, [isClaro]);

  // Sincroniza caso o localStorage mude em outra aba/janela
  React.useEffect(() => {
    const handleStorage = () => {
      setCorTema(ELSD.read("corTema", "system"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className={`${isClaro ? "claro scheme-light" : "scheme-dark"} min-h-screen ${simpleAnims ? "**:duration-0 **:transition-none" : ""}`}>
      {
        <Routes>

          <Route path="/" element={<FakeLayers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route path="/tela-principal" element={<TelaPrincipal
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />} />

          <Route path="/inbox" element={<Inbox
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />} />

          <Route path="/inbox/criacaochamado" element={<CriacaoChamado
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />} />


          <Route path="/configuracoes" element={<Configuracoes
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            corTema={corTema}
            setCorTema={setCorTema}
          />} />

          <Route path="*" element={<PageNotFound />} />

          {/* Futuras rotas de chamado, usuário e configurações

         <Route  path="/chamados" element={<h1 className="text-pri">Chamados</h1>}/>
         */}
          <Route
            path="/usuario"
            element={
              <InfoUsuario
                collapsed={collapsed}
                setCollapsed={setCollapsed}
              />
            }
          />
        </Routes>
      }

    </div>
  );
}
export default App;
