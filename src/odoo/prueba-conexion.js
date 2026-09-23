require("dotenv").config();

const { consultarOdoo } = require("./odoo");

async function probarConexion() {

    console.log("========================================");
    console.log(" PRUEBA DE CONEXIÓN CON ODOO");
    console.log("========================================");

    console.log("URL:", process.env.ODOO_URL);

    try {

        const resultado = await consultarOdoo(
            "res.users",
            "context_get",
            {}
        );

        console.log("");
        console.log("CONEXIÓN CON ODOO CORRECTA");
        console.log("");

        console.log(JSON.stringify(resultado, null, 2));

    } catch (error) {

        console.error("");
        console.error("ERROR DE CONEXIÓN");
        console.error(error.message);

        process.exitCode = 1;
    }
}

probarConexion();