// зависимости
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// модель школьного предмета со списком поурочных планов (для разных классов и языков обучения)
const SubjectSchema = new Schema(
    {
        // язык обучения
        language: String,
        // название предмета (выбирается из определенного списка)
        name: String,
        // поурочные планы для различных языков обучения и классов
        plans: [
            {
                // язык обучения (дублируется из верхнего языка обучения)
                language: String,
                // класс
                targetClass: Number,
                // кол-во часов в неделю
                hoursPerWeek: Number,
                // кол-во часов в учебном году
                hoursInYear: Number,
                // разделы плана
                sections: [
                    {
                        // название раздела
                        name: String,
                        // учебная четверть
                        quarter: Number,
                        // темы
                        topics: [
                            {
                                // название темы
                                name: String,
                                // цели обучения
                                learningObjectives: [
                                    {
                                        // номер цели
                                        number: String,
                                        // текст цели
                                        objective: String
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Subject", SubjectSchema);
