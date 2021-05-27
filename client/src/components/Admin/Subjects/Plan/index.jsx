// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import {
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Grid,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Snackbar,
    SnackbarContent,
    TextField,
    Typography
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import NewSection from "../NewSection";
import Section from "../Section";
// redux
// assets
import { subjectsRoutes } from "../../../../assets/routes";
import { allClasses, languages } from "../../../../assets/utils/subjects";
// styles
import { green } from "@material-ui/core/colors";

const styles = theme => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(2)
    },
    progress: {
        margin: theme.spacing(2)
    },
    innerPaper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2, 0, 2)
    },
    item: {
        margin: theme.spacing(1, 0)
    },
    newSection: {
        margin: theme.spacing(2, 0)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
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
        margin: theme.spacing(1, 1, 1, 0)
    }
});

class Plan extends Component {
    state = {
        loading: false,
        plan: {},
        newSection: null,
        section: null,
        showSnackbar: false,
        subject: ""
    };

    componentDidMount() {
        const id = this.props.match.params.id;
        const pid = this.props.match.params.pid;
        this.getSubjectPlan(id, pid);
    }

    getSubjectPlan = (id, pid) => {
        this.setState({ loading: true });
        axios
            .get(subjectsRoutes.getSubjectPlan(id, pid))
            .then(response => {
                this.setState({ loading: false, plan: response.data.plan, subject: response.data.subject });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleEditPlan = () => {
        const id = this.props.match.params.id;
        const { plan } = this.state;

        if (!plan._id) {
            alert("План не определен");
            return;
        }

        axios
            .post(subjectsRoutes.editSubjectPlan(id, plan._id), { plan: plan })
            .then(() => {
                // show snackbar
                this.handleShowSnackbar();
                // hide snackbar after 3 seconds
                setTimeout(this.handleHideSnackbar, 3000);
            })
            .catch(err => {
                console.error(err);
            });
    };

    handleDeletePlan = () => {
        const id = this.props.match.params.id;
        const { plan } = this.state;

        if (!plan._id) {
            alert("План не определен");
            return;
        }

        const r = window.confirm("Удалить этот план?");
        if (r) {
            axios
                .delete(subjectsRoutes.deleteSubjectPlan(id, plan._id))
                .then(() => {
                    // redirect to subject page
                    this.props.history.push(`/admin/subjects/${id}`);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    handleOpenNewSection = () => {
        this.setState({
            newSection: (
                <NewSection
                    handleAddSection={this.handleAddSection}
                    handleCloseNewSection={this.handleCloseNewSection}
                />
            )
        });
    };

    handleCloseNewSection = () => {
        this.setState({
            newSection: null
        });
    };

    handleAddSection = section => {
        if (!section.name || !section.quarter) {
            alert("Не все поля заполнены");
            return;
        }

        const r = window.confirm("Создать новый раздел плана?");
        if (r) {
            // add new section
            const sections = [...this.state.plan.sections, section];
            // set state
            this.setState(
                prevState => ({
                    plan: {
                        ...prevState.plan,
                        sections: sections
                    }
                }),
                () => {
                    // edit
                    this.handleEditPlan();
                    // close new section
                    this.handleCloseNewSection();
                }
            );
        }
    };

    handleOpenSection = (section, index) => {
        this.setState({
            section: (
                <Section
                    section={section}
                    index={index}
                    handleCloseSection={this.handleCloseSection}
                    handleSaveSection={this.handleSaveSection}
                    handleDeleteSection={this.handleDeleteSection}
                />
            )
        });
    };

    handleCloseSection = () => {
        this.setState({ section: null });
    };

    handleSaveSection = (section, index) => {
        if (!section.name || !section.quarter) {
            alert("Не все поля заполнены");
            return;
        }

        // replace section
        const sections = [...this.state.plan.sections];
        sections[index] = section;
        // set state
        this.setState(
            prevState => ({
                plan: {
                    ...prevState.plan,
                    sections: sections
                }
            }),
            () => this.handleEditPlan()
        );
    };

    handleDeleteSection = index => {
        const r = window.confirm("Удалить раздел плана?");
        if (r) {
            // delete section
            const sections = [...this.state.plan.sections];
            sections.splice(index, 1);
            // set state
            this.setState(
                prevState => ({
                    plan: {
                        ...prevState.plan,
                        sections: sections
                    }
                }),
                () => {
                    // close section
                    this.handleCloseSection();
                    // edit
                    this.handleEditPlan();
                }
            );
        }
    };

    handleShowSnackbar = () => {
        this.setState({ showSnackbar: true });
    };

    handleHideSnackbar = () => {
        this.setState({ showSnackbar: false });
    };

    handleChange = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            plan: {
                ...prevState.plan,
                [name]: value
            }
        }));
    };

    render() {
        const { loading, plan, newSection, section, showSnackbar, subject } = this.state;
        const { classes } = this.props;

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <Container component="main">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography paragraph>Поурочный план по предмету: {subject ? subject : ""}</Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        variant="filled"
                        inputProps={{
                            readOnly: true
                        }}
                        id="filled-plan-language"
                        label="Язык"
                        name="language"
                        value={languages[plan.language]}
                    />

                    <TextField
                        fullWidth
                        select
                        margin="normal"
                        variant="filled"
                        id="filled-plan-targetClass"
                        label="Класс обучения"
                        name="targetClass"
                        type="number"
                        value={plan.targetClass || ""}
                        onChange={this.handleChange}
                    >
                        {allClasses.map(targetClass => (
                            <MenuItem key={`target-class-${targetClass}`} value={targetClass}>
                                {targetClass}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        margin="normal"
                        variant="filled"
                        id="filled-plan-hoursPerWeek"
                        label="Часов в неделю"
                        name="hoursPerWeek"
                        type="number"
                        value={plan.hoursPerWeek || ""}
                        inputProps={{
                            min: 1,
                            step: 1
                        }}
                        onChange={this.handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        variant="filled"
                        id="filled-plan-hoursInYear"
                        label="Часов в год"
                        name="hoursInYear"
                        type="number"
                        value={plan.hoursInYear || ""}
                        inputProps={{
                            min: 1,
                            step: 1
                        }}
                        onChange={this.handleChange}
                    />

                    <Paper className={classes.innerPaper}>
                        <Typography paragraph>Разделы плана</Typography>
                        <List aria-label="Plan sections list">
                            {plan.sections && plan.sections.length
                                ? plan.sections.map((section, index) => (
                                      <Paper className={classes.item} key={`admin-subject-plan-section-${index}`}>
                                          <ListItem button onClick={() => this.handleOpenSection(section, index)}>
                                              <ListItemText
                                                  primary={`${index + 1}) ${section.name}, ${section.quarter} четверть`}
                                              />
                                          </ListItem>
                                      </Paper>
                                  ))
                                : []}
                        </List>

                        <div>{section}</div>

                        <div className={classes.newSection}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={this.handleOpenNewSection}
                            >
                                Создать новый раздел
                                <AddIcon className={classes.rightIcon} />
                            </Button>
                            {newSection}
                        </div>
                    </Paper>

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
                                    Поурочный план отредактирован
                                </span>
                            }
                        />
                    </Snackbar>

                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.handleEditPlan}
                    >
                        Редактировать план
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={this.handleDeletePlan}
                    >
                        Удалить план
                    </Button>
                </div>
            </Container>
        );
    }
}

export default withStyles(styles)(Plan);
