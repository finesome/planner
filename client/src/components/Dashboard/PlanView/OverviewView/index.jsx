// modules
import React from "react";
// components
import { Typography } from "@material-ui/core";
import { Translation } from "react-i18next";
// redux
// assets
import { formatDate } from "../../../../assets/utils/date";
import { languages } from "../../../../assets/utils/subjects";
// styles

const OverviewView = props => {
    const { plan, myPlan } = props;

    return (
        <div>
            {myPlan && plan ? (
		<div>
                    {plan.isPublished ? (
			<Typography paragraph variant="button">
                            <span>[</span>
                            <Translation>{t => t("dashboard.plan.isPublished")}</Translation>
                            <span>]</span>
                        </Typography>
                    ) : (
			<Typography paragraph variant="button">
                            <span>[</span>
                            <Translation>{t => t("dashboard.plan.notPublished")}</Translation>
                            <span>]</span>
                        </Typography>
                    )}
                </div>
            ) : null}
            {plan && plan.author ? (
                <Typography paragraph>
                    <Translation>{t => t("dashboard.plan.author")}</Translation>
                    {`: ${plan.author.lastName} ${plan.author.firstName} ${plan.author.patronymic}`}
                </Typography>
            ) : null}
            {myPlan && plan && plan.originalPlan && plan.originalPlan.author ? (
                <Typography paragraph>
                    <Translation>{t => t("dashboard.plan.originalAuthor")}</Translation>
                    {`: ${plan.originalPlan.author.lastName} ${plan.originalPlan.author.firstName} ${
                        plan.originalPlan.author.patronymic
                    }`}
                </Typography>
            ) : null}
            {plan && plan.coAuthors && plan.coAuthors.length ? (
                <Typography paragraph>
                    <Translation>{t => t("dashboard.plan.coAuthors")}</Translation>
                    {`: ${plan.coAuthors.map(coAuthor => `${coAuthor.lastName} ${coAuthor.firstName} `)}`}
                </Typography>
            ) : null}
            {plan && plan.subject && plan.language && plan.targetClass ? (
                <Typography paragraph>
                    {`${plan.subject}, ${plan.targetClass} класс, ${languages[plan.language]} язык`}
                </Typography>
            ) : null}
            {plan && plan.lessonDate && plan.lessonDate.start && plan.lessonDate.end ? (
                <Typography paragraph>
                    <Translation>{t => t("dashboard.plan.lessonDates")}</Translation>
                    {`: ${formatDate(plan.lessonDate.start)} - ${formatDate(plan.lessonDate.end)}`}
                </Typography>
            ) : null}
            {plan && plan.quarter && plan.section && plan.topic ? (
                <Typography paragraph>
                    {`${plan.quarter} четверть, раздел ${plan.section}, тема ${plan.topic}`}
                </Typography>
            ) : null}
            {plan && plan.forks ? (
                <Typography paragraph>
                    <b>
                        <Translation>{t => t("copied")}</Translation>: {plan.forks} раз
                    </b>
                </Typography>
            ) : null}
        </div>
    );
};

export default OverviewView;
