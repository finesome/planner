// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import parse from "html-react-parser";
// components
import { Button, List, ListItem, ListItemText, Paper, TextField, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ExerciseView from "../../PlanView/StageView/ExerciseView";
import ResourceView from "../../PlanView/ResourcesView//ResourceView";
// redux
// assets
import { stagesRoutes } from "../../../../assets/routes";
// styles

const styles = theme => ({
    paper: {
        margin: theme.spacing(1),
        width: "100%"
    },
    innerPaper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2, 0, 2)
    },
    item: {
        margin: theme.spacing(1, 0)
    },
    button: {
        margin: theme.spacing(1, 0, 1)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    }
});

class FavoriteStageView extends Component {
    state = {
        stage: this.props.stage ? this.props.stage : {},
        exercise: null,
        resource: null
    };

    componentDidUpdate(prevProps) {
        // re-hydrate stage
        if (this.props.stage !== prevProps.stage) {
            this.setState({
                stage: this.props.stage
            });
        }
    }

    handleUnlikeStage = () => {
        const { stage } = this.props;
        const r = window.confirm("Удалить блок из избранного?");

        if (stage._id && r) {
            axios
                .post(stagesRoutes.unfavoriteStage(stage._id))
                .then(() => {
                    // reload favorite stages
                    this.props.getFavoriteStages();
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handleOpenResource = (resource, index) => {
        const { id } = this.props;

        this.setState({
            resource: <ResourceView id={id} resource={resource} handleCloseResource={this.handleCloseResource} />
        });
    };

    handleCloseResource = () => {
        this.setState({ resource: null });
    };

    handleOpenExercise = (exercise, index) => {
        const { id } = this.props;

        this.setState({
            exercise: (
                <ExerciseView
                    exercise={exercise}
                    id={id}
                    position={index}
                    handleCloseExercise={this.handleCloseExercise}
                />
            )
        });
    };

    handleCloseExercise = () => {
        this.setState({ exercise: null });
    };

    render() {
        const { exercise, resource, stage } = this.state;
        const { classes } = this.props;

        return (
            <div className={classes.paper}>
                <Typography>Раздел: {stage.lessonPlan.section || ""}</Typography>
                <Typography>Тема: {stage.lessonPlan.topic || ""}</Typography>
                <Typography>Свое название темы: {stage.lessonPlan.customTopic || ""}</Typography>

                <TextField
                    fullWidth
                    multiline
                    label="Название"
                    value={stage.name || ""}
                    margin="normal"
                    variant="filled"
                    inputProps={{
                        readOnly: true
                    }}
                />

                <Paper className={classes.innerPaper} square>
                    <Typography>Описание</Typography>
                    {stage.description ? parse(stage.description) : ""}
                </Paper>

                <TextField
                    fullWidth
                    label="Продолжительность (в минутах)"
                    type="number"
                    value={stage.duration || ""}
                    margin="normal"
                    variant="filled"
                    inputProps={{
                        readOnly: true
                    }}
                />

                <Paper className={classes.innerPaper}>
                    <Typography paragraph>Ресурсы</Typography>

                    <List aria-label="favorite-stage-resources-list">
                        {stage.resources && stage.resources.length
                            ? stage.resources.map((resource, index) => (
                                  <Paper
                                      className={classes.item}
                                      key={`favorite-stage-${stage._id}-resources-${index}`}
                                  >
                                      <ListItem button onClick={() => this.handleOpenResource(resource, index)}>
                                          <ListItemText primary={`${resource.name}`} />
                                      </ListItem>
                                  </Paper>
                              ))
                            : []}
                    </List>

                    <div>{resource}</div>
                </Paper>

                <Paper className={classes.innerPaper}>
                    <Typography paragraph>Задания</Typography>

                    <List aria-label="favorite-stage-exercises-list">
                        {stage.exercises && stage.exercises.length
                            ? stage.exercises.map((exercise, index) => (
                                  <Paper
                                      className={classes.item}
                                      key={`favorite-stage-${stage._id}-exercises-${index}`}
                                  >
                                      <ListItem button onClick={() => this.handleOpenExercise(exercise, index)}>
                                          <ListItemText primary={`Задание ${index + 1}`} />
                                      </ListItem>
                                  </Paper>
                              ))
                            : []}
                    </List>

                    <div>{exercise}</div>
                </Paper>

                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={this.handleUnlikeStage}
                >
                    Удалить из избранного
                    <DeleteIcon className={classes.rightIcon} />
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(FavoriteStageView);
