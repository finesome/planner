// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import parse from "html-react-parser";
// components
import { Button, List, ListItem, ListItemText, Paper, TextField, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ReactQuill from "react-quill";
import { Translation } from "react-i18next";
import ExerciseView from "./ExerciseView";
import NewExerciseView from "./NewExerciseView";
// redux
import { getFavoriteStages } from "../../../../store/Auth";
// assets
import { exercisesRoutes, stagesRoutes, uploadRoutes } from "../../../../assets/routes";
// styles
import "react-quill/dist/quill.snow.css";

const styles = theme => ({
    paper: {
        width: "100%"
    },
    innerPaper: {
        margin: theme.spacing(2, 0),
        padding: theme.spacing(2)
    },
    item: {
        margin: theme.spacing(1, 0)
    },
    button: {
        margin: theme.spacing(2, 2, 0, 0)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    }
});

class StageView extends Component {
    state = {
        stage: this.props.stage ? this.props.stage : {},
        selectedFile: null,
        newExercise: null,
        exercise: null
    };

    componentDidUpdate(prevProps) {
        // re-hydrate stage
        if (this.props.stage !== prevProps.stage) {
            this.setState({
                stage: this.props.stage
            });
        }
    }

    handleEditStage = () => {
        const r = window.confirm("Редактировать этот этап?");
        const { stage } = this.state;
        const { id } = this.props;

        if (stage._id && r) {
            this.setState({ loading: true });
            axios
                .post(stagesRoutes.editStage(stage._id), { stage: stage })
                .then(() => {
                    this.setState({ loading: false });
                    // reload stages
                    this.props.getPlanStages(id);
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ loading: false });
                });
        }
    };

    handleDeleteStage = () => {
        const r = window.confirm("Удалить этот этап?");
        const { stage } = this.stage;
        const { id } = this.props;

        if (stage._id && r) {
            this.setState({ loading: true });
            axios
                .delete(stagesRoutes.deleteStage(stage._id))
                .then(() => {
                    this.setState({ loading: false });
                    // reload stages
                    this.props.getPlanStages(id);
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ loading: false });
                });
        }
    };

    handleFavoriteStage = () => {
        const { stage } = this.state;
        const { id } = this.props;

        if (stage._id) {
            this.setState({ loading: true });
            axios
                .post(stagesRoutes.favoriteStage(stage._id))
                .then(() => {
                    this.setState({ loading: false });
                    // reload stages
                    this.props.getPlanStages(id);
                    // reload favorite stages
                    this.props.getFavoriteStages();
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ loading: false });
                });
        }
    };

    handleOpenNewExercise = () => {
        this.setState({
            newExercise: (
                <NewExerciseView
                    handleAddExercise={this.handleAddExercise}
                    handleCloseNewExercise={this.handleCloseNewExercise}
                />
            )
        });
    };

    handleCloseNewExercise = () => {
        this.setState({
            newExercise: null
        });
    };

    handleAddExercise = (exercise, files) => {
        const { stage } = this.state;
        const { id } = this.props;

        if (!exercise.text) {
            alert("Текст задания не введен");
            return;
        }

        const r = window.confirm("Создать новое задание?");
        if (r) {
            const data = new FormData();
            for (let i = 0; i < files.length; i++) {
                data.append("file", files[i]);
            }

            axios.post(uploadRoutes.uploadExerciseFiles(stage._id), data).then(response => {
                // append links to exercise
                const newExercise = { ...exercise, files: response.data.links };
                // add exercise
                axios.post(exercisesRoutes.addExercise(stage._id), { exercise: newExercise }).then(() => {
                    // close new exercise
                    this.handleCloseNewExercise();
                    // reload stages
                    this.props.getPlanStages(id);
                });
            });
        }
    };

    handleOpenExercise = (exercise, index) => {
        const { stage } = this.state;
        const { id, myPlan } = this.props;

        this.setState({
            exercise: (
                <ExerciseView
                    exercise={exercise}
                    id={stage._id}
                    myPlan={myPlan}
                    planId={id}
                    position={index}
                    handleCloseExercise={this.handleCloseExercise}
                    getPlanStages={this.props.getPlanStages}
                />
            )
        });
    };

    handleCloseExercise = () => {
        this.setState({ exercise: null });
    };

    handleChangeStage = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            stage: {
                ...prevState.stage,
                [name]: value
            }
        }));
    };

    handleChangeStageDescription = value => {
        this.setState(prevState => ({
            stage: {
                ...prevState.stage,
                description: value
            }
        }));
    };

    render() {
        const { exercise, newExercise, stage } = this.state;
        const { classes, favoriteStages, myPlan, newStage, user } = this.props;

        let alreadyFavorite = false;
        if (favoriteStages && favoriteStages.length) {
            alreadyFavorite = favoriteStages.some(x => x._id === stage._id);
        }
        let isAuthor = stage && stage.lessonPlan && stage.lessonPlan.author === user._id;

        return (
            <div className={classes.paper}>
                {newStage ? (
                    <Typography>
                        <Translation>{t => t("dashboard.plan.stage.new")}</Translation>
                    </Typography>
                ) : null}
                {newStage ? null : stage.likes ? (
                    <Typography>
                        <b>
                            <Translation>{t => t("dashboard.plan.stage.liked")}</Translation>: {stage.likes} раз
                        </b>
                    </Typography>
                ) : null}

                <TextField
                    fullWidth
                    multiline
                    inputProps={{
                        readOnly: !myPlan
                    }}
                    id="filled-stage-name-input"
                    name="name"
                    label={<Translation>{t => t("dashboard.plan.stage.name")}</Translation>}
                    value={stage.name || ""}
                    margin="normal"
                    variant="filled"
                    onChange={this.handleChangeStage}
                />
                <Paper className={classes.innerPaper} square>
                    <Typography paragraph>
                        <Translation>{t => t("dashboard.plan.stage.description")}</Translation>
                    </Typography>
                    {!myPlan && !newStage ? (
                        parse(stage.description)
                    ) : (
                        <ReactQuill value={stage.description || ""} onChange={this.handleChangeStageDescription} />
                    )}
                </Paper>
                <TextField
                    fullWidth
                    inputProps={{
                        readOnly: !myPlan,
                        min: 0,
                        step: 1
                    }}
                    id="filled-stage-duration-input"
                    name="duration"
                    label={<Translation>{t => t("dashboard.plan.stage.duration")}</Translation>}
                    type="number"
                    value={stage.duration || ""}
                    margin="normal"
                    variant="filled"
                    onChange={this.handleChangeStage}
                />

                {newStage ? null : (
                    <div>
                        <Paper className={classes.innerPaper} square>
                            <Typography paragraph>
                                <Translation>{t => t("dashboard.plan.stage.exercises")}</Translation>
                            </Typography>

                            <List aria-label="stage-exercises-list">
                                {stage.exercises && stage.exercises.length
                                    ? stage.exercises.map((exercise, index) => (
                                          <Paper
                                              className={classes.item}
                                              key={`dashboard-stage-exercises-item-${index}`}
                                          >
                                              <ListItem button onClick={() => this.handleOpenExercise(exercise, index)}>
                                                  <ListItemText primary={`Задание ${index + 1}`} />
                                              </ListItem>
                                          </Paper>
                                      ))
                                    : []}
                            </List>

                            <div>{exercise}</div>

                            {myPlan ? (
                                <div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={this.handleOpenNewExercise}
                                    >
                                        <Translation>{t => t("dashboard.plan.stage.addExercise")}</Translation>
                                        <AddIcon className={classes.rightIcon} />
                                    </Button>
                                    {newExercise}
                                </div>
                            ) : null}
                        </Paper>
                    </div>
                )}

                {myPlan ? (
                    newStage ? (
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => this.props.handleCreateStage(stage)}
                        >
                            <Translation>{t => t("dashboard.plan.stage.create")}</Translation>
                        </Button>
                    ) : (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={this.handleEditStage}
                            >
                                <Translation>{t => t("dashboard.plan.stage.edit")}</Translation>
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                onClick={this.handleDeleteStage}
                            >
                                <Translation>{t => t("dashboard.plan.stage.delete")}</Translation>
                            </Button>
                        </div>
                    )
                ) : isAuthor ? null : (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={alreadyFavorite}
                        className={classes.button}
                        onClick={this.handleFavoriteStage}
                    >
                        {alreadyFavorite ? (
                            <Translation>{t => t("dashboard.plan.stage.alreadyFavorite")}</Translation>
                        ) : (
                            <Translation>{t => t("dashboard.plan.stage.favorite")}</Translation>
                        )}
                    </Button>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    favoriteStages: state.auth.user.favoriteStages,
    user: state.auth.user
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    getFavoriteStages: () => dispatch(getFavoriteStages())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(StageView));
