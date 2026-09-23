require("dotenv").config();

const {
    crearTicket
} = require("./helpdesk");


async function probar() {

    console.log("========================================");
    console.log(" PRUEBA CREAR TICKET");
    console.log("========================================");

    try {

        const resultado = await crearTicket({

            email: "fabian.tobias@ladivinata.mx",

            asunto: "PRUEBA MIGRACION NODE",

            descripcion:
                "Este ticket es una prueba de la nueva aplicación Node.js.",

            prioridad: "0",

            equipoId: 2

        });

        console.log("\nTICKET CREADO:");
        console.log("----------------------------------------");

        console.log(
            JSON.stringify(resultado, null, 2)
        );

        console.log("----------------------------------------");

    } catch (error) {

        console.error("\nERROR:");
        console.error(error.message);

        process.exitCode = 1;
    }
}


probar();