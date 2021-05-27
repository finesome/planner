// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { uniq } from "lodash";
import classNames from "classnames";
// components
import {
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Divider,
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@material-ui/core";
import { Bar, BarChart, Cell, LabelList, Legend, PieChart, Pie, Tooltip, XAxis, YAxis } from "recharts";
import { Translation } from "react-i18next";
// redux
// assets
import { analyticsRoutes } from "../../assets/routes";
import { filterPlans, filterUsers } from "../../assets/utils/analytics";
// styles
const colors = ["#75ca55", "#0ab978", "#00b094", "#0dab76", "#007d58", "#92bda3", "#095256"];

const styles = theme => ({
    paper: {
        display: "flex",
        flexDirection: "column"
    },
    progress: {
        margin: theme.spacing(2)
    },
    filtersBar: {
        display: "flex",
        flexWrap: "wrap",
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2, 0),
        borderBottom: "1px solid #c9c9c9"
    },
    textField: {
        width: "160px",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1)
    },
    infoBar: {
        borderBottom: "1px solid #c9c9c9",
        padding: theme.spacing(1)
    },
    usersNumber: {
        color: colors[0]
    },
    topGrid: {
        borderBottom: "1px solid #c9c9c9"
    },
    middleGrid: {
        borderLeft: "1px solid #c9c9c9",
        borderRight: "1px solid #c9c9c9"
    },
    chartGrid: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    plansBar: {
        display: "flex",
        flexDirection: "column"
    }
});

class Analytics extends Component {
    state = {
        loading: false,
        // уникальные регионы
        uniqueRegions: [],
        // фильтры для инфобара
        topResults: {},
        topFilters: {
            region: "",
            city: "",
            district: "",
            school: ""
        },
        // фильтры для планов
        bottomResults: {},
        bottomFilters: {
            region: "",
            city: "",
            district: "",
            school: "",
            author: ""
        }
    };

    componentDidMount() {
        // запрос аналитики
        this.getAnalytics();
    }

