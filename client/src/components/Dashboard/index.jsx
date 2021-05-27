// modules
import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
// components
import { CssBaseline } from "@material-ui/core";
import AllListIcon from "@material-ui/icons/List";
import ChartIcon from "@material-ui/icons/InsertChart";
import CreateIcon from "@material-ui/icons/Create";
import FavoriteIcon from "@material-ui/icons/Favorite";
import HomeIcon from "@material-ui/icons/Home";
import MyListIcon from "@material-ui/icons/ViewList";
import PersonIcon from "@material-ui/icons/Person";
import { Translation } from "react-i18next";
import CustomAppBar from "../Navigation/CustomAppBar";
import CustomDrawer from "../Navigation//CustomDrawer";
import Analytics from "../Analytics";
import CreatePlan from "./CreatePlan";
import FavoriteStages from "./FavoriteStages";
import MainPage from "./MainPage";
import PlansView from "./PlansView";
import PlanView from "./PlanView";
import Profile from "../Profile";
// redux
// assets
// styles

const drawerWidth = 240;

const drawerItems = [
    {
        to: "/dashboard",
        name: <Translation>{t => t("home")}</Translation>,
        icon: <HomeIcon />
    },
    {
        to: "/dashboard/profile",
        name: <Translation>{t => t("profile")}</Translation>,
        icon: <PersonIcon />
    },
    {
        to: "/dashboard/create",
        name: <Translation>{t => t("dashboard.createPlan")}</Translation>,
        icon: <CreateIcon />
    },
    {
        to: "/dashboard/all",
        name: <Translation>{t => t("dashboard.allPlans")}</Translation>,
        icon: <AllListIcon />
    },
    {
        to: "/dashboard/my",
        name: <Translation>{t => t("dashboard.myPlans")}</Translation>,
        icon: <MyListIcon />
    },
    {
        to: "/dashboard/favorites",
        name: <Translation>{t => t("dashboard.favorites")}</Translation>,
        icon: <FavoriteIcon />
    },
    {
        to: "/dashboard/analytics",
        name: <Translation>{t => t("analytics")}</Translation>,
        icon: <ChartIcon />
    }
];

const styles = theme => ({
    root: {
        display: "flex"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: -drawerWidth
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        ...theme.mixins.toolbar,
        justifyContent: "flex-end"
    }
});

class Dashboard extends Component {
    state = {
        anchorEl: null,
        openDrawer: false
    };

    handleDrawerOpen = () => {
        this.setState({ openDrawer: true });
    };

    handleDrawerClose = () => {
        this.setState({ openDrawer: false });
    };

    handleProfile = () => {
        // переход на страницу профиля
        this.props.history.push("/dashboard/profile");
        // закрыть меню
        this.handleUserMenuClose();
    };

    handleUserMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleUserMenuClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl, openDrawer } = this.state;
        const { classes, user } = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <CustomDrawer items={drawerItems} openDrawer={openDrawer} handleDrawerClose={this.handleDrawerClose} />
                <CustomAppBar
                    anchorEl={anchorEl}
                    openDrawer={openDrawer}
                    title="appbar.title.user"
                    menuText={user.email}
                    handleDrawerOpen={this.handleDrawerOpen}
                    handleProfile={this.handleProfile}
                    handleUserMenu={this.handleUserMenu}
                    handleUserMenuClose={this.handleUserMenuClose}
                />
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: openDrawer
                    })}
                >
                    <div className={classes.drawerHeader} />
                    <Switch>
                        <Route exact path="/dashboard" component={MainPage} />
                        <Route exact path="/dashboard/create" component={CreatePlan} />
                        <Route exact path="/dashboard/all" render={props => <PlansView />} />
                        <Route path="/dashboard/all/:id" render={props => <PlanView />} />
                        <Route exact path="/dashboard/my" render={props => <PlansView myPlans />} />
                        <Route path="/dashboard/my/:id" render={props => <PlanView myPlan />} />
                        <Route exact path="/dashboard/favorites" component={FavoriteStages} />
                        <Route exact path="/dashboard/profile" component={Profile} />
                        <Route exact path="/dashboard/analytics" component={Analytics} />
                        <Redirect to="/dashboard" />
                    </Switch>
                </main>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Dashboard));
