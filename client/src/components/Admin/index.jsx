// modules
import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
// components
import ChartIcon from "@material-ui/icons/InsertChart";
import CssBaseline from "@material-ui/core/CssBaseline";
import CustomAppBar from "../Navigation/CustomAppBar";
import CustomDrawer from "../Navigation//CustomDrawer";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import SchoolIcon from "@material-ui/icons/School";
import SubjectIcon from "@material-ui/icons/Subject";
import SettingsIcon from "@material-ui/icons/SettingsApplications";
import { Translation } from "react-i18next";
import Analytics from "../Analytics";
import Config from "./Config";
import CreateSchool from "./Schools/CreateSchool";
import CreateSubject from "./Subjects/CreateSubject";
import MainPage from "./MainPage";
import Plan from "./Subjects/Plan";
import Profile from "../Profile";
import Schools from "./Schools";
import School from "./Schools/School";
import Subjects from "./Subjects";
import Subject from "./Subjects/Subject";
import Users from "./Users";
import User from "./Users/User";
// redux
// assets
// styles

const drawerWidth = 240;

const drawerItems = [
    {
        to: "/admin",
        name: <Translation>{t => t("home")}</Translation>,
        icon: <HomeIcon />
    },
    {
        to: "/admin/analytics",
        name: <Translation>{t => t("analytics")}</Translation>,
        icon: <ChartIcon />
    },
    {
        to: "/admin/users",
        name: <Translation>{t => t("admin.users")}</Translation>,
        icon: <PersonIcon />
    },
    {
        to: "/admin/schools",
        name: <Translation>{t => t("admin.schools")}</Translation>,
        icon: <SchoolIcon />
    },
    {
        to: "/admin/subjects",
        name: <Translation>{t => t("admin.subjects")}</Translation>,
        icon: <SubjectIcon />
    },
    {
        to: "/admin/config",
        name: <Translation>{t => t("admin.config")}</Translation>,
        icon: <SettingsIcon />
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

class Admin extends Component {
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
        this.props.history.push("/admin/profile");
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
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <CustomDrawer items={drawerItems} openDrawer={openDrawer} handleDrawerClose={this.handleDrawerClose} />
                <CustomAppBar
                    anchorEl={anchorEl}
		    menuText="Администратор"
                    openDrawer={openDrawer}
                    title="appbar.title.admin"
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
                        <Route exact path="/admin" component={MainPage} />
                        <Route exact path="/admin/analytics" component={Analytics} />
                        <Route exact path="/admin/config" component={Config} />
                        <Route exact path="/admin/profile" component={Profile} />
                        <Route exact path="/admin/schools" component={Schools} />
                        <Route exact path="/admin/schools/create" component={CreateSchool} />
                        <Route exact path="/admin/schools/:id" component={School} />
                        <Route exact path="/admin/subjects" component={Subjects} />
                        <Route exact path="/admin/subjects/create" component={CreateSubject} />
                        <Route exact path="/admin/subjects/:id" component={Subject} />
                        <Route exact path="/admin/subjects/:id/plans/:pid" component={Plan} />
                        <Route exact path="/admin/users" component={Users} />
                        <Route exact path="/admin/users/:email" component={User} />
                        <Redirect to="/admin" />
                    </Switch>
                </main>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Admin));
