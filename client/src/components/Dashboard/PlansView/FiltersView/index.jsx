// modules
import React from "react";
import { makeStyles, useTheme } from "@material-ui/styles";
import { uniq, uniqBy } from "lodash";
// components
import { Button, MenuItem, TextField } from "@material-ui/core";
import { Translation } from "react-i18next";
// redux
// assets
import { languages } from "../../../../assets/utils/subjects";
// styles

const useStyles = makeStyles(theme => ({
    filterBar: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: theme.spacing(2)
    },
    filterRow: {
        flexBasis: "100%"
    },
    textField: {
        width: "180px",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1)
    }
}));

const FiltersView = props => {
    const { filters, filteredPlans, plans, showPublicationFilter, subjects } = props;
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <div className={classes.filterBar}>
            <div className={classes.filterRow}>
                <TextField
                    select
                    className={classes.textField}
                    margin="normal"
                    variant="filled"
                    id="filled-subject-filter"
                    label={<Translation>{t => t("dashboard.plan.subject")}</Translation>}
                    name="subject"
                    value={filters.subject || ""}
                    onChange={props.handleChangeFilters}
                >
                    {subjects && subjects.length
                        ? subjects.map((subject, index) => (
                              <MenuItem key={`filter-subject-${index}`} value={subject}>
                                  {subject}
                              </MenuItem>
                          ))
                        : []}
                </TextField>

                <TextField
                    select
                    className={classes.textField}
                    margin="normal"
                    variant="filled"
                    id="filled-target-class-filter"
                    label={<Translation>{t => t("dashboard.plan.class")}</Translation>}
                    name="targetClass"
                    value={filters.targetClass || ""}
                    onChange={props.handleChangeFilters}
                >
                    {filters.subject
                        ? uniq(filteredPlans.filter(x => x.subject === filters.subject).map(x => x.targetClass)).map(
                              (targetClass, index) => (
                                  <MenuItem key={`filter-target-class-${index}`} value={targetClass}>
                                      {targetClass}
                                  </MenuItem>
                              )
                          )
                        : []}
                </TextField>

                <TextField
                    select
                    className={classes.textField}
                    margin="normal"
                    variant="filled"
                    id="filled-language-filter"
                    label={<Translation>{t => t("dashboard.plan.language")}</Translation>}
                    name="language"
                    value={filters.language || ""}
                    onChange={props.handleChangeFilters}
                >
                    {filters.subject && filters.targetClass
                        ? uniq(
                              filteredPlans
                                  .filter(
                                      x =>
                                          x.subject === filters.subject && x.targetClass === Number(filters.targetClass)
                                  )
                                  .map(x => x.language)
                          ).map((language, index) => (
                              <MenuItem key={`filter-language-${index}`} value={language}>
                                  {languages[language]}
                              </MenuItem>
                          ))
                        : []}
                </TextField>

                <TextField
                    select
                    className={classes.textField}
                    margin="normal"
                    variant="filled"
                    id="filled-section-filter"
                    label={<Translation>{t => t("dashboard.plan.section")}</Translation>}
                    name="section"
                    value={filters.section || ""}
                    onChange={props.handleChangeFilters}
                >
                    {filters.subject && filters.targetClass && filters.language
                        ? uniq(
                              filteredPlans
                                  .filter(
                                      x =>
                                          x.subject === filters.subject &&
                                          x.targetClass === Number(filters.targetClass) &&
                                          x.language === filters.language
                                  )
                                  .map(x => x.section)
                          ).map((section, index) => (
                              <MenuItem key={`filter-section-${index}`} value={section}>
                                  {section}
                              </MenuItem>
                          ))
                        : []}
                </TextField>

                <TextField
                    select
                    className={classes.textField}
                    margin="normal"
                    variant="filled"
                    id="filled-topic-filter"
                    label={<Translation>{t => t("dashboard.plan.topic")}</Translation>}
                    name="topic"
                    value={filters.topic || ""}
                    onChange={props.handleChangeFilters}
                >
                    {filters.subject && filters.targetClass && filters.language && filters.section
                        ? uniq(
                              filteredPlans
                                  .filter(
                                      x =>
                                          x.subject === filters.subject &&
                                          x.targetClass === Number(filters.targetClass) &&
                                          x.language === filters.language &&
                                          x.section === filters.section
                                  )
                                  .map(x => x.topic)
                          ).map((topic, index) => (
                              <MenuItem key={`filter-topic-${index}`} value={topic}>
                                  {topic}
                              </MenuItem>
                          ))
                        : []}
                </TextField>
            </div>

            <div className={classes.filterRow}>
                <TextField
                    select
                    className={classes.textField}
                    margin="normal"
                    variant="filled"
                    id="filled-school-filter"
                    label={<Translation>{t => t("dashboard.plan.school")}</Translation>}
                    name="school"
                    value={filters.school || ""}
                    onChange={props.handleChangeFilters}
                >
                    {plans && plans.length
                        ? uniqBy(plans.map(x => x.author.school), "_id").map((school, index) => (
                              <MenuItem key={`filter-school-${index}`} value={school._id}>
                                  {`${school.name}, ${school.region}, ${school.city} ${school.district}`}
                              </MenuItem>
                          ))
                        : []}
                </TextField>

                <TextField
                    select
                    className={classes.textField}
                    margin="normal"
                    variant="filled"
                    id="filled-author-filter"
                    label={<Translation>{t => t("dashboard.plan.author")}</Translation>}
                    name="author"
                    value={filters.author || ""}
                    onChange={props.handleChangeFilters}
                >
                    {plans && plans.length
                        ? uniqBy(plans.map(x => x.originalPlan.author), "_id").map((author, index) => (
                              <MenuItem key={`filter-author-${index}`} value={author._id}>
                                  {`${author.lastName} ${author.firstName} ${author.patronymic}`}
                              </MenuItem>
                          ))
                        : []}
                </TextField>

                {showPublicationFilter ? (
                    <TextField
                        select
                        className={classes.textField}
                        margin="normal"
                        variant="filled"
                        id="filled-is-published-filter"
                        label={<Translation>{t => t("dashboard.plan.status")}</Translation>}
                        name="isPublished"
                        value={filters.isPublished || "Все"}
                        onChange={props.handleChangeFilters}
                    >
                        {["Все", "Опубликованные", "Неопубликованные"].map((status, index) => (
                            <MenuItem key={`filter-is-published-${index}`} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>
                ) : null}
            </div>

            <div className={classes.filterRow}>
                <Button variant="contained" color="primary" className={classes.button} onClick={props.handleFilters}>
                    <Translation>{t => t("showFilters")}</Translation>
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={props.handleResetFilters}
                >
                    <Translation>{t => t("resetFilters")}</Translation>
                </Button>
            </div>
        </div>
    );
};

export default FiltersView;
