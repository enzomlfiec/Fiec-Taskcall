import Swal from "sweetalert2";

const taskcallSwal = Swal.mixin({
    buttonsStyling: false,
    customClass: {
        container: "taskcall-swal-container",
        popup: "taskcall-swal-popup",
        title: "taskcall-swal-title",
        htmlContainer: "taskcall-swal-html",
        actions: "taskcall-swal-actions",
        confirmButton: "taskcall-swal-confirm",
        cancelButton: "taskcall-swal-cancel",
        timerProgressBar: "taskcall-swal-progress",
    },
});

export function alertaSucesso({
    title = "Sucesso!",
    text,
    html,
    confirmButtonText = "Continuar",
    showConfirmButton = true,
    timer,
} = {}) {
    return taskcallSwal.fire({
        icon: "success",
        iconColor: "var(--color-sec-verde)",
        title,
        text,
        html,
        confirmButtonText,
        showConfirmButton,
        timer,
        timerProgressBar: Boolean(timer),
    });
}

export function alertaErro({
    title = "Algo deu errado",
    text,
    html,
    confirmButtonText = "Entendi",
} = {}) {
    return taskcallSwal.fire({
        icon: "error",
        iconColor: "var(--color-sec-vermelho)",
        title,
        text,
        html,
        confirmButtonText,
    });
}

export function alertaAviso({
    title = "Atenção",
    text,
    html,
    confirmButtonText = "Revisar",
} = {}) {
    return taskcallSwal.fire({
        icon: "warning",
        iconColor: "var(--color-sec-amarelo)",
        title,
        text,
        html,
        confirmButtonText,
    });
}

export function alertaConfirmacao({
    title = "Confirmar ação?",
    text,
    html,
    icon = "warning",
    confirmButtonText = "Confirmar",
    cancelButtonText = "Cancelar",
} = {}) {
    return taskcallSwal.fire({
        icon,
        iconColor: icon === "warning" ? "var(--color-sec-amarelo)" : "var(--color-sec-azul)",
        title,
        text,
        html,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
    });
}

export function alertaCarregando({
    title = "Enviando...",
    text = "Aguarde um instante.",
} = {}) {
    return taskcallSwal.fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
}

export default taskcallSwal;
