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


          <Route path="/configuracoes" element={<Configuracoes
            collapsed={collapsed}
            setCollapsed={setCollapsed}
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

    </>
  );
}
export default App;
