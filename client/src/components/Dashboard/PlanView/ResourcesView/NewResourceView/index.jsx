// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
// components
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";
import Dropzone from "react-dropzone";
import { Translation } from "react-i18next";
// redux
// assets
// styles

const styles = theme => ({
    dropzone: {
        padding: theme.spacing(2),
        border: "1px dashed gray",
        textAlign: "center"
    },
    button: {
        margin: theme.spacing(1, 1, 1, 0)
    }
});

class NewResourceView extends Component {
    state = {
        resource: {
            name: "",
            description: ""
        },
        selectedFile: null
    };

    handleChange = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            resource: {
                ...prevState.resource,
                [name]: value
            }
        }));
    };

    handleDrop = files => {
        if (files.length !== 0) {
            this.setState({
                selectedFile: files[0]
            });
        }
    };

    render() {
        const { resource, selectedFile } = this.state;
        const { classes } = this.props;

        return (
            <Dialog fullWidth open={true} onClose={this.props.handleCloseNewResource}>
                <DialogTitle id="new-resource-dialog-title">
                    <Translation>{t => t("dashboard.plan.resources.new")}</Translation>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        variant="filled"
                        id="filled-new-resource-name"
                        label={<Translation>{t => t("dashboard.plan.resources.name")}</Translation>}
                        name="name"
                        value={resource.name}
                        onChange={this.handleChange}
                    />
                    <TextField
                        fullWidth
                        multiline
                        margin="normal"
                        variant="filled"
                        id="filled-new-resource-description"
                        label={<Translation>{t => t("dashboard.plan.resources.description")}</Translation>}
                        name="description"
                        value={resource.description}
                        onChange={this.handleChange}
                    />
                    <Dropzone multiple={false} onDrop={files => this.handleDrop(files)}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps({ className: classes.dropzone })}>
                                <input {...getInputProps()} />
                                {selectedFile ? (
                                    <p>
                                        <Translation>{t => t("dashboard.plan.resources.selectedFile")}</Translation>:{" "}
                                        {selectedFile.name}
                                    </p>
                                ) : (
                                    <p>
                                        <Translation>{t => t("dashboard.plan.resources.dropzone.text")}</Translation>
                                    </p>
                                )}
                            </div>
                        )}
                    </Dropzone>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" className={classes.button} onClick={this.props.handleCloseNewResource}>
                        <Translation>{t => t("cancel")}</Translation>
                    </Button>
                    <Button
                        color="primary"
                        className={classes.button}
                        onClick={() => this.props.handleAddResource(resource, selectedFile)}
                    >
                        <Translation>{t => t("dashboard.plan.resources.create")}</Translation>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(NewResourceView);
