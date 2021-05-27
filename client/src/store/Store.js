// modules
import { applyMiddleware, combineReducers, createStore } from "redux";
// middleware
import logger from "redux-logger";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
// reducers
import Auth from "./Auth";
import Preferences from "./Preferences";
import { logout, set } from "./Auth";
import { changeLocale } from "./Preferences";
// assets

// root reducer
const reducer = combineReducers({
    auth: Auth,
    preferences: Preferences
});

// middleware
const middleware = applyMiddleware(promise, thunk, logger);
// store
const store = createStore(reducer, middleware);

// restore locale from local storage
const locale = localStorage.getItem("planner-locale");
if (locale) {
    // set locale
    store.dispatch(changeLocale(locale));
}

// restore user string from local storage
const userString = localStorage.getItem("planner-user");
if (userString) {
    // parse user string
    const user = JSON.parse(userString);
    // check expiration
    if (user.exp <= new Date()) {
        // logout
        store.dispatch(logout());
    } else {
        // set user
        store.dispatch(set(user));
    }
}

export default store;
