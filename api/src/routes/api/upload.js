// зависимости
const express = require("express");
const router = express.Router();

// контроллер
const uploadController = require("../../controllers/uploadController");

// загрузка ресурса для этапа (id относится к этапу)
router.post("/resource/:id", uploadController.uploadResource);
// загрузка файлов для задания (id также относится к этапу)
router.post("/exercise/files/:id", uploadController.uploadExerciseFiles);

module.exports = router;
