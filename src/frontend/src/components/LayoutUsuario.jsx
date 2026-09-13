import { Cpu } from "lucide-react";
import perfil from "../assets/perfil.png";

const LayoutUsuario = () => {
    return (
        <div className="flex justify-start w-90 h-30 m-1 p-1 bg-fundo-fundo items-start">


            <div className="flex items-center gap-2">

                <a href="">
                    <img
                        className="w-16 h-16 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                        src={perfil}
                        alt="Ícone do usuário"/>
                </a>

                <div className="flex flex-col gap-1">

                    <span className="h-7 w-57 px-2 bg-fundo-razo rounded-md text-white font-medium text-lg flex items-center">
                        Usuário S1337
                    </span>

                    <div className="flex items-center gap-1">

                        <Cpu className="text-borda w-4 h-4" />

                        <div className="h-6 w-30 px-2 bg-fundo-medio text-borda text-sm rounded-md border border-borda flex items-center">
                            Suporte de TI
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
};

export default LayoutUsuario;