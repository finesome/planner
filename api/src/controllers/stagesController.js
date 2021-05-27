// зависимости
const asyncHandler = require("express-async-handler");
const errors = require("../utils/errors");

// модели
const LessonPlan = require("../models/LessonPlan");
const LessonStage = require("../models/LessonStage");
const User = require("../models/User");

// запрос избранных этапов
exports.getFavoriteStages = asyncHandler(async (req, res, next) => {
    try {
        // поиск автора (с его избранными блоками)
        const foundAuthor = await User.findById(req.user._id)
            .populate({
                path: "favoriteStages",
                populate: {
                    path: "lessonPlan",
                    populate: [
                        {
                            path: "author",
                            populate: {
                                path: "school"
                            },
                            select: "email firstName lastName patronymic school"
                        },
                        {
                            path: "coAuthors",
                            populate: {
                                path: "school"
                            },
                            select: "email firstName lastName patronymic school"
                        }
                    ],
                    select:
                        "author coAuthors lessonDate subject language targetClass quarter section topic customTopic learningObjectives"
                }
            })
            .select("favoriteStages");
        if (!foundAuthor) {
            return next(errors.userNotFound);
        }

        // отправить список избранных этапов
        res.status(200).json(foundAuthor.favoriteStages);
    } catch (err) {
        next(err);
    }
});

// добавление этапа в избранное
exports.favoriteStage = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    // поиск автора
    const foundAuthor = await User.findById(req.user._id);
    if (!foundAuthor) {
        return next(errors.userNotFound);
    }

    try {
        // поиск этапа
        const stage = await LessonStage.findById(id);
        if (!stage) {
            return next(errors.stageNotFound);
        }

        // проверить если автор уже добавлял этап в избранное
        if (foundAuthor.favoriteStages.find(x => x.equals(stage._id))) {
            return next(errors.stageAlreadyInFavorites);
        }

        // увеличить кол-во добавлений в избранное для этапа
        stage.likes++;
        // сохранить этап
        await stage.save();
        // добавить этап в избранное пользователя
        foundAuthor.favoriteStages.push(stage._id);
        // сохранить пользователя
        await foundAuthor.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// удаление этапа из избранного
exports.unfavoriteStage = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    // поиск автора
    const foundAuthor = await User.findById(req.user._id);
    if (!foundAuthor) {
        return next(errors.userNotFound);
    }

    try {
        // поиск этапа
        const stage = await LessonStage.findById(id);
        if (!stage) {
            return next(errors.stageNotFound);
        }

        // проверить если этап есть в избранном пользователя
        if (!foundAuthor.favoriteStages.find(x => x.equals(stage._id))) {
            return next(errors.notInFavoriteStages);
        }

        // уменьшить кол-во добавлений в избранное для этапа
        stage.likes--;
        // сохранить этап
        await stage.save();
        // удалить этап из избранного пользователя
        foundAuthor.favoriteStages = foundAuthor.favoriteStages.filter(x => !x.equals(stage._id));
        // сохранить пользователя
        await foundAuthor.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// изменение порядка этапов
exports.reorderStages = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.stages || !req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { stages } = req.body;
    const { id } = req.params;

    // поиск автора
    const foundAuthor = await User.findById(req.user._id);
    if (!foundAuthor) {
        return next(errors.userNotFound);
    }

    // поиск плана
    const foundPlan = await LessonPlan.findById(id);
    if (!foundPlan) {
        return next(errors.planNotFound);
    }

    // проверка на то что пользователь является автором или со-автором плана
    if (!foundPlan.author.equals(foundAuthor._id) && !foundPlan.coAuthors.find(x => x.equals(foundAuthor._id))) {
        return next(errors.notAuthor);
    }

    try {
        // изменить порядок этапов (на самом деле просто обновить массив)
        foundPlan.lessonStages = [...stages];
        // сохранить план
        await foundPlan.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// создание нового этапа (и добавление его в урок)
exports.addStage = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.stage || !req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { stage } = req.body;
    const { id } = req.params;

    // поиск автора
    const foundAuthor = await User.findById(req.user._id);
    if (!foundAuthor) {
        return next(errors.userNotFound);
    }

    // поиск плана
    const foundPlan = await LessonPlan.findById(id);
    if (!foundPlan) {
        return next(errors.planNotFound);
    }

    // проверка на то что пользователь является автором или со-автором плана
    if (!foundPlan.author.equals(foundAuthor._id) && !foundPlan.coAuthors.find(x => x.equals(foundAuthor._id))) {
        return next(errors.notAuthor);
    }

    try {
        // создать новый этап
        const createdStage = new LessonStage(stage);
        // установить дату создания
        createdStage.createdDate = new Date();
        // поставить ссылку на план
        createdStage.lessonPlan = foundPlan._id;
        // сохранить новый этап
        await createdStage.save();
        // добавить созданный этап в план урока
        foundPlan.lessonStages.push(createdStage._id);
        // сохранить план
        await foundPlan.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// редактирование этапа
exports.editStage = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.stage || !req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { stage } = req.body;
    const { id } = req.params;

    // поиск автора
    const foundAuthor = await User.findById(req.user._id);
    if (!foundAuthor) {
        return next(errors.userNotFound);
    }

    // поиск этапа
    const foundStage = await LessonStage.findById(id).populate("lessonPlan", "author coAuthors");
    if (!foundStage) {
        return next(errors.stageNotFound);
    }

    // проверка на то что пользователь является автором или со-автором плана
    if (
        !foundStage.lessonPlan.author.equals(foundAuthor._id) &&
        !foundStage.lessonPlan.coAuthors.find(x => x.equals(foundAuthor._id))
    ) {
        return next(errors.notAuthor);
    }

    try {
        // обновить этап урока
        await LessonStage.updateOne({ _id: id }, stage);

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// удаление этапа
exports.deleteStage = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    // поиск автора
    const foundAuthor = await User.findById(req.user._id);
    if (!foundAuthor) {
        return next(errors.userNotFound);
    }

    // поиск этапа
    const foundStage = await LessonStage.findById(id).populate("lessonPlan", "author coAuthors");
    if (!foundStage) {
        return next(errors.stageNotFound);
    }

    // проверка на то что пользователь является автором или со-автором плана
    if (
        !foundStage.lessonPlan.author.equals(foundAuthor._id) &&
        !foundStage.lessonPlan.coAuthors.find(x => x.equals(foundAuthor._id))
    ) {
        return next(errors.notAuthor);
    }

    try {
        // поиск плана к которому относится этот этап
        const foundPlan = await LessonPlan.findById(foundStage.lessonPlan._id);
        // удалить этап и списка этапов плана
        foundPlan.lessonStages = foundPlan.lessonStages.filter(x => !x.equals(foundStage._id));
        // сохранить план
        await foundPlan.save();

        // удалить этап урока
        await LessonStage.deleteOne({ _id: id });

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});
