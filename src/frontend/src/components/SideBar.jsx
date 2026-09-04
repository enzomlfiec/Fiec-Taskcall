import taskcall from "../assets/taskcall.png";
import home from "../assets/home.png";
import vector from "../assets/vector.png";
import vector2 from "../assets/vector2.png";
import configuracao from "../assets/configuracao.png";
import perfil from "../assets/perfil.png";

function SideBar() {
  return (
    <div className="absolute z-index h-screen w-screen  bg-[url(public/assets/login2.png)] bg-cover bg-center">
      <div className="w-30 h-screen bg-fundo-razo rounded-r-3xl flex flex-col items-center justify-between pb-5 ">
        {/* parte superior */}

        <div className="flex flex-col items-center gap-10 ">
          <img
            className="w-22 opacity-30 mt-5"
            src={taskcall}
            alt="Logo Taskcall"
          />
          <div className="w-24 h-0.5 bg-cl-razo opacity-30 rounded"></div>
          <a href="">
            <img
              className="w-12 opacity-30 hover:opacity-100 transition-opacity"
              src={home}
              alt="Icone casa - ínicio"
            />
          </a>
          <div className="w-22 h-0.5 bg-cl-razo opacity-30 rounded"></div>
          <a href="">
            <img
              className="w-12 opacity-30 hover:opacity-100 transition-opacity"
              src={vector}
              alt="Icone"
            />
          </a>
          <div className="w-22 h-0.5 bg-cl-razo opacity-30 rounded"></div>
          <a href="">
            <img
              className="w-16 opacity-30 hover:opacity-100 transition-opacity"
              src={vector2}
              alt="Icone "
            />
          </a>
          <div className="w-22 h-0.5 bg-cl-razo opacity-30 rounded"></div>
        </div>

        {/* parte inferior */}

        <div className="flex flex-col items-center gap-10">
          <div className="w-22 h-1 bg-cl-razo opacity-30 rounded"></div>
          <a href="">
            <img
              className="w-14 opacity-30 hover:opacity-100 transition-opacity"
              src={configuracao}
              alt="Icone Configuração - ajustes"
            />
          </a>
          <div className="w-22 h-0.5 bg-cl-razo opacity-30 rounded"></div>
          <a href="">
            <img
              className="w-14 opacity-30 hover:opacity-100 transition-opacity"
              src={perfil}
              alt="Icone Configuração - ajustes"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
