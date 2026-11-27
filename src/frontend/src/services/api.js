const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");

export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

function extrairMensagemErro(data, status) {
    if (!data) {
        return `Erro na requisição (HTTP ${status}).`;
    }
    if (data.errors && typeof data.errors === "object") {
        const primeiraChave = Object.keys(data.errors)[0];
        if (primeiraChave && Array.isArray(data.errors[primeiraChave]) && data.errors[primeiraChave][0]) {
            return data.errors[primeiraChave][0];
        }
    }
    return data.erro || data.mensagem || data.message || `Erro na requisição (HTTP ${status}).`;
}

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("taskcall:token");
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    const headers = {
        Accept: "application/json",
        ...(options.body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const config = {
        method: options.method || "GET",
        headers,
    };

    if (options.body !== undefined) {
        if (isFormData || typeof options.body === "string") {
            config.body = options.body;
        } else {
            config.body = JSON.stringify(options.body);
        }
    }

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    } catch {
        throw new ApiError("Não foi possível conectar ao servidor da API. Verifique se o backend está em execução.", 0);
    }

    let data = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        data = await response.json().catch(() => null);
    }

    if (!response.ok) {
        if (response.status === 401 && !options.skipAuthReset) {
            localStorage.removeItem("taskcall:token");
            localStorage.removeItem("taskcall:usuario");
        }
        throw new ApiError(extrairMensagemErro(data, response.status), response.status, data);
    }

    return data;
}

export function buildQueryString(params = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([chave, valor]) => {
        if (valor !== undefined && valor !== null && String(valor).trim() !== "") {
            qs.set(chave, String(valor));
        }
    });
    const texto = qs.toString();
    return texto ? `?${texto}` : "";
}

export const authApi = {
    login: (credenciais) =>
        apiRequest("/login", { method: "POST", body: credenciais, skipAuthReset: true }),
    register: (dados) =>
        apiRequest("/registro", { method: "POST", body: dados, skipAuthReset: true }),
    me: () => apiRequest("/me"),
    atualizarFoto: (arquivo) => {
        const formData = new FormData();
        formData.append("foto", arquivo);
        return apiRequest("/me/foto", { method: "POST", body: formData });
    },
    logout: () => apiRequest("/logout", { method: "POST" }),
    health: () => apiRequest("/health", { skipAuthReset: true }),
};

export const chamadosApi = {
    listar: (filtros = {}) => apiRequest(`/chamados${buildQueryString(filtros)}`),
    detalhar: (id) => apiRequest(`/chamados/${id}`),
    criar: (dados) => apiRequest("/chamados", { method: "POST", body: dados }),
    triar: (id, dados) => apiRequest(`/chamados/${id}/triagem`, { method: "PATCH", body: dados }),
    atualizarStatus: (id, dados) => apiRequest(`/chamados/${id}/status`, { method: "PATCH", body: dados }),
    atualizarPrioridade: (id, dados) => apiRequest(`/chamados/${id}/prioridade`, { method: "PATCH", body: dados }),
    registrarAtendimento: (id, dados) => apiRequest(`/chamados/${id}/atendimentos`, { method: "POST", body: dados }),
    reabrir: (id, dados) => apiRequest(`/chamados/${id}/reabrir`, { method: "POST", body: dados }),
    indicadores: (filtros = {}) => apiRequest(`/chamados/indicadores${buildQueryString(filtros)}`),
};

export const notificacoesApi = {
    listar: () => apiRequest("/notificacoes"),
    marcarLida: (id) => apiRequest(`/notificacoes/${id}/lida`, { method: "PATCH" }),
    marcarTodasLidas: () => apiRequest("/notificacoes/marcar-todas-lidas", { method: "POST" }),
};

export const usuariosAdminApi = {
    listar: (filtros = {}) => apiRequest(`/usuarios${buildQueryString(filtros)}`),
    criar: (dados) => apiRequest("/usuarios", { method: "POST", body: dados }),
    atualizar: (id, dados) => apiRequest(`/usuarios/${id}`, { method: "PUT", body: dados }),
    inativar: (id, ativo) => apiRequest(`/usuarios/${id}/inativar`, { method: "PATCH", body: { ativo } }),
    remover: (id) => apiRequest(`/usuarios/${id}`, { method: "DELETE" }),
};
