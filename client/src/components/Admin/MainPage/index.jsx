// modules
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// components
import { Button, CssBaseline, Container } from "@material-ui/core";
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
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2)
    },
    link: {
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
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleClick("/admin/analytics")}
                >
                    <Translation>{t => t("analytics")}</Translation>
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleClick("/admin/users")}
                >
                    <Translation>{t => t("admin.users")}</Translation>
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleClick("/admin/schools")}
                >
                    <Translation>{t => t("admin.schools")}</Translation>
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleClick("/admin/subjects")}
                >
                    <Translation>{t => t("admin.subjects")}</Translation>
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleClick("/admin/config")}
                >
                    <Translation>{t => t("admin.config")}</Translation>
                </Button>
            </div>
        </Container>
    );
}

export default MainPage;
