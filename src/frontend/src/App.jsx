import Painel from "./components/Painel";
import "../style.css";
import FakeLayers from "./components/FakeLayers";
import Inbox from "./components/Chamado/Inbox/Inbox";
import TelaPrincipal from "./components/TelaPrincipal";
import PageNotFound from "./components/PageNotFound";
import React from "react";

{/* Rotas */ }
import { Routes, Route } from "react-router-dom";

function App() {

  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <>
      {
        <Routes>

          <Route path="/" element={<FakeLayers />} />
          <Route path="/painel" element={<Painel />} />

          <Route path="/tela-principal" element={<TelaPrincipal
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />} />

          <Route path="/inbox" element={<Inbox
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />} />

          <Route path="*" element={<PageNotFound />} />

          {/* Futuras rotas de chamado, usuário e configurações

         <Route  path="/chamados" element={<h1 className="text-white">Chamados</h1>}/>

         <Route  path="/configuracoes" element={<h1 className="text-white">Configurações</h1>}/>

          <Route path="/usuario "element={<h1 className="text-white">Usuário</h1>} />
       */}
        </Routes>
      }

    </>
  );
}
export default App;
