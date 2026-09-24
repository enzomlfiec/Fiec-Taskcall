
import { useNavigate } from "react-router-dom"


function FakeLayers() {
    const navigate = useNavigate()
    return (
        <>
            <div className="flex flex-row bg-[url(public/assets/bg.png)] bg-left bg-no-repeat">
                <div className="w-[26%]"></div>
                <div className="h-screen w-full flex items-center flex-row justify-baseline ">
                    <div className="flex flex-row relative bottom-15">
                        <img className="ml-3 transition-transform duration-100 ease-in-out hover:scale-[1.01] hover:drop-shadow-[0px_2px_3px_rgba(0,0,0,0.185)] hover:cursor-pointer" src="/assets/button0.png" alt="Button 0" />
                        <img className="ml-3 transition-transform duration-100 ease-in-out hover:scale-[1.01] hover:drop-shadow-[0px_2px_3px_rgba(0,0,0,0.185)] hover:cursor-pointer" src="/assets/button1.png" alt="Button 1" />
                        <img className="ml-3 transition-transform duration-100 ease-in-out hover:scale-[1.01] hover:drop-shadow-[0px_2px_3px_rgba(0,0,0,0.185)] hover:cursor-pointer" src="/assets/button2.png" alt="Button 2" />

                        <button onClick={() => navigate("/Login")}>
                            <img className="ml-3 transition-transform duration-100 ease-in-out hover:scale-[1.01] hover:drop-shadow-[0px_2px_3px_rgba(0,0,0,0.185)] hover:cursor-pointer" src="/assets/button3.png" alt="Button 3" />
                        </button>

                    </div>
                </div>
            </div>
        </>
    )
}

export default FakeLayers