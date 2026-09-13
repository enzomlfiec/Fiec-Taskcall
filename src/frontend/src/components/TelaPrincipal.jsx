import SideBar from "./SideBar";
import LayoutUsuario from "./LayoutUsuario";

{/* Icones */}
import { MessageCircleWarning } from 'lucide-react';
import { Clock4 } from 'lucide-react';
import { TriangleAlert } from 'lucide-react';
import { CircleEllipsis } from 'lucide-react';

const TelaPrincipal = () => {
    return(
        <>
         <div className="flex z-10 min-h-screen w-screen bg-[url(public/assets/login2.png)] bg-cover bg-center items-stretch overflow-hidden">

           <SideBar/>

        <header className="flex flex-col gap-2 w-full m-2">

             <LayoutUsuario/>
            
            <div className="flex flex-row text-pri text-lg justify-start items-center px-1 gap-2">
             <div className="flex h-0.5 w-50 bg-borda rounded-2xl"></div>
             Resumo Chamados
             <div className="flex h-0.5 w-50 bg-borda rounded-3xl"></div>

            </div>
             
             <article className="flex flex-row w-full  h-45">

                <div className="flex flex-row h-40 w-81 gap-3 bg-fundo-razo rounded-2xl p-4 m-3 items-center justify-center text-pri text-xl ">

                    <div className="flex items-center justify-center w-20 h-20 shrink-0 bg-sec-amarelo rounded-xl text-pri  shadow-lg">
                        <MessageCircleWarning 
                        className="w-12 h-12"/>
                    </div>
                    
                         <span className="flex text-pri text-lg">Chamados não visualizados</span>

                    <div className="flex items-center justify-center w-20 h-20 ml-auto shrink-0 rounded-full border-15 border-sec-amarelo text-lg text-orange-400 ">
                        25%
                    </div>

                </div>

                 <div className="flex flex-row h-40 w-81 gap-3 bg-fundo-razo rounded-2xl p-4 m-3 items-center justify-center text-pri text-xl ">

                    <div className="flex items-center justify-center w-20 h-20 shrink-0 bg-sec-azul rounded-xl text-pri
                    shadow-lg">
                        <Clock4 className="w-12 h-12"/>
                    </div>
                    
                         <span className="flex text-pri text-lg">Chamados em Progresso</span>

                    <div className="flex items-center justify-center w-20 h-20 ml-auto shrink-0 rounded-full border-15 border-sec-azul text-lg text-blue-600 ">
                        50%
                    </div>

                </div>

                 <div className="flex flex-row h-40 w-81 gap-3 bg-fundo-razo rounded-2xl p-4 m-3 items-center justify-center text-pri text-xl ">

                    <div className="flex items-center justify-center w-20 h-20 shrink-0 bg-sec-vermelho rounded-xl text-pri shadow-lg">
                        <TriangleAlert className="w-12 h-12"/>
                    </div>
                    
                         <span className="flex text-pri text-lg">Chamados Emergencial</span>

                    <div className="flex items-center justify-center w-20 h-20 ml-auto shrink-0 rounded-full border-15 border-sec-vermelho text-lg text-red-700">
                        25%
                    </div>

                </div>

                 <div className="flex flex-row h-40 w-81 gap-3 bg-fundo-razo rounded-2xl p-4 m-3 items-center justify-center text-pri text-xl ">

                    <div className="flex items-center justify-center w-20 h-20 shrink-0 bg-sec rounded-xl text-pri shadow-lg">
                        <CircleEllipsis className="w-12 h-12"/>
                    </div>
                    
                         <span className="flex text-pri text-lg">Chamados em Análise</span>

                    <div className="flex items-center justify-center w-20 h-20 ml-auto shrink-0 rounded-full border-15 border-sec text-lg text-pri">
                        0%
                    </div>
                </div>
             </article>

             <div className="flex flex-row text-pri text-lg justify-start items-center px-1 gap-2">
             <div className="flex h-0.5 w-50 bg-borda rounded-2xl"></div>
             Inbox Recente
             <div className="flex h-0.5 w-50 bg-borda rounded-3xl"></div>
            </div>

           </header>
        </div>
    </>
    )
}

export default TelaPrincipal