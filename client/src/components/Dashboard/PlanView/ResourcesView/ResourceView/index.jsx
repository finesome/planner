// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import { AppBar, Button, Dialog, IconButton, Paper, Slide, TextField, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Translation } from "react-i18next";
// redux
// assets
import { resourcesRoutes } from "../../../../../assets/routes";
// styles

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

class Resource extends Component {
    state = {
        resource: this.props.resource ? this.props.resource : {}
    };

    componentDidUpdate(prevProps) {
        // re-hydrate resource
        if (this.props.resource !== prevProps.resource) {
            this.setState({
                resource: this.props.resource
            });
        }
    }

    handleEditResource = () => {
        const r = window.confirm("Редактировать этот ресурс?");
        const { id, position } = this.props;

        if (id && position !== undefined && position !== null && r) {
            const { resource } = this.state;

            axios
                .post(resourcesRoutes.editResource(id, position), { resource: resource })
                .then(() => {
                    // close resource
                    this.props.handleCloseResource();
                    // reload resource
                    this.props.getPlanResources(id);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handleDeleteResource = () => {
        const r = window.confirm("Удалить этот ресурс?");
        const { id, position } = this.props;

        if (id && position !== undefined && position !== null && r) {
            axios
                .delete(resourcesRoutes.deleteResource(id, position))
                .then(() => {
                    // close resource
                    this.props.handleCloseResource();
                    // reload resources
                    this.props.getPlanResources(id);
                })
                .catch(err => {
                    console.error(err);
                });
        }
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

    render() {
        const { resource } = this.state;
        const { classes, myPlan } = this.props;

        return (
            <Dialog fullScreen open={true} onClose={this.props.handleCloseResource} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={this.props.handleCloseResource}
                            aria-label="Close"
                        >
                            <CloseIcon />
                        </IconButton>

                        <Typography variant="h6" className={classes.title}>
                            {resource && resource.name ? resource.name : ""}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div className={classes.paper}>
                    <TextField
                        fullWidth
                        multiline
                        id="filled-resource-name-input"
                        name="name"
                        label={<Translation>{t => t("dashboard.plan.resources.name")}</Translation>}
                        value={resource.name || ""}
                        margin="normal"
                        variant="filled"
                        onChange={this.handleChange}
                    />
                    <TextField
                        fullWidth
                        multiline
                        id="filled-resource-description-input"
                        name="description"
                        label={<Translation>{t => t("dashboard.plan.resources.description")}</Translation>}
                        value={resource.description || ""}
                        margin="normal"
                        variant="filled"
                        onChange={this.handleChange}
                    />
                    <Paper className={classes.innerPaper} square>
                        <Typography paragraph>
                            <Translation>{t => t("dashboard.plan.resources.link")}</Translation>
                            <span>: </span>
                            <a href={resource.link || ""} target="__blank">
                                сілтеме
                            </a>
                        </Typography>
                    </Paper>

                    {myPlan ? (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={this.handleEditResource}
                            >
                                <Translation>{t => t("dashboard.plan.resources.edit")}</Translation>
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                onClick={this.handleDeleteResource}
                            >
                                <Translation>{t => t("dashboard.plan.resources.delete")}</Translation>
                            </Button>
                        </div>
                    ) : null}
                </div>
            </Dialog>
        );
    }
}

export default withStyles(styles)(Resource);
