import LayoutUsuario from "./LayoutUsuario"
import SideBar from "./SideBar"


const Configuracoes = ({collapsed, setCollapsed}) => {

    return(
        <div>
            <div className=" flex z-10 min-h-screen w-full bg-[url(public/assets/login2.png)] bg-cover bg-center justify-center items-stretch overflow-x-hidden overflow-y-auto lg:overflow-y-hidden">
                <SideBar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
           </div>
        </div>
    )
}

export default Configuracoes