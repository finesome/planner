// зависимости
const asyncHandler = require("express-async-handler");
const errors = require("../utils/errors");

// модели
const User = require("../models/User");

// запрос определенного пользователя (самого себя)
exports.getMe = asyncHandler(async (req, res, next) => {
    try {
        // поиск пользователя
        const user = await User.findById(req.user._id)
            .populate("school")
            .populate({
                path: "lessonPlans",
                select: "originalPlan forks"
            })
            .select("email lastName firstName patronymic school phone language subject lessonPlans avatar");
        
        // отправить пользователя
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
});

// изменить аватар
exports.editAvatar = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.avatar) {
        return next(errors.badRequest);
    }
    const { avatar } = req.body;

    try {
        // поиск пользователя
        const user = await User.findById(req.user._id);
        if (!user) {
            return next(errors.userNotFound);
        }

        // обновить аватар
        user.avatar = avatar;

        // сохранить пользователя
        await user.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// изменить пароль
exports.editPassword = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.password) {
        return next(errors.badRequest);
    }
    const { password } = req.body;

    try {
        // поиск пользователя
        const user = await User.findById(req.user._id);
        if (!user) {
            return next(errors.userNotFound);
        }

        // обновить пароль
        user.setPassword(password);

        // сохранить пользователя
        await user.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// запрос всех пользователей
exports.getUsers = asyncHandler(async (req, res, next) => {
    try {
        // поиск всех пользователей
        const users = await User.find({ scope: "user" })
            .populate("school")
            .select("email lastName firstName patronymic school phone language subject avatar");

        // отправить пользователей
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
});

// запрос определенного пользователя
exports.getUser = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.email) {
        return next(errors.badRequest);
    }
    const { email } = req.params;

    try {
        // поиск пользователя
        const user = await User.findOne({ email: email })
            .populate("school")
            .select("email password lastName firstName patronymic school phone language subject avatar");

        // отправить пользователя
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
});

// удалить определенного пользователя
exports.deleteUser = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.email) {
        return next(errors.badRequest);
    }
    const { email } = req.params;

    try {
        // удалить пользователя
        await User.deleteOne({ email: email });

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// сбросить пароль определенного пользователя
exports.resetUserPassword = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.password || !req.params || !req.params.email) {
        return next(errors.badRequest);
    }
    const { password } = req.body;
    const { email } = req.params;

    try {
        // поиск пользователя
        const user = await User.findOne({ email: email });

        // обновить пароль (на введенный пароль)
        user.setPassword(password);

        // сохранить пользователя
        await user.save();

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});
