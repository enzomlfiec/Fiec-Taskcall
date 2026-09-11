// import Alerta from "./components/alerta"
// import FakeLayers from "./components/fakelayers"
import SideBar from "./components/SideBar";
import Painel from "./components/Painel";
import "../style.css";
import FakeLayers from "./components/FakeLayers";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      {
      <Routes>

        <Route path="/" element={<FakeLayers/>}/> 
        <Route path="/painel" element={<Painel/>}/>

      </Routes>
      }

    </>
  );
}
export default App;
