// зависимости
const express = require("express");
const router = express.Router();

// контроллер
const analyticsController = require("../../controllers/analyticsController");

// запрос всех (необходимых) данных
router.get("/", analyticsController.getAnalytics);

module.exports = router;
