// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
// components
import {
    CircularProgress,
    Container,
    Grid,
    CssBaseline,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FavoriteStageView from "./FavoriteStageView";
// redux
import { getFavoriteStages } from "../../../store/Auth";
// assets
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
    }
});

class FavoriteStages extends Component {
    state = {
        expanded: false
    };

    componentDidMount() {
        // запрос избранных этапов
        this.props.getFavoriteStages();
    }

    handleExpansion = panel => (event, isExpanded) => {
        this.setState({
            expanded: isExpanded ? panel : false
        });
    };

    render() {
        const { expanded } = this.state;
        const { classes, loading, favoriteStages } = this.props;

        const favoriteStagesList = [];
        if (favoriteStages && favoriteStages.length) {
            for (let i = 0; i < favoriteStages.length; i++) {
                const stage = favoriteStages[i];
                const plan = stage.lessonPlan;

                favoriteStagesList.push(
                    <ExpansionPanel
                        expanded={expanded === `liked-stage-expansion-panel-${i}`}
                        key={`liked-lesson-stage-expansion-panel-${i}`}
                        onChange={this.handleExpansion(`liked-stage-expansion-panel-${i}`)}
                    >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`liked-stage-expansion-panel-${i}-content`}
                            id={`liked-stage-expansion-panel-${i}-header`}
                        >
                            <Typography variant="body1">
                                {`Автор: ${plan.author.lastName} ${plan.author.firstName} ${plan.author.patronymic}, 
                                ${plan.subject}, 
                                ${plan.targetClass} класс, 
                                ${languages[plan.language]} язык`}
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <FavoriteStageView stage={stage} getFavoriteStages={this.props.getFavoriteStages} />
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
            <Container component="main">
                <CssBaseline />
                <div className={classes.paper}>{favoriteStagesList}</div>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    loading: state.auth.getFavoriteStages.pending,
    favoriteStages: state.auth.user.favoriteStages
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    getFavoriteStages: () => dispatch(getFavoriteStages())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(FavoriteStages));
