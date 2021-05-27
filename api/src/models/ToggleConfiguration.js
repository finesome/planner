// зависимости
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// модель школы
const ToggleConfigurationSchema = new Schema(
    {
        // название настройки
        name: String,
        // значение (булево)
        value: Boolean
    },
    { timestamps: true }
);

module.exports = mongoose.model("ToggleConfiguration", ToggleConfigurationSchema);
