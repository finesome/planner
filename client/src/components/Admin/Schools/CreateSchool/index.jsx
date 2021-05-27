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
import { schoolsRoutes } from "../../../../assets/routes";
import { regions } from "../../../../assets/utils/schools";
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

class CreateSchool extends Component {
    state = {
        error: false,
        loading: false,
        school: {
            region: "",
            city: "",
            district: "",
            name: ""
        }
    };

    handleCreate = e => {
        e.preventDefault();

        const { school } = this.state;

        if (!school.region || !school.city || !school.district || !school.name) {
            alert("Не все поля заполнены");
            return;
        }

        const r = window.confirm("Создать школу?");
        if (r) {
            this.setState({ loading: true });
            axios
                .post(schoolsRoutes.createSchool(), school)
                .then(() => {
                    this.setState({ loading: false });
                    // redirect to schools page
                    this.props.history.push("/admin/schools");
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ error: true, loading: false });
                });
        }
    };

    handleChange = e => {
        const { name, value } = e.target;

        if (name === "region") {
            this.setState(prevState => ({
                school: {
                    ...prevState.school,
                    [name]: value,
                    city: "",
                    district: ""
                }
            }));
        } else if (name === "city") {
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

    render() {
        const { error, loading, school } = this.state;
        const { classes } = this.props;

        return loading ? (
            <Grid container justify="center" alignItems="center">
                <CircularProgress className={classes.progress} />
            </Grid>
        ) : (
            <Container component="main">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography paragraph>Создать новую школу</Typography>
                    {error ? (
                        <Typography className={classes.error} paragraph>
                            Ошибка при создании школы
                        </Typography>
                    ) : null}

                    <form onSubmit={this.handleCreate}>
                        <TextField
                            select
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="region"
                            label="Регион"
                            name="region"
                            value={school.region}
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
                            id="city"
                            label="Город"
                            name="city"
                            value={school.city}
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
                            id="district"
                            label="Район"
                            name="district"
                            value={school.district}
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

                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            id="name"
                            label="Название"
                            name="name"
                            value={school.name}
                            autoFocus
                            onChange={this.handleChange}
                        />

                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Сохранить школу
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
)(withStyles(styles)(CreateSchool));
