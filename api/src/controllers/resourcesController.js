// зависимости
const asyncHandler = require("express-async-handler");
const errors = require("../utils/errors");
const fs = require("fs");
const path = require("path");

// модели
const LessonPlan = require("../models/LessonPlan");
const User = require("../models/User");

// добавление ресурса
exports.addResource = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.resource || !req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { resource } = req.body;
    const { id } = req.params;

    // поиск пользователя
    const foundAuthor = await User.findById(req.user._id);
    if (!foundAuthor) {
        return next(errors.userNotFound);
    }

    // поиск плана урока
    const foundPlan = await LessonPlan.findById(id);
    if (!foundPlan) {
        return next(errors.planNotFound);
    }

    // проверка на то что пользователь является автором или со-автором плана
    if (!foundPlan.author.equals(foundAuthor._id) && !foundPlan.coAuthors.find(x => x.equals(foundAuthor._id))) {
        return next(errors.notAuthor);
    }

    try {
        // добавить ресурс в массив ресурсов
        foundPlan.resources.push(resource);
        // сохранить план урока
        await foundPlan.save();
        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// редактирование ресурса
exports.editResource = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.resource || !req.params || !req.params.id || !req.params.position) {
        return next(errors.badRequest);
    }
    const { resource } = req.body;
    const { id, position } = req.params;

    // поиск пользователя
    const foundAuthor = await User.findById(req.user._id);
    if (!foundAuthor) {
        return next(errors.userNotFound);
    }

    // поиск плана урока
    const foundPlan = await LessonPlan.findById(id);
    if (!foundPlan) {
        return next(errors.planNotFound);
    }

    // проверка на то что пользователь является автором или со-автором плана
    if (!foundPlan.author.equals(foundAuthor._id) && !foundPlan.coAuthors.find(x => x.equals(foundAuthor._id))) {
        return next(errors.notAuthor);
    }

    try {
        // редактировать ресурс (просто заменить предыдущее на обновленный вариант)
        foundPlan.resources[position] = resource;
        // сохранить план урока
        await foundPlan.save();
        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// удаление ресурса
exports.deleteResource = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id || !req.params.position) {
        return next(errors.badRequest);
    }
    const { id, position } = req.params;

    // поиск пользователя
    const foundAuthor = await User.findById(req.user._id);
    if (!foundAuthor) {
        return next(errors.userNotFound);
    }

    // поиск плана урока
    const foundPlan = await LessonPlan.findById(id);
    if (!foundPlan) {
        return next(errors.planNotFound);
    }

    // проверка на то что пользователь является автором или со-автором плана
    if (!foundPlan.author.equals(foundAuthor._id) && !foundPlan.coAuthors.find(x => x.equals(foundAuthor._id))) {
        return next(errors.notAuthor);
    }

    try {
        // путь к папке
        const deleteFolder = path.join(__dirname, "..", "..", "public", "resources", id);
        // путь к файлу ресурса
        const deletePath = path.join(deleteFolder, foundPlan.resources[position].filename);

        // проверить существование файла
        if (fs.existsSync(deletePath)) {
            // удалить файл
            fs.unlinkSync(deletePath);
            /*
            // прочитать содержимое папки
            const files = fs.readdirSync(deleteFolder);
            if (files.length === 0) {
                // удалить папку если она осталась пустой
                fs.rmdirSync(deleteFolder);
            }
            */
        }

        // удалить ресурс
        foundPlan.resources.splice(position, 1);
        // сохранить план урока
        await foundPlan.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});
