const jwt = require("jwt-simple");
const moment = require("moment");
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({
      status: "error",
      message: "No se proporcionó un token de autenticación.",
    });
  }

  const token = authHeader.replace(/['"]+/g, "");

  try {
    const payload = jwt.decode(token, secret);

    if (payload.exp <= moment().unix()) {
      return res.status(401).json({
        status: "error",
        message: "Token Expirado",
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Token Inválido",
      error: error.message,
    });
  }
};
