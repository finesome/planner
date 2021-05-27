// modules
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
// components
import { AppBar, Breadcrumbs, Button, Menu, MenuItem, IconButton, Toolbar, Typography } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import ReactCountryFlag from "react-country-flag";
import { Translation } from "react-i18next";
// redux
import { logout } from "../../../store/Auth";
import { changeLocale } from "../../../store/Preferences";
// assets
import { getAppBarTitle } from "../../../assets/utils/navigation";
// styles

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    hide: {
        display: "none"
    },
    languageButton: {
	marginLeft: theme.spacing(2),
	color: "white"
    },
    userMenu: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "auto"
    },
    userMenuButton: {
        marginLeft: "auto"
    }
}));

function CustomAppBar(props) {
    const classes = useStyles();

    const [ languageAnchorEl, setLanguageAnchorEl ] = React.useState(null);
    const { anchorEl, locale, menuText, openDrawer, title } = props;
    const userMenuOpen = Boolean(anchorEl);

    function handleLanguageMenu(event) {
        setLanguageAnchorEl(event.currentTarget);
    }

    function handleLanguageMenuClose() {
        setLanguageAnchorEl(null);
    }

    function updateLocale(locale) {
        // change locale
        props.changeLocale(locale);
        // reload page
        window.location.reload();
    }

    return (
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: openDrawer
            })}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={props.handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, openDrawer && classes.hide)}
                >
                    <MenuIcon />
                </IconButton>

                <Breadcrumbs color="inherit" separator="›" aria-label="App bar breadcrumb">
                    <Typography>
                        <Translation>{t => t(title)}</Translation>
                    </Typography>

                    <Typography>
                        <Translation>{t => t(getAppBarTitle(props.history.location.pathname))}</Translation>
                    </Typography>
                </Breadcrumbs>

                <div className={classes.userMenu}>
                    <Typography>{menuText}</Typography>
		    <Button className={classes.languageButton} onClick={handleLanguageMenu}>
	    		<ReactCountryFlag code={locale === "kk" ? "kz" : locale} svg />
	    	    </Button>
                    <Menu
                        id="user-appbar-language-menu"
                        anchorEl={languageAnchorEl}
                        keepMounted
                        open={Boolean(languageAnchorEl)}
                        onClose={handleLanguageMenuClose}
                    >
                        <MenuItem onClick={() => updateLocale("ru")}>
                            <Translation>{t => t("ru")}</Translation>
                        </MenuItem>
                        <MenuItem onClick={() => updateLocale("kk")}>
                            <Translation>{t => t("kk")}</Translation>
                        </MenuItem>
                    </Menu>
                    <IconButton
                        aria-label="Account of current user"
                        aria-controls="user-menu-appbar"
                        aria-haspopup="true"
                        className={classes.userMenuButton}
                        color="inherit"
                        edge="end"
                        onClick={props.handleUserMenu}
                    >
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu
                        id="user-appbar-menu"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        open={userMenuOpen}
                        onClose={props.handleUserMenuClose}
                    >
                        <MenuItem onClick={props.handleProfile}>
                            <Translation>{t => t("appbar.menu.profile")}</Translation>
                        </MenuItem>
                        <MenuItem onClick={props.logout}>
                            <Translation>{t => t("appbar.menu.logout")}</Translation>
                        </MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
}

const mapStateToProps = (state, ownProps) => ({
    locale: state.preferences.locale
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    logout: () => dispatch(logout()),
    changeLocale: locale => dispatch(changeLocale(locale))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CustomAppBar)
);
