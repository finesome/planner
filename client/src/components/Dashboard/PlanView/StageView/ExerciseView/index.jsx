// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import parse from "html-react-parser";
// components
import { AppBar, Button, Dialog, IconButton, Paper, Slide, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ReactQuill from "react-quill";
import { Translation } from "react-i18next";
// redux
// assets
import { exercisesRoutes } from "../../../../../assets/routes";
// styles
import "react-quill/dist/quill.snow.css";

const styles = theme => ({
    paper: {
        padding: theme.spacing(4)
    },
    appBar: {
        position: "relative"
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    },
    innerPaper: {
        margin: theme.spacing(2, 0),
        padding: theme.spacing(2)
    },
    button: {
        margin: theme.spacing(1, 1, 1, 0)
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Exercise extends Component {
    state = {
        exercise: this.props.exercise ? this.props.exercise : {}
    };

    componentDidUpdate(prevProps) {
        // re-hydrate exercise
        if (this.props.exercise !== prevProps.exercise) {
            this.setState({
                exercise: this.props.exercise
            });
        }
    }

    handleEditExercise = () => {
        const r = window.confirm("Редактировать это задание?");
        const { id, planId, position } = this.props;

        if (id && position !== undefined && position !== null && r) {
            const { exercise } = this.state;

            axios
                .post(exercisesRoutes.editExercise(id, position), { exercise: exercise })
                .then(() => {
                    // reload stages
                    this.props.getPlanStages(planId);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handleDeleteExercise = () => {
        const r = window.confirm("Удалить это задание?");
        const { id, planId, position } = this.props;

        if (id && position !== undefined && position !== null && r) {
            axios
                .delete(exercisesRoutes.deleteExercise(id, position))
                .then(() => {
                    // reload stages
                    this.props.getPlanStages(planId);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handleChange = value => {
        this.setState(prevState => ({
            exercise: {
                ...prevState.exercise,
                text: value
            }
        }));
    };

    render() {
        const { exercise } = this.state;
        const { classes, myPlan, position } = this.props;

        return (
            <Dialog fullScreen open={true} onClose={this.props.handleCloseExercise} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={this.props.handleCloseExercise}
                            aria-label="Close"
                        >
                            <CloseIcon />
                        </IconButton>

                        <Typography variant="h6" className={classes.title}>
                            {`Задание ${position + 1}`}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div className={classes.paper}>
                    <Paper className={classes.innerPaper} square>
                        <Typography paragraph>
                            <Translation>{t => t("dashboard.plan.exercise.text")}</Translation>
                        </Typography>
                        {myPlan ? (
                            <ReactQuill value={exercise.text} onChange={this.handleChange} />
                        ) : (
                            parse(exercise.text)
                        )}
                    </Paper>

                    <Paper className={classes.innerPaper} square>
                        {exercise.files
                            ? exercise.files.map((file, index) => (
                                  <p key={`exercise-files-${index}`}>
                                      {`Файл ${index + 1}:`} <a href={`${file}`}>ссылка</a>
                                  </p>
                              ))
                            : []}
                    </Paper>

                    {myPlan ? (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={this.handleEditExercise}
                            >
                                <Translation>{t => t("dashboard.plan.exercise.edit")}</Translation>
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                onClick={this.handleDeleteExercise}
                            >
                                <Translation>{t => t("dashboard.plan.exercise.delete")}</Translation>
                            </Button>
                        </div>
                    ) : null}
                </div>
            </Dialog>
        );
    }
}

export default withStyles(styles)(Exercise);
