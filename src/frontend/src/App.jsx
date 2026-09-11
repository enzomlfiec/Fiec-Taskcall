// import Alerta from "./components/alerta"
// import FakeLayers from "./components/fakelayers"
import SideBar from "./components/SideBar";
import Painel from "./components/Painel";
import "../style.css";
import FakeLayers from "./components/FakeLayers";

function App() {
  return (
    <>
      <FakeLayers/>
      {/* SideBar */}
      {/* <SideBar /> */}
      <Painel/>
    </>
  );
}
export default App;
