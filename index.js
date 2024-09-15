const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");

// Inicializar app
console.log("App de Node on");

// Inicializar la aplicación Express
const app = express();
const puerto =process.env.PORT || 3900; 

// Configurar CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://rotaryclubmaipu.org',], // Permite solicitudes desde estas URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  preflightContinue: false, // Asegura que las solicitudes OPTIONS no se pasen a los siguientes middleware
}));

// Permitir solicitudes OPTIONS para todos los endpoints
app.options('*', cors());

// Conectar a la base de datos
const connection = require("./datebase/connection");
connection();

// Parsear el cuerpo de las solicitudes a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargar rutas
const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");

app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);

// Ruta de prueba GET
app.get("/ruta_prueba", (req, res) => {
  const objeto = {
    mensaje: "Probando API REST con Node",
    otraPropiedad: "Valor de otra propiedad",
  };
  res.status(200).json(objeto);
});

// Ruta de prueba adicional
app.get("/test", (req, res) => {
  const objeto = {
    mensaje: "Probando API REST con Node",
    otraPropiedad: "Valor de otra propiedad",
  };
  res.status(200).json(objeto);
});

// Poner el servidor a escuchar peticiones HTTP
app.listen(puerto, () => {
  console.log("Servidor corriendo en el puerto " + puerto);
});
