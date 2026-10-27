import Swal from 'sweetalert2'

const Alerta = () =>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const nome = userInfo.name || "Usuário"
    const cargo = userInfo.cargo || "Aluno"
    const uid = userInfo.uid || "—"
    
    Swal.fire({
      title: `Olá, ${nome}`,
      html: `Cargo: ${cargo}<br><br>
      UID: ${uid}`,
      icon: "success",
      confirmButtonText: "Continuar",
    })
}

export default Alerta
