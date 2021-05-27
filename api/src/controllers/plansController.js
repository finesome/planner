// зависимости
const asyncHandler = require("express-async-handler");
const errors = require("../utils/errors");

// модели
const LessonPlan = require("../models/LessonPlan");
const User = require("../models/User");

// поиск всех планов
exports.getPlans = asyncHandler(async (req, res, next) => {
    try {
        // поиск всех планов (опубликованных)
        const plans = await LessonPlan.find({ isPublished: true })
            .populate({
                path: "originalPlan",
                populate: { path: "author", select: "lastName firstName patronymic" },
                select: "author"
            })
            .populate({
                path: "author",
                populate: { path: "school", select: "name region city district" },
                select: "lastName firstName patronymic school"
            })
            .populate("coAuthors", "lastName firstName patronymic")
            .select(
                "createdDate originalPlan forks reviews author coAuthors lessonDate subject language targetClass classLetters quarter section topic customTopic"
            );

        // отправить планы
        res.status(200).json(plans);
    } catch (err) {
        next(err);
    }
});

// поиск моих планов (пользователя, который совершает запрос)
exports.getMyPlans = asyncHandler(async (req, res, next) => {
    try {
        // поиск планов (в которых пользователь является автором или со-автором)
        const plans = await LessonPlan.find({ $or: [{ author: req.user._id }, { coAuthors: req.user._id }] })
            .populate({
                path: "originalPlan",
                populate: { path: "author", select: "lastName firstName patronymic" },
                select: "author"
            })
            .populate({
                path: "author",
                populate: { path: "school", select: "name region city district" },
                select: "lastName firstName patronymic school"
            })
            .populate("coAuthors", "lastName firstName patronymic")
            .select(
                "createdDate originalPlan forks reviews author coAuthors isPublished lessonDate subject language targetClass classLetters quarter section topic customTopic"
            );

        // отправить планы
        res.status(200).json(plans);
    } catch (err) {
        next(err);
    }
});

// создание плана
exports.createPlan = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.plan) {
        return next(errors.badRequest);
    }
    const { plan } = req.body;

    try {
        // поиск автора
        const foundAuthor = await User.findById(req.user._id);
        if (!foundAuthor) {
            return next(errors.userNotFound);
        }

        // создание плана
        const createdPlan = new LessonPlan({
            createdDate: new Date(),
            author: foundAuthor._id,
            coAuthors: plan.coAuthors,
            isPublished: false,
            lessonDate: plan.lessonDate,
            subject: plan.subject,
            language: plan.language,
            targetClass: Number(plan.targetClass),
            classLetters: plan.classLetters,
            quarter: Number(plan.quarter),
            section: plan.section,
            topic: plan.topic,
            customTopic: plan.customTopic,
            learningObjectives: plan.learningObjectives,
            lessonObjectives: plan.lessonObjectives,
            evaluationCriteria: plan.evaluationCriteria,
            languageObjectives: plan.languageObjectives,
            valuesTaught: plan.valuesTaught,
            interdisciplinaryConnections: plan.interdisciplinaryConnections,
            preliminaryKnowledge: plan.preliminaryKnowledge
        });
        // добавление атрибута оригинального плана к плану (указывать на самого себя)
        createdPlan.originalPlan = createdPlan._id;

        // сохранение созданного плана
        await createdPlan.save();
        // добавление плана в список планов автора
        foundAuthor.lessonPlans.push(createdPlan._id);
        // сохранение автора
        await foundAuthor.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// запрос определенного плана
exports.getPlan = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    try {
        // поиск плана
        const plan = await LessonPlan.findById(id)
            .populate({
                path: "originalPlan",
                populate: { path: "author", select: "lastName firstName patronymic" },
                select: "author"
            })
            .populate("reviews.user", "lastName firstName patronymic")
            .populate("author", "lastName firstName patronymic")
            .populate("coAuthors", "lastName firstName patronymic")
            .select(
                "originalPlan forks reviews author coAuthors isPublished lessonDate subject language targetClass classLetters quarter section topic"
            );

        // проверка на то был ли опубликован план (для тех кто не является автором или со-автором)
        if (
            !plan.author._id.equals(req.user._id) &&
            !plan.coAuthors.find(x => x._id.equals(req.user._id)) &&
            !plan.isPublished
        ) {
            return next(errors.planNotPublished);
        }

        // отправить основную информацию плана
        res.status(200).json(plan);
    } catch (err) {
        next(err);
    }
});

