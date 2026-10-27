const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")

async function request(path, options = {}) {
    let response
    const isPublicAuthEndpoint = path === "/auth/login" || path === "/auth/register"
    const token = isPublicAuthEndpoint ? null : localStorage.getItem("authToken")

    try {
        response = await fetch(`${apiBase}/api${path}`, {
            ...options,
            headers: {
                Accept: "application/json",
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        })
    } catch {
        throw new Error("Não foi possível conectar ao servidor. Confira se o back-end está iniciado.")
    }

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
        if (response.status === 401 && token) {
            localStorage.removeItem("authToken")
            localStorage.removeItem("userInfo")
        }
        const firstValidationError = Object.values(payload.errors || {})[0]?.[0]
        throw new Error(firstValidationError || payload.message || "Não foi possível concluir a solicitação.")
    }

    return payload
}

export async function listarChamados() {
    const payload = await request("/chamados")
    return payload.data || []
}

export async function criarChamado(chamado) {
    const payload = await request("/chamados", {
        method: "POST",
        body: JSON.stringify(chamado),
    })
    return payload.data
}

export async function excluirChamado(id) {
    return request(`/chamados/${id}`, { method: "DELETE" })
}

export async function cadastrarUsuario(usuario) {
    const payload = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(usuario),
    })
    return payload.data
}

export async function autenticarUsuario(credenciais) {
    const payload = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credenciais),
    })
    return { ...payload.data, token: payload.token, tokenExpiresAt: payload.token_expires_at }
}

export async function encerrarSessao() {
    try {
        return await request("/auth/logout", { method: "POST" })
    } finally {
        localStorage.removeItem("authToken")
        localStorage.removeItem("userInfo")
    }
}
