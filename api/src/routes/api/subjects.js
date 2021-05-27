// зависимости
const express = require("express");
const router = express.Router();
// уровни доступа
const { ADMIN, USER } = require("../../utils/passport");

// контроллер
const subjectController = require("../../controllers/subjectsController");

// все предметы и их поурочные планы
router.get("/", USER, subjectController.getSubjects);
// запрос предмета (этот и последующие запросы требуют доступа администратора)
router.get("/:id", ADMIN, subjectController.getSubject);
// создание нового предмета
router.post("/", ADMIN, subjectController.createSubject);
// запрос плана по предмету (id относится к предмету, pid относится к плану)
router.get("/:id/plans/:pid", ADMIN, subjectController.getPlan);
// добавление нового плана в предмет
router.post("/:id/plans", ADMIN, subjectController.createPlan);
// редактирование плана в предмете
router.post("/:id/plans/:pid", ADMIN, subjectController.editPlan);
// удаление плана из предмета
router.delete("/:id/plans/:pid", ADMIN, subjectController.deletePlan);

module.exports = router;
