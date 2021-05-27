// modules
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
// components
import {
    AppBar,
    Button,
    Dialog,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    IconButton,
    MenuItem,
    Slide,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NewTopic from "../NewTopic";
import Topic from "../Topic";
// redux
// assets
// styles

const styles = theme => ({
    paper: {
        padding: theme.spacing(4)
    },
    appBar: {
        position: "relative"
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    },
    buttonIcon: {
        marginRight: theme.spacing(1)
    },
    topics: {
        margin: theme.spacing(2, 0)
    },
    newTopic: {
        margin: theme.spacing(2, 0)
    },
    button: {
        margin: theme.spacing(1, 1, 1, 0)
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Section extends Component {
    state = {
        expanded: false,
        newTopic: null,
        section: this.props.section ? this.props.section : {}
    };

    componentDidUpdate(prevProps) {
        // re-hydrate state with props
        if (this.props.section !== prevProps.section) {
            this.setState({
                section: this.props.section
            });
        }
    }

    handleOpenNewTopic = () => {
        this.setState({
            newTopic: <NewTopic handleAddTopic={this.handleAddTopic} handleCloseNewTopic={this.handleCloseNewTopic} />
        });
    };

    handleCloseNewTopic = () => {
        this.setState({ newTopic: null });
    };

    handleAddTopic = topic => {
        if (!topic.name || !topic.learningObjectives || !topic.learningObjectives.length) {
            alert("Не все поля заполнены");
            return;
        }

        const r = window.confirm("Создать новую тему?");
        if (r) {
            // add new topic
            const topics = [...(this.state.section.topics || []), topic];
            // set state
            this.setState(
                prevState => ({
                    section: {
                        ...prevState.section,
                        topics: topics
                    }
                }),
                () => {
                    // edit
                    this.props.handleSaveSection(this.state.section, this.props.index);
                    // close new topic
                    this.handleCloseNewTopic();
                }
            );
        }
    };

    handleEditTopic = (topic, index) => {
        if (!topic.name) {
            alert("Название темы не заполнено");
            return;
        }

        // replace topic
        const topics = [...this.state.section.topics];
        topics[index] = topic;
        // set state
        this.setState(
            prevState => ({
                section: {
                    ...prevState.section,
                    topics: topics
                }
            }),
            () => this.props.handleSaveSection(this.state.section, this.props.index)
        );
    };

    handleDeleteTopic = index => {
        const r = window.confirm("Удалить тему?");
        if (r) {
            // delete topic
            const topics = [...this.state.section.topics];
            topics.splice(index, 1);
            // set state
            this.setState(
                prevState => ({
                    section: {
                        ...prevState.section,
                        topics: topics
                    }
                }),
                () => this.props.handleSaveSection(this.state.section, this.props.index)
            );
        }
    };

    handleExpansion = panel => (event, isExpanded) => {
        this.setState({
            expanded: isExpanded ? panel : false
        });
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
        const { expanded, newTopic, section } = this.state;
        const { classes, index } = this.props;

        return (
            <Dialog fullScreen open={true} onClose={this.props.handleCloseSection} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={this.props.handleCloseSection}
                            aria-label="Close"
                        >
                            <CloseIcon />
                        </IconButton>

                        <Typography variant="h6" className={classes.title}>
                            {section && section.name ? section.name : ""}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div className={classes.paper}>
                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        variant="filled"
                        id="filled-section-name"
                        label="Название раздела"
                        name="name"
                        value={section.name || ""}
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
                        value={section.quarter || ""}
                        onChange={this.handleChange}
                    >
                        {[1, 2, 3, 4].map((quarter, index) => (
                            <MenuItem key={`section-quarter-${index}`} value={quarter}>
                                {quarter}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Typography paragraph>Темы уроков</Typography>

                    <div className={classes.topics}>
                        {section && section.topics && section.topics.length
                            ? section.topics.map((topic, index) => (
                                  <ExpansionPanel
                                      expanded={expanded === `topic-expansion-panel-${index}`}
                                      key={`topic-expansion-panel-${index}`}
                                      onChange={this.handleExpansion(`topic-expansion-panel-${index}`)}
                                  >
                                      <ExpansionPanelSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          aria-controls={`topic-expansion-panel-${index}-content`}
                                          id={`topic-expansion-panel-${index}-header`}
                                      >
                                          {topic.name}
                                      </ExpansionPanelSummary>
                                      <ExpansionPanelDetails>
                                          <Topic
                                              topic={topic}
                                              index={index}
                                              handleEditTopic={this.handleEditTopic}
                                              handleDeleteTopic={this.handleDeleteTopic}
                                          />
                                      </ExpansionPanelDetails>
                                  </ExpansionPanel>
                              ))
                            : []}
                    </div>

                    <div className={classes.newTopic}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.handleOpenNewTopic}
                        >
                            Создать новую тему
                            <AddIcon className={classes.rightIcon} />
                        </Button>
                        {newTopic}
                    </div>

                    <Button
                        color="primary"
                        variant="contained"
                        className={classes.button}
                        onClick={() => this.props.handleSaveSection(section, index)}
                    >
                        Редактировать раздел
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        className={classes.button}
                        onClick={() => this.props.handleDeleteSection(index)}
                    >
                        Удалить раздел
                    </Button>
                </div>
            </Dialog>
        );
    }
}

export default withStyles(styles)(Section);
