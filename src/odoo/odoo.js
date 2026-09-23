const axios = require("axios");

const ODOO_URL = process.env.ODOO_URL;
const ODOO_API_KEY = process.env.ODOO_API_KEY;

if (!ODOO_URL) {
    throw new Error("Falta ODOO_URL en .env");
}

if (!ODOO_API_KEY) {
    throw new Error("Falta ODOO_API_KEY en .env");
}

async function consultarOdoo(modelo, metodo, datos = {}) {

    const url =
        `${ODOO_URL}/json/2/${encodeURIComponent(modelo)}/${encodeURIComponent(metodo)}`;

    try {

        const respuesta = await axios.post(
            url,
            datos,
            {
                headers: {
                    "Authorization": `bearer ${ODOO_API_KEY}`,
                    "Content-Type": "application/json",
                    "User-Agent": "Mesa-Ayuda-La-Divinata"
                }
            }
        );

        return respuesta.data;

    } catch (error) {

        if (error.response) {

            console.error("Error de Odoo:");
            console.error("HTTP:", error.response.status);
            console.error("Respuesta:", error.response.data);

            throw new Error(
                `Odoo respondió HTTP ${error.response.status}`
            );

        }

        console.error("Error conectando con Odoo:");
        console.error(error.message);

        throw error;
    }
}

module.exports = {
    consultarOdoo
};