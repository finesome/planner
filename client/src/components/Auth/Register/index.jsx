// modules
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import clsx from "clsx";
// components
import {
    Avatar,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Grid,
    MenuItem,
    Snackbar,
    SnackbarContent,
    TextField,
    Typography
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Select from "react-select";
import MuiPhoneNumber from "material-ui-phone-number";
import { Translation } from "react-i18next";
// redux
import { register } from "../../../store/Auth";
// assets
import { configRoutes, schoolsRoutes } from "../../../assets/routes";
import { allSubjects } from "../../../assets/utils/subjects";
// styles
import { green, red } from "@material-ui/core/colors";

const styles = theme => ({
    paper: {
        margin: theme.spacing(8, 0, 4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    progress: {
        margin: theme.spacing(2)
    },
    avatar: {
        margin: theme.spacing(0, 0, 2),
        backgroundColor: theme.palette.primary.main
    },
    form: {
        width: "100%" // Fix IE 11 issue.
    },
    formSelect: {
        zIndex: 30,
        marginTop: theme.spacing(1)
    },
    snackbarSuccess: {
        backgroundColor: green[600]
    },
    snackbarError: {
        backgroundColor: red[700]
    },
    snackbarMessage: {
        display: "flex",
        alignItems: "center"
    },
    snackbarIcon: {
        marginRight: theme.spacing(1)
    },
    buttonWrapper: {
        margin: theme.spacing(1, 0, 1),
        position: "relative"
    },
    buttonProgress: {
        color: "green",
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12
    }
});

class Register extends Component {
    state = {
	allowRegistration: true,
        loading: false,
        showSnackbar: false,
        schools: [],
        user: {
            email: "",
            password: "",
            lastName: "",
            firstName: "",
            patronymic: "",
            school: "",
	    phone: "",
	    language: "ru",
	    subject: ""
        }
    };

    componentDidMount() {
	this.getAllowRegistration();
        this.getSchools();
    }

    getSchools = () => {
        this.setState({ loading: true });
        axios
            .get(schoolsRoutes.getSchools())
            .then(response => {
                this.setState({ loading: false, schools: response.data });
            })
            .catch(err => {
		this.setState({ loading: false });
                console.error(err);
            });
    };

    getAllowRegistration = () => {
	this.setState({ loading: true });
	axios
	    .get(configRoutes.getConfig("allowRegistration"))
	    .then(response => {
		this.setState({ loading: false, allowRegistration: response.data.value });
 	    })
	    .catch(err => {
		this.setState({ loading: false });
		console.error(err);
	    });
    };

    handleRegister = e => {
        // отключить стандартное поведение формы (переход по ссылке)
        e.preventDefault();

        // проверить выбрана ли школа
        if (!this.state.user.school) {
            alert("Не выбрана школа");
            return;
        }
	    
	// проверить введен ли номер телефона
	if (!this.state.user.phone) {
	    alert("Не введен номер телефона");
	    return;
	}
	    
	// проверить выбран ли предмет
	if (!this.state.user.language || !this.state.user.subject) {
	    alert("Не выбран предмет или его язык");
	    return;
	}

        // регистрация
        this.props
            .register(this.state.user)
            .then(() => {
                // показать снэкбар
                this.handleShowSnackbar();
                // скрыть через 2 секунды
                setTimeout(this.handleHideSnackbar, 2000);
                // переадресация на страницу входа через 2 секунду
                setTimeout(() => {
                    this.props.history.push("/login");
                }, 2000);
            })
            .catch(err => {
                console.error(err);
                // показать снэкбар
                this.handleShowSnackbar();
                // скрыть через 5 секунд
                setTimeout(this.handleHideSnackbar, 5000);
            });
    };

    handleChange = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            user: {
                ...prevState.user,
                [name]: value
            }
        }));
    };

    handleChangePhone = phone => {
	this.setState(prevState => ({
	    user: {
		...prevState.user,
		phone: phone
	    }
	}));
    };

    handleChangeSchool = school => {
        this.setState(prevState => ({
            user: {
                ...prevState.user,
                school: school
            }
        }));
    };

    handleShowSnackbar = () => {
        this.setState({ showSnackbar: true });
    };

    handleHideSnackbar = () => {
        this.setState({ showSnackbar: false });
    };

    render() {
        const { allowRegistration, loading, showSnackbar, schools, user } = this.state;
        const { classes, done, fail, pending, status } = this.props;

        let msg;
        if (done) {
            msg = <Translation>{t => t("auth.register.success")}</Translation>;
        }
        if (fail) {
            switch (status) {
                case 400:
                    msg = <Translation>{t => t("auth.register.error.400")}</Translation>;
                    break;
                case 409:
                    msg = <Translation>{t => t("auth.register.error.409")}</Translation>;
                    break;
                default:
                    msg = <Translation>{t => t("auth.register.error.other")}</Translation>;
            }
        }

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        <Translation>{t => t("auth.register.title")}</Translation>
                    </Typography>

                    <form className={classes.form} onSubmit={this.handleRegister}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            id="email"
                            label={<Translation>{t => t("email")}</Translation>}
                            name="email"
                            autoComplete="email"
                            type="email"
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
                            autoComplete="current-password"
                            onChange={this.handleChange}
                        />
                        <Select
                            className={classes.formSelect}
                            placeholder={<Translation>{t => t("auth.register.selectSchool")}</Translation>}
                            value={user.school}
                            onChange={this.handleChangeSchool}
                            options={schools.map(school => ({
                                value: school._id,
                                label: `${school.region}, ${school.city}, ${school.district}, ${school.name}`
                            }))}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
			    select
                            required
                            id="language"
                            label={<Translation>{t => t("auth.register.selectSubjectLanguage")}</Translation>}
                            name="language"
			    value={user.language}
                            onChange={this.handleChange}
                        >

			    {Object.keys(allSubjects).map(lang => (
			    	<MenuItem key={lang} value={lang}>
				    <Translation>{t => t(lang)}</Translation>
				</MenuItem>
			    ))}
			</TextField>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
			    select
                            required
                            id="subject"
                            label={<Translation>{t => t("auth.register.selectSubject")}</Translation>}
                            name="subject"
			    value={user.subject}
                            onChange={this.handleChange}
                        >
			    {allSubjects[user.language].map(subject => (
			    	<MenuItem key={subject} value={subject}>
				    {subject}
				</MenuItem>
			    ))}
			</TextField>
                        <MuiPhoneNumber
			    defaultCountry="kz"
			    onlyCountries={["kz"]}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            id="phone"
                            label={<Translation>{t => t("phone")}</Translation>}
                            name="phone"
                            onChange={this.handleChangePhone}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            id="lastName"
                            label={<Translation>{t => t("lastName")}</Translation>}
                            name="lastName"
                            onChange={this.handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            id="firstName"
                            label={<Translation>{t => t("firstName")}</Translation>}
                            name="firstName"
                            onChange={this.handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="patronymic"
                            label={<Translation>{t => t("patronymic")}</Translation>}
                            name="patronymic"
                            onChange={this.handleChange}
                        />

                        <Link to="/login">
                            <Translation>{t => t("auth.register.login")}</Translation>
                        </Link>

                        <Snackbar
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            open={showSnackbar}
                            onClose={this.handleHideSnackbar}
                        >
                            <SnackbarContent
                                aria-describedby="client-snackbar"
                                className={clsx({
                                    [classes.snackbarSuccess]: done,
                                    [classes.snackbarError]: fail
                                })}
                                message={
                                    <span className={classes.snackbarMessage} id="client-snackbar">
                                        <CheckCircleIcon className={classes.snackbarIcon} />
                                        {msg}
                                    </span>
                                }
                            />
                        </Snackbar>

                        <div className={classes.buttonWrapper}>
                            <Button disabled={pending || !allowRegistration} type="submit" fullWidth variant="contained" color="primary">
                                <Translation>{t => t("auth.register.button")}</Translation>
                            </Button>
                            {pending && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </div>
                    </form>
                </div>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    pending: state.auth.register.pending,
    done: state.auth.register.done,
    fail: state.auth.register.fail,
    status: state.auth.register.status
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    register: user => dispatch(register(user))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Register));
