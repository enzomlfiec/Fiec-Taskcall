import {
    CircleCheck,
    Clock4,
    Ellipsis,
    MessageCircleWarning,
} from "lucide-react";

export const STATUS_OFICIAIS = [
    "emAnalise",
    "naoVisualizado",
    "emProgresso",
    "resolvido",
];

export const STATUS_TI_PERMITIDOS = [
    "naoVisualizado",
    "emProgresso",
    "resolvido",
];

export const STATUS_META = {
    emAnalise: {
        id: "emAnalise",
        nome: "Em Análise",
        cor: "cinza",
        bgClass: "bg-zinc-500",
        icone: Ellipsis,
    },
    naoVisualizado: {
        id: "naoVisualizado",
        nome: "Não Visualizado",
        cor: "sec-amarelo",
        bgClass: "bg-sec-amarelo",
        icone: MessageCircleWarning,
    },
    emProgresso: {
        id: "emProgresso",
        nome: "Em Progresso",
        cor: "sec-azul",
        bgClass: "bg-sec-azul",
        icone: Clock4,
    },
    resolvido: {
        id: "resolvido",
        nome: "Resolvido",
        cor: "sec-verde",
        bgClass: "bg-sec-verde",
        icone: CircleCheck,
    },
};

export const PRIORIDADES_OFICIAIS = ["Muito alta", "Alta", "Média", "Baixa"];

export const PRIORIDADE_META = {
    "Muito alta": {
        label: "Muito alta",
        badgeClass: "bg-sec-vermelho/20 text-sec-vermelho border border-sec-vermelho/40",
        urgente: true,
    },
    Alta: {
        label: "Alta",
        badgeClass: "bg-sec-amarelo/20 text-sec-amarelo border border-sec-amarelo/40",
        urgente: true,
    },
    Média: {
        label: "Média",
        badgeClass: "bg-sec-azul/15 text-sec-azul border border-sec-azul/30",
        urgente: false,
    },
    Baixa: {
        label: "Baixa",
        badgeClass: "bg-fundo-razo text-sec border border-borda/30",
        urgente: false,
    },
};

export const TRIAGEM_LABELS = {
    pendente: "Aguardando triagem",
    aprovado: "Aprovado na triagem",
    recusado: "Recusado na triagem",
};

const NOMES_MESES = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

export function formatarDataTaskCall(dataIso) {
    if (!dataIso) return "Data indisponível";
    const dt = new Date(dataIso);
    if (Number.isNaN(dt.getTime())) return String(dataIso);

    const dia = dt.getDate();
    const mes = NOMES_MESES[dt.getMonth()];
    const ano = dt.getFullYear();
    const hora = String(dt.getHours()).padStart(2, "0");
    const minuto = String(dt.getMinutes()).padStart(2, "0");

    return `${dia}, ${mes} ${ano} - ${hora}:${minuto}`;
}

export function dataParaIsoLocal(dataIso) {
    if (!dataIso) return "";
    const dt = new Date(dataIso);
    if (Number.isNaN(dt.getTime())) return "";
    const ano = dt.getFullYear();
    const mes = String(dt.getMonth() + 1).padStart(2, "0");
    const dia = String(dt.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

export function getStatusMeta(status) {
    return (
        STATUS_META[status] || {
            id: status || "emAnalise",
            nome: status || "Em Análise",
            cor: "cinza",
            bgClass: "bg-zinc-500",
            icone: Ellipsis,
        }
    );
}

export function adaptarChamadoApi(raw, favoritosSet = new Set()) {
    const id = raw.cod_chamado ?? raw.id;
    const solicitante = raw.usuario || {};
    const responsavelTi = raw.responsavel_ti || raw.responsavelTi || null;
    const triadoPor = raw.triado_por || raw.triadoPor || null;
    const equipamento = raw.equipamento || null;

    const sala = raw.sala_chamado
        ? String(raw.sala_chamado)
        : equipamento?.num_sala
          ? String(equipamento.num_sala)
          : "-";

    const dispositivo = raw.dispositivo
        ? String(raw.dispositivo)
        : equipamento?.equipamentos_col || "-";

    const status = STATUS_META[raw.status] ? raw.status : "emAnalise";
    const prioridade = raw.prioridade || "Média";
    const dataRaw = raw.data || raw.created_at;
    const dt = dataRaw ? new Date(dataRaw) : null;

    return {
        ...raw,
        id,
        cod_chamado: id,
        titulo: raw.titulo || raw.descricao || `Chamado #${id}`,
        nome: solicitante.nome || "Usuário FIEC",
        cargo: solicitante.funcao || (solicitante.perfil === "coordenador" ? "Coordenadora" : "Sem cargo"),
        sala,
        dispositivo,
        categoria: raw.categoria || "Hardware",
        descricao: raw.descricao || "",
        status,
        prioridade,
        visualizado: Boolean(raw.visualizado_em),
        visualizado_em: raw.visualizado_em || null,
        triagem_status: raw.triagem_status || "pendente",
        triagem_observacao: raw.triagem_observacao || null,
        triagem_em: raw.triagem_em || null,
        triado_por_nome: triadoPor?.nome || null,
        responsavel_ti_nome: responsavelTi?.nome || null,
        dataOriginal: dataRaw,
        dataIsoDia: dataParaIsoLocal(dataRaw),
        dataTimestamp: dt && !Number.isNaN(dt.getTime()) ? dt.getTime() : 0,
        data: formatarDataTaskCall(dataRaw),
        salvo: favoritosSet.has(Number(id)),
        historicos: Array.isArray(raw.historicos) ? raw.historicos : [],
        atendimentos: Array.isArray(raw.atendimentos) ? raw.atendimentos : [],
    };
}

export function getChaveFavoritos(idUsuario) {
    return `taskcall:favoritos:${idUsuario}`;
}

export function lerFavoritosUsuario(idUsuario) {
    if (!idUsuario) return [];
    try {
        const bruto = localStorage.getItem(getChaveFavoritos(idUsuario));
        if (!bruto) return [];
        const parsed = JSON.parse(bruto);
        return Array.isArray(parsed) ? parsed.map(Number) : [];
    } catch {
        return [];
    }
}

export function alternarFavoritoUsuario(idUsuario, codChamado) {
    if (!idUsuario) return [];
    const idNum = Number(codChamado);
    const atuais = lerFavoritosUsuario(idUsuario);
    const existe = atuais.includes(idNum);
    const atualizados = existe
        ? atuais.filter((item) => item !== idNum)
        : [...atuais, idNum];
    localStorage.setItem(getChaveFavoritos(idUsuario), JSON.stringify(atualizados));
    return atualizados;
}
