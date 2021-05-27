// modules
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import {
    CircularProgress,
    CssBaseline,
    Container,
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
import { schoolsRoutes } from "../../../assets/routes";
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

class Schools extends Component {
    state = {
        loading: false,
        schools: []
    };

    componentDidMount() {
        this.getSchools();
    }

    getSchools = () => {
        this.setState({ loading: true });
        axios
            .get(schoolsRoutes.getSchools())
            .then(response => {
                this.setState({ loading: false, schools: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    render() {
        const { loading, schools } = this.state;
        const { classes } = this.props;

        let schoolsList = [];
        if (schools.length !== 0) {
            for (let i = 0; i < schools.length; i++) {
                let school = schools[i];
                schoolsList.push(
                    <Link className={classes.link} key={`admin-schools-item-${i}`} to={`/admin/schools/${school._id}`}>
                        <Paper className={classes.item}>
                            <ListItem button>
                                <ListItemText
                                    primary={`${i + 1}. ${school.name}`}
                                    secondary={`${school.region}, ${school.city}, ${school.district}`}
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
                    <List aria-label="Schools list">{schoolsList}</List>
                    <Link className={classes.link} to="/admin/schools/create">
                        <Fab color="primary" aria-label="Add school" className={classes.fab}>
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
)(withStyles(styles)(Schools));
