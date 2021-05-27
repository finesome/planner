// modules
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
// components
import { CircularProgress, CssBaseline, Container, Grid, List, ListItem, ListItemText, Paper } from "@material-ui/core";
// redux
// assets
import { usersRoutes } from "../../../assets/routes";
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
    }
});

const compareUsers = (a, b) => {
    let aLastName = a.lastName;
    let bLastName = b.lastName;
    
    if (aLastName < bLastName) {
	    return -1;
    } else if (aLastName > bLastName) {
	    return 1;
    } else {
	    return 0;
    }
}

class Users extends Component {
    state = {
        loading: false,
        users: []
    };

    componentDidMount() {
        this.getUsers();
    }

    getUsers = () => {
        this.setState({ loading: true });
        axios
            .get(usersRoutes.getUsers())
            .then(response => {
		// sort users
		let users = [...response.data];
		users.sort(compareUsers);

                this.setState({ loading: false, users: users });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    render() {
        const { loading, users } = this.state;
        const { classes } = this.props;

        let usersList = [];
        if (users.length !== 0) {
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let school = user.school
                    ? `${user.school.region}, ${user.school.city}, ${user.school.district}, ${user.school.name}`
                    : "";
		let subject = user.subject && user.language ? `${user.subject}, ${user.language}, ` : "";

                usersList.push(
                    <Link className={classes.link} key={`admin-users-item-${i}`} to={`/admin/users/${user.email}`}>
                        <Paper className={classes.item}>
                            <ListItem button>
                                <ListItemText
                                    primary={`${i + 1}. ${user.lastName} ${user.firstName} ${user.patronymic} (${user.email})`}
                                    secondary={`${subject}${school}`}
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
                    <List aria-label="Users list">{usersList}</List>
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
)(withStyles(styles)(Users));
