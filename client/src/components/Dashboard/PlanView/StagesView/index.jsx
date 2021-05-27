// modules
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import arrayMove from "array-move";
// components
import {
    Button,
    CircularProgress,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Fab,
    Grid,
    MenuItem,
    Paper,
    Snackbar,
    SnackbarContent,
    TextField,
    Typography
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Close";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Translation } from "react-i18next";
import SortableContainer from "./SortableContainer";
import SortableItem from "./SortableItem";
import StageView from "../StageView";
// redux
import { getFavoriteStages } from "../../../../store/Auth";
// assets
import { plansRoutes, stagesRoutes } from "../../../../assets/routes";
// styles
import "react-quill/dist/quill.snow.css";
import { green } from "@material-ui/core/colors";

const styles = theme => ({
    progress: {
        margin: theme.spacing(2)
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(1, 0)
    },
    button: {
        margin: theme.spacing(1, 0, 1)
    },
    newStage: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(2)
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
    fab: {
        position: "fixed",
        bottom: theme.spacing(4),
        right: theme.spacing(4)
    }
});

class StagesView extends Component {
    state = {
        creating: false,
        expanded: false,
        favoriteStage: "",
        loading: false,
        newStage: null,
        showSnackbar: false,
        sorting: false,
        stages: []
    };

    componentDidMount() {
        // запрос этапов
        const id = this.props.match.params.id;
        this.getPlanStages(id);
        // запрос избранных этапов
        this.props.getFavoriteStages();
    }

    getPlanStages = id => {
        this.setState({ loading: true });
        axios
            .get(plansRoutes.getPlanStages(id))
            .then(response => {
                this.setState({ loading: false, id: id, stages: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleExpansion = panel => (event, isExpanded) => {
        this.setState({
            expanded: isExpanded ? panel : false
        });
    };

    handleStartCreatingStage = () => {
        // создать компонент нового этапа
        this.setState({
            creating: true,
            newStage: <StageView myPlan={this.props.myPlan} newStage handleCreateStage={this.handleCreateStage} />
        });
    };

    handleCancelCreatingStage = () => {
        const r = window.confirm("Отменить создание нового этапа?");
        if (r) {
            this.setState({ creating: false, newStage: null });
        }
    };

    handleChooseFromFavorites = e => {
        const { value } = e.target;
        const { favoriteStages } = this.props;

        // get favorite stage
        const stage = favoriteStages.find(item => item._id === value);
        // inject the favorite stage into a new stage component
        this.setState({
            newStage: (
                <StageView
                    myPlan={this.props.myPlan}
                    newStage
                    stage={stage}
                    handleCreateStage={this.handleCreateStage}
                />
            ),
            favoriteStage: value
        });
    };

    handleCreateStage = stage => {
        const { id } = this.state;

        if (!stage.name || !stage.description || !stage.duration) {
            alert("Не все поля заполнены");
            return;
        }

        const r = window.confirm("Создать новый этап?");

        if (r) {
            axios
                .post(stagesRoutes.addStage(id), { stage: stage })
                .then(() => {
                    this.setState({ creating: false, newStage: null });
                    // reload stages
                    this.getPlanStages(id);
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ creating: false });
                });
        }
    };

    handleStartSorting = () => {
        this.setState({ sorting: true });
    };

    handleCancelSorting = () => {
        this.setState({ sorting: false });
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ stages }) => ({
            stages: arrayMove(stages, oldIndex, newIndex)
        }));
    };

    handleReorderStages = () => {
        const r = window.confirm("Поменять порядок блоков урока?");
        const { id, stages } = this.state;

        if (id && r) {
            axios
                .post(stagesRoutes.reorderStages(id), { stages: stages })
                .then(() => {
                    this.setState({ sorting: false });
                    // show snackbar
                    this.handleShowSnackbar();
                    // hide snackbar after 3 seconds
                    setTimeout(this.handleHideSnackbar, 3000);
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ sorting: false });
                });
        }
    };

    handleShowSnackbar = () => {
        this.setState({ showSnackbar: true });
    };

    handleHideSnackbar = () => {
        this.setState({ showSnackbar: false });
    };

    render() {
        const { creating, expanded, favoriteStage, loading, newStage, showSnackbar, sorting, stages } = this.state;
        const { classes, favoriteStages, myPlan, plan } = this.props;

        let stagePanels = [];
        if (stages.length) {
            for (let i = 0; i < stages.length; i++) {
                let stage = stages[i];
                stagePanels.push(
                    <ExpansionPanel
                        expanded={expanded === `stage-expansion-panel-${i}`}
                        key={`lesson-stage-expansion-panel-${i}`}
                        onChange={this.handleExpansion(`stage-expansion-panel-${i}`)}
                    >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`stage-expansion-panel-${i}-content`}
                            id={`stage-expansion-panel-${i}-header`}
                        >
                            {stage.name} ({stage.duration} мин)
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <StageView id={plan._id} myPlan={myPlan} stage={stage} getPlanStages={this.getPlanStages} />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                );
            }
        }

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <div className={classes.paper}>
                {myPlan && sorting ? (
                    <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
                        {stages.map((stage, index) => (
                            <SortableItem
                                key={`lesson-stage-sortable-stage-item-${index}`}
                                index={index}
                                stage={stage}
                            />
                        ))}
                    </SortableContainer>
                ) : (
                    stagePanels
                )}

                {myPlan && newStage ? (
                    <Paper className={classes.newStage} id="lesson-plan-new-stage">
                        <Typography>
                            <Translation>{t => t("dashboard.plan.stages.chooseFavorite")}</Translation>
                        </Typography>
                        <TextField
                            fullWidth
                            select
                            margin="normal"
                            variant="filled"
                            id="filled-choose-favorite-stage"
                            label={<Translation>{t => t("dashboard.favorites")}</Translation>}
                            name="favoriteStage"
                            value={favoriteStage}
                            onChange={this.handleChooseFromFavorites}
                        >
                            {favoriteStages && favoriteStages.length
                                ? favoriteStages
                                      .filter(
                                          stage =>
                                              stage.lessonPlan.subject === plan.subject &&
                                              stage.lessonPlan.language === plan.language &&
                                              stage.lessonPlan.targetClass === plan.targetClass &&
                                              stage.lessonPlan.quarter === plan.quarter &&
                                              stage.lessonPlan.section === plan.section &&
                                              stage.lessonPlan.topic === plan.topic
                                      )
                                      .map((stage, index) => (
                                          <MenuItem key={`favorite-stage-${index}`} value={stage._id}>
                                              {`${stage.name} (автор: ${stage.lessonPlan.author.lastName} 
                                                  ${stage.lessonPlan.author.firstName} ${
                                                  stage.lessonPlan.author.patronymic
                                              })`}
                                          </MenuItem>
                                      ))
                                : []}
                        </TextField>
                    </Paper>
                ) : null}

                {myPlan && newStage ? <Paper className={classes.newStage}>{newStage}</Paper> : null}

                {myPlan && sorting ? (
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.handleReorderStages}
                    >
                        <Translation>{t => t("save")}</Translation>
                    </Button>
                ) : null}

                {myPlan ? (
                    sorting ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={this.handleCancelSorting}
                        >
                            <Translation>{t => t("cancel")}</Translation>
                        </Button>
                    ) : (
                        <Button
                            disabled={stages.length <= 1}
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.handleStartSorting}
                        >
                            <Translation>{t => t("dashboard.plan.stages.changeOrder")}</Translation>
                        </Button>
                    )
                ) : null}

                {myPlan ? (
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
                                    <Translation>{t => t("dashboard.plan.stages.changedOrder")}</Translation>
                                </span>
                            }
                        />
                    </Snackbar>
                ) : null}

                {myPlan ? (
                    <Fab
                        color="primary"
                        aria-label="Create lesson plan"
                        className={classes.fab}
                        onClick={creating ? this.handleCancelCreatingStage : this.handleStartCreatingStage}
                    >
                        {creating ? <CancelIcon /> : <AddIcon />}
                    </Fab>
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    favoriteStages: state.auth.user.favoriteStages
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    getFavoriteStages: () => dispatch(getFavoriteStages())
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withStyles(styles)(StagesView))
);
