// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { uniq } from "lodash";
// components
import {
    Button,
    Chip,
    CssBaseline,
    Container,
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import ReactQuill from "react-quill";
import { Translation } from "react-i18next";
// redux
// assets
import { plansRoutes, schoolsRoutes, subjectsRoutes } from "../../../assets/routes";
import { languages } from "../../../assets/utils/subjects";
// styles
import "react-quill/dist/quill.snow.css";

const compareTeachers = (a, b) => {
    const aLastName = a.lastName;
    const bLastName = b.lastName;

    if (aLastName < bLastName) {
	return -1;
    } else if (aLastName > bLastName) {
	return 1;
    } else {
	return 0;
    }
}

const styles = theme => ({
    paper: {
        display: "flex",
        flexDirection: "column"
    },
    formControl: {
        margin: theme.spacing(1, 0),
        minWidth: 120
    },
    chips: {
        display: "flex",
        flexWrap: "wrap"
    },
    chip: {
        margin: 2
    },
    editorPaper: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(2)
    },
    button: {
        margin: theme.spacing(1, 0, 1)
    }
});

class CreatePlan extends Component {
    state = {
        loading: false,
        subjects: [],
        teachers: [],
        plan: {
            coAuthors: [],
            lessonDate: {
                start: null,
                end: null
            },
            subject: "",
            language: "",
            targetClass: "",
            classLetters: "",
            quarter: "",
            section: "",
            topic: "",
            customTopic: "",
            learningObjectives: [],
            lessonObjectives: "",
            evaluationCriteria: "",
            languageObjectives: "",
            valuesTaught:
                "Привитие ценности уважения, сотрудничества и открытости осуществляется через групповую работу и коллективное обсуждение; эти виды деятельности направлены на развитие у учащихся качеств доброжелательной и коммуникабельной личности, умеющей мыслить творчески и критически.",
            interdisciplinaryConnections: "",
            preliminaryKnowledge: ""
        }
    };

