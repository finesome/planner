// зависимости
const asyncHandler = require("express-async-handler");
const errors = require("../utils/errors");
const fs = require("fs");
const path = require("path");

// модели
const LessonStage = require("../models/LessonStage");
const User = require("../models/User");

// добавление задания
exports.addExercise = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.exercise || !req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { exercise } = req.body;
    const { id } = req.params;

    // поиск этапа урока
    const stage = await LessonStage.findById(id).populate("lessonPlan", "author coAuthors");
    if (!stage) {
        return next(errors.stageNotFound);
    }

    // проверка на то что пользователь является автором или со-автором плана
    if (
        !stage.lessonPlan.author.equals(req.user._id) &&
        !stage.lessonPlan.coAuthors.find(x => x.equals(req.user._id))
    ) {
        return next(errors.notAuthor);
    }

    try {
        // добавить задание в массив заданий
        stage.exercises.push(exercise);
        // сохранить этап урока
        await stage.save();
        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// редактирование задания
exports.editExercise = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.exercise || !req.params || !req.params.id || !req.params.position) {
        return next(errors.badRequest);
    }
    const { exercise } = req.body;
    const { id, position } = req.params;

    // поиск этапа урока
    const stage = await LessonStage.findById(id).populate("lessonPlan", "author coAuthors");
    if (!stage) {
        return next(errors.stageNotFound);
    }

    // проверка на то что пользователь является автором или со-автором плана
    if (
        !stage.lessonPlan.author.equals(req.user._id) &&
        !stage.lessonPlan.coAuthors.find(x => x.equals(req.user._id))
    ) {
        return next(errors.notAuthor);
    }

    try {
        // редактировать задание (просто заменить предыдущее на обновленный вариант)
        stage.exercises[position] = exercise;
        // сохранить этап урока
        await stage.save();
        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// удаление задания
exports.deleteExercise = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id || !req.params.position) {
        return next(errors.badRequest);
    }
    const { id, position } = req.params;

    // поиск этапа урока
    const stage = await LessonStage.findById(id).populate("lessonPlan", "author coAuthors");
    if (!stage) {
        return next(errors.stageNotFound);
    }

    // проверка на то что пользователь является автором или со-автором плана
    if (
        !stage.lessonPlan.author.equals(req.user._id) &&
        !stage.lessonPlan.coAuthors.find(x => x.equals(req.user._id))
    ) {
        return next(errors.notAuthor);
    }

    try {
        // путь к папке
        const deleteFolder = path.join(__dirname, "..", "..", "public", "exercises", id);

        // удалить файлы задания
        for (let i = 0; i < stage.exercises[position].files.length; i++) {
            const file = stage.exercises[position].files[i];
            const filename = file.replace(/^.*[\\\/]/, "");
            // проверить существование файла
            if (fs.existsSync(path.join(deleteFolder, filename))) {
                // удалить файл
                fs.unlinkSync(path.join(deleteFolder, filename));
            }
        }

        // удалить задание
        stage.exercises.splice(position, 1);
        // сохранить этап урока
        await stage.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});
