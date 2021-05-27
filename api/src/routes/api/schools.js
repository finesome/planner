// зависимости
const express = require("express");
const router = express.Router();
// уровни доступа
const { ADMIN, USER } = require("../../utils/passport");

// контроллер
const schoolController = require("../../controllers/schoolsController");

// все учителя (доступ только у пользователей)
router.get("/teachers", USER, schoolController.getTeachers);
// все школы
router.get("/", schoolController.getSchools);
// запрос определенной школы (этот и последующие запросы требуют доступ администратора)
router.get("/:id", ADMIN, schoolController.getSchool);
// создание школы
router.post("/", ADMIN, schoolController.createSchool);
// редактирование школы
router.post("/:id", ADMIN, schoolController.editSchool);
// удаление школы
router.delete("/:id", ADMIN, schoolController.deleteSchool);

module.exports = router;
