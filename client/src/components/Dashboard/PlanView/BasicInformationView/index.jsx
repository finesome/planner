// modules
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import {
    Button,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    SnackbarContent,
    TextField,
    Typography
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ReactQuill from "react-quill";
import { Translation } from "react-i18next";
// redux
// assets
import { plansRoutes, schoolsRoutes } from "../../../../assets/routes";
// styles
import "react-quill/dist/quill.snow.css";
import { green } from "@material-ui/core/colors";

const styles = theme => ({
    progress: {
        margin: theme.spacing(2)
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(1, 0)
    },
    formControl: {
        margin: theme.spacing(1, 0),
        minWidth: 120
    },
    chips: {
        display: "flex",
        flexWrap: "wrap"
    },
    chip: {
        margin: 2
    },
    editorPaper: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(2)
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
        margin: theme.spacing(1, 0, 1)
    }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

class BasicInformationView extends Component {
    state = {
        loading: false,
        showSnackbar: false,
        teachers: []
    };

    componentDidMount() {
        // запрос учителей
        this.getTeachers();
        // запрос плана
        const id = this.props.match.params.id;
        this.getPlanBasicInformation(id);
    }

    getTeachers = () => {
        this.setState({ loading: true });
        axios
            .get(schoolsRoutes.getTeachers())
            .then(response => {
                this.setState({ loading: false, teachers: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    getPlanBasicInformation = id => {
        this.setState({ loading: true });
        axios
            .get(plansRoutes.getPlanBasicInformation(id))
            .then(response => {
                this.setState({ loading: false, id: id, plan: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleEditPlan = () => {
        const { plan } = this.state;

        if (
            !plan._id ||
            !plan.lessonObjectives ||
            !plan.evaluationCriteria ||
            !plan.languageObjectives ||
            !plan.valuesTaught ||
            !plan.interdisciplinaryConnections ||
            !plan.preliminaryKnowledge
        ) {
            alert("Не все поля заполнены");
            return;
        }

        const r = window.confirm("Редактировать план урока?");
        if (r) {
            axios
                .post(plansRoutes.editPlan(plan._id), { plan: plan })
                .then(() => {
                    // show snackbar
                    this.handleShowSnackbar();
                    // hide snackbar after 3 seconds
                    setTimeout(this.handleHideSnackbar, 3000);
                    // reload basic information
                    this.getPlanBasicInformation(plan._id);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handleChange = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            plan: {
                ...prevState.plan,
                [name]: value
            }
        }));
    };

    handleDeleteCoAuthors = value => {
        const coAuthors = this.state.plan.coAuthors.filter(x => x !== value);

        this.setState(prevState => ({
            plan: {
                ...prevState.plan,
                coAuthors: coAuthors
            }
        }));
    };

    handleEvaluationCriteriaChange = value => {
        this.setState(prevState => ({
            plan: {
                ...prevState.plan,
                evaluationCriteria: value
            }
        }));
    };

    handleLanguageObjectivesChange = value => {
        this.setState(prevState => ({
            plan: {
                ...prevState.plan,
                languageObjectives: value
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
        const { loading, showSnackbar, plan, teachers } = this.state;
        const { classes, myPlan } = this.props;

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <div className={classes.paper}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="filled-co-authors">
                        <Translation>{t => t("dashboard.plan.coAuthors")}</Translation>
                    </InputLabel>
                    <Select
                        multiple
                        name="coAuthors"
                        value={(plan && plan.coAuthors) || []}
                        onChange={this.handleChange}
                        input={
                            <Input
                                inputProps={{
                                    readOnly: !myPlan
                                }}
                                id="filled-co-authors"
                            />
                        }
                        renderValue={selected => (
                            <div className={classes.chips}>
                                {selected.map((value, index) => (
                                    <Chip
                                        className={classes.chip}
                                        key={`dashboard-plan-co-author-${index}`}
                                        label={
                                            teachers.find(x => x._id === value)
                                                ? `${teachers.find(x => x._id === value).lastName} ${
                                                      teachers.find(x => x._id === value).firstName
                                                  } ${teachers.find(x => x._id === value).patronymic}`
                                                : ""
                                        }
                                        onDelete={() => this.handleDeleteCoAuthors(value)}
                                    />
                                ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >
                        {teachers.map((teacher, index) => (
                            <MenuItem key={`dashboard-plan-teacher-${index}`} value={teacher._id}>
                                {`${teacher.lastName} ${teacher.firstName} ${teacher.patronymic} (г. ${
                                    teacher.school.city
                                }, район ${teacher.school.district}, ${teacher.school.name})`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    multiline
                    inputProps={{
                        readOnly: !myPlan
                    }}
                    id="filled-custom-topic-input"
                    name="customTopic"
                    label={<Translation>{t => t("dashboard.plan.customTopic")}</Translation>}
                    value={(plan && plan.customTopic) || ""}
                    margin="normal"
                    variant="filled"
                    onChange={this.handleChange}
                />

                <TextField
                    multiline
                    inputProps={{
                        readOnly: true,
                        rows: 3
                    }}
                    id="filled-learning-objectives-input"
                    name="learningObjectives"
                    value={
                        plan && plan.learningObjectives && plan.learningObjectives.length
                            ? plan.learningObjectives.map(item => `${item.number} - ${item.objective}`)
                            : ""
                    }
                    label={<Translation>{t => t("dashboard.plan.learningObjectives")}</Translation>}
                    margin="normal"
                    variant="filled"
                />

                <TextField
                    multiline
                    inputProps={{
                        readOnly: !myPlan,
                        rows: 3
                    }}
                    id="filled-lesson-objectives-input"
                    name="lessonObjectives"
                    label={<Translation>{t => t("dashboard.plan.lessonObjectives")}</Translation>}
                    value={(plan && plan.lessonObjectives) || ""}
                    margin="normal"
                    variant="filled"
                    onChange={this.handleChange}
                />

                <Paper className={classes.editorPaper}>
                    <Typography paragraph>
                        <Translation>{t => t("dashboard.plan.criteria")}</Translation>
                    </Typography>
                    <ReactQuill
                        readOnly={!myPlan}
                        value={(plan && plan.evaluationCriteria) || ""}
                        onChange={this.handleEvaluationCriteriaChange}
                    />
                </Paper>

                <Paper className={classes.editorPaper}>
                    <Typography paragraph>
                        <Translation>{t => t("dashboard.plan.languageObjectives")}</Translation>
                    </Typography>
                    <ReactQuill
                        readOnly={!myPlan}
                        value={(plan && plan.languageObjectives) || ""}
                        onChange={this.handleLanguageObjectivesChange}
                    />
                </Paper>

                <TextField
                    multiline
                    inputProps={{
                        readOnly: !myPlan,
                        rows: 3
                    }}
                    id="filled-values-taught-input"
                    name="valuesTaught"
                    label={<Translation>{t => t("dashboard.plan.values")}</Translation>}
                    value={(plan && plan.valuesTaught) || ""}
                    margin="normal"
                    variant="filled"
                    onChange={this.handleChange}
                />

                <TextField
                    multiline
                    inputProps={{
                        readOnly: !myPlan,
                        rows: 3
                    }}
                    id="filled-interdisciplinary-connections-input"
                    name="interdisciplinaryConnections"
                    label={<Translation>{t => t("dashboard.plan.interdisciplinary")}</Translation>}
                    value={(plan && plan.interdisciplinaryConnections) || ""}
                    margin="normal"
                    variant="filled"
                    onChange={this.handleChange}
                />

                <TextField
                    multiline
                    inputProps={{
                        readOnly: !myPlan,
                        rows: 3
                    }}
                    id="filled-preliminary-knowledge-input"
                    name="preliminaryKnowledge"
                    label={<Translation>{t => t("dashboard.plan.preliminary")}</Translation>}
                    value={(plan && plan.preliminaryKnowledge) || ""}
                    margin="normal"
                    variant="filled"
                    onChange={this.handleChange}
                />

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
                                <Translation>{t => t("dashboard.plan.edited")}</Translation>
                            </span>
                        }
                    />
                </Snackbar>

                {myPlan ? (
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.handleEditPlan}
                    >
                        <Translation>{t => t("dashboard.plan.edit")}</Translation>
                    </Button>
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withStyles(styles)(BasicInformationView))
);
