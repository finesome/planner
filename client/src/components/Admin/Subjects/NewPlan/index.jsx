// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
// components
import { Button, MenuItem, TextField, Typography } from "@material-ui/core";
// redux
// assets
import { allClasses, languages } from "../../../../assets/utils/subjects";
// styles

const styles = theme => ({
    paper: {
        width: "100%"
    },
    innerPaper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2, 0, 2)
    },
    button: {
        margin: theme.spacing(1, 1, 1, 0)
    }
});

class NewPlan extends Component {
    state = {
        plan: {
            language: this.props.language,
            targetClass: "",
            hoursPerWeek: "",
            hoursInYear: ""
        }
    };

    handleChange = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            plan: {
                ...prevState.plan,
                [name]: value
            }
        }));
    };

    render() {
        const { plan } = this.state;
        const { classes } = this.props;

        return (
            <div className={classes.paper}>
                <Typography>Новый план</Typography>

                <TextField
                    fullWidth
                    margin="normal"
                    variant="filled"
                    inputProps={{
                        readOnly: true
                    }}
                    id="filled-plan-language"
                    label="Язык"
                    name="language"
                    value={languages[plan.language]}
                />

                <TextField
                    fullWidth
                    select
                    margin="normal"
                    variant="filled"
                    id="filled-plan-targetClass"
                    label="Класс обучения"
                    name="targetClass"
                    type="number"
                    value={plan.targetClass}
                    onChange={this.handleChange}
                >
                    {allClasses.map(targetClass => (
                        <MenuItem key={`target-class-${targetClass}`} value={targetClass}>
                            {targetClass}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    margin="normal"
                    variant="filled"
                    id="filled-plan-hoursPerWeek"
                    label="Часов в неделю"
                    name="hoursPerWeek"
                    type="number"
                    value={plan.hoursPerWeek}
                    inputProps={{
                        min: 1,
                        step: 1
                    }}
                    onChange={this.handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    variant="filled"
                    id="filled-plan-hoursInYear"
                    label="Часов в год"
                    name="hoursInYear"
                    type="number"
                    value={plan.hoursInYear}
                    inputProps={{
                        min: 1,
                        step: 1
                    }}
                    onChange={this.handleChange}
                />

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => this.props.handleCreatePlan(plan)}
                >
                    Создать новый план
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(NewPlan);
