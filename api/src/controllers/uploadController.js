// зависимости
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const errors = require("../utils/errors");

// загрузка ресурса для этапа урока
exports.uploadResource = function(req, res, next) {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    // создать объект входящей формы
    const form = new formidable.IncomingForm();

    // путь для загрузки
    form.uploadDir = path.join(__dirname, "..", "..", "public", "resources", id);

    // сохранить расширения файлов
    form.keepExtensions = true;

    // максимальный размер файла (300 МБ)
    form.maxFileSize = 300 * 1024 * 1024;

    // функция-listener начала загрузки файла
    form.on("fileBegin", function(name, file) {
        // создать папку если она не существует
        if (!fs.existsSync(form.uploadDir)) {
            fs.mkdirSync(form.uploadDir);
        }
    });

    // функция-listener получения файла из формы
    form.on("file", function(name, file) {
        // достать название сохраненного файла из пути
        const filename = file.path.replace(/^.*[\\\/]/, "");
        // установить атрибут filename
        form.filename = filename;
        // установить атрибут link как ссылку на статичный ресурс на сервере
        form.link = `/resources/${id}/${filename}`;
    });

    // функция-listener ошибок
    form.on("error", function(error) {
        console.error(error);
        return next(errors.resourceUploadFailed);
    });

    // функция-listener окончания загрузки
    form.on("end", function() {
        // отправить JSON сообщение с ссылкой на загруженный статичный ресурс
        res.json({ filename: form.filename, link: form.link });
    });

    // парсинг входящего запроса с формой
    form.parse(req);
};

// загрузка файлов для задания
exports.uploadExerciseFiles = function(req, res, next) {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    // создать объект входящей формы
    const form = new formidable.IncomingForm();

    // путь для загрузки
    form.uploadDir = path.join(__dirname, "..", "..", "public", "exercises", id);

    // сохранить расширения файлов
    form.keepExtensions = true;

    // максимальный размер файла (300 МБ)
    form.maxFileSize = 300 * 1024 * 1024;

    // создать массив из названий файлов и ссылок
    form.links = [];

    // функция-listener начала загрузки файла
    form.on("fileBegin", function(name, file) {
        // создать папку если она не существует
        if (!fs.existsSync(form.uploadDir)) {
            fs.mkdirSync(form.uploadDir);
        }
    });

    // функция-listener получения файла из формы
    form.on("file", function(name, file) {
        // достать название сохраненного файла из пути
        const filename = file.path.replace(/^.*[\\\/]/, "");
        // добавить новую ссылку на статичный ресурс
        form.links.push(`/exercises/${id}/${filename}`);
    });

    // функция-listener ошибок
    form.on("error", function(error) {
        console.error(error);
        return next(errors.exerciseFilesUploadFailed);
    });

    // функция-listener окончания загрузки
    form.on("end", function() {
        // отправить JSON сообщение с ссылкой на загруженный статичный ресурс
        res.json({ links: form.links });
    });

    // парсинг входящего запроса с формой
    form.parse(req);
};
