// зависимости
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// модель школы
const SchoolSchema = new Schema(
    {
        // регион
        region: String,
        // город
        city: String,
        // район
        district: String,
        // название школы
        name: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("School", SchoolSchema);
