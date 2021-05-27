// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
// components
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@material-ui/core";
// redux
// assets
// styles

const styles = theme => ({
    learningObjectives: {
        margin: theme.spacing(2, 0)
    },
    newLearningObjective: {
        margin: theme.spacing(2, 0)
    },
    button: {
        margin: theme.spacing(1, 1, 1, 0)
    }
});

class NewTopic extends Component {
    state = {
        newLearningObjective: {
            number: "",
            objective: ""
        },
        topic: {
            name: "",
            learningObjectives: []
        }
    };

    handleAddLearningObjective = () => {
        const { newLearningObjective } = this.state;
        if (!newLearningObjective.number || !newLearningObjective.objective) {
            alert("Не все поля заполнены");
            return;
        }

        // add new learning objective
        const learningObjectives = [...this.state.topic.learningObjectives, newLearningObjective];
        // set state
        this.setState(prevState => ({
            newLearningObjective: {
                number: "",
                objective: ""
            },
            topic: {
                ...prevState.topic,
                learningObjectives
            }
        }));
    };

    handleChangeTopic = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            topic: {
                ...prevState.topic,
                [name]: value
            }
        }));
    };

    handleChangeLearningObjective = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            newLearningObjective: {
                ...prevState.newLearningObjective,
                [name]: value
            }
        }));
    };

    render() {
        const { newLearningObjective, topic } = this.state;
        const { classes } = this.props;

        return (
            <Dialog fullWidth open={true} onClose={this.props.handleCloseNewTopic}>
                <DialogTitle id="new-section-dialog-title">Новая тема</DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        variant="filled"
                        id="filled-topic-name"
                        label="Название темы"
                        name="name"
                        value={topic.name}
                        onChange={this.handleChangeTopic}
                    />

                    <div className={classes.learningObjectives}>
                        <Typography paragraph>Цели обучения</Typography>
                        {topic && topic.learningObjectives && topic.learningObjectives.length
                            ? topic.learningObjectives.map((learningObjective, index) => (
                                  <Typography paragraph variant="button" key={`topic-learning-objective-${index}`}>
                                      {learningObjective.number} {learningObjective.objective}
                                  </Typography>
                              ))
                            : []}
                    </div>

                    <div className={classes.newLearningObjective}>
                        <Typography>Добавить цель обучения</Typography>
                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            variant="filled"
                            id="filled-learning-objective-number"
                            label="Номер цели обучения"
                            name="number"
                            value={newLearningObjective.number}
                            onChange={this.handleChangeLearningObjective}
                        />
                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            variant="filled"
                            id="filled-learning-objective-text"
                            label="Текст цели обучения"
                            name="objective"
                            value={newLearningObjective.objective}
                            onChange={this.handleChangeLearningObjective}
                        />
                        <Button color="primary" className={classes.button} onClick={this.handleAddLearningObjective}>
                            Добавить цель обучения
                        </Button>
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button color="secondary" className={classes.button} onClick={this.props.handleCloseNewTopic}>
                        Отменить
                    </Button>
                    <Button color="primary" className={classes.button} onClick={() => this.props.handleAddTopic(topic)}>
                        Добавить новую тему
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(NewTopic);
