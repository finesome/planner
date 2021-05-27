// зависимости
const express = require("express");
const router = express.Router();

// контроллер
const stagesController = require("../../controllers/stagesController");

// избранные этапы (того кто делает запрос)
router.get("/favorites", stagesController.getFavoriteStages);
// добавление этапа урока в избранное
router.post("/:id/favorite", stagesController.favoriteStage);
// удаление этапа урока из избранного
router.post("/:id/unfavorite", stagesController.unfavoriteStage);
// изменение порядка этапов (id относится к плану урока)
router.post("/:id/reorder", stagesController.reorderStages);
// создание нового этапа (id также относится к плану урока)
router.post("/:id/add", stagesController.addStage);
// редактирование этапа (внимательно, здесь и в следующем запросе id уже относится к этапу)
router.post("/:id", stagesController.editStage);
// удаление этапа
router.delete("/:id", stagesController.deleteStage);

module.exports = router;
