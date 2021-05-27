// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
// components
import { Button, TextField, Typography } from "@material-ui/core";
// redux
// assets
// styles

const styles = theme => ({
    learningObjectives: {
        margin: theme.spacing(2, 0)
    },
    button: {
        margin: theme.spacing(1, 1, 1, 0)
    }
});

class Topic extends Component {
    state = {
        topic: this.props.topic ? this.props.topic : {}
    };

    componentDidUpdate(prevProps) {
        // re-hydrate state with props
        if (this.props.topic !== prevProps.topic) {
            this.setState({
                topic: this.props.topic
            });
        }
    }

    handleChange = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            topic: {
                ...prevState.topic,
                [name]: value
            }
        }));
    };

    render() {
        const { topic } = this.state;
        const { classes, index } = this.props;

        return (
            <div>
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    variant="filled"
                    id="filled-topic-name"
                    label="Название темы"
                    name="name"
                    value={topic.name || ""}
                    onChange={this.handleChange}
                />

                <Typography paragraph>Цели обучения:</Typography>

                <div className={classes.learningObjectives}>
                    {topic && topic.learningObjectives && topic.learningObjectives.length
                        ? topic.learningObjectives.map((learningObjective, index) => (
                              <Typography paragraph variant="button" key={`topic-learning-objective-${index}`}>
                                  {learningObjective.number} {learningObjective.objective}
                              </Typography>
                          ))
                        : []}
                </div>

                <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    onClick={() => this.props.handleEditTopic(topic, index)}
                >
                    Редактировать тему
                </Button>

                <Button
                    color="secondary"
                    variant="contained"
                    className={classes.button}
                    onClick={() => this.props.handleDeleteTopic(index)}
                >
                    Удалить тему
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(Topic);
