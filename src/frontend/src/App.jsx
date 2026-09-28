import Login from "./components/Login";
import "../style.css";
import FakeLayers from "./components/FakeLayers";
import Inbox from "./components/Chamado/Inbox/Inbox";
import TelaPrincipal from "./components/TelaPrincipal";
import Registro from "./components/Registro";
import PageNotFound from "./components/PageNotFound";
import React from "react";

{/* Rotas */ }
import { Routes, Route } from "react-router-dom";
import CriacaoChamado from "./components/Chamado/Inbox/CriacaoChamado";

function App() {

  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <>
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

          <Route path="*" element={<PageNotFound />} />

          {/* Futuras rotas de chamado, usuário e configurações

         <Route  path="/chamados" element={<h1 className="text-pri">Chamados</h1>}/>

         <Route  path="/configuracoes" element={<h1 className="text-pri">Configurações</h1>}/>

          <Route path="/usuario "element={<h1 className="text-pri">Usuário</h1>} />
       */}
        </Routes>
      }

    </>
  );
}
export default App;
