// modules
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import { Button, CircularProgress, Grid, List, ListItem, ListItemText, Paper, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Translation } from "react-i18next";
import ResourceView from "./ResourceView";
import NewResourceView from "./NewResourceView";
// redux
// assets
import { plansRoutes, resourcesRoutes, uploadRoutes } from "../../../../assets/routes";
// styles

const styles = theme => ({
    progress: {
        margin: theme.spacing(2)
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(1, 0)
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

class ResourcesView extends Component {
    state = {
        loading: false,
        selectedFile: null,
        newResource: null,
        resource: null,
        resources: []
    };

    componentDidMount() {
        // запрос ресурсов
        const id = this.props.match.params.id;
        this.getPlanResources(id);
    }

    getPlanResources = id => {
        this.setState({ loading: true });
        axios
            .get(plansRoutes.getPlanResources(id))
            .then(response => {
                this.setState({ loading: false, id: id, resources: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleOpenNewResource = () => {
        this.setState({
            newResource: (
                <NewResourceView
                    handleAddResource={this.handleAddResource}
                    handleCloseNewResource={this.handleCloseNewResource}
                />
            )
        });
    };

    handleCloseNewResource = () => {
        this.setState({
            newResource: null
        });
    };

    handleAddResource = (resource, file) => {
        const { id } = this.state;

        if (!resource.name) {
            alert("Введите название ресурса");
            return;
        }

        if (!file) {
            alert("Файл не выбран");
            return;
        }

        const r = window.confirm("Добавить новый ресурс?");
        if (r) {
            const data = new FormData();
            data.append("file", file);

            axios.post(uploadRoutes.uploadResource(id), data).then(response => {
                // append filename and link attributes to resource
                const newResource = { ...resource, filename: response.data.filename, link: response.data.link };
                // add resource
                axios.post(resourcesRoutes.addResource(id), { resource: newResource }).then(() => {
                    // close new resource
                    this.handleCloseNewResource();
                    // reload resources
                    this.getPlanResources(id);
                });
            });
        }
    };

    handleOpenResource = (resource, index) => {
        const { id } = this.state;
        const { myPlan } = this.props;

        this.setState({
            resource: (
                <ResourceView
                    id={id}
                    myPlan={myPlan}
                    resource={resource}
                    position={index}
                    handleCloseResource={this.handleCloseResource}
                    getPlanResources={this.getPlanResources}
                />
            )
        });
    };

    handleCloseResource = () => {
        this.setState({ resource: null });
    };

    render() {
        const { loading, newResource, resource, resources } = this.state;
        const { classes, myPlan } = this.props;

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <div className={classes.paper}>
                <Paper className={classes.innerPaper} square>
                    <Typography paragraph>
                        <Translation>{t => t("dashboard.plan.resources")}</Translation>
                    </Typography>

                    <List aria-label="plan-resources-list">
                        {resources && resources.length
                            ? resources.map((resource, index) => (
                                  <Paper className={classes.item} key={`dashboard-plan-resources-item-${index}`}>
                                      <ListItem button onClick={() => this.handleOpenResource(resource, index)}>
                                          <ListItemText primary={`${resource.name}`} />
                                      </ListItem>
                                  </Paper>
                              ))
                            : []}
                    </List>

                    <div>{resource}</div>

                    {myPlan ? (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={this.handleOpenNewResource}
                            >
                                <Translation>{t => t("dashboard.plan.resources.create")}</Translation>
                                <AddIcon className={classes.rightIcon} />
                            </Button>
                            {newResource}
                        </div>
                    ) : null}
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withStyles(styles)(ResourcesView))
);
