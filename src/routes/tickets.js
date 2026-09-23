const express = require("express");

const {
    obtenerTickets,
    obtenerTicket,
    crearTicket
} = require("../odoo/helpdesk");

const router = express.Router();


/*
 * GET /api/tickets?email=correo@ladivinata.mx
 *
 * Obtiene los tickets asociados al correo indicado.
 */
router.get("/", async (req, res) => {

    try {

        const email = String(req.query.email || "")
            .trim()
            .toLowerCase();

        if (!email) {

            return res.status(400).json({
                ok: false,
                error: "El correo electrónico es obligatorio."
            });

        }

        const tickets = await obtenerTickets(email);

        res.json({
            ok: true,
            total: tickets.length,
            tickets
        });

    } catch (error) {

        console.error("Error obteniendo tickets:");
        console.error(error);

        res.status(500).json({
            ok: false,
            error: error.message
        });

    }

});

router.get("/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        const email = String(req.query.email || "")
            .trim()
            .toLowerCase();

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                ok: false,
                error: "El ID del ticket no es válido."
            });

        }

        if (!email) {

            return res.status(400).json({
                ok: false,
                error: "El correo electrónico es obligatorio."
            });

        }

        const ticket = await obtenerTicket(
            id,
            email
        );

        res.json({
            ok: true,
            ticket
        });

    } catch (error) {

        console.error("Error obteniendo detalle del ticket:");
        console.error(error);

        res.status(404).json({
            ok: false,
            error: error.message
        });

    }

});

/*
 * GET /api/tickets/:id?email=correo@ladivinata.mx
 */
router.get("/:id", async (req, res) => {
    try {

        const id = Number(req.params.id);

        const email = String(req.query.email || "")
            .trim()
            .toLowerCase();

        if (!id) {
            return res.status(400).json({
                ok: false,
                error: "El ID del ticket es obligatorio."
            });
        }

        if (!email) {
            return res.status(400).json({
                ok: false,
                error: "El correo electrónico es obligatorio."
            });
        }

        const ticket = await obtenerTicketPorId(id, email);

        res.json({
            ok: true,
            ticket
        });

    } catch (error) {

        console.error("Error obteniendo detalle del ticket:");
        console.error(error);

        res.status(404).json({
            ok: false,
            error: error.message
        });
    }
});
/*
 * POST /api/tickets
 *
 * Crea un ticket en Odoo.
 */
router.post("/", async (req, res) => {

    try {

        const {
            email,
            asunto,
            descripcion,
            prioridad,
            equipoId
        } = req.body;

        if (!email) {
            return res.status(400).json({
                ok: false,
                error: "El correo electrónico es obligatorio."
            });
        }

        if (!asunto) {
            return res.status(400).json({
                ok: false,
                error: "El asunto es obligatorio."
            });
        }

        if (!descripcion) {
            return res.status(400).json({
                ok: false,
                error: "La descripción es obligatoria."
            });
        }

        const resultado = await crearTicket({
            email,
            asunto,
            descripcion,
            prioridad: prioridad || "0",
            equipoId: equipoId || 2
        });

        res.status(201).json({
            ok: true,
            resultado
        });

    } catch (error) {

        console.error("Error creando ticket:");
        console.error(error);

        res.status(500).json({
            ok: false,
            error: error.message
        });

    }

});

module.exports = router;