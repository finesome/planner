// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import {
    Button,
    Checkbox,
    CircularProgress,
    Container,
    CssBaseline,
    FormControlLabel,
    FormGroup,
    Grid,
    Snackbar,
    SnackbarContent
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Translation } from "react-i18next";
// redux
// assets
import { configRoutes } from "../../../assets/routes";
// styles
import { green } from "@material-ui/core/colors";

const styles = theme => ({
    progress: {
        margin: theme.spacing(2)
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(2)
    },
    snackbar: {
        backgroundColor: green[600]
    },
    snackbarMessage: {
        display: "flex",
        alignItems: "center"
    },
    snackbarIcon: {
        marginRight: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1, 0)
    }
});

class Profile extends Component {
    state = {
	allowRegistration: true,
        loading: false,
        showSnackbar: false
    };

    componentDidMount() {
        // запрос конфигурации для регистрации
        this.getConfiguration("allowRegistration");
    }

    getConfiguration = name => {
        this.setState({ loading: true });
        axios
            .get(configRoutes.getConfig(name))
            .then(response => {
                this.setState({ loading: false, [name]: response.data.value });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    setConfiguration = (name, value) => {
        this.setState({ loading: true });
        axios
            .post(configRoutes.setConfig(), { name: name, value: value })
            .then(response => {
		this.setState({ loading: false });
		// show snackbar
		this.handleShowSnackbar();
		// hide after 5 seconds
		setTimeout(this.handleHideSnackbar, 5000);
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleChange = e => {
        const { name, checked } = e.target;

        this.setState({
            [name]: checked
        });
    };

    handleShowSnackbar = () => {
        this.setState({ showSnackbar: true });
    };

    handleHideSnackbar = () => {
        this.setState({ showSnackbar: false });
    };

    render() {
        const { allowRegistration, loading, showSnackbar } = this.state;
        const { classes } = this.props;

        let configsComponent;
        configsComponent = (
            <div>
		<FormGroup row>
			<FormControlLabel
        		    control={
          			<Checkbox
			            color="primary"
            			    checked={allowRegistration}
				    name="allowRegistration"
			            onChange={this.handleChange}
			        />
		            }
			    label={<Translation>{t => t("admin.allowRegistration")}</Translation>}
			 />
		</FormGroup>

                <Button className={classes.button} onClick={() => this.setConfiguration("allowRegistration", allowRegistration)}>
                    <Translation>{t => t("save")}</Translation>
                </Button>

                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    open={showSnackbar}
                    onClose={this.handleHideSnackbar}
                >
                    <SnackbarContent
                        aria-describedby="client-snackbar"
                        className={classes.snackbar}
                        message={
                            <span className={classes.snackbarMessage} id="client-snackbar">
                                <CheckCircleIcon className={classes.snackbarIcon} />
                                <Translation>{t => t("admin.savedChanges")}</Translation>
                            </span>
                        }
                    />
                </Snackbar>
            </div>
        );

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <Container component="main">
                <CssBaseline />
                <div className={classes.paper}>{configsComponent}</div>
            </Container>
        );
    }
}

export default withStyles(styles)(Profile);
