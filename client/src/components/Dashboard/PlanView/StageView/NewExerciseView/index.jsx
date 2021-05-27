// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
// components
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from "@material-ui/core";
import ReactQuill from "react-quill";
import Dropzone from "react-dropzone";
import { Translation } from "react-i18next";
// redux
// assets
// styles
import "react-quill/dist/quill.snow.css";

const styles = theme => ({
    innerPaper: {
        margin: theme.spacing(2, 0),
        padding: theme.spacing(2)
    },
    dropzone: {
        padding: theme.spacing(2),
        border: "1px dashed gray",
        textAlign: "center"
    },
    button: {
        margin: theme.spacing(1, 1, 1, 0)
    }
});

class NewExerciseView extends Component {
    state = {
        exercise: {
            text: ""
        },
        selectedFiles: []
    };

    handleChange = value => {
        this.setState(prevState => ({
            exercise: {
                ...prevState.exercise,
                text: value
            }
        }));
    };

    handleDrop = files => {
        if (files.length !== 0) {
            this.setState({
                selectedFiles: files
            });
        }
    };

    render() {
        const { exercise, selectedFiles } = this.state;
        const { classes } = this.props;

        return (
            <Dialog fullWidth open={true} onClose={this.props.handleCloseNewExercise}>
                <DialogTitle id="new-exercise-dialog-title">
                    <Translation>{t => t("dashboard.plan.exercise.new")}</Translation>
                </DialogTitle>
                <DialogContent>
                    <Paper className={classes.innerPaper} square>
                        <Typography paragraph>
                            <Translation>{t => t("dashboard.plan.exercise.text")}</Translation>
                        </Typography>
                        <ReactQuill value={exercise.text} onChange={this.handleChange} />
                    </Paper>
                    <Dropzone onDrop={files => this.handleDrop(files)}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps({ className: classes.dropzone })}>
                                <input {...getInputProps()} />
                                {selectedFiles.length ? (
                                    <div>
                                        <Translation>{t => t("dashboard.plan.exercise.selectedFiles")}</Translation>:
                                        {selectedFiles.map((file, index) => (
                                            <p key={`new-exercise-file-${index}`}>{`${index + 1}) ${file.name}`}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <p>
                                        <Translation>{t => t("dashboard.plan.exercise.dropzone.text")}</Translation>
                                    </p>
                                )}
                            </div>
                        )}
                    </Dropzone>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" className={classes.button} onClick={this.props.handleCloseNewExercise}>
                        <Translation>{t => t("cancel")}</Translation>
                    </Button>
                    <Button
                        color="primary"
                        className={classes.button}
                        onClick={() => this.props.handleAddExercise(exercise, selectedFiles)}
                    >
                        <Translation>{t => t("dashboard.plan.exercise.create")}</Translation>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(NewExerciseView);
