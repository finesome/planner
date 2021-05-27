// зависимости
const express = require("express");
const router = express.Router();

const { ADMIN } = require("../../utils/passport");

// контроллер
const configController = require("../../controllers/configController");

// получение конфигурации
router.get("/:name", configController.getConfig);
// обновление конфигурации
router.post("/", ADMIN, configController.setConfig);

module.exports = router;
