// зависимости
const express = require("express");
const router = express.Router();
// уровни доступа
const { ADMIN } = require("../../utils/passport");

// контроллер
const usersController = require("../../controllers/usersController");

// определенный пользователь (сам)
router.get("/me", usersController.getMe);
// изменить аватар
router.post("/me/avatar", usersController.editAvatar);
// изменить пароль
router.post("/me/password", usersController.editPassword);
// все пользователи
router.get("/", ADMIN, usersController.getUsers);
// определенный пользователь
router.get("/:email", ADMIN, usersController.getUser);
// удалить пользователя
router.delete("/:email", ADMIN, usersController.deleteUser);
// сброс пароля
router.post("/:email/reset", ADMIN, usersController.resetUserPassword);

module.exports = router;
