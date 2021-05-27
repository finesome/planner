// зависимости
const asyncHandler = require("express-async-handler");

// модели
const LessonPlan = require("../models/LessonPlan");
const User = require("../models/User");

// получить всю аналитику (данные по планам уроков и пользователям)
exports.getAnalytics = asyncHandler(async (req, res, next) => {
    try {
        // найти все планы
        const plans = await LessonPlan.find({ isPublished: true })
            .populate("originalPlan", "_id")
            .populate({
                path: "author",
                populate: { path: "school" },
                select: "email lastName firstName patronymic school scope"
            })
            .select("originalPlan author subject language targetClass");

        // найти всех пользователей (учителей)
        const users = await User.find({ scope: "user" })
            .populate("school")
            .populate("lessonPlans", "originalPlan forks author isPublished")
            .select("email lastName firstName patronymic school lessonPlans");

        // вернуть все в едином объекте
        res.status(200).json({ plans: plans, users: users });
    } catch (err) {
        next(err);
    }
});
