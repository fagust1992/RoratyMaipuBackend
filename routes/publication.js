const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication");
const check = require("../Middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/publications/");
    },
    filename: (req, file, cb) => {
        cb(null, "pub-" + Date.now() + "-" + file.originalname);
    },
});

const uploads = multer({ storage });

// Definir Rutas
router.get("/prueba-publication", PublicationController.pruebaPublication);
router.get("/detail/:id", check.auth, PublicationController.Detail);
router.post("/save", check.auth, PublicationController.save);
router.delete("/remove/:id", check.auth, PublicationController.remove);
router.get("/user/:id/:page?", check.auth, PublicationController.user);
router.post("/upload/:id", [check.auth, uploads.single("file0")], PublicationController.upload);
router.get("/media/:file",check.auth,PublicationController.media); //cambio
router.get('/publications/:page?',check.auth, PublicationController.getAllPublications);
router.put("/update/:id", check.auth, PublicationController.updatePublication);


// Exportar router
module.exports = router;
