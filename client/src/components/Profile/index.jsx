// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import {
    Avatar,
    Button,
    ButtonGroup,
    CircularProgress,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    Snackbar,
    SnackbarContent,
    TextField,
    Typography
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Dropzone from "react-dropzone";
import { Translation } from "react-i18next";
// redux
// assets
import { usersRoutes } from "../../assets/routes";
import { resizeImage } from "../../assets/utils/profile";
// styles
import { green } from "@material-ui/core/colors";

const styles = theme => ({
    progress: {
        margin: theme.spacing(2)
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(2)
    },
    dropzone: {
        padding: theme.spacing(2),
        border: "1px dashed gray",
        textAlign: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        width: 80,
        height: 80
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

class Profile extends Component {
    state = {
        isPasswordVisible: false,
        loading: false,
        password: "",
        selectedAvatar: null,
        showAvatarDialog: false,
        showPasswordDialog: false,
        showSnackbar: false
    };

    componentDidMount() {
        // запрос данных пользователя
        this.getMe();
    }

    getMe = () => {
        this.setState({ loading: true });
        axios
            .get(usersRoutes.getMe())
            .then(response => {
                this.setState({ loading: false, user: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleEditAvatar = () => {
        const { user } = this.state;

        const r = window.confirm("Поменять аватар?");
        if (r) {
            axios
                .post(usersRoutes.editAvatar(), { avatar: user.avatar })
                .then(() => {
                    // скрыть модальное окно
                    this.handleHideAvatarDialog();
                    // показать snackbar
                    this.handleShowSnackbar();
                    // скрыть snackbar через 3 секунды
                    setTimeout(this.handleHideSnackbar, 3000);
                    // сбросить выбор аватар в dropzon'е
                    this.setState({ selectedAvatar: null });
                    // загрузить данные пользователя
                    this.getMe();
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handleEditPassword = () => {
        const { password } = this.state;

        const r = window.confirm("Поменять пароль?");
        if (r) {
            axios
                .post(usersRoutes.editPassword(), { password: password })
                .then(() => {
                    // скрыть модальное окно
                    this.handleHidePasswordDialog();
                    // показать snackbar
                    this.handleShowSnackbar();
                    // скрыть snackbar через 3 секунды
                    setTimeout(this.handleHideSnackbar, 3000);
                    // сбросить введенный пароль
                    this.setState({ password: "" });
                    // загрузить данные пользователя
                    this.getMe();
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handleDrop = files => {
        if (files.length !== 0) {
            // выделить файл аватара
            const avatar = files[0];
            // создать объект FileReader
            const reader = new FileReader();
            // прочитать данные файла аватара
            reader.readAsArrayBuffer(avatar);

            // callback при загрузке файла
            reader.onload = event => {
                // создать Blob объект
                const blob = new Blob([event.target.result]);
                // установить URL объекта window
                window.URL = window.URL || window.webkitURL;
                // создать URL для нового Blob объекта
                const blobURL = window.URL.createObjectURL(blob);

                // вспомогательный объект изображения для сжатия файла аватара
                const image = new Image();
                // установить источник изображения как URL созданного Blob
                image.src = blobURL;

                // callback при загрузке изображения
                image.onload = () => {
                    // сжать изображение
                    const resized = resizeImage(image);
                    // установить данные
                    this.setState(prevState => ({
                        selectedAvatar: avatar,
                        user: {
                            ...prevState.user,
                            avatar: resized
                        }
                    }));
                };
            };
        }
    };

    handleChange = e => {
        const { value } = e.target;

        this.setState({
            password: value
        });
    };

    handleShowAvatarDialog = () => {
        this.setState({ showAvatarDialog: true });
    };

    handleHideAvatarDialog = () => {
        this.setState({ showAvatarDialog: false });
    };

    handleShowPasswordDialog = () => {
        this.setState({ showPasswordDialog: true });
    };

    handleHidePasswordDialog = () => {
        this.setState({ showPasswordDialog: false });
    };

    togglePasswordVisibility = () => {
        this.setState(prevState => ({
            isPasswordVisible: !prevState.isPasswordVisible
        }));
    };

    handleShowSnackbar = () => {
        this.setState({ showSnackbar: true });
    };

    handleHideSnackbar = () => {
        this.setState({ showSnackbar: false });
    };

    render() {
        const {
            isPasswordVisible,
            loading,
            password,
            selectedAvatar,
            showAvatarDialog,
            showPasswordDialog,
            showSnackbar,
            user
        } = this.state;
        const { classes } = this.props;

        let userInfo;
        if (user) {
            userInfo = (
                <div>
                    <Dialog
                        fullWidth
                        open={showAvatarDialog}
                        onClose={this.handleHideAvatarDialog}
                        aria-labelledby="avatar-selection-dialog-title"
                    >
                        <DialogTitle id="avatar-selection-dialog-title">
                            <Translation>{t => t("profile.changeAvatar.title")}</Translation>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Translation>{t => t("profile.changeAvatar.currentAvatar")}</Translation>
                            </DialogContentText>
                            <Grid container justify="center">
                                <Avatar className={classes.avatar} alt="User avatar" src={user.avatar || ""} />
                            </Grid>
                            <Dropzone multiple={false} onDrop={files => this.handleDrop(files)}>
                                {({ getRootProps, getInputProps }) => (
                                    <div {...getRootProps({ className: classes.dropzone })}>
                                        <input {...getInputProps()} />
                                        {selectedAvatar ? (
                                            <p>
                                                <Translation>
                                                    {t => t("profile.changeAvatar.selectedAvatar")}
                                                </Translation>
                                                : {selectedAvatar.name}
                                            </p>
                                        ) : (
                                            <p>
                                                <Translation>
                                                    {t => t("profile.changeAvatar.dropzone.text")}
                                                </Translation>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </Dropzone>
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" onClick={this.handleHideAvatarDialog}>
                                <Translation>{t => t("cancel")}</Translation>
                            </Button>
                            <Button color="primary" onClick={this.handleEditAvatar}>
                                <Translation>{t => t("profile.changeAvatar.button")}</Translation>
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        fullWidth
                        open={showPasswordDialog}
                        onClose={this.handleHidePasswordDialog}
                        aria-labelledby="password-selection-dialog-title"
                    >
                        <DialogTitle id="password-selection-dialog-title">
                            <Translation>{t => t("profile.changePassword.title")}</Translation>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Translation>{t => t("profile.changePassword.hint")}</Translation>
                            </DialogContentText>
                            <TextField
                                id="filled-password-input"
                                label={<Translation>{t => t("profile.changePassword.newPassword")}</Translation>}
                                name="password"
                                value={password}
                                type={isPasswordVisible ? "text" : "password"}
                                fullWidth
                                margin="normal"
                                variant="filled"
                                onChange={this.handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                aria-label="Toggle password visibility"
                                                onClick={this.togglePasswordVisibility}
                                            >
                                                {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" onClick={this.handleHidePasswordDialog}>
                                <Translation>{t => t("cancel")}</Translation>
                            </Button>
                            <Button color="primary" onClick={this.handleEditPassword}>
                                <Translation>{t => t("profile.changePassword.button")}</Translation>
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Typography paragraph>
                        <Translation>{t => t("profile.fullName")}</Translation>
                        {`: ${user.lastName} ${user.firstName} ${user.patronymic}`}
                    </Typography>

		    {user.phone ? (
                        <Typography paragraph>
                            <Translation>{t => t("phone")}</Translation>
                            {`: ${user.phone}`}
                        </Typography>
		    ) : null}

                    {user.school ? (
                        <Typography paragraph>
                            <Translation>{t => t("profile.school")}</Translation>
                            {`: ${user.school.name}, ${user.school.region}, город ${user.school.city}, район ${
                                user.school.district
                            }`}
                        </Typography>
                    ) : null}
		    

                    {user.language ? (
                        <Typography paragraph>
                            <Translation>{t => t("language")}</Translation>
                            {`: `}
                            <Translation>{t => t(user.language)}</Translation>
                        </Typography>
                    ) : null}

		    
                    {user.subject ? (
                        <Typography paragraph>
                            <Translation>{t => t("subject")}</Translation>
                            {`: ${user.subject}`}
                        </Typography>
                    ) : null}

                    {user.lessonPlans && user.lessonPlans.length ? (
                        <Typography paragraph>
                            <Translation>{t => t("profile.totalPlans")}</Translation>
                            {`: ${user.lessonPlans.length}`}
                        </Typography>
                    ) : null}

                    {user.lessonPlans && user.lessonPlans.length ? (
                        <Typography paragraph>
                            <Translation>{t => t("profile.originalPlans")}</Translation>
                            {`: ${user.lessonPlans.filter(x => x._id === x.originalPlan).length}`}
                        </Typography>
                    ) : null}

                    {user.lessonPlans && user.lessonPlans.length ? (
                        <Typography paragraph>
                            <Translation>{t => t("profile.copiedPlans")}</Translation>
                            {`: ${user.lessonPlans.map(plan => plan.forks).reduce((a, b) => a + b, 0)}`}
                        </Typography>
                    ) : null}

                    <ButtonGroup color="primary">
                        <Button className={classes.button} onClick={this.handleShowAvatarDialog}>
                            <Translation>{t => t("profile.changeAvatar.button")}</Translation>
                        </Button>
                        <Button className={classes.button} onClick={this.handleShowPasswordDialog}>
                            <Translation>{t => t("profile.changePassword.button")}</Translation>
                        </Button>
                    </ButtonGroup>

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
                                    <Translation>{t => t("dataEditingSuccess")}</Translation>
                                </span>
                            }
                        />
                    </Snackbar>
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
                <div className={classes.paper}>{userInfo}</div>
            </Container>
        );
    }
}

export default withStyles(styles)(Profile);
