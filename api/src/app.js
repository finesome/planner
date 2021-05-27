// зависимости
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const helmet = require("helmet");
const logger = require("morgan");
const path = require("path");
// сообщения ошибок
const errors = require("./utils/errors");

// импорт модуля для подключения к базе данных (достаточно 1-го подключения)
require("./utils/db");

// импорт путей
const routes = {
    api: require("./routes/api"),
    index: require("./routes/index")
};

// инициализация приложения Express
const app = express();

// движок для view
app.set("view engine", "html");
app.engine("html", function(path, options, callback) {
    fs.readFile(path, "utf-8", callback);
});

// определение окружения (production или development)
const production = process.env.NODE_ENV === "production";
// использовать CORS (только в development)
if (!production) {
    console.log("[app] Using CORS");
    app.use(cors());
}
// подключение Helmet
app.use(helmet());
// подключение Morgan для логгирования
app.use(logger("dev"));
// парсинг JSON
app.use(express.json());
// парсинг urlencoded
app.use(express.urlencoded({ extended: false }));
// парсинг cookie
app.use(cookieParser());
// статические файлы
app.use(express.static(path.join(__dirname, "..", "public")));

// подключение путей
app.use("/api", routes.api);
app.use("/*", routes.index);

// обработка ошибки 404 (если запрос не подходит под перечисленные пути)
app.use(function(req, res, next) {
    next(errors.notFound);
});

// формирование сообщения об ошибке в JSON формате
app.use(function(err, req, res, next) {
    // добавление атрибута locals (ошибка выдается только в development)
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // вернуть JSON сообщение
    res.status(err.status || 500);
    res.send({
        error: err.message || "Internal error",
        status: err.status || 500
    });
});

module.exports = app;
