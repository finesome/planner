// modules
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { uniq } from "lodash";
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
import { Translation } from "react-i18next";
import FiltersView from "./FiltersView";
// redux
// assets
import { filterPlans } from "../../../assets/utils/plans";
import { plansRoutes } from "../../../assets/routes";
import { languages } from "../../../assets/utils/subjects";
// styles

const styles = theme => ({
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

const comparePlans = (a, b) => {
    const dateA = new Date(a.createdDate);
    const dateB = new Date(b.createdDate);

    if (dateA > dateB) {
	return -1;
    } else if (dateA < dateB) {
	return 1;
    } else {
	return 0;
    }
}

class PlansView extends Component {
    state = {
        loading: false,
        // фильтры
        filters: {},
        // все планы
        plans: [],
        // отфильтрованные планы (которые отображаются)
        filteredPlans: [],
        // предметы (названия предметов)
        subjects: []
    };

    componentDidMount() {
        // определить путь запроса
        const route = this.props.myPlans ? plansRoutes.getMyPlans() : plansRoutes.getPlans();
        // запрос планов
        this.getPlans(route);
    }

    componentDidUpdate(prevProps) {
        if (this.props.myPlans !== prevProps.myPlans) {
            const route = this.props.myPlans ? plansRoutes.getMyPlans() : plansRoutes.getPlans();
            this.getPlans(route);
        }
    }

    getPlans = route => {
        this.setState({ loading: true });
        axios
            .get(route)
            .then(response => {
                // выделить уникальные предметы
                const subjects = uniq(response.data.map(x => x.subject));
		// отсортировать планы
		const plans = response.data.sort(comparePlans);
                // поставить данные в состояние
                this.setState({
                    loading: false,
                    filteredPlans: plans,
                    plans: plans,
                    subjects: subjects
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleChangeFilters = e => {
        const { name, value } = e.target;
        const { filters } = this.state;

        // последующие фильтры сбрасываются при изменении предыдущего
        if (name === "subject" && filters.subject !== value) {
            this.setState(prevState => ({
                filters: {
                    ...prevState.filters,
                    [name]: value,
                    targetClass: "",
                    language: "",
                    section: "",
                    topic: ""
                }
            }));
        } else if (name === "targetClass" && filters.targetClass !== value) {
            this.setState(prevState => ({
                filters: {
                    ...prevState.filters,
                    [name]: value,
                    language: "",
                    section: "",
                    topic: ""
                }
            }));
        } else if (name === "language" && filters.language !== value) {
            this.setState(prevState => ({
                filters: {
                    ...prevState.filters,
                    [name]: value,
                    section: "",
                    topic: ""
                }
            }));
        } else if (name === "section" && filters.section !== value) {
            this.setState(prevState => ({
                filters: {
                    ...prevState.filters,
                    [name]: value,
                    topic: ""
                }
            }));
        } else {
            this.setState(prevState => ({
                filters: {
                    ...prevState.filters,
                    [name]: value
                }
            }));
        }
    };

    handleFilters = () => {
        const { filters, plans } = this.state;

        // отфильтровать планы
        const filteredPlans = filterPlans(plans, filters);
        // установить данные в состояние
        this.setState({ filteredPlans: filteredPlans });
    };

    handleResetFilters = () => {
        // сбросить фильтры
        this.setState({ filters: {}, filteredPlans: [...this.state.plans] });
    };

    render() {
        const { loading, filters, filteredPlans, plans, subjects } = this.state;
        const { classes, myPlans } = this.props;

        // определение базового пути (для ссылок на план)
        const baseRoute = myPlans ? "/dashboard/my" : "/dashboard/all";

        const plansList = [];
        if (filteredPlans.length !== 0) {
            for (let i = 0; i < filteredPlans.length; i++) {
                const plan = filteredPlans[i];
                const author = myPlans ? plan.originalPlan.author : plan.author;

                plansList.push(
                    <Link className={classes.link} key={`dashboard-plans-item-${i}`} to={`${baseRoute}/${plan._id}`}>
                        <Paper className={classes.item}>
                            <ListItem button>
                                <ListItemText
                                    primary={
                                        <div>
                                            <Typography paragraph>
                                                {myPlans ? (
                                                    plan.isPublished ? (
                                                        <Typography variant="button">
                                                            <span>[</span>
                                                            <Translation>
                                                                {t => t("dashboard.plan.isPublished")}
                                                            </Translation>
                                                            <span>] </span>
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="button">
                                                            <span>[</span>
                                                            <Translation>
                                                                {t => t("dashboard.plan.notPublished")}
                                                            </Translation>{" "}
                                                            <span>] </span>
                                                        </Typography>
                                                    )
                                                ) : null}
                                                <Translation>{t => t("dashboard.plan.author")}</Translation>
                                                {`: ${author.lastName || "--"} ${author.firstName ||
                                                    "--"} ${author.patronymic || ""}`}
                                            </Typography>
                                            {plan.coAuthors.length ? (
                                                <Typography paragraph>
                                                    <Translation>{t => t("dashboard.plan.coAuthors")}</Translation>
                                                    {`: ${plan.coAuthors.map(
                                                        coAuthor => `${coAuthor.lastName} ${coAuthor.firstName} `
                                                    )}`}
                                                </Typography>
                                            ) : null}
                                            <Typography paragraph>{`${plan.subject}, ${plan.targetClass} класс, ${
                                                languages[plan.language]
                                            } язык`}</Typography>
                                        </div>
                                    }
                                    secondary={`${plan.quarter} четверть, раздел ${plan.section}, тема ${plan.topic}`}
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
                <FiltersView
                    filters={filters}
                    filteredPlans={filteredPlans}
                    plans={plans}
                    showPublicationFilter={myPlans}
                    subjects={subjects}
                    handleChangeFilters={this.handleChangeFilters}
                    handleFilters={this.handleFilters}
                    handleResetFilters={this.handleResetFilters}
                />
                <List aria-label="Plans list">{plansList}</List>

                {myPlans ? (
                    <Link className={classes.link} to="/dashboard/create">
                        <Fab color="primary" aria-label="Create lesson plan" className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
                ) : null}
            </Container>
        );
    }
}

export default withStyles(styles)(PlansView);
