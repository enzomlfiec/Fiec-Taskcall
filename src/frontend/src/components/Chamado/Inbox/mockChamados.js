const mockChamados = [
    {
        id: 1,
        bookmarked: false,
        nome: "Adilene",
        sala: "Sala 39",
        categoria: "Máquina",
        salas: "Sala 39",
        dispositivo: "Máquina 25",
        data: "5, Maio 2026 - 14:28",
        status: 2
    },
    {
        id: 2,
        bookmarked: false,
        nome: "Tathiana",
        sala: "Sala 39",
        categoria: "Veyon",
        salas: "Sala 39",
        dispositivo: "Máquina 15",
        data: "27, Abril 2026 - 16:02",
        status: 0
    },
    {
        id: 3,
        bookmarked: false,
        nome: "Adilene",
        sala: "Sala 39",
        categoria: "Projetor",
        salas: "Sala 39",
        dispositivo: "Máquina 15",
        data: "23, Abril 2026 - 14:28",
        status: 0
    },
    {
        id: 4,
        bookmarked: false,
        nome: "Gustavo",
        sala: "Sala 40",
        categoria: "Máquina",
        salas: "Sala 40",
        dispositivo: "Máquina 07",
        data: "6, Maio 2026 - 14:28",
        status: 0
    },
    {
        id: 5,
        bookmarked: false,
        nome: "Ana",
        sala: "Sala 39",
        categoria: "Máquina",
        salas: "Sala 39",
        dispositivo: "Máquina 25",
        data: "6, Maio 2026 - 14:28",
        status: 1
    },
    {
        id: 6,
        bookmarked: false,
        nome: "Tathiana",
        sala: "Sala 40",
        categoria: "Máquina",
        salas: "Sala 40",
        dispositivo: "Máquina 14",
        data: "6, Maio 2026 - 14:28",
        status: 1
    },
    {
        id: 7,
        bookmarked: false,
        nome: "Gustavo",
        sala: "Sala 39",
        categoria: "Equipamento",
        salas: "Sala 39",
        dispositivo: "Máquina 07",
        data: "6, Maio 2026 - 14:28",
        status: 2
    },
    {
        id: 8,
        bookmarked: false,
        nome: "Adilene",
        sala: "Sala 40",
        categoria: "Máquina",
        salas: "Sala 40",
        dispositivo: "Máquina 09",
        data: "6, Maio 2026 - 14:28",
        status: 2
    },
    {
        id: 9,
        bookmarked: false,
        nome: "Tathiana",
        sala: "Sala 40",
        categoria: "Máquina",
        salas: "Sala 40",
        dispositivo: "Máquina 13",
        data: "6, Maio 2026 - 14:28",
        status: 2
    },
    {
        id: 10,
        bookmarked: false,
        nome: "Gustavo",
        sala: "Sala 39",
        categoria: "Máquina",
        salas: "Sala 39",
        dispositivo: "Máquina 05",
        data: "6, Maio 2026 - 14:28",
        status: 2
    },
    {
        id: 11,
        bookmarked: false,
        nome: "Ana",
        sala: "Sala 40",
        categoria: "Máquina",
        salas: "Sala 40",
        dispositivo: "Máquina 12",
        data: "6, Maio 2026 - 14:28",
        status: 2
    },
    {
        id: 12,
        bookmarked: false,
        nome: "Adilene",
        sala: "Sala 39",
        categoria: "Máquina",
        salas: "Sala 39",
        dispositivo: "Máquina 20",
        data: "6, Maio 2026 - 14:28",
        status: 2
    },
    {
        id: 13,
        bookmarked: false,
        nome: "Tathiana",
        sala: "Sala 40",
        categoria: "Máquina",
        salas: "Sala 40",
        dispositivo: "Máquina 11",
        data: "6, Maio 2026 - 14:28",
        status: 2
    },
    {
        id: 14,
        bookmarked: false,
        nome: "Adilene",
        sala: "Sala 39",
        categoria: "Máquina",
        salas: "Sala 39",
        dispositivo: "Máquina 03",
        data: "6, Maio 2026 - 14:28",
        status: 2
    },
    {
        id: 15,
        bookmarked: false,
        nome: "Gustavo",
        sala: "Sala 40",
        categoria: "Máquina",
        salas: "Sala 40",
        dispositivo: "Máquina 27",
        data: "6, Maio 2026 - 14:28",
        status: 2
    },
    {
        id: 16,
        bookmarked: false,
        nome: "Adilene",
        sala: "Sala 39",
        categoria: "Máquina",
        salas: "Sala 39",
        dispositivo: "Máquina 02",
        data: "6, Maio 2026 - 14:28",
        status: 2
    },
    {
        id: 17,
        bookmarked: false,
        nome: "Adilene",
        sala: "Sala 39",
        categoria: "Máquina",
        salas: "Sala 39",
        dispositivo: "Máquina 09",
        data: "6, Maio 2026 - 14:28",
        status: 2
    },

    {
        id: 18,
        bookmarked: false,
        nome: "Ana",
        sala: "Sala 38",
        categoria: "Projetor",
        salas: "Sala 38",
        dispositivo: "Projetor 02",
        data: "7, Maio 2026 - 09:15",
        status: 0
    },
    {
        id: 19,
        bookmarked: true,
        nome: "Gustavo",
        sala: "Sala 41",
        categoria: "Equipamento",
        salas: "Sala 41",
        dispositivo: "Monitor 04",
        data: "7, Maio 2026 - 10:32",
        status: 1
    },
    {
        id: 20,
        bookmarked: false,
        nome: "Adilene",
        sala: "Sala 37",
        categoria: "Máquina",
        salas: "Sala 37",
        dispositivo: "Máquina 18",
        data: "8, Maio 2026 - 13:47",
        status: 2
    },
    {
        id: 21,
        bookmarked: false,
        nome: "Tathiana",
        sala: "Sala 42",
        categoria: "Rede",
        salas: "Sala 42",
        dispositivo: "Switch 03",
        data: "8, Maio 2026 - 15:20",
        status: 2
    },
    {
        id: 22,
        bookmarked: true,
        nome: "Ana",
        sala: "Sala 40",
        categoria: "Máquina",
        salas: "Sala 40",
        dispositivo: "Máquina 22",
        data: "9, Maio 2026 - 08:41",
        status: 2
    },
    {
        id: 23,
        bookmarked: false,
        nome: "Gustavo",
        sala: "Sala 39",
        categoria: "Veyon",
        salas: "Sala 39",
        dispositivo: "Máquina 16",
        data: "9, Maio 2026 - 11:03",
        status: 0
    },
    {
        id: 24,
        bookmarked: false,
        nome: "Adilene",
        sala: "Sala 36",
        categoria: "Equipamento",
        salas: "Sala 36",
        dispositivo: "Teclado 08",
        data: "10, Maio 2026 - 14:12",
        status: 1
    },
    {
        id: 25,
        bookmarked: true,
        nome: "Tathiana",
        sala: "Sala 43",
        categoria: "Projetor",
        salas: "Sala 43",
        dispositivo: "Projetor 05",
        data: "10, Maio 2026 - 16:36",
        status: 2
    },
    {
        id: 26,
        bookmarked: false,
        nome: "Ana",
        sala: "Sala 38",
        categoria: "Máquina",
        salas: "Sala 38",
        dispositivo: "Máquina 31",
        data: "11, Maio 2026 - 09:28",
        status: 2
    },
    {
        id: 27,
        bookmarked: false,
        nome: "Gustavo",
        sala: "Sala 40",
        categoria: "Internet",
        salas: "Sala 40",
        dispositivo: "Roteador 02",
        data: "11, Maio 2026 - 13:55",
        status: 2
    }
];

export default mockChamados