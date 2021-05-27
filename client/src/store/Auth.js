// modules
import axios from "axios";
// imports
import { authRoutes, stagesRoutes } from "../assets/routes";
// action type
const TYPE = type => "planner/Auth/" + type;
// axios promises
const PENDING = action => action + "_PENDING";
const DONE = action => action + "_FULFILLED";
const FAIL = action => action + "_REJECTED";

// action types
export const CHECK_AUTH = TYPE("CHECK_AUTH");
export const GET_FAVORITE_STAGES = TYPE("GET_FAVORITE_STAGES");
export const REGISTER = TYPE("REGISTER");
export const FORGOT_PASSWORD = TYPE("FORGOT_PASSWORD");
export const LOGIN = TYPE("LOGIN");
export const LOGOUT = TYPE("LOGOUT");
export const SET = TYPE("SET");

// initial state
const initialState = {
    checkAuth: { pending: null, done: null, fail: null },
    getFavoriteStages: { pending: null, done: null, fail: null },
    register: { pending: null, done: null, fail: null },
    forgotPassword: { pending: null, done: null, fail: null },
    login: { pending: null, done: null, fail: null },
    logout: { pending: null, done: null, fail: null },
    user: {}
};

// reducer
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        // check auth
        case PENDING(CHECK_AUTH):
            return { ...state, checkAuth: { pending: true } };
        case DONE(CHECK_AUTH):
            return { ...state, checkAuth: { done: true } };
        case FAIL(CHECK_AUTH):
            return { ...state, checkAuth: { fail: true, status: action.payload.response.status } };
        // get favorite stages
        case PENDING(GET_FAVORITE_STAGES):
            return { ...state, getFavoriteStages: { pending: true } };
        case DONE(GET_FAVORITE_STAGES):
            return {
                ...state,
                getFavoriteStages: { done: true },
                user: { ...state.user, favoriteStages: action.payload.data }
            };
        case FAIL(GET_FAVORITE_STAGES):
            return { ...state, getFavoriteStages: { fail: true, status: action.payload.response.status } };
        // register
        case PENDING(REGISTER):
            return { ...state, register: { pending: true } };
        case DONE(REGISTER):
            return { ...state, register: { done: true } };
        case FAIL(REGISTER):
            return { ...state, register: { fail: true, status: action.payload.response.status } };
        // forgot password
        case PENDING(FORGOT_PASSWORD):
            return { ...state, forgotPassword: { pending: true } };
        case DONE(FORGOT_PASSWORD):
            return { ...state, forgotPassword: { done: true } };
        case FAIL(FORGOT_PASSWORD):
            return { ...state, forgotPassword: { fail: true, status: action.payload.response.status } };
        // login
        case PENDING(LOGIN):
            return { ...state, login: { pending: true } };
        case DONE(LOGIN):
            return { ...state, login: { done: true } };
        case FAIL(LOGIN):
            return { ...state, login: { fail: true, status: action.payload.response.status } };
        // logout
        case PENDING(LOGOUT):
            return { ...state, logout: { pending: true } };
        case DONE(LOGOUT):
            return { ...state, logout: { done: true } };
        case FAIL(LOGOUT):
            return { ...state, logout: { fail: true, status: action.payload.response.status } };
        // set user
        case SET:
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

// action creators
export const checkAuth = () => dispatch => {
    dispatch({
        type: CHECK_AUTH,
        payload: axios.post(authRoutes.checkAuth())
    }).catch(err => {
        console.error(err);
        // logout
        dispatch(logout());
    });
};

export const getFavoriteStages = () => dispatch => {
    dispatch({
        type: GET_FAVORITE_STAGES,
        payload: axios.get(stagesRoutes.getFavoriteStages())
    }).catch(err => {
        console.error(err);
        // logout
        dispatch(logout());
    });
};

export const register = ({ email, password, phone, lastName, firstName, patronymic, school, language, subject }) => dispatch => {
    return dispatch({
        type: REGISTER,
        payload: axios.post(authRoutes.register(), {
            email: email,
            password: password,
	    phone: phone,
            lastName: lastName,
            firstName: firstName,
            patronymic: patronymic,
            school: school,
	    language: language,
	    subject: subject
        })
    });
};

export const forgotPassword = email => dispatch => {
    return dispatch({
        type: FORGOT_PASSWORD,
        payload: axios.get(authRoutes.forgotPassword(email))
    });
};

export const login = (email, password) => dispatch => {
    return dispatch({
        type: LOGIN,
        payload: axios.post(authRoutes.login(), {
            email: email,
            password: password
        })
    }).then(response => {
        // set user
        dispatch(set(response.value.data));
        // save to local storage
        localStorage.setItem("planner-user", JSON.stringify(response.value.data));
    });
};

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT,
        payload: axios.post(authRoutes.logout())
    })
        .then(() => {
            // unset user
            dispatch(set({}));
            // remove from local storage
            localStorage.removeItem("planner-user");
        })
        .catch(err => {
            console.error(err);
        });
};

export const set = user => dispatch => {
    dispatch({
        type: SET,
        payload: user
    });
};
