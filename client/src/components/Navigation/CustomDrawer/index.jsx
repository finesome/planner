// modules
import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
// components
import { Drawer, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// redux
// assets
// styles

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        ...theme.mixins.toolbar,
        justifyContent: "flex-end"
    },
    menuItem: {
        color: "black",
        textDecoration: "none"
    }
}));

function CustomDrawer(props) {
    const classes = useStyles();

    const { items } = props;

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={props.openDrawer}
            classes={{
                paper: classes.drawerPaper
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={props.handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <List>
                {items.map((item, index) => (
                    <NavLink
                        className={classes.menuItem}
                        key={`navigation-custom-drawer-item-${index}`}
                        to={item.to}
                        onClick={props.handleDrawerClose}
                    >
                        <ListItem button key={item.name}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItem>
                    </NavLink>
                ))}
            </List>
        </Drawer>
    );
}

export default CustomDrawer;
