// зависимости
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const config = require("../../config");
const jwt = require("jsonwebtoken");

// модель пользователя
const UserSchema = new Schema(
    {
        // почта (используется как логин)
        email: {
            type: String,
            lowercase: true,
            unique: true,
            index: true
        },
        // пароль (чистым текстом, для пилотной версии)
        password: String,
        // фамилия
        lastName: String,
        // имя
        firstName: String,
        // отчество
        patronymic: String,
        // школа
        school: {
            type: Schema.Types.ObjectId,
            ref: "School"
        },
        // ссылка на аватар
        avatar: String,
        // телефон
        phone: String,
        // язык преподавания
        language: String,
        // предмет (который преподает)
        subject: String,
        // планы уроков
        lessonPlans: [
            {
                type: Schema.Types.ObjectId,
                ref: "LessonPlan"
            }
        ],
        // избранные этапы уроков
        favoriteStages: [
            {
                type: Schema.Types.ObjectId,
                ref: "LessonStage"
            }
        ],
        // уровень доступа (администратор/пользователь)
        scope: {
            type: String,
            default: "user"
        },
        // хэш пароля
        hash: String,
        // salt строка
        salt: String,
        // ключ для восстановления пароля
        forgotToken: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

UserSchema.method({
    // установить пароль
    setPassword: function (password) {
        // const saltRounds = config.get("bcrypt:saltRounds");
        // this.salt = bcrypt.genSaltSync(saltRounds);
        // this.hash = bcrypt.hashSync(password, this.salt);
        this.password = password;
    },
    // проверка пароля
    validPassword: function (password) {
        // return bcrypt.compareSync(password, this.hash);
        return this.password === password;
    },
    // генерация JWT токена
    generateJWT: function (payload) {
        const tokenLifetimeInHours = config.get("jwt:tokenLifetimeInHours");
        const exp = Date.now() + tokenLifetimeInHours * 3600000;
        const token = jwt.sign({ ...payload, exp }, config.get("jwt:secret"));
        return { token, exp };
    }
});

module.exports = mongoose.model("User", UserSchema);
