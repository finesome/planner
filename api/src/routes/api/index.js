// зависимости
const express = require("express");
const router = express.Router();
const errors = require("../../utils/errors");
// уровни доступа
const { USER } = require("../../utils/passport");

// пути
const analyticsRouter = require("./analytics");
const authRouter = require("./auth");
const configRouter = require("./config");
const exercisesRouter = require("./exercises");
const plansRouter = require("./plans");
const resourcesRouter = require("./resources");
const schoolsRouter = require("./schools");
const stagesRouter = require("./stages");
const subjectsRouter = require("./subjects");
const uploadRouter = require("./upload");
const usersRouter = require("./users");

// главный API путь (не играет никакую роль)
router.get("/", function (req, res, next) {
    return res.send("Planner API v1.0");
});

// аналитика (доступ администратора)
router.use("/analytics", USER, analyticsRouter);
// аутентификация
router.use("/auth", authRouter);
// конфигурации
router.use("/config", configRouter);
// задания
router.use("/exercises", USER, exercisesRouter);
// планы уроков
router.use("/plans", USER, plansRouter);
// ресурсы
router.use("/resources", USER, resourcesRouter);
// школы
router.use("/schools", schoolsRouter);
// этапы в ходе урока
router.use("/stages", USER, stagesRouter);
// предметы
router.use("/subjects", subjectsRouter);
// загрузка файлов
router.use("/upload", USER, uploadRouter);
// пользователи
router.use("/users", USER, usersRouter);

// вернуть ошибку 404 если запрос не подходит под вышеперечисленные пути
router.all("/*", function (req, res, next) {
    next(errors.notFound);
});

module.exports = router;
