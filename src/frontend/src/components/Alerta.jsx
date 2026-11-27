import { alertaSucesso } from '../utils/alertaSite';

const Alerta = () => {
    let usuario = null;
    try {
        const bruto = localStorage.getItem("taskcall:usuario");
        usuario = bruto ? JSON.parse(bruto) : null;
    } catch {
        usuario = null;
    }

    const nome = usuario?.nome || "Usuário";
    const cargo = usuario?.funcao || "Sem função atribuída";
    const identificador = usuario?.rm || usuario?.email || "-";

    return alertaSucesso({
        title: `Olá, ${nome}`,
        html: `Cargo: ${cargo}<br><br>Identificação: ${identificador}`,
        confirmButtonText: "Continuar",
    });
};

export default Alerta;
