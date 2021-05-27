// modules
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// components
import { Button, CssBaseline, Container } from "@material-ui/core";
import AllListIcon from "@material-ui/icons/List";
import ChartIcon from "@material-ui/icons/InsertChart";
import CreateIcon from "@material-ui/icons/Create";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MyListIcon from "@material-ui/icons/ViewList";
import PersonIcon from "@material-ui/icons/Person";
import { Translation } from "react-i18next";
// redux
// assets
// styles

const useStyles = makeStyles(theme => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(2)
    },
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(2)
    },
    leftIcon: {
        marginRight: theme.spacing(1)
    },
    link: {
        display: "block",
        width: "100%",
        height: "100%",
        color: "white",
        textDecoration: "none"
    }
}));

function MainPage(props) {
    const classes = useStyles();

    function handleClick(link) {
        props.history.push(link);
    }

    return (
        <Container component="main">
            <CssBaseline />
            <div className={classes.paper}>
                <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    onClick={() => handleClick("/dashboard/profile")}
                >
                    <PersonIcon className={classes.leftIcon} />
                    <Translation>{t => t("profile")}</Translation>
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    onClick={() => handleClick("/dashboard/create")}
                >
                    <CreateIcon className={classes.leftIcon} />
                    <Translation>{t => t("dashboard.createPlan")}</Translation>
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    onClick={() => handleClick("/dashboard/all")}
                >
                    <AllListIcon className={classes.leftIcon} />
                    <Translation>{t => t("dashboard.allPlans")}</Translation>
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    onClick={() => handleClick("/dashboard/my")}
                >
                    <MyListIcon className={classes.leftIcon} />
                    <Translation>{t => t("dashboard.myPlans")}</Translation>
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    onClick={() => handleClick("/dashboard/favorites")}
                >
                    <FavoriteIcon className={classes.leftIcon} />
                    <Translation>{t => t("dashboard.favorites")}</Translation>
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    onClick={() => handleClick("/dashboard/analytics")}
                >
                    <ChartIcon className={classes.leftIcon} />
                    <Translation>{t => t("analytics")}</Translation>
                </Button>
            </div>
        </Container>
    );
}

export default MainPage;
