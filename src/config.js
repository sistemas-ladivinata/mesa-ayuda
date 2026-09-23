const SUCURSALES = {
    "AND/Existencias": "AND",
    "ANZ/Existencias": "ANZ",
    "ARM/Existencias": "ARM",
    "AUR/Existencias": "AUR",
    "GOM/Existencias": "GOM",
    "LOM/Existencias": "LOM",
    "LSPS/Existencias": "LSPS",
    "NAT/Existencias": "NAT",
    "PRKP/Existencias": "PRKP",
    "QIN/Existencias": "QIN",
    "SANG/Existencias": "SANG",
    "SER/Existencias": "SER",
    "SLV/Existencias": "SLV",
    "SNJ/Existencias": "SNJ",
    "TEC/Existencias": "TEC",
    "VASCO/Existencias": "VASCO"
};

const PRIORIDADES = [
    {
        value: "0",
        label: "Normal"
    },
    {
        value: "1",
        label: "Alta"
    },
    {
        value: "2",
        label: "Urgente"
    }
];

module.exports = {
    SUCURSALES,
    PRIORIDADES
};