// зависимости
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// модель этапа в ходе урока
const LessonStageSchema = new Schema(
    {
        // дата создания
        createdDate: Date,
        // план урока (к которому относится этот этап урока)
        lessonPlan: {
            type: Schema.Types.ObjectId,
            ref: "LessonPlan"
        },
        // кол-во людей добавивших этот этап в избранное
        likes: {
            type: Number,
            default: 0
        },
        // длительность этапа
        duration: Number,
        // название
        name: String,
        // описание
        description: String,
        // задания
        exercises: [
            {
                // текст задания
                text: String,
                // дополнительные файлы
                files: [String]
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("LessonStage", LessonStageSchema);
