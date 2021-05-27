// зависимости
const express = require("express");
const router = express.Router();

// контроллер
const resourcesController = require("../../controllers/resourcesController");

// добавление ресурса (в урок)
router.post("/:id", resourcesController.addResource);
// редактирование ресурса
router.post("/:id/:position", resourcesController.editResource);
// удаление ресурса
router.delete("/:id/:position", resourcesController.deleteResource);

module.exports = router;
