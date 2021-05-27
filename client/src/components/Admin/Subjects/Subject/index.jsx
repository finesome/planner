// modules
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import {
    CircularProgress,
    Container,
    CssBaseline,
    Fab,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Close";
import NewPlan from "../NewPlan";
// redux
// assets
import { subjectsRoutes } from "../../../../assets/routes";
import { languages } from "../../../../assets/utils/subjects";
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
    link: {
        color: "black",
        textDecoration: "none"
    },
    item: {
        margin: theme.spacing(1, 0)
    },
    fab: {
        position: "fixed",
        bottom: theme.spacing(4),
        right: theme.spacing(4)
    }
});

class Subject extends Component {
    state = {
        creating: false,
        loading: false,
        subject: {},
        newPlan: null
    };

    componentDidMount() {
        let id = this.props.match.params.id;
        this.getSubject(id);
    }

    getSubject = id => {
        this.setState({ loading: true });
        axios
            .get(subjectsRoutes.getSubject(id))
            .then(response => {
                this.setState({ loading: false, subject: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleStartCreatingPlan = () => {
        const { subject } = this.state;

        this.setState({
            creating: true,
            newPlan: <NewPlan language={subject.language} handleCreatePlan={this.handleCreatePlan} />
        });
    };

    handleCancelCreatingPlan = () => {
        const r = window.confirm("Отменить создание нового плана?");
        if (r) {
            this.setState({ creating: false, newPlan: null });
        }
    };

    handleCreatePlan = plan => {
        if (!plan.language || !plan.targetClass || !plan.hoursPerWeek || !plan.hoursInYear) {
            alert("Не все поля заполнены");
            return;
        }

        const r = window.confirm("Создать новый план?");
        if (r) {
            axios
                .post(subjectsRoutes.createSubjectPlan(this.state.subject._id), { plan: plan })
                .then(() => {
                    // hide new plan
                    this.setState({ creating: false, newPlan: null });
                    // reload subject
                    this.getSubject(this.state.subject._id);
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ loading: false });
                });
        }
    };

    render() {
        const { creating, loading, newPlan, subject } = this.state;
        const { classes } = this.props;

        let plansList = [];
        if (subject && subject.plans && subject.plans.length !== 0) {
            for (let i = 0; i < subject.plans.length; i++) {
                let plan = subject.plans[i];
                plansList.push(
                    <Link
                        className={classes.link}
                        key={`admin-subject-plans-item-${i}`}
                        to={`/admin/subjects/${subject._id}/plans/${plan._id}`}
                    >
                        <Paper className={classes.item}>
                            <ListItem button>
                                <ListItemText primary={`${languages[plan.language]} язык, ${plan.targetClass} класс`} />
                            </ListItem>
                        </Paper>
                    </Link>
                );
            }
        }

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <Container component="main">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography paragraph>
                        Поурочные планы по предмету: {subject && subject.name ? subject.name : ""}
                    </Typography>

                    <List aria-label="Plans list">{plansList}</List>
                    {newPlan}

                    <Fab
                        color="primary"
                        aria-label="Add subject"
                        className={classes.fab}
                        onClick={creating ? this.handleCancelCreatingPlan : this.handleStartCreatingPlan}
                    >
                        {creating ? <CancelIcon /> : <AddIcon />}
                    </Fab>
                </div>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Subject));
