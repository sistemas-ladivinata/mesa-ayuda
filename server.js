require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const ticketsRouter = require("./src/routes/tickets");
const usuarioRouter = require("./src/routes/usuario");
const PORT = process.env.PORT || 4000;

// Permitir JSON
app.use(express.json());
app.use("/api/tickets", ticketsRouter);
app.use("/api/usuario", usuarioRouter);

// Servir archivos de la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log("================================");
    console.log(` const PORT: string | ${PORT} `);
    console.log(` Follow link (ctrl + click) `);
    console.log(` http://localhost:${PORT} `);
    console.log("================================")
});