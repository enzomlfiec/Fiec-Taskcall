import Painel from "./components/Painel";
import "../style.css";
import FakeLayers from "./components/FakeLayers";
import Inbox from "./components/Inbox";
import TelaPrincipal from "./components/TelaPrincipal";

{/* Rotas */}
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      {
      <Routes>

        <Route path="/" element={<FakeLayers/>}/> 
        <Route path="/painel" element={<Painel/>}/>

        <Route path="/tela-principal" element={<TelaPrincipal />} />

        <Route path="/inbox" element={<Inbox />} />

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
