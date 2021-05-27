// зависимости
const asyncHandler = require("express-async-handler");
const errors = require("../utils/errors");

// модели
const ToggleConfiguration = require("../models/ToggleConfiguration");

// получить конфигурацию
exports.getConfig = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.params || !req.params.name) {
        return next(errors.badRequest);
    }
    const { name } = req.params;

    try {
        // поиск конфигурации
        const config = await ToggleConfiguration.findOne({ name: name });

        if (!config) {
            return next(errors.configNotFound);
        }

        // отправить конфигурацию
        res.status(200).json(config);
    } catch (err) {
        next(err);
    }
});

// установить конфигурацию
exports.setConfig = asyncHandler(async (req, res, next) => {
    // проверка наличия полей в запросе
    if (!req.body || !req.body.name) {
        return next(errors.badRequest);
    }
    const { name, value } = req.body;

    try {
        // поиск конфигурации
        const config = await ToggleConfiguration.findOne({ name: name });

        if (config) {
            // обновить конфигурацию
            config.value = value;
            // сохранить конфигурацию
            await config.save();
        } else {
            // создать новую конфигурацию
            newConfig = new ToggleConfiguration({
                name: name,
                value: value
            });
            // сохранить новую конфигурацию
            await newConfig.save();
        }

        // отправить 200
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});
