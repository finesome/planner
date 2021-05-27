// зависимости
const asyncHandler = require("express-async-handler");
const errors = require("../utils/errors");

// модели
const School = require("../models/School");
const User = require("../models/User");

// запрос всех учителей
exports.getTeachers = asyncHandler(async (req, res, next) => {
    try {
        // поиск всех учителей
        const teachers = await User.find({ scope: "user" })
            .populate("school")
            .select("email lastName firstName patronymic school")
            .sort({ lastName: 1 });

        // отправить учителей
        res.status(200).json(teachers);
    } catch (err) {
        next(err);
    }
});

// запрос всех школы
exports.getSchools = asyncHandler(async (req, res, next) => {
    try {
        // поиск всех школы
        const schools = await School.find();

        // отправить школы
        res.status(200).json(schools);
    } catch (err) {
        next(err);
    }
});

// запрос определенной школы
exports.getSchool = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    try {
        // поиск школы
        const school = await School.findById(id);

        // отправить школу
        res.status(200).json(school);
    } catch (err) {
        next(err);
    }
});

// создание школы
exports.createSchool = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.region || !req.body.city || !req.body.district || !req.body.name) {
        return next(errors.badRequest);
    }
    const { region, city, district, name } = req.body;

    // создать новую школы
    const school = new School({
        region: region,
        city: city,
        district: district,
        name: name
    });

    try {
        // сохранить школу
        await school.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// редактирование школы
exports.editSchool = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.school || !req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { school } = req.body;
    const { id } = req.params;

    try {
        // обновить школу
        await School.updateOne({ _id: id }, school);

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// удаление школы
exports.deleteSchool = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.id) {
        return next(errors.badRequest);
    }
    const { id } = req.params;

    try {
        // удалить школу
        await School.deleteOne({ _id: id });

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});