// запрос базовой информации определенного плана
exports.getPlanBasicInformation = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    try {
        // поиск плана
        const plan = await LessonPlan.findById(id)
            .populate("author", "lastName firstName patronymic")
            .select("-createdDate -originalPlan -forks -reviews -publishedDate -lessonStages");

        // проверка на то был ли опубликован план (для тех кто не является автором или со-автором)
        if (
            !plan.author._id.equals(req.user._id) &&
            !plan.coAuthors.find(x => x._id.equals(req.user._id)) &&
            !plan.isPublished
        ) {
            return next(errors.planNotPublished);
        }

        // отправить базовую информацию плана
        res.status(200).json(plan);
    } catch (err) {
        next(err);
    }
});

// запрос этапов определенного плана
exports.getPlanStages = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    try {
        // поиск плана
        const plan = await LessonPlan.findById(id)
            .populate({
                path: "lessonStages",
                populate: {
                    path: "lessonPlan",
                    select: "author"
                }
            })
            .select("author coAuthors isPublished lessonStages");

        // проверка на то был ли опубликован план (для тех кто не является автором или со-автором)
        if (
            !plan.author._id.equals(req.user._id) &&
            !plan.coAuthors.find(x => x._id.equals(req.user._id)) &&
            !plan.isPublished
        ) {
            return next(errors.planNotPublished);
        }

        // отправить этапы урока
        res.status(200).json(plan.lessonStages);
    } catch (err) {
        next(err);
    }
});

// запрос ресурсов определенного плана
exports.getPlanResources = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    try {
        // поиск плана
        const plan = await LessonPlan.findById(id).select("author coAuthors isPublished resources");

        // проверка на то был ли опубликован план (для тех кто не является автором или со-автором)
        if (
            !plan.author._id.equals(req.user._id) &&
            !plan.coAuthors.find(x => x._id.equals(req.user._id)) &&
            !plan.isPublished
        ) {
            return next(errors.planNotPublished);
        }

        // отправить ресурсы урока
        res.status(200).json(plan.resources);
    } catch (err) {
        next(err);
    }
});

// запрос отзывов определенного плана
exports.getPlanReviews = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    try {
        // поиск плана
        const plan = await LessonPlan.findById(id)
            .populate({
                path: "reviews.user",
                select: "lastName firstName patronymic"
            })
            .select("author coAuthors isPublished reviews");

        // проверка на то был ли опубликован план (для тех кто не является автором или со-автором)
        if (
            !plan.author._id.equals(req.user._id) &&
            !plan.coAuthors.find(x => x._id.equals(req.user._id)) &&
            !plan.isPublished
        ) {
            return next(errors.planNotPublished);
        }

        // отправить отзывы
        res.status(200).json(plan.reviews);
    } catch (err) {
        next(err);
    }
});

