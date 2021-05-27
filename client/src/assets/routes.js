// аналитика
export const analyticsRoutes = {
    getAnalytics: () => `/api/analytics`
};

// аутентификация
export const authRoutes = {
    checkAuth: () => `/api/auth`,
    register: () => `/api/auth/register`,
    forgotPassword: email => `/api/auth/forgot/${email}`,
    verify: token => `/api/auth/verify/${token}`,
    login: () => `/api/auth/login`,
    logout: () => `/api/auth/logout`
};

export const configRoutes = {
    getConfig: name => `/api/config/${name}`,
    setConfig: () => `/api/config`
}

// задания
export const exercisesRoutes = {
    addExercise: id => `/api/exercises/${id}`,
    editExercise: (id, position) => `/api/exercises/${id}/${position}`,
    deleteExercise: (id, position) => `/api/exercises/${id}/${position}`
};

// планы уроков
export const plansRoutes = {
    getPlans: () => `/api/plans`,
    getMyPlans: () => `/api/plans/my`,
    createPlan: () => `/api/plans`,
    editPlan: id => `/api/plans/${id}`,
    deletePlan: id => `/api/plans/${id}`,
    getPlan: id => `/api/plans/${id}`,
    getPlanBasicInformation: id => `/api/plans/${id}/info`,
    getPlanStages: id => `/api/plans/${id}/stages`,
    getPlanResources: id => `/api/plans/${id}/resources`,
    getPlanReviews: id => `/api/plans/${id}/reviews`,
    copyPlan: id => `/api/plans/${id}/copy`,
    publishPlan: id => `/api/plans/${id}/publish`,
    reviewPlan: id => `/api/plans/${id}/review`
};

// ресурсы
export const resourcesRoutes = {
    addResource: id => `/api/resources/${id}`,
    editResource: (id, position) => `/api/resources/${id}/${position}`,
    deleteResource: (id, position) => `/api/resources/${id}/${position}`
};

// школы
export const schoolsRoutes = {
    getTeachers: () => `/api/schools/teachers`,
    getSchools: () => `/api/schools`,
    getSchool: id => `/api/schools/${id}`,
    createSchool: () => `/api/schools`,
    editSchool: id => `/api/schools/${id}`,
    deleteSchool: id => `/api/schools/${id}`
};

// этапы
export const stagesRoutes = {
    getFavoriteStages: () => `/api/stages/favorites`,
    favoriteStage: id => `/api/stages/${id}/favorite`,
    unfavoriteStage: id => `/api/stages/${id}/unfavorite`,
    reorderStages: id => `/api/stages/${id}/reorder`,
    addStage: id => `/api/stages/${id}/add`,
    editStage: id => `/api/stages/${id}`,
    deleteStage: id => `/api/stages/${id}`
};

// предметы (и поурочные планы)
export const subjectsRoutes = {
    getSubjects: () => `/api/subjects`,
    getSubject: id => `/api/subjects/${id}`,
    createSubject: () => `/api/subjects`,
    getSubjectPlan: (id, pid) => `/api/subjects/${id}/plans/${pid}`,
    createSubjectPlan: id => `/api/subjects/${id}/plans`,
    editSubjectPlan: (id, pid) => `/api/subjects/${id}/plans/${pid}`,
    deleteSubjectPlan: (id, pid) => `/api/subjects/${id}/plans/${pid}`
};

// загрузка файлов
export const uploadRoutes = {
    uploadResource: id => `/api/upload/resource/${id}`,
    uploadExerciseFiles: id => `/api/upload/exercise/files/${id}`
};

// пользователи
export const usersRoutes = {
    getMe: () => `/api/users/me`,
    editAvatar: () => `/api/users/me/avatar`,
    editPassword: () => `/api/users/me/password`,
    getUsers: () => `/api/users`,
    getUser: email => `/api/users/${email}`,
    deleteUser: email => `/api/users/${email}`,
    resetUserPassword: email => `/api/users/${email}/reset`
};
