const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta// password secret
const secret = "CLAVE_SECRETA_del_proyecto_DE_LA_PAGINA_ROTARY_MAIPO_CHILE";

const createToken = (user) => {
  // Validar que el objeto 'user' y sus propiedades necesarias estén presentes
  if (!user || !user._id || !user.name || !user.email || !user.role) {
    throw new Error(
      "Objeto de usuario inválido. Faltan propiedades requeridas."
    );
  }

  // Obtener la fecha actual y la fecha de expiración
  const iat = moment().unix();
  // aqui puede dias hora o minitos 
  const exp = moment().add(30, "days").unix();

  // Validar que las fechas se hayan generado correctamente
  if (!iat || !exp) {
    throw new Error("Error al generar las fechas.");
  }

  // Construir el objeto payload para el token
  const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    iat,
    exp,
  };

  // Devolver el token JWT codificado
  return jwt.encode(payload, secret);
};
module.exports = {
  secret,
  createToken,
};
