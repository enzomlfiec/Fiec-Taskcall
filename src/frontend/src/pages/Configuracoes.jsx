import LayoutUsuario from "../components/LayoutUsuario"
import SideBar from "../components/SideBar"


const Configuracoes = ({collapsed, setCollapsed}) => {

    return(
        <div>
            <div className=" flex z-10 min-h-screen w-full bg-[url(public/assets/login2.png)] bg-cover bg-center justify-center items-stretch overflow-x-hidden overflow-y-auto lg:overflow-y-hidden">
                <SideBar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
           </div>

            <div className="flex-1 min-h-screen bg-white">
                <LayoutUsuario />
            </div>
        </div>
    )
}

export default Configuracoes