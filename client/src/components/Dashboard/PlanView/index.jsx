// modules
import React, { Component } from "react";
import { NavLink, Switch, Redirect, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import { AppBar, Button, CircularProgress, Container, CssBaseline, Grid, Typography } from "@material-ui/core";
import CopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import PublishIcon from "@material-ui/icons/Publish";
import { Translation } from "react-i18next";
import OverviewView from "./OverviewView";
import BasicInformationView from "./BasicInformationView";
import StagesView from "./StagesView";
import ResourcesView from "./ResourcesView";
import ReviewsView from "./ReviewsView";
// redux
// assets
import { plansRoutes } from "../../../assets/routes";
// styles

const styles = theme => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(2)
    },
    progress: {
        margin: theme.spacing(2)
    },
    appBar: {
        zIndex: 10
    },
    linksBar: {
        display: "flex",
        justifyContent: "space-evenly"
    },
    link: {
        padding: theme.spacing(2),
        color: "black",
        textDecoration: "none"
    },
    activeLink: {
        color: theme.palette.primary.main
    },
    button: {
        padding: theme.spacing(2)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    }
});

class PlanView extends Component {
    state = {
        loading: false
    };

    componentDidMount() {
        // запрос плана
        const id = this.props.match.params.id;
        this.getPlan(id);
    }

    getPlan = id => {
        this.setState({ loading: true });
        axios
            .get(plansRoutes.getPlan(id))
            .then(response => {
                this.setState({ loading: false, plan: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleCopyPlan = () => {
        const { plan } = this.state;
        const r = window.confirm("Скопировать план урока?");

        if (plan._id && r) {
            axios
                .post(plansRoutes.copyPlan(plan._id))
                .then(() => {
                    // redirect to my plans
                    this.props.history.push("/dashboard/my");
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handlePublishPlan = () => {
        const { plan } = this.state;
        const r = window.confirm("Опубликовать план урока?");

        if (plan._id && r) {
            axios
                .post(plansRoutes.publishPlan(plan._id))
                .then(() => {
                    // reload plan
                    this.getPlan(plan._id);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handleDeletePlan = () => {
        const { plan } = this.state;
        const { myPlan } = this.props;
        const r = window.confirm("Удалить план урока?");

        if (plan._id && r) {
            const sure = window.confirm("Вы уверены?");

            if (sure) {
                axios
                    .delete(plansRoutes.deletePlan(plan._id))
                    .then(() => {
                        // redirect to plans view
                        this.props.history.push(`/dashboard/${myPlan ? "my" : "all"}`);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    };

    render() {
        const { loading, plan } = this.state;
        const { classes, myPlan, user } = this.props;

        let isAuthor = false;
        if (plan) {
            isAuthor = plan.author._id === user._id;
        }

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <Container component="main">
                <CssBaseline />
                <div className={classes.paper}>
                    <OverviewView plan={plan} myPlan={myPlan} />
                    <AppBar className={classes.appBar} position="static" color="default">
                        <Grid container>
                            <Grid className={classes.linksBar} item xs={12}>
                                <NavLink
                                    activeClassName={classes.activeLink}
                                    className={classes.link}
                                    to={plan ? `/dashboard/${myPlan ? "my" : "all"}/${plan._id}/info` : ""}
                                >
                                    <Typography variant="button">
                                        <Translation>{t => t("dashboard.plan.basicInformation")}</Translation>
                                    </Typography>
                                </NavLink>
                                <NavLink
                                    activeClassName={classes.activeLink}
                                    className={classes.link}
                                    to={plan ? `/dashboard/${myPlan ? "my" : "all"}/${plan._id}/stages` : ""}
                                >
                                    <Typography variant="button">
                                        <Translation>{t => t("dashboard.plan.stages")}</Translation>
                                    </Typography>
                                </NavLink>
                                <NavLink
                                    activeClassName={classes.activeLink}
                                    className={classes.link}
                                    to={plan ? `/dashboard/${myPlan ? "my" : "all"}/${plan._id}/resources` : ""}
                                >
                                    <Typography variant="button">
                                        <Translation>{t => t("dashboard.plan.resources")}</Translation>
                                    </Typography>
                                </NavLink>
                                <NavLink
                                    activeClassName={classes.activeLink}
                                    className={classes.link}
                                    to={plan ? `/dashboard/${myPlan ? "my" : "all"}/${plan._id}/reviews` : ""}
                                >
                                    <Typography variant="button">
                                        <Translation>{t => t("dashboard.plan.reviews")}</Translation>
                                    </Typography>
                                </NavLink>
                                {myPlan ? null : (
                                    <Button
                                        className={classes.button}
                                        disabled={isAuthor}
                                        onClick={this.handleCopyPlan}
                                    >
                                        {isAuthor ? (
                                            <Translation>{t => t("dashboard.plan.alreadyYours")}</Translation>
                                        ) : (
                                            <Translation>{t => t("dashboard.plan.copyPlan")}</Translation>
                                        )}
                                        <CopyIcon className={classes.rightIcon} />
                                    </Button>
                                )}
                                {myPlan ? (
                                    <Button
                                        className={classes.button}
                                        disabled={plan && (plan.isPublished || plan.author._id !== user._id)}
                                        onClick={this.handlePublishPlan}
                                    >
                                        {plan ? (
                                            plan.author._id === user._id ? (
                                                plan.isPublished ? (
                                                    <Translation>
                                                        {t => t("dashboard.plan.alreadyPublished")}
                                                    </Translation>
                                                ) : (
                                                    <Translation>{t => t("dashboard.plan.publishPlan")}</Translation>
                                                )
                                            ) : (
                                                <Translation>{t => t("dashboard.plan.notAuthor")}</Translation>
                                            )
                                        ) : (
                                            ""
                                        )}
                                        <PublishIcon className={classes.rightIcon} />
                                    </Button>
                                ) : null}
                                {myPlan ? (
                                    <Button className={classes.button} onClick={this.handleDeletePlan}>
                                        <Translation>{t => t("delete")}</Translation>
                                        <DeleteIcon className={classes.rightIcon} />
                                    </Button>
                                ) : null}
                            </Grid>
                        </Grid>
                    </AppBar>
                    {plan ? (
                        <Switch>
                            <Route
                                exact
                                path={`/dashboard/${myPlan ? "my" : "all"}/:id/info`}
                                render={props => <BasicInformationView myPlan={myPlan} />}
                            />
                            <Route
                                exact
                                path={`/dashboard/${myPlan ? "my" : "all"}/:id/stages`}
                                render={props => <StagesView myPlan={myPlan} plan={plan} />}
                            />
                            <Route
                                exact
                                path={`/dashboard/${myPlan ? "my" : "all"}/:id/resources`}
                                render={props => <ResourcesView myPlan={myPlan} plan={plan} />}
                            />
                            <Route
                                exact
                                path={`/dashboard/${myPlan ? "my" : "all"}/:id/reviews`}
                                render={props => <ReviewsView myPlan={myPlan} />}
                            />
                            <Redirect to={`/dashboard/${myPlan ? "my" : "all"}/${plan._id}/info`} />
                        </Switch>
                    ) : null}
                </div>
            </Container>
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
    )(withStyles(styles)(PlanView))
);
