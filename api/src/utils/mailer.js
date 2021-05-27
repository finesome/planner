// зависимости
const nodemailer = require("nodemailer");
const config = require("../../config");

// данные о сервисе почты и пользователе (для аутентификации) из файла конфигурации
const service = config.get("mailer:service");
const auth = config.get("mailer:auth");

// объект-транспортер для почты
const transporter = nodemailer.createTransport({
    service: service,
    auth: auth
});

// отправление письма (общая функция)
const sendEmail = async ({ from, to, subject, text, html }) => {
    return await transporter.sendMail({ from, to, subject, text, html }, error => {
        if (error) {
            return error;
        }
    });
};

// отправление письма с подтверждением регистрации
const sendVerificationEmail = async (to, token) => {
    const mailOptions = {
        from: auth.user,
        to: to,
        subject: "Подтверждение регистрации",
        text: `Это автоматическое письмо для подтверждения вашей регистрации.
            Ссылка для подтверждения: 
            ${config.get("mailer:baseUrl")}/api/auth/verify/${to}/${token}`,
        html: `<p>Это автоматическое письмо для подтверждения вашей регистрации.</p>
            <p>Ссылка для подтверждения: </p>
            <p>${config.get("mailer:baseUrl")}/api/auth/verify/${to}/${token}</p>`
    };
    return await sendEmail(mailOptions);
};

// отправление письма для проверки запроса восстановления пароля
const sendForgotPasswordVerification = async (to, token) => {
    const mailOptions = {
        from: auth.user,
        to: to,
        subject: "Восстановление пароля",
        text: `Вы запросили восстановление пароля для вашего аккаунта. 
            Чтобы восстановить пароль, подтвердите ваш email, перейдя по следующей ссылке:
            ${config.get("mailer:baseUrl")}/api/auth/forgot/${to}/${token}
            После этого вы получите письмо с новым паролем. 
            Если вы не запрашивали восстановление пароля, проигнорируйте это сообщение.`,
        html: `<p>Вы запросили восстановление пароля для вашего аккаунта.</p>
            <p>Чтобы восстановить пароль, подтвердите ваш email, перейдя по следующей ссылке:</p>
            <p>${config.get("mailer:baseUrl")}/api/auth/forgot/${to}/${token}</p>
            <p>После этого вы получите письмо с новым паролем.</p>
            <p>Если вы не запрашивали восстановление пароля, проигнорируйте это сообщение.</p>`
    };
    return await sendEmail(mailOptions);
};

// отправление письма с новым паролем
const sendNewPassword = async (to, password) => {
    const mailOptions = {
        from: auth.user,
        to: to,
        subject: "Восстановление пароля",
        text: `Ваш новый пароль: ${password}`,
        html: `<p>Ваш новый пароль: ${password}</p>`
    };
    return await sendEmail(mailOptions);
};

module.exports = {
    sendVerificationEmail,
    sendForgotPasswordVerification,
    sendNewPassword
};
