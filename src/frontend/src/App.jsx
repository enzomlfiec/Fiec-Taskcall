import SideBar from "./components/SideBar";
import Painel from "./components/Painel";
import "../style.css";
import FakeLayers from "./components/FakeLayers";
import { Routes, Route } from "react-router-dom";
import Inbox from "./components/Inbox";

function App() {
  return (
    <>{/* 
      {
      <Routes>

        <Route path="/" element={<FakeLayers/>}/> 
        <Route path="/painel" element={<Painel/>}/>

      </Routes>
      }
      */}

      <Inbox/>

    </>
  );
}
export default App;
