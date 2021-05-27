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
    Paper
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
// redux
// assets
import { subjectsRoutes } from "../../../assets/routes";
import { languages } from "../../../assets/utils/subjects";
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

class Subjects extends Component {
    state = {
        loading: false,
        subjects: []
    };

    componentDidMount() {
        this.getSubjects();
    }

    getSubjects = () => {
        this.setState({ loading: true });
        axios
            .get(subjectsRoutes.getSubjects())
            .then(response => {
                this.setState({ loading: false, subjects: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    render() {
        const { loading, subjects } = this.state;
        const { classes } = this.props;

        let subjectsList = [];
        if (subjects.length !== 0) {
            for (let i = 0; i < subjects.length; i++) {
                let subject = subjects[i];
                subjectsList.push(
                    <Link
                        className={classes.link}
                        key={`admin-subjects-item-${i}`}
                        to={`/admin/subjects/${subject._id}`}
                    >
                        <Paper className={classes.item}>
                            <ListItem button>
                                <ListItemText
                                    primary={`${i + 1}. ${subject.name} (${languages[subject.language]} язык обучения)`}
                                />
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
                    <List aria-label="Subjects list">{subjectsList}</List>
                    <Link className={classes.link} to="/admin/subjects/create">
                        <Fab color="primary" aria-label="Add subject" className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
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
)(withStyles(styles)(Subjects));
