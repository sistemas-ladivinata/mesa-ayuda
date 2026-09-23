const { consultarOdoo } = require("./odoo");
const { SUCURSALES, PRIORIDADES } = require("../config");

async function obtenerEquipos() {

    return await consultarOdoo(
        "helpdesk.team",
        "search_read",
        {
            domain: [
                ["active", "=", true]
            ],
            fields: [
                "id",
                "name"
            ],
            order: "name asc",
            limit: 200
        }
    );
}


async function obtenerCamposTicket() {

    return await consultarOdoo(
        "helpdesk.ticket",
        "fields_get",
        {
            attributes: [
                "string",
                "type",
                "relation",
                "selection"
            ]
        }
    );
}


async function buscarPartnerPorEmail(email) {

    const limpio = String(email || "")
        .trim()
        .toLowerCase();

    if (!limpio) {
        return null;
    }

    const partners = await consultarOdoo(
        "res.partner",
        "search_read",
        {
            domain: [
                ["email", "=ilike", limpio]
            ],
            fields: [
                "id",
                "name",
                "email"
            ],
            limit: 1
        }
    );

    return partners.length ? partners[0] : null;
}
async function obtenerTickets(email) {

    const partner = await buscarPartnerPorEmail(email);

    if (!partner) {
        throw new Error(
            `No encontramos un contacto de Odoo asociado al correo: ${email}`
        );
    }

    const tickets = await consultarOdoo(
        "helpdesk.ticket",
        "search_read",
        {
            domain: [
                ["partner_id", "=", partner.id]
            ],
            fields: [
                "id",
                "name",
                "display_name",
                "description",
                "create_date",
                "write_date",
                "priority",
                "stage_id",
                "team_id",
                "user_id",
                "partner_id"
            ],
            order: "create_date desc",
            limit: 100
        }
    );

    return tickets;
}

async function obtenerTicket(id, email) {

    const partner = await buscarPartnerPorEmail(email);

    if (!partner) {
        throw new Error(
            `No encontramos un contacto de Odoo asociado al correo: ${email}`
        );
    }

    const tickets = await consultarOdoo(
        "helpdesk.ticket",
        "search_read",
        {
            domain: [
                ["id", "=", Number(id)],
                ["partner_id", "=", partner.id]
            ],
            fields: [
                "id",
                "name",
                "description",
                "create_date",
                "write_date",
                "priority",
                "stage_id",
                "team_id",
                "user_id",
                "partner_id"
            ],
            limit: 1
        }
    );

    if (!tickets.length) {
        throw new Error(
            "El ticket no existe o no pertenece al usuario."
        );
    }

    const ticket = tickets[0];

    return {
        id: ticket.id,
        name: ticket.name || `Ticket #${ticket.id}`,
        description: ticket.description || "",
        create_date: ticket.create_date || "",
        write_date: ticket.write_date || "",
        priority: String(ticket.priority ?? "0"),

        stage: ticket.stage_id
            ? ticket.stage_id[1]
            : "Sin estado",

        team: ticket.team_id
            ? ticket.team_id[1]
            : "Sin equipo",

        responsable: ticket.user_id
            ? ticket.user_id[1]
            : "Sin asignar"
    };
}

async function crearTicket({
    email,
    asunto,
    descripcion,
    prioridad = "0",
    equipoId = 2
}) {

    const partner = await buscarPartnerPorEmail(email);

    if (!partner) {
        throw new Error(
            `No encontramos un contacto de Odoo asociado al correo: ${email}`
        );
    }

    const valores = {
        name: asunto,
        description:
            `<p><strong>Solicitante:</strong> ${partner.name}</p>` +
            `<p><strong>Correo:</strong> ${partner.email}</p>` +
            `<hr>` +
            `<p>${descripcion}</p>`,
        team_id: equipoId,
        partner_id: partner.id,
        priority: String(prioridad)
    };

    const resultado = await consultarOdoo(
        "helpdesk.ticket",
        "create",
        {
            vals_list: [
                valores
            ]
        }
    );

    return resultado;
}

async function obtenerTicketPorId(id, email) {

    const partner = await buscarPartnerPorEmail(email);

    if (!partner) {
        throw new Error(
            `No encontramos un contacto de Odoo asociado al correo: ${email}`
        );
    }

    const tickets = await consultarOdoo(
        "helpdesk.ticket",
        "search_read",
        {
            domain: [
                ["id", "=", Number(id)],
                ["partner_id", "=", partner.id]
            ],
            fields: [
                "id",
                "name",
                "display_name",
                "description",
                "create_date",
                "write_date",
                "priority",
                "stage_id",
                "team_id",
                "user_id",
                "partner_id"
            ],
            limit: 1
        }
    );

    if (!tickets.length) {
        throw new Error(
            "Ticket no encontrado o no pertenece al usuario."
        );
    }

    return tickets[0];
}

async function obtenerTicketPorId(id, email) {

    const partner = await buscarPartnerPorEmail(email);

    if (!partner) {
        throw new Error(
            `No encontramos un contacto de Odoo asociado al correo: ${email}`
        );
    }

    const tickets = await consultarOdoo(
        "helpdesk.ticket",
        "search_read",
        {
            domain: [
                ["id", "=", Number(id)],
                ["partner_id", "=", partner.id]
            ],
            fields: [
                "id",
                "name",
                "display_name",
                "description",
                "create_date",
                "write_date",
                "priority",
                "stage_id",
                "team_id",
                "user_id",
                "partner_id"
            ],
            limit: 1
        }
    );

    if (!tickets.length) {
        throw new Error(
            "Ticket no encontrado o no pertenece al usuario."
        );
    }

    return tickets[0];
}

async function obtenerDatosIniciales(email) {

    const limpio = String(email || "")
        .trim()
        .toLowerCase();

    // Validar correo
    if (!limpio) {
        throw new Error(
            "No se recibió un correo electrónico."
        );
    }

    // Validar dominio corporativo
    if (!limpio.endsWith("@ladivinata.mx")) {
        throw new Error(
            "Solo se permiten correos @ladivinata.mx."
        );
    }

    // Buscar contacto en Odoo
    const partner = await buscarPartnerPorEmail(limpio);

    if (!partner) {
        throw new Error(
            "No encontramos un contacto de Odoo asociado al correo: " +
            limpio
        );
    }

    // Obtener equipos
    const equipos = await obtenerEquipos();

    return {
        ok: true,

        usuario: {
            id: partner.id,
            name: partner.name || "",
            email: partner.email || limpio
        },

        sucursales: Object.values(SUCURSALES),

        prioridades: PRIORIDADES,

        equipos: equipos.map(e => ({
            id: e.id,
            name: e.name || ""
        }))
    };
}

module.exports = {
    obtenerEquipos,
    obtenerCamposTicket,
    buscarPartnerPorEmail,
    obtenerDatosIniciales,
    obtenerTickets,
    obtenerTicket,
    crearTicket
};