    componentDidMount() {
        // get subjects and corresponding programs
        this.getSubjects();
        // get teachers
        this.getTeachers();
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

    getTeachers = () => {
        this.setState({ loading: true });
        axios
            .get(schoolsRoutes.getTeachers())
            .then(response => {
                // убрать текущего пользователя из списка кандидатов
                const teachers = response.data.filter(x => x._id !== this.props.user._id).sort(compareTeachers);
                this.setState({ loading: false, teachers: teachers });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleChange = e => {
        const { name, value } = e.target;
        const { plan, subjects } = this.state;

        if (name === "subject" && plan.subject !== value) {
            this.setState(prevState => ({
                plan: {
                    ...prevState.plan,
                    [name]: value,
                    language: "",
                    targetClass: "",
                    quarter: "",
                    section: "",
                    topic: "",
                    learningObjectives: []
                }
            }));
        } else if (
            (name === "language" && plan.language !== value) ||
            (name === "targetClass" && plan.targetClass !== value)
        ) {
            this.setState(prevState => ({
                plan: {
                    ...prevState.plan,
                    [name]: value,
                    quarter: "",
                    section: "",
                    topic: "",
                    learningObjectives: []
                }
            }));
        } else if (name === "quarter" && plan.quarters !== value) {
            this.setState(prevState => ({
                plan: {
                    ...prevState.plan,
                    [name]: value,
                    section: "",
                    topic: "",
                    learningObjectives: []
                }
            }));
        } else if (name === "section" && plan.section !== value) {
            this.setState(prevState => ({
                plan: {
                    ...prevState.plan,
                    [name]: value,
                    topic: "",
                    learningObjectives: []
                }
            }));
        } else if (name === "topic" && plan.topic !== value) {
            const learningObjectives = [
                ...subjects
                    .find(x => x._id === plan.subject)
                    .plans.find(x => x.targetClass === Number(plan.targetClass) && x.language === plan.language)
                    .sections.filter(x => x.quarter === Number(plan.quarter))
                    .find(x => x.name === plan.section)
                    .topics.find(x => x.name === value).learningObjectives
            ];
            this.setState(prevState => ({
                plan: {
                    ...prevState.plan,
                    [name]: value,
                    learningObjectives: learningObjectives
                }
            }));
        } else {
            this.setState(prevState => ({
                plan: {
                    ...prevState.plan,
                    [name]: value
                }
            }));
        }
    };

    handleDelete = value => {
        const coAuthors = this.state.plan.coAuthors.filter(x => x !== value);

        this.setState(prevState => ({
            plan: {
                ...prevState.plan,
                coAuthors: coAuthors
            }
        }));
    };

    handleEvaluationCriteriaChange = value => {
        this.setState(prevState => ({
            plan: {
                ...prevState.plan,
                evaluationCriteria: value
            }
        }));
    };

    handleLanguageObjectivesChange = value => {
        this.setState(prevState => ({
            plan: {
                ...prevState.plan,
                languageObjectives: value
            }
        }));
    };

    handleStartDateChange = date => {
        let { end } = this.state.plan.lessonDate;

        this.setState(prevState => ({
            plan: {
                ...prevState.plan,
                lessonDate: {
                    start: date,
                    end: end ? end : date
                }
            }
        }));
    };

    handleEndDateChange = date => {
        this.setState(prevState => ({
            plan: {
                ...prevState.plan,
                lessonDate: {
                    ...prevState.plan.lessonDate,
                    end: date
                }
            }
        }));
    };

    handleCreatePlan = e => {
        e.preventDefault();

	const { plan, subjects } = this.state;
        if (
            !plan.lessonDate.start ||
            !plan.lessonDate.end ||
            !plan.subject ||
            !plan.language ||
            !plan.targetClass ||
            !plan.quarter ||
            !plan.section ||
            !plan.topic ||
            !plan.learningObjectives.length ||
            !plan.lessonObjectives
        ) {
            alert("Не все поля заполнены");
            return;
        }

	let newPlan = { ...plan };	
	newPlan.subject = subjects.find(x => x._id === plan.subject).name;

        const r = window.confirm("Создать план урока?");
        if (r) {
            axios
                .post(plansRoutes.createPlan(), { plan: newPlan })
                .then(() => {
                    // redirect to my plans
                    this.props.history.push("/dashboard/my");
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    render() {
        const { plan, subjects, teachers } = this.state;
        const { classes } = this.props;

        return (
            <Container component="main">
                <CssBaseline />
                <form className={classes.paper} onSubmit={this.handleCreatePlan}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="filled-co-authors">
                            <Translation>{t => t("dashboard.plan.coAuthors")}</Translation>
                        </InputLabel>
                        <Select
                            multiple
                            name="coAuthors"
                            value={plan.coAuthors}
                            onChange={this.handleChange}
                            input={<Input id="filled-co-authors" />}
                            renderValue={selected => (
                                <div className={classes.chips}>
                                    {selected.map((value, index) => (
                                        <Chip
                                            variant="outlined"
                                            className={classes.chip}
                                            key={`dashboard-plan-co-author-${index}`}
                                            label={`${teachers.find(x => x._id === value).lastName} ${
                                                teachers.find(x => x._id === value).firstName
                                            } ${teachers.find(x => x._id === value).patronymic}`}
                                            onDelete={() => this.handleDelete(value)}
                                        />
                                    ))}
                                </div>
                            )}
                        >
                            {teachers.map((teacher, index) => (
                                <MenuItem key={`dashboard-plan-teacher-${index}`} value={teacher._id}>
                                    {`${teacher.lastName} ${teacher.firstName} ${teacher.patronymic} (г. ${
                                        teacher.school.city
                                    }, район ${teacher.school.district}, ${teacher.school.name})`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            clearable
                            format="dd/MM/yyyy"
                            label={<Translation>{t => t("dashboard.plan.lessonStart")}</Translation>}
                            value={plan.lessonDate.start}
                            onChange={this.handleStartDateChange}
                        />
                    </MuiPickersUtilsProvider>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            clearable
                            format="dd/MM/yyyy"
                            label={<Translation>{t => t("dashboard.plan.lessonEnd")}</Translation>}
                            minDate={plan.lessonDate.start}
                            value={plan.lessonDate.end}
                            onChange={this.handleEndDateChange}
                        />
                    </MuiPickersUtilsProvider>

                    <TextField
                        fullWidth
                        required
                        select
                        margin="normal"
                        variant="filled"
                        id="filled-subject"
                        label={<Translation>{t => t("dashboard.plan.subject")}</Translation>}
                        name="subject"
                        value={plan.subject}
                        onChange={this.handleChange}
                    >
                        {subjects && subjects.length
                            ? subjects.map((item, index) => (
                                  <MenuItem key={`dashboard-create-plan-subject-item-${index}`} value={item._id}>
            			      {`${subjects.find(x => x._id === item._id).name} (${languages[subjects.find(x => x._id === item._id).language]})`}
                                  </MenuItem>
                              ))
                            : []}
                    </TextField>

                    <TextField
                        fullWidth
                        required
                        select
                        margin="normal"
                        variant="filled"
                        id="filled-target-class"
                        label={<Translation>{t => t("dashboard.plan.class")}</Translation>}
                        name="targetClass"
                        value={plan.targetClass}
                        onChange={this.handleChange}
                    >
                        {plan.subject
                            ? subjects
                                  .find(x => x._id === plan.subject)
                                  .plans.map((item, index) => (
                                      <MenuItem
                                          key={`dashboard-create-plan-target-class-item-${index}`}
                                          value={Number(item.targetClass)}
                                      >
                                          {`${item.targetClass} класс`}
                                      </MenuItem>
                                  ))
                            : []}
                    </TextField>

                    <TextField
                        id="filled-class-letters-input"
                        label={<Translation>{t => t("dashboard.plan.liters")}</Translation>}
                        name="classLetters"
                        value={plan.classLetters}
                        margin="normal"
                        variant="filled"
                        onChange={this.handleChange}
                    />

                    <TextField
                        fullWidth
                        required
                        select
                        margin="normal"
                        variant="filled"
                        id="filled-language"
                        label={<Translation>{t => t("dashboard.plan.language")}</Translation>}
                        name="language"
                        value={plan.language}
                        onChange={this.handleChange}
                    >
                        {plan.subject && plan.targetClass
                            ? subjects
                                  .find(x => x._id === plan.subject)
                                  .plans.filter(x => x.targetClass === Number(plan.targetClass))
                                  .map((item, index) => (
                                      <MenuItem
                                          key={`dashboard-create-plan-language-item-${index}`}
                                          value={item.language}
                                      >
                                          {`${languages[item.language]} язык`}
                                      </MenuItem>
                                  ))
                            : []}
                    </TextField>

                    <TextField
                        fullWidth
                        required
                        select
                        margin="normal"
                        variant="filled"
                        id="filled-quarter"
                        label={<Translation>{t => t("dashboard.plan.quarter")}</Translation>}
                        name="quarter"
                        value={plan.quarter}
                        onChange={this.handleChange}
                    >
                        {plan.subject && plan.targetClass && plan.language
                            ? uniq(
                                  subjects
                                      .find(x => x._id === plan.subject)
                                      .plans.find(
                                          x =>
                                              x.targetClass === Number(plan.targetClass) && x.language === plan.language
                                      )
                                      .sections.map(section => section.quarter)
                              ).map((item, index) => (
                                  <MenuItem key={`dashboard-create-plan-quarter-item-${index}`} value={Number(item)}>
                                      {`${item} четверть`}
                                  </MenuItem>
                              ))
                            : []}
                    </TextField>

                    <TextField
                        fullWidth
                        required
                        select
                        margin="normal"
                        variant="filled"
                        id="filled-section"
                        label={<Translation>{t => t("dashboard.plan.section")}</Translation>}
                        name="section"
                        value={plan.section}
                        onChange={this.handleChange}
                    >
                        {plan.subject && plan.targetClass && plan.language && plan.quarter
                            ? subjects
                                  .find(x => x._id === plan.subject)
                                  .plans.find(
                                      x => x.targetClass === Number(plan.targetClass) && x.language === plan.language
                                  )
                                  .sections.filter(section => section.quarter === Number(plan.quarter))
                                  .map((item, index) => (
                                      <MenuItem key={`dashboard-create-plan-section-item-${index}`} value={item.name}>
                                          {item.name}
                                      </MenuItem>
                                  ))
                            : []}
                    </TextField>

                    <TextField
                        fullWidth
                        required
                        select
                        margin="normal"
                        variant="filled"
                        id="filled-topic"
                        label={<Translation>{t => t("dashboard.plan.topic")}</Translation>}
                        name="topic"
                        value={plan.topic}
                        onChange={this.handleChange}
                    >
                        {plan.subject && plan.targetClass && plan.language && plan.quarter && plan.section
                            ? subjects
                                  .find(x => x._id === plan.subject)
                                  .plans.find(
                                      x => x.targetClass === Number(plan.targetClass) && x.language === plan.language
                                  )
                                  .sections.filter(section => section.quarter === Number(plan.quarter))
                                  .find(x => x.name === plan.section)
                                  .topics.map((item, index) => (
                                      <MenuItem key={`dashboard-create-plan-topic-item-${index}`} value={item.name}>
                                          {item.name}
                                      </MenuItem>
                                  ))
                            : []}
                    </TextField>

                    <TextField
                        multiline
                        id="filled-custom-topic-input"
                        label={<Translation>{t => t("dashboard.plan.customTopic")}</Translation>}
                        name="customTopic"
                        value={plan.customTopic}
                        margin="normal"
                        variant="filled"
                        onChange={this.handleChange}
                    />

                    <TextField
                        multiline
			required
                        inputProps={{
                            readOnly: true,
                            rows: 3
                        }}
                        id="filled-learning-objectives-input"
                        label={<Translation>{t => t("dashboard.plan.learningObjectives")}</Translation>}
                        name="learningObjectives"
                        value={
                            plan.learningObjectives.length
                                ? plan.learningObjectives.map(item => `${item.number}. ${item.objective}`)
                                : ""
                        }
                        margin="normal"
                        variant="filled"
                    />

                    <TextField
                        multiline
			required
                        inputProps={{
                            rows: 3
                        }}
                        id="filled-lesson-objectives-input"
                        label={<Translation>{t => t("dashboard.plan.lessonObjectives")}</Translation>}
                        name="lessonObjectives"
                        value={plan.lessonObjectives}
                        margin="normal"
                        variant="filled"
                        onChange={this.handleChange}
                    />

                    <Paper className={classes.editorPaper}>
                        <Typography paragraph>
                            <Translation>{t => t("dashboard.plan.criteria")}</Translation>
                        </Typography>
                        <ReactQuill
                            value={this.state.plan.evaluationCriteria}
                            onChange={this.handleEvaluationCriteriaChange}
                        />
                    </Paper>

                    <Paper className={classes.editorPaper}>
                        <Typography paragraph>
                            <Translation>{t => t("dashboard.plan.languageObjectives")}</Translation>
                        </Typography>
                        <ReactQuill
                            value={this.state.plan.languageObjectives}
                            onChange={this.handleLanguageObjectivesChange}
                        />
                    </Paper>

                    <TextField
                        multiline
                        inputProps={{
                            rows: 3
                        }}
                        id="filled-values-taught-input"
                        label={<Translation>{t => t("dashboard.plan.values")}</Translation>}
                        name="valuesTaught"
                        value={plan.valuesTaught}
                        margin="normal"
                        variant="filled"
                        onChange={this.handleChange}
                    />

                    <TextField
                        multiline
                        inputProps={{
                            rows: 3
                        }}
                        id="filled-interdisciplinary-connections-input"
                        label={<Translation>{t => t("dashboard.plan.interdisciplinary")}</Translation>}
                        name="interdisciplinaryConnections"
                        value={plan.interdisciplinaryConnections}
                        margin="normal"
                        variant="filled"
                        onChange={this.handleChange}
                    />

                    <TextField
                        multiline
                        inputProps={{
                            rows: 3
                        }}
                        id="filled-preliminary-knowledge-input"
                        label={<Translation>{t => t("dashboard.plan.preliminary")}</Translation>}
                        name="preliminaryKnowledge"
                        value={plan.preliminaryKnowledge}
                        margin="normal"
                        variant="filled"
                        onChange={this.handleChange}
                    />

                    <Button className={classes.button} type="submit" color="primary" variant="contained">
                        <Translation>{t => t("dashboard.plan.createPlan")}</Translation>
                    </Button>
                </form>
            </Container>
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
)(withStyles(styles)(CreatePlan));
