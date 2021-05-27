// зависимости
const config = require("../../config");
const errors = require("../utils/errors");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// модели
const User = require("../models/User");

// функция для извлечения cookie из запроса
const cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["token"];
    }
    return token;
};

// настройки JWT стратегии
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromExtractors([cookieExtractor]);
opts.secretOrKey = config.get("jwt:secret");

// новая стратегия аутентификации (основанная на JWT стратегии)
passport.use(
    "api",
    new JwtStrategy(opts, async (payload, done) => {
        try {
            const foundUser = await User.findById(payload._id);
            if (foundUser) {
                return done(null, foundUser);
            } else {
                return done(null, false);
            }
        } catch (error) {
            done(error, false);
        }
    })
);

// middleware для проверки доступа администратора
const adminAuth = (req, res, next) => {
    if (req.user.scope === "admin") {
        return next();
    }
    next(errors.adminAccessRequired);
};

// два уровня аутентификации - пользователь и администратор
const USER = [passport.authenticate("api", { session: false }, null)];
const ADMIN = [passport.authenticate("api", { session: false }, null), adminAuth];

module.exports = { USER, ADMIN };
