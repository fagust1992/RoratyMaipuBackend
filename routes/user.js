const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const multer = require("multer"); // Corrección aquí
const check = require("../Middleware/auth"); // Middleware

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars/"); // Corrección aquí
  },
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + "-" + file.originalname);
  },
});
const uploads = multer({ storage });

// Definir Rutas

router.get("/prueba-usuario", check.auth, UserController.pruebaUser);
router.post("/register",UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", UserController.profile);
router.get("/list/:page?", check.auth, UserController.list);
router.get("/avatar/:file", check.auth, UserController.avatar);
router.put("/update", check.auth, UserController.update);
router.post(
  "/upload",
  [check.auth, uploads.single("file0")],
  UserController.upload
);
router.delete("/delete/:id", check.auth, UserController.delete_user);
// Exportar router
module.exports = router;
