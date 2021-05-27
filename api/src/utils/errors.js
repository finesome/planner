// объект ошибки
const httpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

// типы ошибок и сообщения
const errors = {
    badRequest: httpError(400, "Bad request"),
    unauthorized: httpError(401, "Unauthorized"),
    wrongCredentials: httpError(401, "Wrong credentials"),
    adminAccessRequired: httpError(403, "Admin access required"),
    notAuthor: httpError(403, "Not an author or co-author"),
    planNotPublished: httpError(403, "Plan not published"),
    tokensDoNotMatch: httpError(403, "Tokens do not match"),
    notInFavoriteStages: httpError(404, "Stage not in favorites"),
    configNotFound: httpError(404, "Config not found"),
    planNotFound: httpError(404, "Plan not found"),
    stageNotFound: httpError(404, "Stage not found"),
    subjectNotFound: httpError(404, "Subject not found"),
    userNotFound: httpError(404, "User not found"),
    alreadyAuthor: httpError(409, "You are already an author"),
    alreadyReviewed: httpError(409, "YOu already left review"),
    emailAlreadyTaken: httpError(409, "Email already taken"),
    planAlreadyPublished: httpError(409, "Plan already published"),
    stageAlreadyInFavorites: httpError(409, "Stage already added to favorites"),
    subjectAlreadyExists: httpError(409, "Subject already exists"),
    exerciseFilesUploadFailed: httpError(500, "Exercise files upload failed"),
    resourceUploadFailed: httpError(500, "Resource upload failed"),
    notImplemented: httpError(501, "Method not implemented")
};

module.exports = errors;
