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
    Snackbar,
    SnackbarContent,
    TextField
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import DeleteIcon from "@material-ui/icons/Delete";
// redux
// assets
import { schoolsRoutes } from "../../../../assets/routes";
import { regions } from "../../../../assets/utils/schools";
// styles
import { green } from "@material-ui/core/colors";

const styles = theme => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(2)
    },
    progress: {
        margin: theme.spacing(2)
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
    button: {
        marginBottom: theme.spacing(1)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    }
});

class School extends Component {
    state = {
        loading: false,
        showSnackbar: false
    };

    componentDidMount() {
        let id = this.props.match.params.id;
        this.getSchool(id);
    }

    getSchool = id => {
        this.setState({ loading: true });
        axios
            .get(schoolsRoutes.getSchool(id))
            .then(response => {
                this.setState({ loading: false, school: response.data });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    };

    handleEditSchool = e => {
        e.preventDefault();

        const { school } = this.state;
        const r = window.confirm("Вы уверены что хотите редактировать эту школу?");

        if (r && school) {
            axios
                .post(schoolsRoutes.editSchool(school._id), { school: school })
                .then(() => {
                    // показать snackbar
                    this.handleShowSnackbar();
                    // скрыть snackbar через 3 секунды
                    setTimeout(this.handleHideSnackbar, 3000);
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ loading: false });
                });
        }
    };

    handleDeleteSchool = () => {
        const { school } = this.state;
        const r = window.confirm("Вы уверены что хотите удалить эту школу?");

        if (r && school) {
            axios
                .delete(schoolsRoutes.deleteSchool(school._id))
                .then(() => {
                    // redirect to schools page
                    this.props.history.push("/admin/schools");
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ loading: false });
                });
        }
    };

    handleChange = e => {
        const { name, value } = e.target;
        const { school } = this.state;

        if (name === "region" && school.region !== value) {
            this.setState(prevState => ({
                school: {
                    ...prevState.school,
                    [name]: value,
                    city: "",
                    district: ""
                }
            }));
        } else if (name === "city" && school.city !== value) {
            this.setState(prevState => ({
                school: {
                    ...prevState.school,
                    [name]: value,
                    district: ""
                }
            }));
        } else {
            this.setState(prevState => ({
                school: {
                    ...prevState.school,
                    [name]: value
                }
            }));
        }
    };

    handleShowSnackbar = () => {
        this.setState({ showSnackbar: true });
    };

    handleHideSnackbar = () => {
        this.setState({ showSnackbar: false });
    };

    render() {
        const { loading, school, showSnackbar } = this.state;
        const { classes } = this.props;

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <Container component="main">
                <CssBaseline />
                <div className={classes.paper}>
                    <form onSubmit={this.handleEditSchool}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="name"
                            label="Название школы"
                            name="name"
                            value={school && school.name ? school.name : ""}
                            onChange={this.handleChange}
                        />

                        <TextField
                            select
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            id="region"
                            label="Регион"
                            name="region"
                            value={school && school.region ? school.region : ""}
                            onChange={this.handleChange}
                        >
                            {regions.map(region => (
                                <MenuItem key={region.name} value={region.name}>
                                    {region.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            id="city"
                            label="Город"
                            name="city"
                            value={school && school.city ? school.city : ""}
                            onChange={this.handleChange}
                        >
                            {school && school.region
                                ? regions
                                      .find(x => x.name === school.region)
                                      .cities.map(city => (
                                          <MenuItem key={city.name} value={city.name}>
                                              {city.name}
                                          </MenuItem>
                                      ))
                                : []}
                        </TextField>

                        <TextField
                            select
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            id="district"
                            label="Район"
                            name="district"
                            value={school && school.district ? school.district : ""}
                            onChange={this.handleChange}
                        >
                            {school && school.region && school.city
                                ? regions
                                      .find(x => x.name === school.region)
                                      .cities.find(x => x.name === school.city)
                                      .districts.map(district => (
                                          <MenuItem key={district} value={district}>
                                              {district}
                                          </MenuItem>
                                      ))
                                : []}
                        </TextField>

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
                                        Школа отредактирована
                                    </span>
                                }
                            />
                        </Snackbar>

                        <Button className={classes.button} type="submit" fullWidth variant="contained" color="primary">
                            Редактировать школу
                        </Button>
                        <Button
                            className={classes.button}
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={this.handleDeleteSchool}
                        >
                            Удалить школу
                            <DeleteIcon className={classes.rightIcon} />
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
)(withStyles(styles)(School));
