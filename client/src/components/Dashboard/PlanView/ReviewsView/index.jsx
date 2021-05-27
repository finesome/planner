// modules
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import { Button, CircularProgress, Divider, Grid, Paper, TextField, Typography } from "@material-ui/core";
import StarRatingComponent from "react-star-rating-component";
import { Translation } from "react-i18next";
// redux
// assets
import filledStar from "../../../../assets/images/filled_star.svg";
import star from "../../../../assets/images/star.svg";
import { plansRoutes } from "../../../../assets/routes";
// styles

const styles = theme => ({
    progress: {
        margin: theme.spacing(2)
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(1, 0)
    },
    innerPaper: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(2)
    },
    reviewWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    reviewStar: {
        margin: theme.spacing(0, 1),
        width: 40,
        height: 40,
        backgroundColor: "white"
    },
    reviewButton: {
        margin: theme.spacing(1, 0)
    },
    reviewItem: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(1)
    }
});

class PlanReviewsView extends Component {
    state = {
        review: {
            rating: 0,
            text: ""
        },
        reviews: []
    };

    componentDidMount() {
        // запрос отзывов на план
        const id = this.props.match.params.id;
        this.getPlanReviews(id);
    }

    getPlanReviews = id => {
        this.setState({ loading: true });
        axios
            .get(plansRoutes.getPlanReviews(id))
            .then(response => {
                this.setState({ loading: false, id: id, reviews: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleChangeRating = value => {
        this.setState(prevState => ({
            review: {
                ...prevState.review,
                rating: value
            }
        }));
    };

    handleChangeReview = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            review: {
                ...prevState.review,
                [name]: value
            }
        }));
    };

    handleLeaveReview = () => {
        const { id, review } = this.state;

        if (!review.rating) {
            alert("Вы не выбрали оценку");
            return;
        }

        const r = window.confirm("Оставить отзыв?");
        if (r) {
            axios
                .post(plansRoutes.reviewPlan(id), review)
                .then(() => {
                    this.getPlanReviews(id);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    render() {
        const { loading, review, reviews } = this.state;
        const { classes, myPlan, user } = this.props;

        let myReview = false;
        let numberReviews = 0;
        let averageRating = 0;
        if (reviews && reviews.length) {
            // find my review
            myReview = reviews.find(x => x.user._id === user._id);
            // get number of reviews
            numberReviews = reviews.length;
            // sum up ratings from all reviews
            averageRating = reviews.map(review => review.rating).reduce((a, b) => a + b, 0);
            // divide by number of reviews
            averageRating = Math.round((averageRating / numberReviews) * 10) / 10;
        }

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <div className={classes.paper}>
                {myPlan ? null : (
                    <Paper className={classes.innerPaper}>
                        <div className={classes.reviewWrapper}>
                            <Typography paragraph>
                                {myReview ? (
                                    <Translation>{t => t("dashboard.plan.reviews.yourReview")}</Translation>
                                ) : (
                                    <Translation>{t => t("dashboard.plan.reviews.leaveReview")}</Translation>
                                )}
                            </Typography>
                            <StarRatingComponent
                                name="rating"
                                startCount={5}
                                editing={!myReview}
                                value={myReview ? myReview.rating : review.rating}
                                renderStarIcon={(index, value) => (
                                    <img
                                        alt="star"
                                        className={classes.reviewStar}
                                        src={index <= value ? filledStar : star}
                                    />
                                )}
                                onStarClick={this.handleChangeRating}
                            />
                            <TextField
                                fullWidth
                                multiline
                                margin="normal"
                                variant="filled"
                                label={<Translation>{t => t("dashboard.plan.reviews.reviewText")}</Translation>}
                                name="text"
                                value={myReview ? myReview.text : review.text}
                                InputProps={{
                                    readOnly: !!myReview
                                }}
                                onChange={this.handleChangeReview}
                            />
                        </div>

                        {myReview ? null : (
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.reviewButton}
                                onClick={this.handleLeaveReview}
                            >
                                <Translation>{t => t("dashboard.plan.reviews.button")}</Translation>
                            </Button>
                        )}
                    </Paper>
                )}

                <Paper className={classes.innerPaper}>
                    <Typography paragraph>
                        <Translation>{t => t("dashboard.plan.reviews.rating")}</Translation>: <b>{averageRating}</b> (
                        <b>{numberReviews}</b> <Translation>{t => t("dashboard.plan.reviews.basedOn")}</Translation>)
                    </Typography>

                    <Divider />

                    {reviews.map((review, index) => (
                        <div className={classes.reviewItem} key={`lesson-plan-reviews-${index}`}>
                            {`${review.user.lastName} ${review.user.firstName} ${review.user.patronymic} (`}
                            <Translation>{t => t("dashboard.plan.reviews.mark")}</Translation>
                            {`: ${review.rating})`}
                            <p>{review.text}</p>
                        </div>
                    ))}
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withStyles(styles)(PlanReviewsView))
);