    getAnalytics = () => {
        this.setState({ loading: true });
        axios
            .get(analyticsRoutes.getAnalytics())
            .then(response => {
                // достать уникальные регионы из списка всех учителей
                const uniqueRegions = uniq(response.data.users.map(user => user.school.region));
                // установить данные
                this.setState(
                    {
                        loading: false,
                        plans: response.data.plans,
                        users: response.data.users,
                        uniqueRegions: uniqueRegions
                    },
                    () => {
                        // применить фильтры инфобара для отображения общей статистики
                        this.handleApplyTopFilters();
                        // применить фильтры планов для отображения общей статистики
                        this.handleApplyBottomFilters();
                    }
                );
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleChangeTopFilters = e => {
        const { name, value } = e.target;

        if (name === "region") {
            this.setState(prevState => ({
                topFilters: {
                    ...prevState.topFilters,
                    [name]: value,
                    city: "",
                    district: "",
                    school: ""
                }
            }));
        } else if (name === "city") {
            this.setState(prevState => ({
                topFilters: {
                    ...prevState.topFilters,
                    [name]: value,
                    district: "",
                    school: ""
                }
            }));
        } else if (name === "district") {
            this.setState(prevState => ({
                topFilters: {
                    ...prevState.topFilters,
                    [name]: value,
                    school: ""
                }
            }));
        } else {
            this.setState(prevState => ({
                topFilters: {
                    ...prevState.topFilters,
                    [name]: value
                }
            }));
        }
    };

    handleChangeBottomFilters = e => {
        const { name, value } = e.target;

        if (name === "region") {
            this.setState(prevState => ({
                bottomFilters: {
                    ...prevState.bottomFilters,
                    [name]: value,
                    city: "",
                    district: "",
                    school: "",
                    author: ""
                }
            }));
        } else if (name === "city") {
            this.setState(prevState => ({
                bottomFilters: {
                    ...prevState.bottomFilters,
                    [name]: value,
                    district: "",
                    school: "",
                    author: ""
                }
            }));
        } else if (name === "district") {
            this.setState(prevState => ({
                bottomFilters: {
                    ...prevState.bottomFilters,
                    [name]: value,
                    school: "",
                    author: ""
                }
            }));
        } else if (name === "school") {
            this.setState(prevState => ({
                bottomFilters: {
                    ...prevState.bottomFilters,
                    [name]: value,
                    author: ""
                }
            }));
        } else {
            this.setState(prevState => ({
                bottomFilters: {
                    ...prevState.bottomFilters,
                    [name]: value
                }
            }));
        }
    };

    // применить фильтр для инфобара
    handleApplyTopFilters = () => {
        const { topFilters, users } = this.state;

        // вызвать внешнюю функцию для фильтрования
        const topResults = filterUsers(topFilters, users);

        // установить данные
        this.setState({ topResults: topResults });
    };

    // применить фильтр для планов
    handleApplyBottomFilters = () => {
        const { bottomFilters, plans } = this.state;

        // вызвать внешнюю функцию для фильтрования
        const bottomResults = filterPlans(bottomFilters, plans);

        // установить данные
        this.setState({ bottomResults: bottomResults });
    };

    handleResetTopFilters = () => {
        // обновить фильтры и результаты фильтрования пользователей
        this.setState(
            {
                topResults: {},
                topFilters: {
                    region: "",
                    city: "",
                    district: "",
                    school: "",
                    author: ""
                }
            },
            () => {
                this.handleApplyTopFilters();
            }
        );
    };

    handleResetBottomFilters = () => {
        // обновить фильтры и результаты фильтрования планов
        this.setState(
            {
                bottomResults: {},
                bottomFilters: {
                    region: "",
                    city: "",
                    district: "",
                    school: ""
                }
            },
            () => {
                this.handleApplyBottomFilters();
            }
        );
    };

    render() {
        const {
            bottomFilters,
            bottomResults,
            loading,
            plans,
            users,
            topFilters,
            topResults,
            uniqueRegions
        } = this.state;
        const { classes } = this.props;

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <Container component="main">
                <CssBaseline />
                <div className={classes.paper}>
                    {/* фильтр для инфобара */}
                    <Grid className={classes.filtersBar}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                className={classes.textField}
                                margin="normal"
                                variant="filled"
                                label={<Translation>{t => t("region")}</Translation>}
                                name="region"
                                value={topFilters.region}
                                onChange={this.handleChangeTopFilters}
                            >
                                {uniqueRegions.length
                                    ? uniqueRegions.map((region, index) => (
                                          <MenuItem key={`top-region-${index}`} value={region}>
                                              {region}
                                          </MenuItem>
                                      ))
                                    : []}
                            </TextField>

                            <TextField
                                select
                                className={classes.textField}
                                margin="normal"
                                variant="filled"
                                label={<Translation>{t => t("city")}</Translation>}
                                name="city"
                                value={topFilters.city}
                                onChange={this.handleChangeTopFilters}
                            >
                                {topFilters.region
                                    ? uniq(
                                          users
                                              .filter(user => user.school.region === topFilters.region)
                                              .map(user => user.school.city)
                                      ).map((city, index) => (
                                          <MenuItem key={`top-city-${index}`} value={city}>
                                              {city}
                                          </MenuItem>
                                      ))
                                    : []}
                            </TextField>

                            <TextField
                                select
                                className={classes.textField}
                                margin="normal"
                                variant="filled"
                                label={<Translation>{t => t("district")}</Translation>}
                                name="district"
                                value={topFilters.district}
                                onChange={this.handleChangeTopFilters}
                            >
                                {topFilters.city
                                    ? uniq(
                                          users
                                              .filter(
                                                  user =>
                                                      user.school.region === topFilters.region &&
                                                      user.school.city === topFilters.city
                                              )
                                              .map(user => user.school.district)
                                      ).map((district, index) => (
                                          <MenuItem key={`top-district-${index}`} value={district}>
                                              {district}
                                          </MenuItem>
                                      ))
                                    : []}
                            </TextField>

                            <TextField
                                select
                                className={classes.textField}
                                margin="normal"
                                variant="filled"
                                label={<Translation>{t => t("profile.school")}</Translation>}
                                name="school"
                                value={topFilters.school}
                                onChange={this.handleChangeTopFilters}
                            >
                                {topFilters.district
                                    ? uniq(
                                          users
                                              .filter(
                                                  user =>
                                                      user.school.region === topFilters.region &&
                                                      user.school.city === topFilters.city &&
                                                      user.school.district === topFilters.district
                                              )
                                              .map(user => user.school.name)
                                      ).map((school, index) => (
                                          <MenuItem key={`top-school-${index}`} value={school}>
                                              {school}
                                          </MenuItem>
                                      ))
                                    : []}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={this.handleApplyTopFilters}
                            >
                                <Translation>{t => t("showFilters")}</Translation>
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                onClick={this.handleResetTopFilters}
                            >
                                <Translation>{t => t("resetFilters")}</Translation>
                            </Button>
                        </Grid>
                    </Grid>

                    {/* инфобар */}
                    <Grid className={classes.infoBar} container spacing={3}>
                        <Grid className={classes.topGrid} item xs={12}>
                            <Typography variant="button">
                                <Translation>{t => t("analytics.dataShown")}</Translation>:{" "}
                                {topResults.selectedFilter ? topResults.selectedFilter : ""}
                            </Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography className={classes.usersNumber} variant="h4">
                                {topResults.usersNumber ? topResults.usersNumber : 0}
                            </Typography>
                            <Typography gutterBottom variant="button">
                                <Translation>{t => t("analytics.numberTeachers")}</Translation>
                            </Typography>
                            <Divider />
                        </Grid>

                        <Grid className={classNames(classes.middleGrid, classes.chartGrid)} item xs={4}>
                            <Typography variant="button" gutterBottom>
                                <Translation>{t => t("analytics.planDistribution")}</Translation>
                            </Typography>
                            <PieChart width={300} height={240}>
                                <Pie
                                    data={topResults.distributionData ? topResults.distributionData : []}
                                    dataKey="value"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                >
                                    {topResults.distributionData
                                        ? topResults.distributionData.map((entry, index) => (
                                              <Cell
                                                  key={`pie-chart-cell-${index}`}
                                                  fill={colors[index % colors.length]}
                                              />
                                          ))
                                        : []}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="button" gutterBottom>
                                <Translation>{t => t("analytics.topTeachers")}</Translation>
                            </Typography>
                            <BarChart
                                layout="vertical"
                                maxBarSize={24}
                                width={400}
                                height={240}
                                data={topResults.usersData ? topResults.usersData : []}
                            >
                                <XAxis hide type="number" allowDecimals={false} />
                                <YAxis axisLine={false} dataKey="name" type="category" width={160} />
                                <Tooltip />
                                <Bar dataKey="Кол-во копирований" label={{ fill: "#fff" }}>
                                    {topResults.usersData
                                        ? topResults.usersData.map((entry, index) => (
                                              <Cell
                                                  key={`bar-chart-cell-${index}`}
                                                  fill={colors[index % colors.length]}
                                              />
                                          ))
                                        : []}
                                </Bar>
                            </BarChart>
                        </Grid>
                    </Grid>

                    {/* фильтр для планов */}
                    <Grid className={classes.filtersBar}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                className={classes.textField}
                                margin="normal"
                                variant="filled"
                                label={<Translation>{t => t("region")}</Translation>}
                                name="region"
                                value={bottomFilters.region}
                                onChange={this.handleChangeBottomFilters}
                            >
                                {uniqueRegions.length
                                    ? uniqueRegions.map((region, index) => (
                                          <MenuItem key={`bottom-region-${index}`} value={region}>
                                              {region}
                                          </MenuItem>
                                      ))
                                    : []}
                            </TextField>

                            <TextField
                                select
                                className={classes.textField}
                                margin="normal"
                                variant="filled"
                                label={<Translation>{t => t("city")}</Translation>}
                                name="city"
                                value={bottomFilters.city}
                                onChange={this.handleChangeBottomFilters}
                            >
                                {bottomFilters.region
                                    ? uniq(
                                          plans
                                              .filter(plan => plan.author.school.region === bottomFilters.region)
                                              .map(plan => plan.author.school.city)
                                      ).map((city, index) => (
                                          <MenuItem key={`bottom-city-${index}`} value={city}>
                                              {city}
                                          </MenuItem>
                                      ))
                                    : []}
                            </TextField>

                            <TextField
                                select
                                className={classes.textField}
                                margin="normal"
                                variant="filled"
                                label={<Translation>{t => t("district")}</Translation>}
                                name="district"
                                value={bottomFilters.district}
                                onChange={this.handleChangeBottomFilters}
                            >
                                {bottomFilters.city
                                    ? uniq(
                                          plans
                                              .filter(
                                                  plan =>
                                                      plan.author.school.region === bottomFilters.region &&
                                                      plan.author.school.city === bottomFilters.city
                                              )
                                              .map(plan => plan.author.school.district)
                                      ).map((district, index) => (
                                          <MenuItem key={`bottom-district-${index}`} value={district}>
                                              {district}
                                          </MenuItem>
                                      ))
                                    : []}
                            </TextField>

                            <TextField
                                select
                                className={classes.textField}
                                margin="normal"
                                variant="filled"
                                label={<Translation>{t => t("profile.school")}</Translation>}
                                name="school"
                                value={bottomFilters.school}
                                onChange={this.handleChangeBottomFilters}
                            >
                                {bottomFilters.district
                                    ? uniq(
                                          plans
                                              .filter(
                                                  plan =>
                                                      plan.author.school.region === bottomFilters.region &&
                                                      plan.author.school.city === bottomFilters.city &&
                                                      plan.author.school.district === bottomFilters.district
                                              )
                                              .map(plan => plan.author.school.name)
                                      ).map((school, index) => (
                                          <MenuItem key={`bottom-school-${index}`} value={school}>
                                              {school}
                                          </MenuItem>
                                      ))
                                    : []}
                            </TextField>

                            <TextField
                                select
                                className={classes.textField}
                                margin="normal"
                                variant="filled"
                                label={<Translation>{t => t("teacher")}</Translation>}
                                name="author"
                                value={bottomFilters.author}
                                onChange={this.handleChangeBottomFilters}
                            >
                                {bottomFilters.school
                                    ? uniq(
                                          plans
                                              .filter(
                                                  plan =>
                                                      plan.author.school.region === bottomFilters.region &&
                                                      plan.author.school.city === bottomFilters.city &&
                                                      plan.author.school.district === bottomFilters.district &&
                                                      plan.author.school.name === bottomFilters.school
                                              )
                                              .map(plan => plan.author)
                                      ).map((author, index) => (
                                          <MenuItem key={`bottom-author-${index}`} value={author._id}>
                                              {`${author.lastName} ${author.firstName} ${author.patronymic}`}
                                          </MenuItem>
                                      ))
                                    : []}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={this.handleApplyBottomFilters}
                            >
                                <Translation>{t => t("showFilters")}</Translation>
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                onClick={this.handleResetBottomFilters}
                            >
                                <Translation>{t => t("resetFilters")}</Translation>
                            </Button>
                        </Grid>
                    </Grid>

                    {/* статистика по всем планам (сгруппированная по предметам) */}
                    <Grid className={classes.plansBar} container>
                        <Grid item xs={12}>
                            <Typography variant="button">
                                <Translation>{t => t("analytics.subjectPlans")}</Translation>
                                <span>: </span>
                                {bottomResults.selectedFilter ? bottomResults.selectedFilter : ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <BarChart
                                layout="vertical"
                                maxBarSize={40}
                                height={400}
                                width={800}
                                data={bottomResults.graphData ? bottomResults.graphData : []}
                            >
                                <XAxis hide type="number" allowDecimals={false} />
                                <YAxis axisLine={false} dataKey="name" type="category" width={160} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Оригинальные планы" stackId="a" fill={colors[0]}>
                                    <LabelList dataKey="Оригинальные планы" position="inside" fill="#fff" />
                                </Bar>
                                <Bar dataKey="Скопированные планы" stackId="a" fill={colors[1]}>
                                    <LabelList dataKey="Скопированные планы" position="inside" fill="#fff" />
                                </Bar>
                            </BarChart>
                        </Grid>
                    </Grid>
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
)(withStyles(styles)(Analytics));
