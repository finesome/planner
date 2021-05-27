// modules
import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { blue, red } from "@material-ui/core/colors";
// components
import Admin from "./Admin";
import Dashboard from "./Dashboard";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
// redux
import { checkAuth } from "../store/Auth";
// assets
// styles

// app theme
const theme = createMuiTheme({
    palette: {
        primary: {
            light: blue[500],
            main: blue[700],
            dark: blue[900]
        },
        secondary: {
            light: red[500],
            main: red[700],
            dark: red[900]
        },
        error: {
            light: red[500],
            main: red[700],
            dark: red[900]
        }
    }
});

class App extends Component {
    componentDidMount() {
        // дополнительная проверка аутентификации
        if (this.props.isAuthenticated) {
            this.checkAuth();
        }
    }

    checkAuth = () => {
        this.props.checkAuth();
    };

    render() {
        const { isAuthenticated, role } = this.props;

        return (
            <MuiThemeProvider theme={theme}>
                <Router>
                    {isAuthenticated ? (
                        role === "admin" ? (
                            <Switch>
                                <Route path="/admin" component={Admin} />
                                <Redirect to="/admin" />
                            </Switch>
                        ) : (
                            <Switch>
                                <Route path="/dashboard" component={Dashboard} />
                                <Redirect to="/dashboard" />
                            </Switch>
                        )
                    ) : (
                        <Switch>
                            <Route path="/login" component={Login} />
                            <Route exact path="/register" component={Register} />
                            <Redirect to="/login" />
                        </Switch>
                    )}
                </Router>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    isAuthenticated: !!state.auth.user.email,
    role: state.auth.user.scope
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    checkAuth: () => dispatch(checkAuth())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
