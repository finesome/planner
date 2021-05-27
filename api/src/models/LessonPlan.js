// зависимости
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// модель плана урока
const LessonPlanSchema = new Schema(
    {
        // дата создания
        createdDate: Date,
        // оригинальный план урока (указывает на другой план, если этот был скопирован)
        originalPlan: {
            type: Schema.Types.ObjectId,
            ref: "LessonPlan"
        },
        // кол-во планов, которые были скопированы с этого
        forks: {
            type: Number,
            default: 0
        },
        // отзывы
        reviews: [
            {
                // пользователь
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                },
                // рейтинг (от 1 до 5)
                rating: Number,
                // текст отзыва
                text: String
            }
        ],
        // автор (тот кто создал/скопировал этот план)
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        // со-авторы
        coAuthors: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        // статус публикации плана
        isPublished: {
            type: Boolean,
            default: false
        },
        // дата публикации
        publishedDate: Date,
        // диапазон даты урока (по расписанию)
        lessonDate: {
            start: Date,
            end: Date
        },
        // предмет
        subject: String,
        // язык
        language: String,
        // класс
        targetClass: Number,
        // литеры классов
        classLetters: String,
        // учебная четверть
        quarter: Number,
        // раздел долгосрочного плана
        section: String,
        // тема урока
        topic: String,
        // собственное название темы урока (опционально)
        customTopic: String,
        // цели обучения
        learningObjectives: [
            {
                number: String,
                objective: String
            }
        ],
        // цели урока
        lessonObjectives: String,
        // критерии оценивания
        evaluationCriteria: String,
        // языковые критерии
        languageObjectives: String,
        // привитие ценностей
        valuesTaught: String,
        // межпредметные связи
        interdisciplinaryConnections: String,
        // предварительные знания
        preliminaryKnowledge: String,
        // этапы урока
        lessonStages: [
            {
                type: Schema.Types.ObjectId,
                ref: "LessonStage"
            }
        ],
        // ресурсы
        resources: [
            {
                // название
                name: String,
                // описание
                description: String,
                // ссылка на ресурс
                link: String,
                // название файла
                filename: String
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("LessonPlan", LessonPlanSchema);
