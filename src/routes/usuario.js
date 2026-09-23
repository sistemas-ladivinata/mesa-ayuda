const express = require("express");

const {
    obtenerDatosIniciales
} = require("../odoo/helpdesk");

const router = express.Router();

/*
 * GET /api/usuario?email=correo@ladivinata.mx
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

        const datos = await obtenerDatosIniciales(email);

        res.json(datos);

    } catch (error) {

        console.error("Error obteniendo datos iniciales:");
        console.error(error);

        res.status(400).json({
            ok: false,
            error: error.message
        });

    }

});

module.exports = router;