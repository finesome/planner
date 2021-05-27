import { groupBy } from "lodash";

// сравнить авторов по количеству копирований у них (атрибут "Кол-во копирований"
// должен быть уже доступен перед вызовом функции)
export const compareAuthors = (a, b) => {
    const aForks = a["Кол-во копирований"];
    const bForks = b["Кол-во копирований"];
    if (aForks > bForks) {
        return -1;
    } else if (aForks < bForks) {
        return 1;
    } else {
        return 0;
    }
};

// сравнить предметы по количеству (атрибуты "Оригинальные планы" и "Скопированные планы"
// должны быть уже доступны перед вызовом функции)
export const compareSubjects = (a, b) => {
    const aTotal = a["Оригинальные планы"] + a["Скопированные планы"];
    const bTotal = b["Оригинальные планы"] + b["Скопированные планы"];
    if (aTotal > bTotal) {
        return -1;
    } else if (aTotal < bTotal) {
        return 1;
    } else {
        return 0;
    }
};

// отфильтровать данные о пользователях в аналитике
export const filterUsers = (filters, users) => {
    // создать объект с результатами фильтрования
    const results = {
        filteredUsers: [...users],
        groupBy: "school.region",
        selectedFilter: "Весь Казахстан",
        usersNumber: 0,
        distributionData: [],
        usersData: []
    };

    // фильтр по региону
    if (filters.region) {
        results.filteredUsers = results.filteredUsers.filter(user => user.school.region === filters.region);
        results.groupBy = "school.city";
        results.selectedFilter = filters.region;
    }
    // фильтр по городу
    if (filters.city) {
        results.filteredUsers = results.filteredUsers.filter(user => user.school.city === filters.city);
        results.groupBy = "school.district";
        results.selectedFilter = filters.city;
    }
    // фильтр по району
    if (filters.district) {
        results.filteredUsers = results.filteredUsers.filter(user => user.school.district === filters.district);
        results.groupBy = "school.name";
        results.selectedFilter = filters.district;
    }
    // фильтр по школе
    if (filters.school) {
        results.filteredUsers = results.filteredUsers.filter(user => user.school.name === filters.school);
        results.groupBy = "_id";
        results.selectedFilter = filters.school;
    }

    // определить кол-во пользователей в выбранном фильтре
    results.usersNumber = results.filteredUsers.length;

    // сгруппировать пользователей по региону/городу/району/школе
    const groupedUsers = groupBy(results.filteredUsers, results.groupBy);

    // собрать данные для графика
    results.distributionData = Object.keys(groupedUsers).map(key => {
        // определить название для сегмента графика
        let name = key;
        if (results.groupBy === "_id") {
            const user = results.filteredUsers.find(x => x._id === key);
            name = `${user.lastName} ${user.firstName} ${user.patronymic}`;
        }

        // отфильтровать только опубликованные планы
        for (let user of groupedUsers[key]) {
            user.lessonPlans = user.lessonPlans.filter(x => x.isPublished);
        }

        // посчитать кол-во планов для выбранного региона/города/района/школы
        let value = groupedUsers[key].map(x => x.lessonPlans.length).reduce((a, b) => a + b, 0);
        // вернуть результат
        return {
            name: name,
            value: value
        };
    });

    // получить топ пользователей у которых копируют
    results.usersData = results.filteredUsers.map(user => ({
        name: `${user.lastName} ${user.firstName} ${user.patronymic}`,
        "Кол-во копирований": user.lessonPlans.map(plan => plan.forks).reduce((a, b) => a + b, 0)
    }));
    // отсортировать пользователей по кол-ву копирований
    results.usersData.sort(compareAuthors);
    // взять только 5 первых пользователей
    results.usersData = results.usersData.slice(0, 5);

    // вернуть результат фильтрования
    return results;
};

// отфильтровать данные о планах в аналитике
export const filterPlans = (filters, plans) => {
    // создать объект с результатами фильтрования
    const results = {
        filteredPlans: [...plans],
        selectedFilter: "Весь Казахстан",
        graphData: []
    };

    // фильтр по региону
    if (filters.region) {
        results.filteredPlans = results.filteredPlans.filter(plan => plan.author.school.region === filters.region);
        results.selectedFilter = filters.region;
    }
    // фильтр по городу
    if (filters.city) {
        results.filteredPlans = results.filteredPlans.filter(plan => plan.author.school.city === filters.city);
        results.selectedFilter = filters.city;
    }
    // фильтр по району
    if (filters.district) {
        results.filteredPlans = results.filteredPlans.filter(plan => plan.author.school.district === filters.district);
        results.selectedFilter = filters.district;
    }
    // фильтр по школе
    if (filters.school) {
        results.filteredPlans = results.filteredPlans.filter(plan => plan.author.school.name === filters.school);
        results.selectedFilter = filters.school;
    }
    // фильтр по автору
    if (filters.author) {
        results.filteredPlans = results.filteredPlans.filter(plan => plan.author._id === filters.author);
        // найти автора
        const plan = results.filteredPlans.find(x => x.author._id === filters.author);
        results.selectedFilter = `${plan.author.lastName} ${plan.author.firstName} ${plan.author.patronymic}`;
    }

    // сгруппировать результаты по предметам
    const groupedBySubject = groupBy(results.filteredPlans, "subject");

    // получить данные для графика
    for (let subject in groupedBySubject) {
        results.graphData.push({
            name: subject,
            "Оригинальные планы": groupedBySubject[subject].filter(plan => plan._id === plan.originalPlan._id).length,
            "Скопированные планы": groupedBySubject[subject].filter(plan => plan._id !== plan.originalPlan._id).length
        });
    }
    // sort filtered plans data
    results.graphData.sort(compareSubjects);

    // вернуть результат фильтрования
    return results;
};