// редактирование плана
exports.editPlan = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.plan || !req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { plan } = req.body;
    const { id } = req.params;

    try {
        // поиск плана
        const foundPlan = await LessonPlan.findById(id);

        // проверка на то что пользователь является автором или со-автором плана
        if (!foundPlan.author.equals(req.user._id) && !foundPlan.coAuthors.find(x => x.equals(req.user._id))) {
            return next(errors.notAuthor);
        }

        // обновление плана
        foundPlan.coAuthors = plan.coAuthors;
        foundPlan.classLetters = plan.classLetters;
        foundPlan.customTopic = plan.customTopic;
        foundPlan.lessonObjectives = plan.lessonObjectives;
        foundPlan.evaluationCriteria = plan.evaluationCriteria;
        foundPlan.languageObjectives = plan.languageObjectives;
        foundPlan.valuesTaught = plan.valuesTaught;
        foundPlan.interdisciplinaryConnections = plan.interdisciplinaryConnections;
        foundPlan.preliminaryKnowledge = plan.preliminaryKnowledge;

        // сохранить план
        await foundPlan.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// удаление плана
exports.deletePlan = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    try {
        // поиск автора
        const foundAuthor = await User.findById(req.user._id);
        if (!foundAuthor) {
            return next(errors.userNotFound);
        }

        // поиск плана
        const foundPlan = await LessonPlan.findById(id);

        // проверка на то что пользователь является автором плана
        if (!foundPlan.author.equals(foundAuthor._id)) {
            return next(errors.notAuthor);
        }

        // удаление плана из списка планов автора
        foundAuthor.lessonPlans = foundAuthor.lessonPlans.filter(x => !x.equals(foundPlan._id));
        // сохранение автора
        await foundAuthor.save();
        // удаление плана
        await LessonPlan.deleteOne({ _id: id });

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// копирование плана
exports.copyPlan = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    try {
        // поиск автора
        const foundAuthor = await User.findById(req.user._id).populate("lessonPlans", "originalPlan");
        if (!foundAuthor) {
            return next(errors.userNotFound);
        }

        // поиск плана
        const plan = await LessonPlan.findById(id);
        if (!plan) {
            return next(errors.planNotFound);
        }

        // поиск оригинального плана
        const originalPlan = await LessonPlan.findById(plan.originalPlan);
        if (!originalPlan) {
            return next(errors.planNotFound);
        }

        // проверка на то если этот план уже является авторским
        if (foundAuthor.lessonPlans.some(x => x.equals(plan._id))) {
            return next(errors.alreadyAuthor);
        }

        // скопировать план
        const copiedPlan = new LessonPlan({
            createdDate: new Date(),
            // сохранить ссылку на оригинальный план
            originalPlan: plan.originalPlan,
            // установить автора
            author: foundAuthor._id,
            lessonDate: plan.lessonDate,
            subject: plan.subject,
            language: plan.language,
            targetClass: Number(plan.targetClass),
            classLetters: plan.classLetters,
            quarter: Number(plan.quarter),
            section: plan.section,
            topic: plan.topic,
            customTopic: plan.customTopic,
            learningObjectives: [...plan.learningObjectives],
            lessonObjectives: plan.lessonObjectives,
            evaluationCriteria: plan.evaluationCriteria,
            languageObjectives: plan.languageObjectives,
            valuesTaught: plan.valuesTaught,
            interdisciplinaryConnections: plan.interdisciplinaryConnections,
            preliminaryKnowledge: plan.preliminaryKnowledge,
            lessonStages: [...plan.lessonStages]
        });

        // сохранить план
        await copiedPlan.save();
        // добавить план в список планов автора
        foundAuthor.lessonPlans.push(copiedPlan._id);
        // сохранить автора
        await foundAuthor.save();
        // увеличить количество копирований для оригинального плана
        originalPlan.forks++;
        // сохранить оригинальный план
        await originalPlan.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// опубликование плана
exports.publishPlan = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    try {
        // поиск плана
        const plan = await LessonPlan.findById(id);

        // проверка на то что пользователь является автором плана
        if (!plan.author.equals(req.user._id)) {
            return next(errors.notAuthor);
        }

        // проверка на то был ли план уже опубликован
        if (plan.isPublished) {
            return next(errors.planAlreadyPublished);
        }

        // установить атрибуть isPublished на true
        plan.isPublished = true;
        // установить дату публикации
        plan.publishedDate = new Date();
        // сохранить план урока
        await plan.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// отзыв на план
exports.reviewPlan = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.rating || !req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { rating, text } = req.body;
    const { id } = req.params;

    try {
        // поиск плана
        const plan = await LessonPlan.findById(id);

        // удостовериться что план был опубликован
        if (!plan.isPublished) {
            return next(errors.planNotPublished);
        }
        // проверка на то если автор уже оставлял отзыв
        if (plan.reviews.find(x => x.user.equals(req.user._id))) {
            return next(errors.alreadyReviewed);
        }

        // добавить отзыв пользователя в список отзывов
        plan.reviews.push({
            user: req.user._id,
            rating: rating,
            text: text || ""
        });
        // сохранить план
        await plan.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});
