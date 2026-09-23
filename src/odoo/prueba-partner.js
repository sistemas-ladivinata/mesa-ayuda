require("dotenv").config();

const {
    buscarPartnerPorEmail
} = require("./helpdesk");


async function probar() {

    const email = "fabian.tobias@ladivinata.mx";

    console.log("========================================");
    console.log(" PRUEBA DE PARTNER");
    console.log("========================================");

    console.log("\nBuscando:");
    console.log(email);

    try {

        const partner = await buscarPartnerPorEmail(email);

        if (!partner) {

            console.log("\nNO SE ENCONTRÓ EL CONTACTO.");

            return;
        }

        console.log("\nCONTACTO ENCONTRADO:");
        console.log("----------------------------------------");

        console.log("ID:", partner.id);
        console.log("Nombre:", partner.name);
        console.log("Correo:", partner.email);

        console.log("----------------------------------------");

    } catch (error) {

        console.error("\nERROR:");
        console.error(error.message);

        process.exitCode = 1;
    }
}


probar();