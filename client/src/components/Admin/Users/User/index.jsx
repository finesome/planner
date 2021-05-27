// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import {
    Button,
    CircularProgress,
    CssBaseline,
    Container,
    Grid,
    Snackbar,
    SnackbarContent,
    Typography
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Translation } from "react-i18next";
// redux
// assets
import { usersRoutes } from "../../../../assets/routes";
// styles
import { green } from "@material-ui/core/colors";

const styles = theme => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(2)
    },
    progress: {
        margin: theme.spacing(2)
    },
    snackbar: {
        backgroundColor: green[600]
    },
    snackbarMessage: {
        display: "flex",
        alignItems: "center"
    },
    snackbarIcon: {
        marginRight: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1, 0)
    }
});

class User extends Component {
    state = {
        loading: false,
        showSnackbar: false,
        users: []
    };

    componentDidMount() {
        const email = this.props.match.params.email;
        // запрос пользователя
        this.getUser(email);
    }

    getUser = email => {
        this.setState({ loading: true });
        axios
            .get(usersRoutes.getUser(email))
            .then(response => {
                this.setState({ loading: false, user: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleResetPassword = () => {
        const { user } = this.state;

        const password = window.prompt("Введите новый пароль для пользователя");
        if (password) {
            axios
                .post(usersRoutes.resetUserPassword(user.email), { password: password })
                .then(() => {
                    // show snackbar
                    this.handleShowSnackbar();
                    // hide snackbar after 3 seconds
                    setTimeout(this.handleHideSnackbar, 3000);
                    // reload user
                    this.getUser(user.email);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handleDeleteUser = () => {
        const { user } = this.state;

        const r = window.confirm("Удалить пользователя?");
        if (r) {
            axios
                .delete(usersRoutes.deleteUser(user.email))
                .then(() => {
                    this.props.history.push("/admin/users");
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handleShowSnackbar = () => {
        this.setState({ showSnackbar: true });
    };

    handleHideSnackbar = () => {
        this.setState({ showSnackbar: false });
    };

    render() {
        const { loading, showSnackbar, user } = this.state;
        const { classes } = this.props;

        let userComponent;
        if (user) {
            userComponent = (
		<div>
                    <Typography paragraph>
                        <span>
                            <Translation>{t => t("password")}</Translation>: {user.password}
                        </span>
                    </Typography>
                    <Typography paragraph>
                        <span>
                            <Translation>{t => t("phone")}</Translation>: {user.phone || ""}
                        </span>
                    </Typography>
		</div>
            );
        }

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <Container component="main">
                <CssBaseline />
                <div className={classes.paper}>
                    {userComponent}
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        open={showSnackbar}
                        onClose={this.handleHideSnackbar}
                    >
                        <SnackbarContent
                            aria-describedby="client-snackbar"
                            className={classes.snackbar}
                            message={
                                <span className={classes.snackbarMessage} id="client-snackbar">
                                    <CheckCircleIcon className={classes.snackbarIcon} />
                                    Данные пользователя отредактированы
                                </span>
                            }
                        />
                    </Snackbar>
                    <Button
                        className={classes.button}
                        color="primary"
                        variant="contained"
                        onClick={this.handleResetPassword}
                    >
                        Сбросить пароль
                    </Button>
                    <Button color="secondary" variant="contained" onClick={this.handleDeleteUser}>
                        Удалить пользователя
                    </Button>
                </div>
            </Container>
        );
    }
}

export default withStyles(styles)(User);
