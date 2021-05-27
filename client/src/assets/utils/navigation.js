// получить текст в панели (appbar) из пути
export const getAppBarTitle = pathname => {
    let title;
    const splittedPathname = pathname.split("/");

    if (splittedPathname.length === 2) {
        title = "home";
    } else {
        if (splittedPathname[1] === "admin") {
            switch (splittedPathname[2]) {
                case "profile":
                    title = "profile";
                    break;
                case "analytics":
                    title = "analytics";
                    break;
                case "users":
                    title = "admin.users";
                    break;
                case "schools":
                    title = "admin.schools";
                    break;
                case "subjects":
                    title = "admin.subjects";
                    break;
                default:
                    title = "";
            }
        } else {
            switch (splittedPathname[2]) {
                case "profile":
                    title = "profile";
                    break;
                case "analytics":
                    title = "analytics";
                    break;
                case "create":
                    title = "dashboard.createPlan";
                    break;
                case "all":
                    title = "dashboard.allPlans";
                    break;
                case "my":
                    title = "dashboard.myPlans";
                    break;
                case "favorites":
                    title = "dashboard.favorites";
                    break;
                default:
                    title = "";
            }
        }
    }

    return title;
};
