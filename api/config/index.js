// зависимости
const nconf = require("nconf");
const path = require("path");

// определение окружения (production или development)
const production = process.env.NODE_ENV === "production";
console.log(`[config] App is running in ${production ? "production" : "development"} mode`);

// выгрузка конфигураций приложения (аргументы коммандной строки -> окружение -> настройки из файла)
nconf
    .argv()
    .env()
    .file({
        file: path.join(__dirname, production ? "config.json" : "dev-config.json")
    });

module.exports = nconf;
