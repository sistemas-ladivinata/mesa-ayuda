require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const ticketsRouter = require("./src/routes/tickets");
const usuarioRouter = require("./src/routes/usuario");
const PORT = process.env.PORT || 3000;

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
app.listen(PORT, () => {
    console.log("========================================");
    console.log(" MESA DE AYUDA - LA DIVINATA");
    console.log("========================================");
    console.log(`Servidor iniciado en puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});