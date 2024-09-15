const fs = require("fs");
const path = require('path');
const Publication = require("../models/publication");

// acciones de prueba
const pruebaPublication = (req, res) => {
  return res.status(200).send({
    message: "mensaje enviado desde: controllers/publication.js",
  });
};

// guardar publicacion
const save = async (req, res) => {
  try {
    // recoger datos del body
    const params = req.body;

    // si no llegan datos arrogar error
    if (!params.text) {
      return res.status(400).send({
        status: "error",
        message: "debes enviar el texto de la publicacion",
      });
    }

    // crear y rellenar objeto del modelo
    let newPublication = new Publication(params);
    newPublication.user = req.user.id;
    console.log(newPublication);

    // guardar objeto en bbd
    const publicationStored = await newPublication.save();

    return res.status(200).send({
      status: "success",
      message: "Publicacion guardada",
      publication: publicationStored,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "no se ha guardado la publicacion",
      error: error.message,
    });
  }
};

// Sacar Publicacion

// Obtener detalles de una publicación
const Detail = async (req, res) => {
  try {
    // Sacar id de la publicación de la URL
    const publicationId = req.params.id;
    console.log(publicationId);

    // Buscar la publicación por ID
    const publicationStored = await Publication.findById(publicationId);

    // Si no se encuentra la publicación, devolver un error 404
    if (!publicationStored) {
      return res.status(404).send({
        status: "error",
        message: "No existe la publicación",
      });
    }

    // Devolver la publicación encontrada
    return res.status(200).send({
      status: "success",
      message: "Mostrar publicación",
      publication: publicationStored,
    });
  } catch (err) {
    // Manejar errores generales
    return res.status(500).send({
      status: "error",
      message: "Error al obtener la publicación",
      error: err.message,
    });
  }
};

//Delete Publication/Eliminar publicacion
const remove = async (req, res) => {
  try {
    const publicationId = req.params.id;

    // Buscar y luego eliminar la publicación
    const publication = await Publication.findOneAndDelete({
      user: req.user.id,
      _id: publicationId,
    });
    console.log(req.user);
    // Si no se encuentra la publicación, devolver un error 404
    if (!publication) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado esta publicación ",
      });
    }

    // Devolver respuesta de éxito
    return res.status(200).send({
      status: "success",
      message: "Publicación eliminada",
      publication: publicationId,
    });
  } catch (err) {
    // Manejar errores generales
    return res.status(500).send({
      status: "error",
      message: "No se ha eliminado ninguna publicación",
      error: err.message,
    });
  }
};

