// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import {
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@material-ui/core";
// redux
// assets
import { subjectsRoutes } from "../../../../assets/routes";
import { allSubjects, languages } from "../../../../assets/utils/subjects";
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
    error: {
        color: "red"
    }
});

class CreateSubject extends Component {
    state = {
        error: false,
        loading: false,
        subject: {
            language: "",
            name: ""
        },
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
                // оставить только предметы, которые не были созданы
                const subjects = {};
                for (let key in allSubjects) {
                    subjects[key] = allSubjects[key].filter(
                        x => !response.data.some(y => key === y.language && x === y.name)
                    );
                }
                this.setState({ loading: false, subjects: subjects });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleChange = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            subject: {
                ...prevState.subject,
                [name]: value
            }
        }));
    };

    handleCreate = e => {
        e.preventDefault();

        const { subject } = this.state;

        if (!subject.language || !subject.name) {
            alert("Язык обучения или название предмета не выбраны");
            return;
        }

        const r = window.confirm("Создать предмет?");
        if (r) {
            this.setState({ loading: true });
            axios
                .post(subjectsRoutes.createSubject(), subject)
                .then(() => {
                    this.setState({ loading: false });
                    // redirect to schools page
                    this.props.history.push("/admin/subjects");
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ error: true, loading: false });
                });
        }
    };

    render() {
        const { error, loading, subject, subjects } = this.state;
        const { classes } = this.props;

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <Container component="main">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography paragraph>Создать новый предмет</Typography>
                    {error ? (
                        <Typography className={classes.error} paragraph>
                            Ошибка при создании предмета
                        </Typography>
                    ) : null}

                    <form className={classes.form} onSubmit={this.handleCreate}>
                        <TextField
                            select
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="language"
                            label="Язык обучения"
                            name="language"
                            value={subject.language}
                            autoFocus
                            onChange={this.handleChange}
                        >
                            {Object.keys(subjects).map(language => (
                                <MenuItem key={language} value={language}>
                                    {languages[language]}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="name"
                            label="Название"
                            name="name"
                            value={subject.name}
                            onChange={this.handleChange}
                        >
                            {subject.language
                                ? subjects[subject.language].map(subject => (
                                      <MenuItem key={subject} value={subject}>
                                          {subject}
                                      </MenuItem>
                                  ))
                                : []}
                        </TextField>
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Сохранить предмет
                        </Button>
                    </form>
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
)(withStyles(styles)(CreateSubject));
