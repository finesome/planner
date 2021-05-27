// зависимости
const express = require("express");
const router = express.Router();

// контроллер
const exercisesController = require("../../controllers/exercisesController");

// добавление задания (в этап урока)
router.post("/:id", exercisesController.addExercise);
// редактирование задания
router.post("/:id/:position", exercisesController.editExercise);
// удаление задания
router.delete("/:id/:position", exercisesController.deleteExercise);

module.exports = router;
