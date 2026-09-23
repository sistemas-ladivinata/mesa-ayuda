require("dotenv").config();

const {
    obtenerTickets
} = require("./helpdesk");


async function probar() {

    const email = "fabian.tobias@ladivinata.mx";

    console.log("========================================");
    console.log(" PRUEBA DE TICKETS");
    console.log("========================================");

    console.log("\nUsuario:");
    console.log(email);

    try {

        const tickets = await obtenerTickets(email);

        console.log("\nTICKETS ENCONTRADOS:");
        console.log("----------------------------------------");

        console.log("Total:", tickets.length);

        if (!tickets.length) {

            console.log("\nEl usuario no tiene tickets.");

            return;
        }

        console.log("");

        tickets.forEach((ticket, indice) => {

            console.log(`--- Ticket ${indice + 1} ---`);

            console.log("ID:", ticket.id);
            console.log("Asunto:", ticket.name);
            console.log("Display:", ticket.display_name);
            console.log("Fecha:", ticket.create_date);
            console.log("Prioridad:", ticket.priority);
            console.log(
                "Estado:",
                ticket.stage_id
            );
            console.log(
                "Equipo:",
                ticket.team_id
            );
            console.log(
                "Responsable:",
                ticket.user_id
            );

            console.log("");
        });

    } catch (error) {

        console.error("\nERROR:");
        console.error(error.message);

        process.exitCode = 1;
    }
}


probar();