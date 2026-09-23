require("dotenv").config();

const {
    obtenerEquipos,
    obtenerCamposTicket
} = require("./helpdesk");

async function diagnostico() {

    console.log("========================================");
    console.log(" DIAGNÓSTICO HELPDESK - ODOO 19");
    console.log("========================================");

    try {

        console.log("\n1. EQUIPOS DE HELPDESK");
        console.log("----------------------------------------");

        const equipos = await obtenerEquipos();

        console.table(equipos);

        console.log("\n2. CAMPOS DE HELPDESK.TICKET");
        console.log("----------------------------------------");

        const campos = await obtenerCamposTicket();

        const importantes = [
            "name",
            "description",
            "team_id",
            "partner_id",
            "email_from",
            "priority",
            "stage_id",
            "user_id"
        ];

        for (const campo of importantes) {

            if (campos[campo]) {

                console.log(
                    `${campo}:`,
                    JSON.stringify(campos[campo], null, 2)
                );

            } else {

                console.log(`${campo}: NO EXISTE`);

            }
        }

        console.log("\n========================================");
        console.log(" DIAGNÓSTICO TERMINADO");
        console.log("========================================");

    } catch (error) {

        console.error("\nERROR:");
        console.error(error.message);

        process.exitCode = 1;
    }
}

diagnostico();