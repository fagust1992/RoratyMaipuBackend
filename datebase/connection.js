const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Cargar variables de entorno desde un archivo .env
dotenv.config();

mongoose.connection.on("connected", () => {
  console.log("Conectado a la base de datos");
});

mongoose.connection.on("error", (err) => {
  console.error("Error de conexión a la base de datos:", err);
});

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conexión establecida correctamente");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    process.exit(1); // Salir del proceso con código de error
  }
};

module.exports = connection;
