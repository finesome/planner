// зависимости
const asyncHandler = require("express-async-handler");
const errors = require("../utils/errors");

// модели
const Subject = require("../models/Subject");

// запрос всех предметов и поурочных планов
exports.getSubjects = asyncHandler(async (req, res, next) => {
    try {
        // поиск предметов
        const subjects = await Subject.find();

        // отправить предметы
        res.status(200).json(subjects);
    } catch (err) {
        next(err);
    }
});

// запрос определенного предмета
exports.getSubject = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    try {
        // поиск предмета
        const subject = await Subject.findById(id).select("-plans.sections");
        if (!subject) {
            return next(errors.subjectNotFound);
        }

        // отправить предмет
        res.status(200).json(subject);
    } catch (err) {
        next(err);
    }
});

// создание предмета
exports.createSubject = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.language || !req.body.name) {
        return next(errors.badRequest);
    }
    const { language, name } = req.body;

    // проверить если предмет уже есть
    const foundSubject = await Subject.findOne({ name: name, language: language });
    if (foundSubject) {
        return next(errors.subjectAlreadyExists);
    }

    // создать предмет
    const subject = new Subject({
        language: language,
        name: name
    });

    try {
        // сохранить предмет
        await subject.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// запрос определенного плана
exports.getPlan = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id || !req.params.pid) {
        return next(errors.badRequest);
    }
    const { id, pid } = req.params;

    try {
        // поиск предмета
        const subject = await Subject.findById(id);
        if (!subject) {
            return next(errors.subjectNotFound);
        }

        // поиск плана
        const plan = subject.plans.find(x => x._id.toString() === pid);
        if (!plan) {
            return next(errors.planNotFound);
        }

        // отправить план (с названием предмета)
        res.status(200).json({ plan: plan, subject: subject.name });
    } catch (err) {
        next(err);
    }
});

// создание нового плана
exports.createPlan = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.plan || !req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { plan } = req.body;
    const { id } = req.params;

    try {
        // поиск предмета
        const subject = await Subject.findById(id);
        if (!subject) {
            return next(errors.subjectNotFound);
        }

        // добавить план в предмет
        subject.plans.push(plan);

        // сохранить предмет
        await subject.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// редактирование плана
exports.editPlan = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.plan || !req.params || !req.params.id || !req.params.pid) {
        return next(errors.badRequest);
    }
    const { plan } = req.body;
    const { id, pid } = req.params;

    try {
        // поиск предмета
        const subject = await Subject.findById(id);
        if (!subject) {
            return next(errors.subjectNotFound);
        }

        // поиск индекса плана
        const index = subject.plans.findIndex(x => x._id.toString() === pid);
        // проверить если план найден
        if (index === -1) {
            return next(errors.planNotFound);
        }

        // обновить атрибуты плана
        subject.plans[index].language = plan.language;
        subject.plans[index].targetClass = plan.targetClass;
        subject.plans[index].hoursPerWeek = plan.hoursPerWeek;
        subject.plans[index].hoursInYear = plan.hoursInYear;
        subject.plans[index].sections = plan.sections;

        // сохранить предмет
        await subject.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// удаление плана
exports.deletePlan = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id || !req.params.pid) {
        return next(errors.badRequest);
    }
    const { id, pid } = req.params;

    try {
        // поиск предмета
        const subject = await Subject.findById(id);
        if (!subject) {
            return next(errors.subjectNotFound);
        }

        // поиск индекса плана
        const index = subject.plans.findIndex(x => x._id.toString() === pid);
        // проверить если план найден
        if (index === -1) {
            return next(errors.planNotFound);
        }

        // удалить план из предмета
        subject.plans.splice(index, 1);

        // сохранить предмет
        await subject.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});
