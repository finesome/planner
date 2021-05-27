// статусы планов (по публикации)
const statuses = {
    Опубликованные: true,
    Неопубликованные: false
};

// отфильтровать планы для отображения
export const filterPlans = (plans, filters) => {
    let filteredPlans = [...plans];

    // отфильтровать по предмету
    if (filters.subject) {
        filteredPlans = filteredPlans.filter(x => x.subject === filters.subject);
    }

    // отфильтровать по классу
    if (filters.targetClass) {
        filteredPlans = filteredPlans.filter(x => x.targetClass === filters.targetClass);
    }

    // отфильтровать по языку обучения
    if (filters.language) {
        filteredPlans = filteredPlans.filter(x => x.language === filters.language);
    }

    // отфильтровать по секции
    if (filters.section) {
        filteredPlans = filteredPlans.filter(x => x.section === filters.section);
    }

    // отфильтровать по теме урока
    if (filters.topic) {
        filteredPlans = filteredPlans.filter(x => x.topic === filters.topic);
    }

    // отфильтровать по школе
    if (filters.school && filters.school !== "Все") {
        filteredPlans = filteredPlans.filter(x => x.author.school._id === filters.school);
    }

    // отфильтровать по автору
    if (filters.author && filters.author !== "Все") {
        filteredPlans = filteredPlans.filter(x => x.author._id === filters.author);
    }

    // отфильтровать по статусу публикации
    if (filters.isPublished && filters.isPublished !== "Все") {
        let status = statuses[filters.isPublished];
        filteredPlans = filteredPlans.filter(x => x.isPublished === status);
    }

    return filteredPlans;
};
