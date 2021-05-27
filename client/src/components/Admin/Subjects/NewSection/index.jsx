// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
// components
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@material-ui/core";
// redux
// assets
// styles

const styles = theme => ({
    button: {
        margin: theme.spacing(1, 1, 1, 0)
    }
});

class NewSection extends Component {
    state = {
        section: {
            name: "",
            quarter: ""
        }
    };

    handleChange = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            section: {
                ...prevState.section,
                [name]: value
            }
        }));
    };

    render() {
        const { section } = this.state;
        const { classes } = this.props;

        return (
            <Dialog fullWidth open={true} onClose={this.props.handleCloseNewSection}>
                <DialogTitle id="new-section-dialog-title">Новый раздел</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        variant="filled"
                        id="filled-section-name"
                        label="Название раздела"
                        name="name"
                        value={section.name}
                        onChange={this.handleChange}
                    />
                    <TextField
                        fullWidth
                        select
                        margin="normal"
                        variant="filled"
                        id="filled-section-quarter"
                        label="Учебная четверть"
                        name="quarter"
                        type="number"
                        value={section.quarter}
                        onChange={this.handleChange}
                    >
                        {[1, 2, 3, 4].map(quarter => (
                            <MenuItem key={`quarter-${quarter}`} value={quarter}>
                                {quarter}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" className={classes.button} onClick={this.props.handleCloseNewSection}>
                        Отменить
                    </Button>
                    <Button
                        color="primary"
                        className={classes.button}
                        onClick={() => this.props.handleAddSection(section)}
                    >
                        Добавить новый раздел
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(NewSection);
