// зависимости
const asyncHandler = require("express-async-handler");
const config = require("../../config");
const errors = require("../utils/errors");
const nanoid = require("nanoid");
const { sendForgotPasswordVerification, sendNewPassword } = require("../utils/mailer");

// модели
const User = require("../models/User");

// проверка аутентификации
exports.checkAuth = asyncHandler(async (req, res, next) => {
    // ответные данные
    const data = {
        _id: req.user._id,
        email: req.user.email,
        scope: req.user.scope
    };

    // отправить 200 и ответные данные
    res.status(200).json(data);
});

// регистрация пользователя
exports.register = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.email || !req.body.password) {
        return next(errors.badRequest);
    }
    const { email, password, lastName, firstName, patronymic, school, phone, language, subject } = req.body;

    // поиск пользователя
    let foundUser = await User.findOne({ email: email });
    if (foundUser) {
        // вернуть ошибку
        return next(errors.emailAlreadyTaken);
    }

    // создать нового пользователя
    const user = new User({
        email: email,
        lastName: lastName || "",
        firstName: firstName || "",
        patronymic: patronymic || "",
        school: school && school.value || null,
	phone: phone || "",
	language: language || "",
	subject: subject || ""
    });
    // установка пароля
    user.setPassword(password);

    // сохранение пользователя
    await user.save();

    // отправить 200
    res.sendStatus(200);
});

// подтверждение регистрации
exports.verify = asyncHandler(async (req, res, next) => {
    // еще не имплементировано
    return next(errors.notImplemented);
});

// восстановление пароля
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.email) {
        return next(errors.badRequest);
    }
    const { email } = req.params;

    // поиск пользователя
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
        return next(errors.userNotFound);
    }

    // сгенерировать ключ восстановления
    const token = nanoid(12);

    // отправить письмо для подтверждения
    sendForgotPasswordVerification(email, token).catch(err => console.error(err));

    // обновить токен у пользователя
    foundUser.forgotToken = token;

    // сохранить пользователя
    await foundUser.save();

    // отправить 200
    res.sendStatus(200);
});

// подтверждение восстановления пароля
exports.forgotPasswordVerify = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.email || !req.params.token) {
        return next(errors.badRequest);
    }
    const { email, token } = req.params;

    // поиск пользователя
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
        return next(errors.userNotFound);
    }

    // сверка ключей
    if (foundUser.forgotToken !== token) {
        return next(errors.tokensDoNotMatch);
    }

    // установить новый пароль
    const password = nanoid(10);

    // отправить письмо с новым паролем
    sendNewPassword(email, password);

    // установить новый пароль
    foundUser.setPassword(password);

    // сбросить ключ восстановления
    foundUser.forgotToken = "";

    // сохранить пользователя
    await foundUser.save();

    // перенаправить на сайт
    res.redirect(`${config.get("clientUrl")}/login/forgot`);
});

// логин
exports.login = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.email || !req.body.password) {
        return next(errors.badRequest);
    }
    const { email, password } = req.body;

    // поиск пользователя
    let foundUser = await User.findOne({ email: email });
    if (!foundUser) {
        return next(errors.userNotFound);
    }
    // проверка пароля
    if (!foundUser.validPassword(password)) {
        return next(errors.wrongCredentials);
    }

    // генерация JWT токена
    const { token, exp } = foundUser.generateJWT({
        _id: foundUser._id,
        email: foundUser.email,
        scope: foundUser.scope
    });
    // ответные данные
    const data = {
        _id: foundUser._id,
        email: foundUser.email,
        scope: foundUser.scope,
        exp: exp
    };

    // установить cookie и отправить ответные данные
    res.status(200)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: config.get("jwt:tokenLifetimeInHours") * 3600000
        })
        .json(data);
});

// выход
exports.logout = asyncHandler(async (req, res, next) => {
    // очистить cookie
    res.clearCookie("token");
    // отправить 200
    res.sendStatus(200);
});
