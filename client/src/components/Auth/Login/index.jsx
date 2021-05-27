// modules
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
// components
import {
    Avatar,
    Button,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    SnackbarContent,
    TextField,
    Typography
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Translation } from "react-i18next";
// redux
import { forgotPassword, login } from "../../../store/Auth";
// assets
// styles

const styles = theme => ({
    paper: {
        margin: theme.spacing(8, 0, 4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(0, 0, 2),
        backgroundColor: theme.palette.primary.main
    },
    form: {
        width: "100%" // Fix IE 11 issue.
    },
    forgot: {
        cursor: "pointer",
        textDecoration: "underline"
    },
    snackbarMessage: {
        display: "flex",
        alignItems: "center"
    },
    snackbarIcon: {
        marginRight: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(2, 0, 0)
    }
});

class Login extends Component {
    state = {
        showForgotModal: false,
        showSnackbar: false,
        toggleForgot: false,
        email: "",
        password: ""
    };

    componentDidMount() {
        if (this.props.location.pathname === "/login/forgot") {
            this.handleShowForgotModal();
        }
    }

    handleLogin = e => {
        // отключить стандартное поведение формы (переход по ссылке)
        e.preventDefault();
        // вход в аккаунт
        this.props.login(this.state.email, this.state.password).catch(err => {
            console.error(err);
            // показать снэкбар
            this.handleShowSnackbar();
            // скрыть через 5 секунд
            setTimeout(this.handleHideSnackbar, 5000);
        });
    };

    handleForgot = e => {
        // отключить стандартное поведение формы (переход по ссылке)
        e.preventDefault();
        // запрос на восстановление пароля
        this.props.forgotPassword(this.state.email).then(() => {
            // показать снэкбар
            this.handleShowSnackbar();
            // скрыть через 5 секунд
            setTimeout(this.handleHideSnackbar, 5000);
        });
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    toggleForgot = () => {
        this.setState(prevState => ({ toggleForgot: !prevState.toggleForgot }));
    };

    handleShowForgotModal = () => {
        this.setState({ showForgotModal: true });
    };

    handleHideForgotModal = () => {
        this.setState({ showForgotModal: false });
        if (this.props.location.pathname === "/login/forgot") {
            this.props.history.push("/login");
        }
    };

    handleShowSnackbar = () => {
        this.setState({ showSnackbar: true });
    };

    handleHideSnackbar = () => {
        this.setState({ showSnackbar: false });
    };

    render() {
        const { showForgotModal, showSnackbar, toggleForgot } = this.state;
        const { classes, done, fail, status } = this.props;

        let msg;
        let forgotModal;
        if (done) {
            msg = <Translation>{t => t("auth.reset.success")}</Translation>;
        }
        if (fail) {
            switch (status) {
                case 400:
                    msg = <Translation>{t => t("auth.login.error.400")}</Translation>;
                    break;
                case 401:
                    msg = <Translation>{t => t("auth.login.error.401")}</Translation>;
                    break;
                case 404:
                    msg = <Translation>{t => t("auth.login.error.404")}</Translation>;
                    break;
                default:
                    msg = <Translation>{t => t("auth.login.error.other")}</Translation>;
            }
        }
        if (showForgotModal) {
            forgotModal = (
                <Dialog
                    open={showForgotModal}
                    onClose={this.handleHideForgotModal}
                    aria-labelledby="auth-login-forgot-title"
                    aria-describedby="auth-login-forgot-text"
                >
                    <DialogTitle id="auth-login-forgot-title">
                        <Translation>{t => t("auth.login.forgot.title")}</Translation>
                    </DialogTitle>
                    <DialogContent id="auth-login-forgot-description">
                        <DialogContentText>
                            <Translation>{t => t("auth.login.forgot.text")}</Translation>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleHideForgotModal}>
                            <Translation>{t => t("auth.login.forgot.button")}</Translation>
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {forgotModal}
                {toggleForgot ? (
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Typography component="h1" variant="h5">
                            <Translation>{t => t("auth.reset.title")}</Translation>
                        </Typography>

                        <form className={classes.form} onSubmit={this.handleForgot}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                id="email"
                                label={<Translation>{t => t("email")}</Translation>}
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={this.handleChange}
                            />

                            <div>
                                <Typography
                                    className={classes.forgot}
                                    component="span"
                                    variant="subtitle2"
                                    onClick={this.toggleForgot}
                                >
                                    <Translation>{t => t("auth.reset.login")}</Translation>
                                </Typography>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                <Translation>{t => t("auth.reset.button")}</Translation>
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Typography component="h1" variant="h5">
                            <Translation>{t => t("auth.login.title")}</Translation>
                        </Typography>

                        <form className={classes.form} onSubmit={this.handleLogin}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                id="email"
                                label={<Translation>{t => t("email")}</Translation>}
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={this.handleChange}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                id="password"
                                label={<Translation>{t => t("password")}</Translation>}
                                name="password"
                                type="password"
                                autoComplete="password"
                                onChange={this.handleChange}
                            />

                            <div>
                                <Link to="/register">
                                    <Typography variant="subtitle2">
                                        <Translation>{t => t("auth.login.register")}</Translation>
                                    </Typography>
                                </Link>
                            </div>

                            <div>
                                <Typography
                                    className={classes.forgot}
                                    component="span"
                                    variant="subtitle2"
                                    onClick={this.toggleForgot}
                                >
                                    <Translation>{t => t("auth.login.reset")}</Translation>
                                </Typography>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                <Translation>{t => t("auth.login.button")}</Translation>
                            </Button>
                        </form>
                    </div>
                )}

                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    open={showSnackbar}
                    onClose={this.handleHideSnackbar}
                >
                    <SnackbarContent
                        aria-describedby="client-snackbar"
                        message={
                            <span className={classes.snackbarMessage} id="client-snackbar">
                                <CheckCircleIcon className={classes.snackbarIcon} />
                                {msg}
                            </span>
                        }
                    />
                </Snackbar>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    done: state.auth.forgotPassword.done,
    fail: state.auth.login.fail,
    status: state.auth.login.status
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    login: (email, password) => dispatch(login(email, password)),
    forgotPassword: email => dispatch(forgotPassword(email))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Login));
