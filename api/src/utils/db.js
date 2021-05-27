// зависимости
const mongoose = require("mongoose");
const config = require("../../config/index");

console.log("[utils/db] Started connecting to database");

// подключение к базе данных MongoDB
mongoose.connect(config.get("mongoose:uri"), config.get("mongoose:options")).then(
    () => {
        console.log("[utils/db] Connected to database");
    },
    error => {
        console.log("[utils/db] Error:", error);
    }
);

module.exports = mongoose;
