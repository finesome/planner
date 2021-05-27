// зависимости
const express = require("express");
const router = express.Router();
const { USER } = require("../../utils/passport");

// контроллер
const authController = require("../../controllers/authController");

// проверка
router.post("/", USER, authController.checkAuth);
// регистрация
router.post("/register", authController.register);
// подтверждение регистрации
router.get("/verify/:token", authController.verify);
// восстановление пароля
router.get("/forgot/:email", authController.forgotPassword);
// подтверждение восстановления пароля
router.get("/forgot/:email/:token", authController.forgotPasswordVerify);
// логин
router.post("/login", authController.login);
// выход
router.post("/logout", authController.logout);

module.exports = router;