// Listar publicaciones de un usuario
const user = async (req, res) => {
  try {
    // Sacar el id del usuario
    const userId = req.params.id;

    // Controlar la página
    let page = 1;

    if (req.params.page) {
      page = parseInt(req.params.page);
    }

    const itemsPerPage = 5;

    // Obtener el total de publicaciones del usuario
    const totalPublications = await Publication.countDocuments({
      user: userId,
    });

    // Calcular el número total de páginas
    const totalPages = Math.ceil(totalPublications / itemsPerPage);

    // Buscar, popular, ordenar y paginar
    const publications = await Publication.find({ user: userId })
      .sort("-created_at") // Ordenar por fecha de creación descendente
      .skip((page - 1) * itemsPerPage) // Saltar los documentos según la página
      .limit(itemsPerPage) // Limitar los resultados por página
      .exec();

    // Devolver respuesta
    return res.status(200).send({
      status: "success",
      message: "Publicaciones del perfil de Usuario",
      user: req.user,
      publications,
      totalPublications,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    // Manejar errores generales
    return res.status(500).send({
      status: "error",
      message: "Error al obtener las publicaciones",
      error: err.message,
    });
  }
};
// Subir ficheros
const upload = async (req, res) => {
  try {
    // Sacar publication id
    const publicationId = req.params.id;
    console.log("Publication ID:", publicationId);

    // Recoger el fichero de imagen y comprobar que existe
    if (!req.file) {
      return res.status(404).send({
        status: "error",
        message: "Petición no incluye la imagen",
      });
    }

    // Conseguir el nombre del archivo
    let image = req.file.originalname;
    console.log(image);

    // Sacar la extensión del archivo
    const imageSplit = image.split(".");
    console.log(imageSplit);
    const extension = imageSplit[imageSplit.length - 1];


    // Comprobar extensión
    if (
      extension != "png" &&
      extension != "jpg" &&
      extension != "jpeg" &&
      extension != "gif"
    ) {
      // Borrar archivo subido
      const filePath = req.file.path;
      fs.unlinkSync(filePath); // No necesitamos guardar el resultado de fs.unlinkSync

      // Devolver respuesta negativa
      return res.status(400).send({
        status: "error",
        message: "Extensión del fichero invalida",
      });
    }

    // Si es correcta, guardar imagen en bbdd
    const publicationUpdated = await Publication.findOneAndUpdate(
      { user: req.user.id, _id: publicationId },
      { file: req.file.filename },
      { new: true }
    );

    console.log("Publicación actualizada:", publicationUpdated);

    if (!publicationUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error en la subida del avatar",
      });
    }

    // Devolver respuesta
    return res.status(200).send({
      status: "success",
      publication: publicationUpdated,
      file: req.file,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      status: "error",
      message: "Error en la solicitud",
      error: error.message,
    });
  }
};
const media = (req, res) => {
  const file = req.params.file;
  // Montar el path real de la imagen
  const filePath = path.join(__dirname, '../uploads/publications/', file);
  // Comprobar que existe
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) {
      return res.status(404).send({
        status: "error",
        message: "No existe la imagen",
      });
    }

    // Devolver un file
    return res.sendFile(path.resolve(filePath));
  });
};

const getAllPublications = async (req, res) => {
  try {
    // Controlar la página
    let page = 1;
    if (req.query.page) {
      page = parseInt(req.query.page);
    }

    const itemsPerPage = 5;

    // Obtener el total de publicaciones
    const totalPublications = await Publication.countDocuments();

    // Calcular el número total de páginas
    const totalPages = Math.ceil(totalPublications / itemsPerPage);

    // Buscar, ordenar y paginar
    const publications = await Publication.find()
      .sort("-created_at") // Ordenar por fecha de creación descendente
      .skip((page - 1) * itemsPerPage) // Saltar los documentos según la página
      .limit(itemsPerPage) // Limitar los resultados por página
      .exec();

    // Devolver respuesta
    return res.status(200).send({
      status: "success",
      message: "Listado de todas las publicaciones",
      publications,
      totalPublications,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    // Manejar errores generales
    return res.status(500).send({
      status: "error",
      message: "Error al obtener las publicaciones",
      error: err.message,
    });
  }
};


const updatePublication = async (req, res) => {
  try {
    // Recoger información de la publicación a modificar
    const publicationId = req.params.id;
    const userId = req.user.id; // Asumiendo que req.user contiene la información del usuario autenticado
    const publicationToUpdate = req.body;


    
    // Verificar si la publicación existe y pertenece al usuario autenticado
    const existingPublication = await Publication.findOne({
      _id: publicationId,  
      
      user: userId,
    });

    if (!existingPublication) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada o no pertenece al usuario",
      });
    }

    // Actualizar la publicación en la base de datos
    const updatedPublication = await Publication.findByIdAndUpdate(
      publicationId,
      publicationToUpdate,
      { new: true }
    );

    if (!updatedPublication) {
      return res.status(500).json({
        status: "error",
        message: "Error al actualizar la publicación",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Publicación actualizada exitosamente",
      publication: updatedPublication,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Hubo un error al actualizar la publicación",
    });
  }
};


module.exports = {
  pruebaPublication,
  save,
  Detail,
  remove,
  user,
  upload,
  media,
  getAllPublications,
  updatePublication
};
