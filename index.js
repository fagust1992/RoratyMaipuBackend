const connection = require("./datebase/connection");
const express = require("express");
const cors = require("cors");

// Inicializar app
console.log("App de Node on  ");
// Inicializar la aplicación Express
const app = express();
const puerto = 3900;

// Configurar CORS
app.use(cors()); // intercambio entre diferente dominios

// Conectar a la base de datos
connection();

// Parsear el cuerpo de las solicitudes a JSON 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cargar rutas

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
